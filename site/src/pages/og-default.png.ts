import type { APIContext } from "astro";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";
import { SITE } from "~/lib/site";

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

export async function GET(_: APIContext) {
  const markup = html`
    <div
      style="
        width: 1200px;
        height: 630px;
        background: #1a1a1a;
        color: #e8e6e1;
        font-family: 'EB Garamond';
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <div style="font-size: 96px; letter-spacing: -0.02em; color: #e8e6e1;">${SITE.name}</div>
      <div style="margin-top: 20px; font-size: 26px; color: #888; font-style: italic;">
        ${SITE.tagline}
      </div>
    </div>
  `;

  const garamond = await loadFont("EB Garamond", 500);
  const svg = await satori(markup as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [{ name: "EB Garamond", data: garamond, weight: 500, style: "normal" }],
  });
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
