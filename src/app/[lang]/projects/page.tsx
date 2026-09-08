import type { Metadata } from "next";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import { ProjectArchive } from "@/components/ProjectArchive";
import { projects } from "@/data/projects";
import { importLocale } from "@/locales";
import { Link } from "@/locales/navigation";

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

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pt-12 pb-20 lg:pt-24">
      <header className="pb-10 sm:pb-12">
        <h1 className="text-fg mb-6 text-3xl leading-tight font-medium tracking-tight sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted max-w-[64ch] text-base leading-relaxed text-pretty sm:text-lg">
          {t("description")}
        </p>
      </header>

      <ProjectArchive projects={groupedProjects} />

      <footer className="border-border text-fg-muted mt-8 flex flex-wrap items-baseline gap-x-1.5 gap-y-2 border-t pt-6 text-sm leading-relaxed">
        <p>{t("experience.prompt")}</p>
        <Link
          href="/about#experience"
          className="group text-fg hover:text-accent focus-visible:ring-accent inline-flex items-center gap-1.5 rounded-sm py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {t("experience.link")}
          <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </footer>
    </main>
  );
}
