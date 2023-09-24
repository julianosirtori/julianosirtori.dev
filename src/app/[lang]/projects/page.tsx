import { useLocale, useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import Link from "next/link";
import { Metadata } from "next";
import { importLocale } from "@/locales";

interface ProjectsProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: ProjectsProps): Promise<Metadata> {
  const messages = (await importLocale({ locale: params.lang })).messages;

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

export default function Projects() {
  const t = useTranslations("projects");
  const currentLocale = useLocale();
  const projectsGroupedByYear =
    projects[currentLocale as keyof typeof projects];
  const years = Object.keys(projectsGroupedByYear).reverse();

  return (
    <main className="mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col	 px-5 py-nav-height-mobile text-base  leading-8 text-secondary selection:bg-cyan selection:text-black lg:py-nav-height-desktop">
      <h1 className="mb-4 text-5xl font-bold text-primary">
        <span className="bg-gradient-to-r from-purple to-cyan bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h1>
      <p className="text-base leading-8 text-secondary ">{t("description")}</p>
      <h2 className="mt-14 px-2 text-2xl font-semibold leading-8 text-primary">
        {t("allProjects")}
      </h2>
      {years.map((year) => (
        <div key={year}>
          <h2 className="mt-5 text-lg font-semibold text-primary">{year}</h2>
          <ul className="list-disc pl-8">
            {projectsGroupedByYear[
              year as keyof typeof projectsGroupedByYear
            ].map((project, index) => (
              <li key={index}>
                <Link
                  href={project.href}
                  target="_blank"
                  className="border-b border-secondary text-primary "
                >
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
