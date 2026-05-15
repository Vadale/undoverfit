import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

// Canonical accessor for the projects collection. Returns entries sorted by year, newest first.
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection("projects");
  return all.sort((a, b) => b.data.year - a.data.year);
}
