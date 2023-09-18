import { type Config } from "tailwindcss";
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";

module.exports = {
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
        cyan: "var(--colors-cyan)",
        green: "var(--colors-green)",
        yellow: "var(--colors-yellow)",
      },
      padding: {
        "nav-height-desktop": "var(--space-navHeightDesktop)",
        "nav-height-mobile": "var(--space-navHeightMobile)",
      },
      animation: {
        textclip: "textclip 5000ms linear infinite",
      },
      keyframes: {
        textclip: {
          to: {
            backgroundPosition: "200% center",
          },
        },
      },
      backgroundImage: {
        "linear-dracula":
          "linear-gradient(-225deg, var(--colors-cyan) 0%, var(--colors-green) 52%, var(--colors-cyan) 100% )",
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
