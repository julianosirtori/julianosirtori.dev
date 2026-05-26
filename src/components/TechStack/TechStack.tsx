"use client";

import { motion } from "framer-motion";

interface TechStackProps {
  title: string;
}

const technologies = [
  { name: "React", icon: "⚛️" },
  { name: "TypeScript", icon: "📘" },
  { name: "Next.js", icon: "▲" },
  { name: "Vue.js", icon: "💚" },
  { name: "Astro", icon: "🚀" },
  { name: "Tailwind", icon: "🎨" },
  { name: "Node.js", icon: "🟢" },
  { name: "NestJS", icon: "🐈" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Drizzle ORM", icon: "💧" },
  { name: "Docker", icon: "🐳" },
  { name: "Vitest", icon: "⚡" },
];

export function TechStack({ title }: TechStackProps) {
  return (
    <section className="w-full">
      <h2 className="text-fg mb-6 text-xl font-medium tracking-tight">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.25 }}
            className="border-border hover:border-fg-muted text-fg flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors"
          >
            <span className="font-mono text-base" aria-hidden>
              {tech.icon}
            </span>
            <span className="text-sm font-medium">{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
