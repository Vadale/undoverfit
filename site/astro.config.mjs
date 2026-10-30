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
      filter: (page) => {
        const path = new URL(page).pathname;
        return !["/search", "/search/", "/404", "/404/", "/404.html"].includes(path) &&
          !path.startsWith("/og/") &&
          !path.startsWith("/og-default") &&
          !path.startsWith("/rss");
      },
      serialize: (item) => ({
        ...item,
        url: item.url.endsWith("/") ? item.url : `${item.url}/`,
      }),
    }),
  ],
  build: {
    inlineStylesheets: "auto",
  },
});
