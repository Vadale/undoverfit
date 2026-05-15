import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

const isProd = import.meta.env.PROD;

function postNumber(entry: Post): number {
  const n = Number.parseInt(entry.slug, 10);
  return Number.isFinite(n) ? n : 0;
}

export async function getPublishedPosts(): Promise<Post[]> {
  const all = await getCollection("blog", ({ data }) => !isProd || !data.draft);
  return all.sort((a, b) => postNumber(b) - postNumber(a));
}

export function getPostNumber(entry: Post): number {
  return postNumber(entry);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function getAdjacent(entry: Post): Promise<{
  prev: Post | null;
  next: Post | null;
}> {
  const posts = await getPublishedPosts();
  const sortedAsc = [...posts].sort(
    (a, b) => postNumber(a) - postNumber(b),
  );
  const idx = sortedAsc.findIndex((p) => p.slug === entry.slug);
  return {
    prev: idx > 0 ? sortedAsc[idx - 1] : null,
    next: idx >= 0 && idx < sortedAsc.length - 1 ? sortedAsc[idx + 1] : null,
  };
}

// Strip HTML tags from a title so it is safe for <title>, OG meta, RSS, and OG images.
export function plainTitle(title: string): string {
  return title.replace(/<[^>]+>/g, "");
}

// Normalize a tag for use in a URL. Lowercase + non-alphanumerics → hyphens.
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TagBucket = {
  tag: string;
  slug: string;
  count: number;
  posts: Post[];
};

export async function getAllTags(): Promise<TagBucket[]> {
  const posts = await getPublishedPosts();
  const map = new Map<string, { tag: string; posts: Post[] }>();
  for (const p of posts) {
    for (const t of p.data.tags ?? []) {
      const slug = tagSlug(t);
      if (!slug) continue;
      const existing = map.get(slug) ?? { tag: t, posts: [] };
      existing.posts.push(p);
      map.set(slug, existing);
    }
  }
  return [...map.entries()]
    .map(([slug, v]) => ({
      slug,
      tag: v.tag,
      count: v.posts.length,
      posts: v.posts,
    }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}
