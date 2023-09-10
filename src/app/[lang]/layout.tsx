import { Analytics } from "@vercel/analytics/react";

import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";

import { biotifFont } from "@/utils/fonts";
import { Header } from "@/components/molecules/Header";
import { Footer } from "@/components/molecules/Footer";
import { importLocale } from "@/locales";
import { Metadata } from "next";
import { CommandBar } from "@/components/CommandBar";

interface BlogRootLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: BlogRootLayoutProps): Promise<Metadata> {
  params.lang;
  const messages = (await importLocale({ locale: params.lang })).messages;
  return {
    title: "Juliano Sirtori",
    description: messages.home.subtitle,
  };
}

export default async function BlogRootLayout({
  children,
  params,
}: BlogRootLayoutProps) {
  const locale = useLocale();
  let messages = {};

  // Show a 404 error if the user requests an unknown locale
  if (params.lang !== locale) {
    notFound();
  }
  messages = (await importLocale({ locale })).messages;

  return (
    <html lang={locale}>
      <body
        className={`relative bg-background ${biotifFont.variable} font-sans`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
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
