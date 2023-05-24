/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#142AE9',
        bgPrimary: '#F4F5FB',
      },
      extend: {
        fontFamily: {
          sans: ['var(--font-darker-grotesque)'],
          mono: ['var(--font-space-mono)'],
        },
      },
    },
  },
  plugins: [],
}
