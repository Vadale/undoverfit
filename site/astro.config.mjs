import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://undoverfit.me",
  output: "static",
  trailingSlash: "never",
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) =>
        !page.includes("/og/") &&
        !page.includes("/og-default") &&
        !page.includes("/rss"),
    }),
  ],
  build: {
    inlineStylesheets: "auto",
  },
});
