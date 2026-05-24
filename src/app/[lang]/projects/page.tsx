import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Metadata } from "next";
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

  const title = "Juliano Sirtori | Projects";
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
  const years = Object.keys(projectsGroupedByYear).reverse();

  let globalIndex = 0;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pt-24 pb-20 lg:pt-32">
      <header className="mb-12">
        <h1 className="text-fg mb-3 text-4xl font-medium tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted max-w-prose text-base leading-relaxed">
          {t("description")}
        </p>
      </header>

      <div className="flex flex-col gap-12">
        {years.map((year) => (
          <section key={year}>
            <h2 className="text-fg-subtle mb-4 font-mono text-sm tracking-wide uppercase">
              {year}
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {projectsGroupedByYear[
                year as keyof typeof projectsGroupedByYear
              ].map((project) => {
                const currentIndex = globalIndex++;
                return (
                  <ProjectCard
                    key={project.title}
                    title={project.title}
                    href={project.href}
                    year={year}
                    index={currentIndex}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
