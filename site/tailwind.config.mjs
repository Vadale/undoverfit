import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          light: "#ede4d0",
          dark: "#0f1b2d",
        },
        ink: {
          light: "#1a2738",
          dark: "#d8dde3",
        },
        muted: {
          light: "#9c8f7d",
          dark: "#7989a0",
        },
        rule: {
          light: "#d0c8b4",
          dark: "#243245",
        },
        accent: {
          navy: "#1a2738",
          teal: "#4a7570",
        },
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [typography],
};
