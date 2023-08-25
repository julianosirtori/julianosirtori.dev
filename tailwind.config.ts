import { type Config } from "tailwindcss";
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";

module.exports = {
  darkMode: "class",
  corePlugins: {
    aspectRatio: false,
  },
  theme: {
    extend: {
      colors: {
        highlight: "var(--color-highlight-current)",
        primary: "var(--colors-primary)",
        secondary: "var(--colors-secondary)",
        background: "var(--colors-background)",
      },
    },
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [aspectRatio, typography],
} satisfies Config;
