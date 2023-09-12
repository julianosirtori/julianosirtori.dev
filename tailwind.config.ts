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
      fontFamily: {
        sans: "var(--font-biotif)",
      },
      colors: {
        highlight: "var(--color-highlight-current)",
        primary: "var(--colors-primary)",
        secondary: "var(--colors-secondary)",
        background: "var(--colors-background)",
        command: "var(--colors-command)",
        hover: "var(--colors-hover)",
        pink: "var(--colors-pink)",
        purple: "var(--colors-purple)",
      },
      padding: {
        "nav-height-desktop": "var(--space-navHeightDesktop)",
        "nav-height-mobile": "var(--space-navHeightMobile)",
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
