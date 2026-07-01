import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { importLocale } from "@/locales";
import { Link } from "@/locales/navigation";

const FEATURED_HREF = "/projects/clinicaall";

interface ProjectsProps {
  params: Promise<{
    lang: string;
  }>;
}

const FEATURED_STACK = ["Next.js", "NestJS", "PostgreSQL"];

export async function generateMetadata({
  params,
}: ProjectsProps): Promise<Metadata> {
  const { lang } = await params;
  const { messages } = await importLocale(lang);

  const title = "Juliano Sirtori | Case studies";
  const description = messages.projects.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://julianosirtori.dev/projects",
    },
  };
}

export default async function Projects({ params }: ProjectsProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("projects");
  const currentLocale = await getLocale();
  const projectsGroupedByYear =
    projects[currentLocale as keyof typeof projects];

  const otherProjects = Object.entries(projectsGroupedByYear)
    .sort(([a], [b]) => b.localeCompare(a))
    .flatMap(([year, items]) => items.map((project) => ({ ...project, year })));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pt-20 pb-20 lg:pt-28">
      {/* HERO */}
      <header className="pb-14">
        <p className="text-accent mb-5 font-mono text-xs tracking-[0.16em] uppercase">
          {t("kicker")}
        </p>
        <h1 className="text-fg mb-6 text-5xl font-semibold tracking-tight md:text-6xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted max-w-[58ch] text-lg leading-relaxed text-pretty">
          {t("description")}
        </p>
      </header>

      {/* FEATURED CASE */}
      <section className="pb-20">
        <article className="border-border bg-bg-elevated overflow-hidden rounded-3xl border">
          <div className="grid items-stretch md:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col p-8 md:p-11">
              <p className="text-accent mb-5 font-mono text-[11px] tracking-[0.12em] uppercase">
                {t("featured.kicker")}
              </p>
              <div className="text-fg-subtle mb-3.5 flex items-center gap-2.5 font-mono text-xs">
                <span>2025</span>
                <span className="opacity-50">·</span>
                <span>{t("featured.tag")}</span>
              </div>
              <h2 className="text-fg mb-4 text-4xl leading-[1.05] font-semibold tracking-tight">
                <Link
                  href={FEATURED_HREF}
                  className="hover:text-accent transition-colors"
                >
                  Clinica<span className="text-accent">ALL</span>
                </Link>
              </h2>
              <p className="text-fg-muted mb-6 max-w-[46ch] text-base leading-relaxed">
                {t("featured.summary")}
              </p>
              <div className="mb-8 flex flex-wrap gap-1.5">
                {FEATURED_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="bg-accent-muted text-accent rounded-full px-2.5 py-1 font-mono text-[11px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <Link
                href={FEATURED_HREF}
                className="bg-accent text-accent-fg mt-auto inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                {t("featured.cta")}
              </Link>
            </div>

            <Link
              href={FEATURED_HREF}
              className="border-border bg-bg text-fg-subtle hover:text-fg flex min-h-[280px] items-center justify-center border-t p-8 text-center font-mono text-xs transition-colors md:border-t-0 md:border-l"
            >
              {t("featured.imageAlt")}
            </Link>
          </div>
        </article>
      </section>

      {/* OTHER PROJECTS */}
      <section>
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <p className="text-fg-subtle font-mono text-xs tracking-[0.14em] uppercase">
            {t("otherLabel")}
          </p>
          <p className="text-fg-subtle text-[13px]">{t("otherSub")}</p>
        </div>
        <div className="flex flex-col gap-2">
          {otherProjects.map((project, index) => (
            <ProjectCard
              key={`${project.year}-${project.title}`}
              title={project.title}
              href={project.href}
              year={project.year}
              index={index}
            />
          ))}
        </div>
      </section>

      <p className="border-border text-fg-subtle mt-16 border-t pt-6 font-mono text-xs">
        {t("footer")}
      </p>
    </main>
  );
}
