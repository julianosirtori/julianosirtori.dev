import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/ContactForm";
import { importLocale } from "@/locales";

interface WorkWithMeProps {
  params: Promise<{
    lang: string;
  }>;
}

const availabilityKeys = [
  "availability.longTerm",
  "availability.freelance",
  "availability.mentoring",
  "availability.speaking",
] as const;

const contributionKeys = [
  "contributions.web",
  "contributions.mobile",
  "contributions.ai",
  "contributions.architecture",
  "contributions.mentoring",
] as const;

export async function generateMetadata({
  params,
}: WorkWithMeProps): Promise<Metadata> {
  const { lang } = await params;
  const { messages } = await importLocale(lang);
  const title = `${messages.workWithMe.title} | Juliano Sirtori`;
  const description = messages.workWithMe.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://julianosirtori.dev/${lang}/work-with-me`,
    },
  };
}

export default async function WorkWithMe({ params }: WorkWithMeProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("workWithMe");
  const tGlobal = await getTranslations("global");

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 pt-20 pb-20 lg:pt-28">
      <header className="max-w-3xl pb-16">
        <p className="text-accent mb-5 font-mono text-xs tracking-[0.16em] uppercase">
          {t("kicker")}
        </p>
        <h1 className="text-fg mb-6 text-5xl font-semibold tracking-tight md:text-6xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted max-w-[62ch] text-lg leading-relaxed">
          {t("description")}
        </p>
      </header>

      <div className="border-border grid gap-12 border-y py-12 md:grid-cols-2 md:gap-16">
        <section>
          <h2 className="text-fg mb-4 text-2xl font-semibold tracking-tight">
            {t("availability.title")}
          </h2>
          <p className="text-fg-muted mb-6 text-[15px] leading-relaxed">
            {t("availability.intro")}
          </p>
          <ul className="text-fg-muted flex flex-col gap-3 text-sm leading-relaxed">
            {availabilityKeys.map((key) => (
              <li key={key} className="border-border border-l-2 pl-4">
                {t(key)}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-fg mb-4 text-2xl font-semibold tracking-tight">
            {t("contributions.title")}
          </h2>
          <ul className="text-fg-muted flex flex-col gap-3 text-sm leading-relaxed">
            {contributionKeys.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
          <p className="text-fg-subtle mt-6 text-sm leading-relaxed">
            {t("contributions.description")}
          </p>
        </section>
      </div>

      <section className="grid gap-10 pt-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div>
          <h2 className="text-fg mb-4 text-2xl font-semibold tracking-tight">
            {t("start.title")}
          </h2>
          <p className="text-fg-muted text-[15px] leading-relaxed">
            {t("start.description")}
          </p>
          <p className="text-fg-muted mt-5 text-sm leading-relaxed">
            {t("start.alternative")}
          </p>
          <div className="mt-4 flex flex-col items-start gap-2 text-sm">
            <a
              href={`mailto:${tGlobal("email")}`}
              className="text-fg hover:text-accent transition-colors"
            >
              {t("start.email")}
            </a>
            <a
              href={tGlobal("social.linkedin")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg hover:text-accent transition-colors"
            >
              {t("start.linkedin")}
            </a>
          </div>
          <p className="text-accent mt-5 font-mono text-xs">
            {t("start.responseTime")}
          </p>
        </div>

        <ContactForm />
      </section>
    </main>
  );
}
