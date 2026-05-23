"use client";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";

import { featuredProjects } from "@/data/featured-projects";

interface FeaturedProjectsProps {
  locale: string;
  title: string;
  viewAll: string;
}

export function FeaturedProjects({
  locale,
  title,
  viewAll,
}: FeaturedProjectsProps) {
  const projects = featuredProjects.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-fg text-xl font-medium tracking-tight">{title}</h2>
        <a
          href={`/${locale}/projects`}
          className="group text-fg-muted hover:text-fg inline-flex items-center gap-1 text-sm transition-colors"
        >
          {viewAll}
          <ArrowTopRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((project, index) => (
          <motion.a
            key={project.id}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group border-border hover:border-fg-muted flex flex-col gap-2 rounded-lg border p-4 transition-colors"
          >
            <div className="flex items-start justify-between">
              <span className="text-fg-subtle font-mono text-xs">
                {project.year}
              </span>
              <ArrowTopRightIcon className="text-fg-subtle group-hover:text-fg h-4 w-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <h3 className="text-fg group-hover:text-accent text-base font-medium transition-colors">
              {project.title}
            </h3>

            <p className="text-fg-muted text-sm leading-relaxed">
              {locale === "pt"
                ? project.description.pt
                : project.description.en}
            </p>

            <div className="mt-1 flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="border-border text-fg-subtle rounded border px-1.5 py-0.5 font-mono text-[10px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
