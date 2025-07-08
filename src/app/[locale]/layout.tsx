import { use } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";

import { biotifFont } from "@/app/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { routing } from "@/i18n/routing";
import { LOCALES } from "@/common/constants";
import { hasLocale } from "next-intl";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  const title = "Juliano Sirtori";
  const description = "messages.global.slogan";

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

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  console.log(params);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`relative bg-background ${biotifFont.variable} font-sans`}
      >
        <NextIntlClientProvider>
          <SpeedInsights />
          <div className="flex min-h-screen flex-col">
            <Header />
            {children}
            <Footer />
          </div>
          <Analytics />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-VNFLVEVSCC" />
    </html>
  );
}
