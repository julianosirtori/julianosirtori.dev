import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

import { Guestbook } from "@/components/Guestbook";

interface GuestbookPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: GuestbookPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isPortuguese = lang === "pt";

  return {
    title: isPortuguese
      ? "Juliano Sirtori - Livro de Visitas"
      : "Juliano Sirtori - Guestbook",
    description: isPortuguese
      ? "Deixe uma mensagem no livro de visitas"
      : "Leave a message in the guestbook",
  };
}

export default async function GuestbookPage({ params }: GuestbookPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("guestbook");

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pt-24 pb-20 lg:pt-32">
      <header className="mb-10">
        <h1 className="text-fg mb-3 text-4xl font-medium tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted text-base leading-relaxed">
          {t("description")}
        </p>
      </header>

      <Guestbook
        placeholder={{
          name: t("placeholderName"),
          message: t("placeholderMessage"),
        }}
        submitText={t("submit")}
        emptyText={t("empty")}
      />
    </main>
  );
}
