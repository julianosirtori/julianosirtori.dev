import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

import { Terminal } from "@/components/Terminal";

interface PlaygroundPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: PlaygroundPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "playground" });

  return {
    title: `Juliano Sirtori - ${t("title")}`,
    description: t("description"),
  };
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("playground");

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pt-24 pb-20 lg:pt-32">
      <header className="mb-8">
        <h1 className="text-fg mb-3 text-4xl font-medium tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted max-w-2xl text-base leading-relaxed">
          {t("description")}
        </p>
      </header>

      <Terminal lang={lang} />

      <div className="text-fg-subtle mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <span>↹ {t("hint.tab")}</span>
        <span>↑↓ {t("hint.history")}</span>
        <span>⌃L {t("hint.clear")}</span>
        <span>· {t("hint.help")}</span>
      </div>
    </main>
  );
}
