export const SITE = {
  name: "Undoverfit",
  tagline: "Signal, noise, and everything in between",
  url: "https://undoverfit.me",
  description:
    "A quiet notebook on R, statistics, local AI and finance. Practical research notes and open-source projects by Alessandro Vadalà.",
  author: "Alessandro Vadalà",
  authorProfiles: [
    "https://github.com/Vadale",
    "https://www.linkedin.com/in/alessandro-vadal%C3%A0-851516180/",
  ],
  language: "en",
  startYear: 2026,
} as const;

export const NAV = [
  { href: "/indice/", label: "index" },
  { href: "/tags/", label: "tags" },
  { href: "/search/", label: "search" },
  { href: "/projects/", label: "projects" },
  { href: "/about/", label: "about" },
] as const;
