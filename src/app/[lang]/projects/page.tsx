import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { importLocale } from "@/locales";

interface ProjectsProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectsProps): Promise<Metadata> {
  const { lang } = await params;
  const { messages } = await importLocale(lang);
  const title = `${messages.projects.title} | Juliano Sirtori`;
  const description = messages.projects.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://julianosirtori.dev/${lang}/projects`,
    },
  };
}

export default async function Projects({ params }: ProjectsProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("projects");
  const locale = await getLocale();
  const groupedProjects = projects[locale as keyof typeof projects];
  const projectGroups = Object.entries(groupedProjects).sort(
    ([firstYear], [secondYear]) => secondYear.localeCompare(firstYear),
  );

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 pt-20 pb-20 lg:pt-28">
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

      <div className="flex flex-col gap-12">
        {projectGroups.map(([year, items]) => (
          <section key={year} aria-labelledby={`projects-${year}`}>
            <h2
              id={`projects-${year}`}
              className="text-fg-subtle border-border mb-3 border-b pb-3 font-mono text-sm"
            >
              {year}
            </h2>
            <div className="flex flex-col gap-2">
              {items.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  href={project.href}
                  year={year}
                  index={index}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="border-border text-fg-subtle mt-16 border-t pt-6 font-mono text-xs">
        {t("footer")}
      </p>
    </main>
  );
}
