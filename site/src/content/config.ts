import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    location: z.string().optional(),
    comments: z.boolean().default(true),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url(),
    year: z.number().int(),
    status: z.enum(["active", "archived", "in-progress"]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, pages, projects };
