import type { Metadata } from "next";

import { GeistMono, GeistSans } from "@/app/fonts";
import { NotFoundPage } from "@/components/NotFoundPage";
import { ThemeProvider } from "@/components/ThemeProvider";
import messages from "@/locales/en/global.json";

import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found | Juliano Sirtori",
  description: messages.notFound.description,
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-bg text-fg flex min-h-screen flex-col font-sans antialiased">
        <ThemeProvider>
          <NotFoundPage
            title={messages.notFound.title}
            description={messages.notFound.description}
            linkLabel={messages.notFound.backHome}
            href="/"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
