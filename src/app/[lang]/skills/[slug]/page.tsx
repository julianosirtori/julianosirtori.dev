import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound, unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
import {
  ArrowLeftIcon,
  ArrowTopRightIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SkillFiles } from "@/components/SkillFiles";
import { SkillInstall } from "@/components/SkillInstall";
import { SkillMarkdown } from "@/components/SkillMarkdown";
import { SkillSourceLink } from "@/components/SkillSourceLink";
import { SkillsState } from "@/components/SkillsState";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { countFilesIn } from "@/lib/skills/build";
import { findSkill, getCatalogResult } from "@/lib/skills/catalog";
import {
  SKILLS_DIR,
  SKILLS_REPO,
  isValidSkillSlug,
  repoBlobUrl,
  repoTreeUrl,
  skillFolderUrl,
} from "@/lib/skills/constants";
import type { RenderedSkillMarkdown } from "@/lib/skills/markdown";
import { getSkillMarkdown } from "@/lib/skills/render";
import type { Skill } from "@/lib/skills/types";
import { Link } from "@/locales/navigation";

interface SkillPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const SITE = "https://julianosirtori.dev";
/** The TOC only earns its place with a long SKILL.md. */
const TOC_MIN_H2 = 4;

const h2Class = "text-fg text-2xl font-semibold tracking-tight";
const sectionClass = "min-w-0 scroll-mt-36 sm:scroll-mt-28";
const backLinkClass =
  "text-fg-muted hover:text-accent focus-visible:ring-accent inline-flex min-h-11 items-center gap-2 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none";
const githubLinkClass =
  "text-fg-muted hover:text-accent focus-visible:ring-accent inline-flex min-h-11 items-center gap-1.5 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none";

export async function generateMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isValidSkillSlug(slug)) return {};

  const t = await getTranslations({ locale: lang, namespace: "skills.meta" });
  const result = await getCatalogResult();
  const title = `${t("detailTitle", { name: slug })} | Juliano Sirtori`;
  const path = `/${lang}/skills/${slug}`;
  const alternates = {
    canonical: path,
    languages: { en: `/en/skills/${slug}`, pt: `/pt/skills/${slug}` },
  };

  if (result.status === "error") {
    return { title, alternates, robots: { index: false } };
  }
  const skill = findSkill(result.catalog, slug);
  // The page answers 404 and Next.js adds noindex.
  if (!skill) return {};

  return {
    title,
    description: skill.summary,
    alternates,
    openGraph: { title, description: skill.summary, url: `${SITE}${path}` },
  };
}

const SCRIPT_LANGUAGES: Record<string, string> = {
  sh: "Shell",
  bash: "Shell",
  zsh: "Shell",
  py: "Python",
  js: "JavaScript",
  mjs: "JavaScript",
  ts: "TypeScript",
  rb: "Ruby",
};

function jsonLd(skill: Skill, lang: string) {
  const languages = [
    ...new Set(
      skill.files
        .map((file) => SCRIPT_LANGUAGES[file.path.split(".").pop() ?? ""])
        .filter(Boolean),
    ),
  ];
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: skill.slug,
    description: skill.summary,
    url: `${SITE}/${lang}/skills/${skill.slug}`,
    codeRepository: skillFolderUrl(skill.slug),
    inLanguage: "en",
    ...(skill.license && {
      license:
        skill.license === "MIT"
          ? "https://opensource.org/licenses/MIT"
          : skill.license,
    }),
    ...(languages.length && {
      programmingLanguage: languages.length === 1 ? languages[0] : languages,
    }),
    ...(skill.version && { version: skill.version }),
    ...(skill.updatedAt && { dateModified: skill.updatedAt }),
    ...(skill.keywords.length && { keywords: skill.keywords.join(", ") }),
    author: { "@type": "Person", name: "Juliano Sirtori", url: SITE },
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

async function renderMarkdown(
  skill: Skill,
  sha: string,
): Promise<RenderedSkillMarkdown | null> {
  try {
    return await getSkillMarkdown(skill, sha);
  } catch (error) {
    unstable_rethrow(error);
    console.error(
      `[skills] could not render ${skill.slug}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { lang, slug } = await params;
  setRequestLocale(lang);
  await connection();

  // An impossible slug never reaches GitHub or the cache.
  if (!isValidSkillSlug(slug)) notFound();

  const t = await getTranslations("skills");
  const result = await getCatalogResult();

  const nav = (
    <div className="mb-7 flex min-h-11 flex-wrap items-center justify-between gap-x-4 text-sm">
      <Link href="/skills" className={backLinkClass}>
        <ArrowLeftIcon aria-hidden="true" className="h-4 w-4" />
        {t("detail.back")}
      </Link>
      <SkillSourceLink
        href={skillFolderUrl(slug)}
        slug={slug}
        newTabLabel={t("detail.newTab")}
        className={githubLinkClass}
      >
        {t("detail.viewOnGitHub")}
        <ArrowTopRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
      </SkillSourceLink>
    </div>
  );

  const h1Class =
    "text-fg mb-5 font-mono text-3xl leading-[1.15] font-medium tracking-tight [overflow-wrap:anywhere] sm:text-4xl lg:text-[2.75rem]";

  if (result.status === "error") {
    return (
      <main className="mx-auto w-full max-w-[760px] flex-1 px-5 pt-10 pb-20 lg:pt-16">
        {nav}
        <h1 className={h1Class}>{slug}</h1>
        <SkillsState
          variant="detailError"
          slug={slug}
          retryHref={`/${lang}/skills/${slug}`}
        />
      </main>
    );
  }

  const { sha } = result.catalog;
  const skill = findSkill(result.catalog, slug);
  if (!skill) notFound();

  const markdown = await renderMarkdown(skill, sha);
  const hasToc = (markdown?.h2Count ?? 0) >= TOC_MIN_H2;
  const toc: TocItem[] = hasToc
    ? [
        { level: 2, text: t("install.title"), slug: "install" },
        { level: 2, text: t("detail.triggers.title"), slug: "triggers" },
        { level: 2, text: t("detail.details.title"), slug: "details" },
        {
          level: 2,
          text: t("detail.instructions.title"),
          slug: "instructions",
        },
        ...(markdown?.headings ?? []),
      ]
    : [];

  const skillMdUrl = repoBlobUrl(sha, `${SKILLS_DIR}/${slug}/SKILL.md`);
  const formatDate = new Intl.DateTimeFormat(
    lang === "pt" ? "pt-BR" : "en-US",
    {
      dateStyle: "medium",
      timeZone: "UTC",
    },
  );

  const facts: {
    key: string;
    label: string;
    value: ReactNode;
    wide?: boolean;
  }[] = [];
  if (skill.version) {
    facts.push({
      key: "version",
      label: t("detail.facts.version"),
      value: <span className="font-mono">{skill.version}</span>,
    });
  }
  if (skill.license) {
    facts.push({
      key: "license",
      label: t("detail.facts.license"),
      value: skill.license,
    });
  }
  if (skill.updatedAt) {
    facts.push({
      key: "updated",
      label: t("detail.facts.updated"),
      value: (
        <time dateTime={skill.updatedAt}>
          {formatDate.format(new Date(skill.updatedAt))}
        </time>
      ),
    });
  }
  if (skill.compatibilityShort) {
    facts.push({
      key: "requirements",
      label: t("detail.facts.requirements"),
      value: <span lang="en">{skill.compatibilityShort}</span>,
      wide: true,
    });
  }

  const details: { key: string; label: ReactNode; value: ReactNode }[] = [];
  if (skill.compatibility) {
    details.push({
      key: "requirements",
      label: t("detail.details.requirements"),
      value: <span lang="en">{skill.compatibility}</span>,
    });
  }
  if (skill.allowedTools.length) {
    details.push({
      key: "tools",
      label: t("detail.details.tools"),
      value: (
        <>
          <ul className="flex flex-wrap gap-2">
            {skill.allowedTools.map((tool) => (
              <li
                key={tool}
                className="border-border text-fg rounded-md border px-2 py-0.5 font-mono text-xs"
              >
                {tool}
              </li>
            ))}
          </ul>
          <p className="text-fg-muted mt-2 text-xs">
            {t("detail.details.toolsHint")}
          </p>
        </>
      ),
    });
  }
  if (skill.keywords.length) {
    details.push({
      key: "keywords",
      label: t("detail.details.keywords"),
      value: (
        <ul className="text-fg-muted flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
          {skill.keywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
      ),
    });
  }
  details.push({
    key: "source",
    label: t("detail.details.source"),
    value: (
      <SkillSourceLink
        href={repoTreeUrl(sha, `${SKILLS_DIR}/${slug}`)}
        slug={slug}
        newTabLabel={t("detail.newTab")}
        className="text-fg hover:text-accent focus-visible:ring-accent inline-flex items-center gap-1.5 rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {t("detail.details.sourceValue", {
          repo: SKILLS_REPO,
          sha: sha.slice(0, 7),
        })}
        <ArrowTopRightIcon aria-hidden="true" className="h-3 w-3" />
      </SkillSourceLink>
    ),
  });
  details.push({
    key: "files",
    label: (
      <>
        {t("detail.details.files")}
        <span className="text-fg-muted block text-xs font-normal">
          {t("detail.details.filesCount", { count: skill.files.length })}
        </span>
      </>
    ),
    value: (
      <SkillFiles slug={slug} sha={sha} files={skill.files} locale={lang} />
    ),
  });

  return (
    <main
      className={`mx-auto w-full max-w-[760px] flex-1 px-5 pt-10 pb-20 lg:pt-16 ${hasToc ? "lg:max-w-[1040px]" : ""}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(skill, lang) }}
      />
      <div
        className={`grid gap-y-10 ${hasToc ? "lg:grid-cols-[minmax(0,720px)_200px] lg:gap-x-16 lg:gap-y-8" : ""}`}
      >
        <header className="min-w-0">
          {nav}
          {skill.category && (
            <p className="bg-accent-muted text-fg mb-5 inline-flex rounded-full px-2.5 py-1 font-mono text-xs tracking-wide uppercase">
              {skill.category}
            </p>
          )}
          <h1 className={h1Class}>{skill.slug}</h1>
          <p
            lang="en"
            className="text-fg-muted mb-6 text-base leading-relaxed text-pretty sm:text-lg"
          >
            {skill.summary}
          </p>
          {lang === "pt" && (
            <p className="text-fg-muted mb-6 flex items-start gap-2 text-sm">
              <InfoCircledIcon
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              {t("detail.languageNote")}
            </p>
          )}
          {facts.length > 0 && (
            <dl
              aria-label={t("detail.facts.label")}
              className="border-border grid grid-cols-2 gap-x-6 gap-y-4 border-b pb-6 sm:flex sm:flex-wrap sm:gap-x-10"
            >
              {facts.map((fact) => (
                <div
                  key={fact.key}
                  className={fact.wide ? "col-span-2 sm:col-span-1" : ""}
                >
                  <dt className="text-fg-muted text-xs">{fact.label}</dt>
                  <dd className="text-fg mt-1 text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </header>

        <SkillInstall
          slug={skill.slug}
          plugin={skill.plugin}
          scriptsCount={countFilesIn(skill, "scripts")}
          className="lg:col-start-1"
        />

        {hasToc && (
          <TableOfContents
            items={toc}
            label={t("detail.onThisPage")}
            className="lg:col-start-2 lg:row-span-3 lg:row-start-1"
          />
        )}

        <div className="flex min-w-0 flex-col gap-14 lg:col-start-1">
          <section
            id="triggers"
            aria-labelledby="triggers-title"
            className={sectionClass}
          >
            <h2 id="triggers-title" className={h2Class}>
              {t("detail.triggers.title")}
            </h2>
            <blockquote
              lang="en"
              cite={skillMdUrl}
              className="border-border-strong text-fg mt-4 border-l-2 pl-5 text-base leading-relaxed"
            >
              {skill.description}
            </blockquote>
            <p className="text-fg-muted mt-3 text-sm">
              {t("detail.triggers.hint")}
            </p>
          </section>

          <section
            id="details"
            aria-labelledby="details-title"
            className={sectionClass}
          >
            <h2 id="details-title" className={h2Class}>
              {t("detail.details.title")}
            </h2>
            <dl className="divide-border border-border mt-4 divide-y border-y">
              {details.map((row) => (
                <div
                  key={row.key}
                  className="grid gap-2 py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="text-fg text-sm font-semibold">{row.label}</dt>
                  <dd className="text-fg-muted min-w-0 text-sm leading-relaxed">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            id="instructions"
            aria-labelledby="instructions-title"
            className={sectionClass}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h2 id="instructions-title" className={h2Class}>
                {t("detail.instructions.title")}
              </h2>
              <SkillSourceLink
                href={skillMdUrl}
                slug={slug}
                newTabLabel={t("detail.newTab")}
                className="text-fg-muted hover:text-accent focus-visible:ring-accent inline-flex min-h-11 items-center gap-1 rounded-sm font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                SKILL.md
                <ArrowTopRightIcon aria-hidden="true" className="h-3 w-3" />
              </SkillSourceLink>
            </div>
            <div className="mt-6">
              {markdown ? (
                <SkillMarkdown tree={markdown.tree} />
              ) : (
                <pre
                  lang="en"
                  className="text-fg text-sm leading-relaxed whitespace-pre-wrap"
                >
                  {skill.body}
                </pre>
              )}
            </div>
          </section>

          <footer className="border-border text-fg-muted flex flex-wrap items-baseline justify-between gap-4 border-t pt-6 text-sm">
            <Link href="/skills" className={backLinkClass}>
              <ArrowLeftIcon aria-hidden="true" className="h-4 w-4" />
              {t("detail.back")}
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
