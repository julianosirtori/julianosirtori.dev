"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { ProjectCard } from "@/components/ProjectCard";
import type { ProjectCategory, ProjectsByYear } from "@/data/projects";

type ProjectFilter = "all" | ProjectCategory;

const filters: ProjectFilter[] = ["all", "personal", "client", "company"];

interface ProjectArchiveProps {
  projects: ProjectsByYear;
}

export function ProjectArchive({ projects }: ProjectArchiveProps) {
  const t = useTranslations("projects");
  const [selectedFilter, setSelectedFilter] = useState<ProjectFilter>("all");
  const allProjects = Object.values(projects).flat();
  const visibleProjects = Object.entries(projects)
    .sort(([firstYear], [secondYear]) => Number(secondYear) - Number(firstYear))
    .flatMap(([year, items]) => items.map((project) => ({ year, project })))
    .filter(
      ({ project }) =>
        selectedFilter === "all" || project.category === selectedFilter,
    );
  const visibleCount = visibleProjects.length;

  return (
    <div>
      <div
        role="group"
        aria-label={t("filters.label")}
        className="mb-7 grid grid-cols-2 gap-x-6 gap-y-1 sm:mb-8 sm:flex sm:gap-7"
      >
        {filters.map((filter) => {
          const count = allProjects.filter(
            (project) => filter === "all" || project.category === filter,
          ).length;

          return (
            <button
              key={filter}
              type="button"
              aria-pressed={selectedFilter === filter}
              aria-controls="project-results"
              onClick={() => setSelectedFilter(filter)}
              className="text-fg-muted hover:text-fg aria-pressed:border-accent aria-pressed:text-fg focus-visible:ring-accent focus-visible:ring-offset-bg flex min-h-11 cursor-pointer items-center justify-between gap-2 border-b-2 border-transparent px-0.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none sm:justify-start"
            >
              {t(`filters.${filter}`)}
              <span
                aria-hidden="true"
                className="font-mono text-[11px] tabular-nums opacity-70"
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p role="status" aria-atomic="true" className="sr-only">
        {t("results", { count: visibleCount })}
      </p>

      <ul
        id="project-results"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visibleProjects.map(({ year, project }, index) => (
          <li key={project.id} className="min-w-0">
            <ProjectCard
              project={project}
              year={year}
              eager={index < 3}
              categoryLabel={t(`categories.${project.category}`)}
              destinationLabel={t(`destinations.${project.destination}`)}
              newTabLabel={t("newTab")}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
