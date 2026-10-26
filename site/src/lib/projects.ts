import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

// Lead with featured work and keep paused or archived projects below active work.
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection("projects");
  const statusOrder = { active: 0, "in-progress": 1, "on-hold": 2, archived: 3 };
  return all.sort(
    (a, b) =>
      statusOrder[a.data.status] - statusOrder[b.data.status] ||
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.year - a.data.year ||
      a.data.title.localeCompare(b.data.title),
  );
}
