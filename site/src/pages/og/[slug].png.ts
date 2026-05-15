import type { APIContext } from "astro";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";
import { getPublishedPosts, getPostNumber, formatDate, plainTitle } from "~/lib/posts";
import { SITE } from "~/lib/site";

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    params: { slug: String(getPostNumber(post)) },
    props: { post },
  }));
}

async function loadFont(
  family: string,
  weight: number,
  italic = false,
): Promise<ArrayBuffer> {
  const ital = italic ? "1," : "0,";
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    "+",
  )}:ital,wght@${ital}${weight}&display=swap`;
  const css = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());
  const match = css.match(/src: url\((https:[^)]+)\) format/);
  if (!match) throw new Error(`font not found: ${family}@${weight}${italic ? " italic" : ""}`);
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
        background: #f4f1e8;
        color: #0e2236;
        font-family: 'Plus Jakarta Sans';
        padding: 80px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      "
    >
      <div style="font-size: 22px; color: #98a1ad; letter-spacing: 0.18em; text-transform: uppercase;">
        page ${String(n).padStart(2, "0")}
      </div>
      <div
        style="
          font-family: 'Lora';
          font-size: 80px;
          line-height: 1.05;
          color: #0e2236;
          letter-spacing: -0.01em;
          max-width: 1040px;
        "
      >
        ${plainTitle(post.data.title)}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="font-family: 'Lora'; font-size: 32px; color: #0e2236; display: flex;">
          Und<span style="color: #1b6e70; font-style: italic;">over</span>fit
        </div>
        <div style="font-size: 18px; color: #98a1ad; text-align: right; letter-spacing: 0.18em; text-transform: uppercase;">
          ${location ? `${location} · ` : ""}${date}
        </div>
      </div>
    </div>
  `;

  const [lora, loraItalic, jakarta] = await Promise.all([
    loadFont("Lora", 500),
    loadFont("Lora", 400, true),
    loadFont("Plus Jakarta Sans", 500),
  ]);

  const svg = await satori(markup as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Lora", data: lora, weight: 500, style: "normal" },
      { name: "Lora", data: loraItalic, weight: 400, style: "italic" },
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
