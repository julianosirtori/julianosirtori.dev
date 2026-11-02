import Image from "next/image";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

import { projectPreviews } from "@/data/project-previews";
import type { Project } from "@/data/projects";
import { PORTFOLIO_URL } from "@/lib/site";

interface ProjectCardProps {
  project: Project;
  year: string;
  // Cards in the first row are above the fold; load their previews eagerly.
  eager?: boolean;
  categoryLabel: string;
  // Absent when the project has no public page left to link to.
  destinationLabel?: string;
  newTabLabel: string;
}

export function ProjectCard({
  project,
  year,
  eager = false,
  categoryLabel,
  destinationLabel,
  newTabLabel,
}: ProjectCardProps) {
  const preview = projectPreviews[project.id];

  const cardClass =
    "border-border bg-bg flex h-full flex-col overflow-hidden rounded-xl border";

  const content = (
    <>
      <div className="border-border bg-bg-muted relative aspect-[16/10] overflow-hidden border-b">
        {preview ? (
          <Image
            src={preview}
            alt=""
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div
            aria-hidden="true"
            className="text-fg-subtle flex h-full flex-col justify-between bg-[radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:14px_14px] p-5"
          >
            <span className="font-mono text-[11px] tracking-wide uppercase">
              {categoryLabel}
            </span>
            <span className="text-fg/70 group-hover:text-accent font-mono text-base leading-relaxed text-balance transition-colors motion-reduce:transition-none">
              <span className="text-accent">&gt;</span> {project.context}
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <p className="text-fg-muted mb-2 flex items-baseline justify-between gap-3 text-xs">
          <span className="min-w-0 truncate">
            {categoryLabel}
            <span aria-hidden="true"> · </span>
            {project.context}
          </span>
          <time
            dateTime={year}
            className="text-fg-subtle shrink-0 font-mono tabular-nums"
          >
            {year}
          </time>
        </p>
        <h2
          id={`project-${project.id}`}
          className="text-fg group-hover:text-accent text-lg leading-snug font-medium tracking-tight break-words transition-colors motion-reduce:transition-none"
        >
          {project.title}
        </h2>
        <p className="text-fg-muted mt-2 text-sm leading-relaxed">
          {project.description}
        </p>
      </div>
    </>
  );

  if (!project.href) {
    return (
      <article
        data-project={project.id}
        aria-labelledby={`project-${project.id}`}
        className={cardClass}
      >
        {content}
      </article>
    );
  }

  return (
    <a
      href={project.href}
      data-project={project.id}
      target="_blank"
      // Keep the referrer on links to the portfolio so referrals are counted.
      rel={
        project.href.startsWith(PORTFOLIO_URL)
          ? "noopener"
          : "noopener noreferrer"
      }
      aria-labelledby={`project-${project.id}`}
      aria-describedby={`project-${project.id}-destination`}
      className={`group ${cardClass} hover:border-border-strong focus-visible:ring-accent focus-visible:ring-offset-bg transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:hover:shadow-black/40`}
    >
      {content}
      {destinationLabel && (
        <span className="block px-5 pb-5">
          <span
            id={`project-${project.id}-destination`}
            className="text-fg-muted group-hover:text-fg inline-flex items-center gap-1.5 text-sm whitespace-nowrap transition-colors motion-reduce:transition-none"
          >
            {destinationLabel}
            <ArrowTopRightIcon
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
            />
            <span className="sr-only"> — {newTabLabel}</span>
          </span>
        </span>
      )}
    </a>
  );
}
