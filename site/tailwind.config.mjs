import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        teal: "var(--teal)",
        rule: "var(--rule)",
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        // Fixed pixel-equivalent width (36rem = 576px at the default 16px root)
        // so the column stays narrow and centered regardless of body font size.
        prose: "36rem",
      },
    },
  },
  plugins: [typography],
};
