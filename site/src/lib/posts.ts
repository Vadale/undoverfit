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
