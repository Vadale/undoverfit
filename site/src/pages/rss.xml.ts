import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "~/lib/site";
import { getPublishedPosts, getPostNumber } from "~/lib/posts";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.name,
    description: SITE.tagline,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/${getPostNumber(post)}`,
    })),
    customData: `<language>${SITE.language}</language>`,
  });
}
