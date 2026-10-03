import type { Metadata } from "next";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  SkillsCatalog,
  type SkillsCatalogItem,
} from "@/components/SkillsCatalog";
import { SkillsState } from "@/components/SkillsState";
import { countFilesIn } from "@/lib/skills/build";
import { getCatalogResult } from "@/lib/skills/catalog";
import { SKILLS_REPO_URL } from "@/lib/skills/constants";

interface SkillsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: SkillsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "skills.meta" });
  const result = await getCatalogResult();
  const title = `${t("listTitle")} | Juliano Sirtori`;
  const description = t("listDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/skills`,
      languages: { en: "/en/skills", pt: "/pt/skills" },
    },
    openGraph: {
      title,
      description,
      url: `https://julianosirtori.dev/${lang}/skills`,
    },
    // The error state answers 200; keep "GitHub did not respond" out of search.
    ...(result.status === "error" ? { robots: { index: false } } : {}),
  };
}

export default async function SkillsPage({ params }: SkillsPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("skills");
  const result = await getCatalogResult();
  const skills = result.status === "ok" ? result.catalog.skills : [];

  const formatDate = new Intl.DateTimeFormat(
    lang === "pt" ? "pt-BR" : "en-US",
    {
      dateStyle: "medium",
      timeZone: "UTC",
    },
  );

  const items: SkillsCatalogItem[] = skills.map((skill) => {
    const scripts = countFilesIn(skill, "scripts");
    const references = countFilesIn(skill, "references");
    const fileCounts: string[] = [];
    if (scripts) fileCounts.push(t("card.scripts", { count: scripts }));
    if (references) {
      fileCounts.push(t("card.references", { count: references }));
    }
    return {
      slug: skill.slug,
      summary: skill.summary,
      category: skill.category,
      version: skill.version,
      compatibility: skill.compatibilityShort,
      keywords: skill.keywords,
      fileCounts,
      updated: skill.updatedAt
        ? {
            iso: skill.updatedAt,
            label: t("card.updated", {
              date: formatDate.format(new Date(skill.updatedAt)),
            }),
          }
        : undefined,
    };
  });

  const hasList = result.status === "ok" && items.length > 0;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pt-12 pb-20 lg:pt-24">
      <header className="pb-10 sm:pb-12">
        <p className="text-fg-muted mb-5 font-mono text-xs tracking-[0.16em] uppercase">
          {t("list.kicker")}
        </p>
        <h1 className="text-fg mb-6 text-3xl leading-tight font-medium tracking-tight sm:text-4xl lg:text-5xl">
          {t("list.title")}
        </h1>
        <p className="text-fg-muted max-w-[64ch] text-base leading-relaxed text-pretty sm:text-lg">
          {t("list.lede")}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          {hasList && (
            <>
              <span className="text-fg-muted font-mono text-xs">
                {t("list.count", { count: items.length })}
              </span>
              <span aria-hidden="true" className="text-fg-muted">
                ·
              </span>
            </>
          )}
          <a
            href={SKILLS_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg hover:text-accent focus-visible:ring-accent inline-flex min-h-11 items-center gap-1.5 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t("list.repoLink")}
            <ArrowTopRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only"> ({t("detail.newTab")})</span>
          </a>
        </div>
      </header>

      {result.status === "error" ? (
        <SkillsState variant="error" retryHref={`/${lang}/skills`} />
      ) : !hasList ? (
        <SkillsState variant="empty" />
      ) : (
        <>
          <SkillsCatalog skills={items} />
          <p className="text-fg-muted mt-8 max-w-[64ch] text-sm leading-relaxed">
            {t("list.footnote")}
          </p>
        </>
      )}
    </main>
  );
}
