export const SITE = {
  name: "Undoverfit",
  tagline: "Signal, noise, and everything in between",
  url: "https://undoverfit.me",
  description:
    "A quiet notebook on data, statistics, technology, finance, and the things in between. Written by Alessandro Vadala.",
  author: "Alessandro Vadala",
  language: "en",
  startYear: 2026,
} as const;

export const NAV = [
  { href: "/indice", label: "index" },
  { href: "/search", label: "search" },
  { href: "/projects", label: "projects" },
  { href: "/about", label: "about" },
  { href: "/newsletter", label: "newsletter" },
] as const;
