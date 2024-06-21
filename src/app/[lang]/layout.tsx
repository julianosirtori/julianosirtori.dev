import { use } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";

import { biotifFont } from "@/app/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { importLocale } from "@/locales";
import { CommandBar } from "@/components/CommandBar";
import { LOCALES } from "@/common/constants";

interface BlogRootLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: BlogRootLayoutProps): Promise<Metadata> {
  const messages = (await importLocale({ locale: params.lang })).messages;

  const title = "Juliano Sirtori";
  const description = messages.global.slogan;

  return {
    metadataBase: new URL("https://julianosirtori.dev"),
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://julianosirtori.dev/",
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default function BlogRootLayout({
  children,
  params,
}: BlogRootLayoutProps) {
  unstable_setRequestLocale(params.lang);

  const locale = useLocale();
  let messages = {};

  // Show a 404 error if the user requests an unknown locale
  if (params.lang !== locale) {
    notFound();
  }
  messages = use(importLocale({ locale })).messages;

  return (
    <html lang={locale}>
      <body
        className={`relative bg-background ${biotifFont.variable} font-sans`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SpeedInsights />
          <CommandBar>
            <div className="flex min-h-screen flex-col">
              <Header />
              {children}
              <Footer />
            </div>
            <Analytics />
          </CommandBar>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
