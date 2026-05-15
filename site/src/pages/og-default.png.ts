import type { APIContext } from "astro";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";
import { SITE } from "~/lib/site";

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

export async function GET(_: APIContext) {
  const markup = html`
    <div
      style="
        width: 1200px;
        height: 630px;
        background: #f4f1e8;
        color: #0e2236;
        font-family: 'Lora';
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 80px;
      "
    >
      <div
        style="
          font-size: 180px;
          line-height: 1;
          letter-spacing: -0.02em;
          display: flex;
          color: #0e2236;
        "
      >
        Und<span style="color: #1b6e70; font-style: italic; font-weight: 400;">over</span>fit
      </div>
      <div
        style="
          margin-top: 40px;
          font-size: 30px;
          color: #5a6878;
          font-style: italic;
        "
      >
        ${SITE.tagline}
      </div>
    </div>
  `;

  const [lora, loraItalic] = await Promise.all([
    loadFont("Lora", 500),
    loadFont("Lora", 400, true),
  ]);
  const svg = await satori(markup as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Lora", data: lora, weight: 500, style: "normal" },
      { name: "Lora", data: loraItalic, weight: 400, style: "italic" },
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
