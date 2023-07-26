import aspectRatio from '@tailwindcss/aspect-ratio'
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    aspectRatio: false,
  },
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C778DD',
        background: '#282C33',
        gray: '#ABB2BF',
      },
    },
  },
  plugins: [aspectRatio, typography],
}
