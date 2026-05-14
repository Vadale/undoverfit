import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          light: "#f5f5f0",
          dark: "#1a1a1a",
        },
        ink: {
          light: "#1a1a1a",
          dark: "#e8e6e1",
        },
        muted: {
          light: "#666666",
          dark: "#888888",
        },
        rule: {
          light: "#dddddd",
          dark: "#333333",
        },
        accent: {
          navy: "#1a2f4e",
          gold: "#c89a2a",
        },
      },
      fontFamily: {
        serif: ['"EB Garamond"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [typography],
};
