import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";

import { GeistSans, GeistMono } from "@/app/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { importLocale } from "@/locales";
import { CommandBar } from "@/components/CommandBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { KonamiEgg } from "@/components/KonamiEgg";
import { ConsoleGreeting } from "@/components/ConsoleGreeting";
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
  const { messages } = await importLocale(lang);

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

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-bg text-fg relative font-sans antialiased">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <SpeedInsights />
            <CommandBar>
              <div className="flex min-h-screen flex-col">
                <Header />
                {children}
                <Footer />
              </div>
              <BackToTop />
              <KonamiEgg />
              <ConsoleGreeting />
              <Analytics />
            </CommandBar>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-VNFLVEVSCC" />
    </html>
  );
}
