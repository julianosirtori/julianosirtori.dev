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
    title: title,
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

  // Flatten all projects with their year for indexing
  let globalIndex = 0;

  return (
    <main className="py-nav-height-mobile text-secondary selection:bg-cyan lg:py-nav-height-desktop mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col px-5 text-base leading-8 selection:text-black">
      <h1 className="text-primary mb-4 text-5xl font-bold">
        <span className="from-purple to-cyan bg-gradient-to-r bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h1>
      <p className="text-secondary mb-10 text-base leading-8">
        {t("description")}
      </p>

      <div className="space-y-10">
        {years.map((year) => (
          <section key={year}>
            <h2 className="text-primary mb-4 flex items-center gap-3 text-xl font-bold">
              <span className="from-cyan to-green text-background flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold">
                {year.slice(-2)}
              </span>
              {year}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
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
