"use client";

import { motion } from "framer-motion";

interface TechStackProps {
  title: string;
}

const technologies = [
  { name: "React", color: "#61DAFB", icon: "⚛️" },
  { name: "TypeScript", color: "#3178C6", icon: "📘" },
  { name: "Next.js", color: "#ffffff", icon: "▲" },
  { name: "JavaScript", color: "#F7DF1E", icon: "🟨" },
  { name: "Node.js", color: "#339933", icon: "🟢" },
  { name: "Tailwind", color: "#06B6D4", icon: "🎨" },
  { name: "GraphQL", color: "#E10098", icon: "◈" },
  { name: "Git", color: "#F05032", icon: "🔀" },
];

export function TechStack({ title }: TechStackProps) {
  return (
    <section className="w-full">
      <h2 className="text-primary mb-8 text-2xl font-bold">{title}</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="group border-hover bg-hover/30 hover:border-opacity-50 relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all duration-300"
            style={
              {
                "--tech-color": tech.color,
              } as React.CSSProperties
            }
          >
            <div
              className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at center, ${tech.color}15 0%, transparent 70%)`,
              }}
            />
            <span className="relative z-10 text-2xl">{tech.icon}</span>
            <span
              className="text-secondary group-hover:text-primary relative z-10 text-sm font-medium transition-colors"
              style={
                {
                  "--tw-text-opacity": 1,
                } as React.CSSProperties
              }
            >
              {tech.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
