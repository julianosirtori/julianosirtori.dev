"use client";

import { motion } from "framer-motion";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

interface ProjectCardProps {
  title: string;
  href: string;
  year: string;
  index: number;
}

export function ProjectCard({ title, href, index }: ProjectCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="group border-border hover:border-fg-muted text-fg flex items-center justify-between rounded-lg border px-4 py-3 transition-colors"
    >
      <h3 className="text-sm font-medium">{title}</h3>
      <ArrowTopRightIcon className="text-fg-subtle group-hover:text-fg h-4 w-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.a>
  );
}
