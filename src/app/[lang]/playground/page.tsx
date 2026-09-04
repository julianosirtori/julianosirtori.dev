import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

import { Terminal } from "@/components/Terminal";

interface PlaygroundPageProps {
  params: Promise<{
    lang: string;
  }>;
}

interface CommandRef {
  cmd: string;
  desc: string;
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
  const commands = t.raw("commands") as CommandRef[];

  return (
    <main className="mx-auto flex w-full max-w-[920px] flex-1 flex-col px-5 pt-20 pb-20 lg:pt-28">
      <header className="pb-8">
        <p className="text-accent mb-5 font-mono text-xs tracking-[0.16em] uppercase">
          {t("kicker")}
        </p>
        <h1 className="text-fg mb-5 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="text-fg-muted max-w-[56ch] text-lg leading-relaxed text-pretty">
          {t.rich("heroLede", {
            code: (chunks) => (
              <code className="text-accent font-mono">{chunks}</code>
            ),
          })}
        </p>
      </header>

      <Terminal lang={lang} />

      <div className="text-fg-subtle mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs">
        <span>↹ {t("hint.tab")}</span>
        <span>↑↓ {t("hint.history")}</span>
        <span>⌃L {t("hint.clear")}</span>
        <span>· {t("hint.help")}</span>
      </div>

      <section className="border-border mt-12 border-t pt-9">
        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-fg text-xl font-semibold tracking-tight">
            {t("commandsTitle")}
          </h2>
          <span className="text-fg-subtle font-mono text-xs">
            {t("commandsSub")}
          </span>
        </div>
        <p className="text-fg-muted mb-6 max-w-[58ch] text-[15px] leading-relaxed">
          {t("commandsHint")}
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5">
          {commands.map((command) => (
            <div
              key={command.cmd}
              className="border-border bg-bg-elevated rounded-xl border p-3.5"
            >
              <span className="text-accent mb-1.5 block font-mono text-sm">
                {command.cmd}
              </span>
              <span className="text-fg-muted block text-[12.5px] leading-snug">
                {command.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      <p className="text-fg-subtle mt-10 font-mono text-xs">{t("footer")}</p>
    </main>
  );
}
