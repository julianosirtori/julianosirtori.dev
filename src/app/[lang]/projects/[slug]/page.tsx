import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { CodeBlock } from "@/components/CodeBlock";
import { Quote } from "@/components/Mdx/Quote";
import { Callout } from "@/components/Mdx/Callout";
import { ProjectCard } from "@/components/ProjectCard";
import {
  caseStudies,
  caseStudyLabels,
  type DecisionMedia,
} from "@/data/case-studies";
import { Link } from "@/locales/navigation";
import { routing } from "@/locales/config";

interface CaseStudyProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((lang) =>
    Object.keys(caseStudies[lang as "en" | "pt"]).map((slug) => ({
      lang,
      slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: CaseStudyProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const study = caseStudies[lang as "en" | "pt"]?.[slug];
  if (!study) return {};

  const title = `Juliano Sirtori | ${study.titlePrefix}${study.titleAccent}`;
  return {
    title,
    description: study.lede,
    openGraph: {
      title,
      description: study.lede,
      url: `https://julianosirtori.dev/projects/${slug}`,
    },
  };
}

function DecisionMediaBlock({ media }: { media: DecisionMedia }) {
  if (media.type === "code") {
    return (
      <CodeBlock data-language={media.language}>
        <code>{media.code}</code>
      </CodeBlock>
    );
  }
  if (media.type === "quote") {
    return (
      <Quote author={media.author} cite={media.cite}>
        {media.text}
      </Quote>
    );
  }
  return (
    <Callout tone={media.tone} title={media.title}>
      {media.text}
    </Callout>
  );
}

export default async function CaseStudyPage({ params }: CaseStudyProps) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const locale = (await getLocale()) as "en" | "pt";
  const study = caseStudies[locale]?.[slug];
  if (!study) notFound();

  const labels = caseStudyLabels[locale];
  const tGlobal = await getTranslations("global");

  const toc = [
    { id: "problem", n: "01", label: labels.toc.problem },
    { id: "decisions", n: "02", label: labels.toc.decisions },
    { id: "results", n: "03", label: labels.toc.results },
    { id: "learnings", n: "04", label: labels.toc.learnings },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-20 pb-16 lg:pt-24">
      <Link
        href="/projects"
        className="text-fg-muted hover:text-fg mb-10 inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <span aria-hidden>←</span>
        {labels.back}
      </Link>

      {/* HERO */}
      <header className="border-border border-b pb-14">
        <p className="text-accent mb-5 font-mono text-xs tracking-[0.16em] uppercase">
          {labels.kicker}
        </p>
        <h1 className="text-fg mb-6 text-5xl font-semibold tracking-tight md:text-6xl">
          {study.titlePrefix}
          <span className="text-accent">{study.titleAccent}</span>
        </h1>
        <p className="text-fg-muted max-w-[62ch] text-xl leading-relaxed text-pretty">
          {study.lede}
        </p>
      </header>

      <div className="grid items-start gap-14 pt-14 xl:grid-cols-[268px_1fr]">
        {/* RAIL */}
        <aside className="flex flex-col gap-7 xl:sticky xl:top-24">
          <RailField label={labels.role} value={study.role} />
          <RailField label={labels.period} value={study.period} />
          <RailField label={labels.client} value={study.client} />
          <div>
            <p className="text-fg-subtle mb-2.5 font-mono text-[11px] tracking-[0.1em] uppercase">
              {labels.stack}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {study.stack.map((tech) => (
                <span
                  key={tech}
                  className="bg-accent-muted text-accent rounded-full px-2.5 py-1 font-mono text-[11px]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <nav className="border-border flex flex-col gap-2.5 border-t pt-5">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-fg-subtle hover:text-fg flex gap-2.5 font-mono text-xs transition-colors"
              >
                <span className="text-accent">{item.n}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2.5">
            {study.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-fg hover:text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                {link.label}
                <span className="text-accent" aria-hidden>
                  ↗
                </span>
              </a>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <div className="min-w-0">
          {/* PROBLEM */}
          <section id="problem" className="mb-16 scroll-mt-24">
            <SectionLabel>{labels.sections.problem}</SectionLabel>
            <div className="flex flex-col gap-4">
              {study.problem.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-fg-muted max-w-[64ch] text-[17px] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <figure className="mt-7">
              <div className="border-border-strong bg-bg-elevated text-fg-subtle flex h-[320px] items-center justify-center rounded-2xl border border-dashed font-mono text-xs">
                {study.problem.figureCaption}
              </div>
              <figcaption className="text-fg-subtle mt-3 font-mono text-xs">
                {study.problem.figureCaption}
              </figcaption>
            </figure>
          </section>

          {/* DECISIONS */}
          <section id="decisions" className="mb-16 scroll-mt-24">
            <SectionLabel>{labels.sections.decisions}</SectionLabel>
            <div className="flex flex-col gap-5">
              {study.decisions.map((card) => (
                <article
                  key={card.n}
                  className="border-border bg-bg-elevated rounded-2xl border p-7"
                >
                  <div className="mb-5 flex items-baseline gap-3">
                    <span className="text-accent font-mono text-sm font-semibold">
                      {card.n}
                    </span>
                    <h3 className="text-fg text-xl font-semibold tracking-tight">
                      {card.title}
                    </h3>
                  </div>
                  <div className="mb-5 grid gap-y-4 sm:grid-cols-2 sm:gap-x-8">
                    <Field label={labels.fields.context} value={card.context} />
                    <Field
                      label={labels.fields.alternatives}
                      value={card.alternatives}
                    />
                    <Field
                      label={labels.fields.chose}
                      value={card.chose}
                      accent
                      strong
                    />
                    <Field
                      label={labels.fields.tradeoff}
                      value={card.tradeoff}
                    />
                  </div>
                  {card.media && <DecisionMediaBlock media={card.media} />}
                  <div className="border-border border-t pt-4">
                    <p className="text-accent mb-2 font-mono text-[11px] tracking-[0.08em] uppercase">
                      {labels.fields.why}
                    </p>
                    <p className="text-fg-muted text-[15px] leading-relaxed">
                      {card.why}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* RESULTS */}
          <section id="results" className="mb-16 scroll-mt-24">
            <SectionLabel>{labels.sections.results}</SectionLabel>
            <div className="mb-3.5 grid gap-3.5 sm:grid-cols-3">
              {study.results.items.map((item) => (
                <div
                  key={item.slice(0, 24)}
                  className="border-border rounded-2xl border p-5"
                >
                  <p className="text-fg text-[15px] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-fg-subtle font-mono text-xs">
              {study.results.note}
            </p>
          </section>

          {/* LEARNINGS */}
          <section id="learnings" className="mb-16 scroll-mt-24">
            <SectionLabel>{labels.sections.learnings}</SectionLabel>
            <ul className="flex flex-col gap-4">
              {study.learnings.map((item) => (
                <li
                  key={item.slice(0, 24)}
                  className="text-fg-muted relative max-w-[66ch] pl-6 text-[17px] leading-relaxed"
                >
                  <span
                    className="text-accent absolute top-0 left-0"
                    aria-hidden
                  >
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* RELATED */}
          <section aria-label={labels.sections.related}>
            <SectionLabel>{labels.sections.related}</SectionLabel>
            <div className="flex flex-col gap-2">
              {study.related.map((item, index) => (
                <ProjectCard
                  key={item.title}
                  title={item.title}
                  href={item.href}
                  year={item.year}
                  index={index}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <p className="border-border text-fg-subtle mt-16 border-t pt-6 font-mono text-xs">
        {labels.footer} · {tGlobal("myFullName")}
      </p>
    </main>
  );
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-subtle mb-6 font-mono text-xs tracking-[0.14em] uppercase">
    {children}
  </p>
);

function RailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-fg-subtle mb-2 font-mono text-[11px] tracking-[0.1em] uppercase">
        {label}
      </p>
      <p className="text-fg text-[15px] leading-snug font-medium">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  accent,
  strong,
}: {
  label: string;
  value: string;
  accent?: boolean;
  strong?: boolean;
}) {
  return (
    <div>
      <p
        className={`mb-2 font-mono text-[11px] tracking-[0.08em] uppercase ${
          accent ? "text-accent" : "text-fg-subtle"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-[14.5px] leading-relaxed ${
          strong ? "text-fg" : "text-fg-muted"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
