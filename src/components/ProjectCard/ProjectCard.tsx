"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

interface ProjectCardProps {
  title: string;
  href: string;
  year: string;
  index: number;
}

export function ProjectCard({ title, href, year, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group border-hover bg-hover/20 hover:border-cyan/50 relative flex items-center justify-between overflow-hidden rounded-xl border p-5 transition-all duration-300"
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: isHovering
            ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(128,255,234,0.1), transparent 40%)`
            : "none",
        }}
      />

      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className="absolute inset-[-1px] rounded-xl"
          style={{
            background: isHovering
              ? `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(128,255,234,0.3), transparent 40%)`
              : "none",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-cyan text-xs font-medium">{year}</span>
        <h3 className="text-primary group-hover:text-cyan font-semibold transition-colors">
          {title}
        </h3>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        <ArrowTopRightIcon className="text-secondary group-hover:text-cyan h-5 w-5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
      </div>
    </motion.a>
  );
}
