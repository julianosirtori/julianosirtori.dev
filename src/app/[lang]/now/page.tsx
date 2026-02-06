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

export default async function NowPage({ params }: NowPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("now");

  return (
    <main className="py-nav-height-mobile selection:bg-purple lg:py-nav-height-desktop mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col px-5 selection:text-black">
      <div className="mb-12">
        <h1 className="text-primary mb-4 text-5xl font-bold">
          <span className="from-purple to-pink bg-gradient-to-r bg-clip-text text-transparent">
            {t("title")}
          </span>
        </h1>
        <p className="text-secondary text-lg leading-relaxed">
          {t("description")}
        </p>
        <p className="text-secondary/70 mt-2 text-sm">
          {t("lastUpdated")}: {t("updateDate")}
        </p>
      </div>

      <div className="grid gap-8">
        {/* Work Section */}
        <section className="border-hover bg-hover/20 rounded-xl border p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">💼</span>
            <h2 className="text-primary text-xl font-semibold">
              {t("work.title")}
            </h2>
          </div>
          <p className="text-secondary">{t("work.description")}</p>
        </section>

        {/* Learning Section */}
        <section className="border-hover bg-hover/20 rounded-xl border p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <h2 className="text-primary text-xl font-semibold">
              {t("learning.title")}
            </h2>
          </div>
          <ul className="text-secondary space-y-2">
            <li className="flex items-center gap-2">
              <span className="bg-cyan h-1.5 w-1.5 rounded-full" />
              {t("learning.item1")}
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-green h-1.5 w-1.5 rounded-full" />
              {t("learning.item2")}
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-pink h-1.5 w-1.5 rounded-full" />
              {t("learning.item3")}
            </li>
          </ul>
        </section>

        {/* Reading Section */}
        <section className="border-hover bg-hover/20 rounded-xl border p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <h2 className="text-primary text-xl font-semibold">
              {t("reading.title")}
            </h2>
          </div>
          <p className="text-secondary">{t("reading.description")}</p>
        </section>

        {/* Side Projects Section */}
        <section className="border-hover bg-hover/20 rounded-xl border p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <h2 className="text-primary text-xl font-semibold">
              {t("projects.title")}
            </h2>
          </div>
          <p className="text-secondary">{t("projects.description")}</p>
        </section>

        {/* Life Section */}
        <section className="border-hover bg-hover/20 rounded-xl border p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <h2 className="text-primary text-xl font-semibold">
              {t("life.title")}
            </h2>
          </div>
          <p className="text-secondary">{t("life.description")}</p>
        </section>
      </div>

      {/* Inspired by nownownow.com */}
      <p className="text-secondary/50 mt-12 text-center text-sm">
        {t("inspired")}{" "}
        <a
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary underline"
        >
          nownownow.com
        </a>
      </p>
    </main>
  );
}
