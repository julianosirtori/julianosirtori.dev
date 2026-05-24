import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface NowPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: NowPageProps): Promise<Metadata> {
  const { lang } = await params;
  const isPortuguese = lang === "pt";

  return {
    title: isPortuguese ? "Juliano Sirtori - Agora" : "Juliano Sirtori - Now",
    description: isPortuguese
      ? "O que estou fazendo agora"
      : "What I'm doing now",
  };
}

const SECTIONS = [
  { key: "work", emoji: "💼" },
  { key: "learning", emoji: "📚" },
  { key: "reading", emoji: "📖" },
  { key: "projects", emoji: "🚀" },
  { key: "life", emoji: "🌱" },
] as const;

export default async function NowPage({ params }: NowPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("now");

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pt-24 pb-20 lg:pt-32">
      <header className="mb-12">
        <h1 className="text-fg mb-3 text-4xl font-medium tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted text-base leading-relaxed">
          {t("description")}
        </p>
        <p className="text-fg-subtle mt-2 text-sm">
          {t("lastUpdated")}: {t("updateDate")}
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {SECTIONS.map(({ key, emoji }) => (
          <section key={key} className="border-border rounded-lg border p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg" aria-hidden>
                {emoji}
              </span>
              <h2 className="text-fg text-base font-medium">
                {t(`${key}.title`)}
              </h2>
            </div>
            {key === "learning" ? (
              <ul className="text-fg-muted flex flex-col gap-1.5 text-sm leading-relaxed">
                <li>· {t("learning.item1")}</li>
                <li>· {t("learning.item2")}</li>
                <li>· {t("learning.item3")}</li>
              </ul>
            ) : (
              <p className="text-fg-muted text-sm leading-relaxed">
                {t(`${key}.description`)}
              </p>
            )}
          </section>
        ))}
      </div>

      <p className="text-fg-subtle mt-12 text-center text-xs">
        {t("inspired")}{" "}
        <a
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg underline"
        >
          nownownow.com
        </a>
      </p>
    </main>
  );
}
