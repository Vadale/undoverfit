import type { APIContext } from "astro";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";
import { getPublishedPosts, getPostNumber, formatDate } from "~/lib/posts";
import { SITE } from "~/lib/site";

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    params: { slug: String(getPostNumber(post)) },
    props: { post },
  }));
}

async function loadFont(family: string, weight: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+",
  )}:wght@${weight}&display=swap`;
  const css = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());
  const match = css.match(/src: url\((https:[^)]+)\) format/);
  if (!match) throw new Error(`font not found: ${family}@${weight}`);
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

export async function GET({ props }: APIContext) {
  const { post } = props as { post: Awaited<ReturnType<typeof getPublishedPosts>>[number] };
  const n = getPostNumber(post);
  const date = formatDate(post.data.pubDate);
  const location = post.data.location ?? "";

  const markup = html`
    <div
      style="
        width: 1200px;
        height: 630px;
        background: #1a1a1a;
        color: #e8e6e1;
        font-family: 'Plus Jakarta Sans';
        padding: 72px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      "
    >
      <div style="font-size: 22px; color: #888; letter-spacing: 0.04em;">
        page ${String(n).padStart(2, "0")}
      </div>
      <div
        style="
          font-family: 'EB Garamond';
          font-size: 72px;
          line-height: 1.1;
          color: #e8e6e1;
          letter-spacing: -0.01em;
          max-width: 1000px;
        "
      >
        ${post.data.title}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="font-size: 22px; color: #c89a2a; letter-spacing: 0.04em;">
          ${SITE.name}
        </div>
        <div style="font-size: 20px; color: #888; text-align: right;">
          ${location ? `${location} · ` : ""}${date}
        </div>
      </div>
    </div>
  `;

  const [garamond, jakarta] = await Promise.all([
    loadFont("EB Garamond", 500),
    loadFont("Plus Jakarta Sans", 500),
  ]);

  const svg = await satori(markup as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: "EB Garamond", data: garamond, weight: 500, style: "normal" },
      { name: "Plus Jakarta Sans", data: jakarta, weight: 500, style: "normal" },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
