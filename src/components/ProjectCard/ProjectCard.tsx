import { ArrowTopRightIcon } from "@radix-ui/react-icons";

import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  categoryLabel: string;
  destinationLabel: string;
  newTabLabel: string;
}

export function ProjectCard({
  project,
  categoryLabel,
  destinationLabel,
  newTabLabel,
}: ProjectCardProps) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-labelledby={`project-${project.id}`}
      aria-describedby={`project-${project.id}-destination`}
      className="group hover:bg-bg-muted focus-visible:ring-accent -mx-3 grid gap-3 rounded-lg px-3 py-5 transition-colors focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8 sm:py-6"
    >
      <div className="min-w-0">
        <p className="text-fg-muted mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span>{categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{project.context}</span>
        </p>
        <h3
          id={`project-${project.id}`}
          className="text-fg group-hover:text-accent text-lg leading-snug font-medium tracking-tight break-words transition-colors motion-reduce:transition-none"
        >
          {project.title}
        </h3>
        <p className="text-fg-muted mt-2 max-w-[62ch] text-sm leading-relaxed">
          {project.description}
        </p>
      </div>
      <span
        id={`project-${project.id}-destination`}
        className="text-fg-muted group-hover:text-fg inline-flex items-center gap-1.5 self-center text-xs whitespace-nowrap transition-colors motion-reduce:transition-none sm:text-sm"
      >
        {destinationLabel}
        <ArrowTopRightIcon
          aria-hidden="true"
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
        />
        <span className="sr-only"> — {newTabLabel}</span>
      </span>
    </a>
  );
}
