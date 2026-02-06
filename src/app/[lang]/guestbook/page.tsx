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
    <main className="py-nav-height-mobile selection:bg-cyan lg:py-nav-height-desktop mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col px-5 selection:text-black">
      <div className="mb-12">
        <h1 className="text-primary mb-4 text-5xl font-bold">
          <span className="from-cyan to-green bg-gradient-to-r bg-clip-text text-transparent">
            {t("title")}
          </span>
        </h1>
        <p className="text-secondary text-lg leading-relaxed">
          {t("description")}
        </p>
      </div>

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
