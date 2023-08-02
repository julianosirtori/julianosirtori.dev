import { Analytics } from "@vercel/analytics/react";

import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";

import { Header } from "@/components/molecules/Header";
import { Footer } from "@/components/molecules/Footer";
import { Icon } from "@/components/atoms/Icon";
import { importLocale } from "@/locales";
import { palletColor } from "@/utils/theme/pallet";
import { Metadata } from "next";

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
    <html
      lang={locale}
      className={`dark set-color-highlight-current-${palletColor}`}
    >
      <body className="bg-primary">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main>
            <div className="text-primary absolute left-4 top-0 hidden flex-col items-center justify-center gap-2 lg:flex">
              <div className="h-36 w-[2px] bg-highlight" />
              <a
                href="https://github.com/julianosirtori/julianosirtori.dev"
                target="_blank"
              >
                <Icon name="IconGithub" />
              </a>
              <a
                href="https://discordapp.com/users/juliano_sirtori"
                target="_blank"
              >
                <Icon name="IconDiscord" />
              </a>
              <a
                href="https://www.linkedin.com/in/juliano-sirtori/"
                target="_blank"
              >
                <Icon name="IconLinkedin" />
              </a>
            </div>
            {children}
          </main>
          <Footer />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
