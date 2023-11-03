import localFont from "next/font/local";

export const biotifFont = localFont({
  preload: false,
  src: [
    {
      path: "./Biotif-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Biotif-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Biotif-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Biotif-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Biotif-Book.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-biotif",
});
