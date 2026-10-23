import { Telemetry } from "@/components/Audience/Telemetry";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteAnalytics } from "@/components/Audience/Analytics";

import { GeistSans, GeistMono } from "@/app/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { importLocale } from "@/locales";
import { CommandBar } from "@/components/CommandBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { KonamiEgg } from "@/components/KonamiEgg";
import { ConsoleGreeting } from "@/components/ConsoleGreeting";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/locales/config";

interface BlogRootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogRootLayoutProps): Promise<Metadata> {
  const { lang } = await params;

  if (!routing.locales.includes(lang as "en" | "pt")) {
    notFound();
  }

  const { messages } = await importLocale(lang);

  const title = "Juliano Sirtori";
  const description = messages.global.slogan;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/`,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export default async function BlogRootLayout({
  children,
  params,
}: BlogRootLayoutProps) {
  const { lang } = await params;

  if (!routing.locales.includes(lang as "en" | "pt")) {
    notFound();
  }

  setRequestLocale(lang);

  const locale = await getLocale();
  const messages = await getMessages();
  const { messages: localeMessages } = await importLocale(locale);
  const personAndWebsiteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: localeMessages.global.myFullName,
        url: `${SITE_URL}/${locale}/about`,
        jobTitle: localeMessages.global.role,
        description: localeMessages.global.slogan,
        email: `mailto:${localeMessages.global.email}`,
        sameAs: [
          localeMessages.global.social.linkedin,
          "https://github.com/julianosirtori",
          localeMessages.global.social.twitter,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: localeMessages.global.myFullName,
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-bg text-fg relative font-sans antialiased">
        <JsonLd data={personAndWebsiteJsonLd} />
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <CommandBar>
              <SiteAnalytics />
              <div className="flex min-h-screen flex-col">
                <Header />
                {children}
                <Footer />
              </div>
              <BackToTop />
              <KonamiEgg />
              <ConsoleGreeting />
              <Telemetry />
            </CommandBar>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
