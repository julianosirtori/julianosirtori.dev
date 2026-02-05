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
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-primary text-2xl font-bold">{title}</h2>
        <a
          href={`/${locale}/projects`}
          className="group text-secondary hover:text-cyan flex items-center gap-1 text-sm transition-colors"
        >
          {viewAll}
          <ArrowTopRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, index) => (
          <motion.a
            key={project.id}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group border-hover from-hover/50 hover:border-cyan/50 relative overflow-hidden rounded-xl border bg-gradient-to-br to-transparent p-5 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(128,255,234,0.3)]"
          >
            {/* Glow effect on hover */}
            <div className="bg-cyan/10 absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="mb-3 flex items-start justify-between">
                <span className="bg-cyan/10 text-cyan inline-block rounded-full px-3 py-1 text-xs font-medium">
                  {project.year}
                </span>
                <ArrowTopRightIcon className="text-secondary group-hover:text-cyan h-5 w-5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
              </div>

              <h3 className="text-primary group-hover:text-cyan mb-2 text-lg font-semibold transition-colors">
                {project.title}
              </h3>

              <p className="text-secondary mb-4 text-sm leading-relaxed">
                {locale === "pt"
                  ? project.description.pt
                  : project.description.en}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-background text-secondary rounded-md px-2 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
