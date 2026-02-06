"use client";

import { motion } from "framer-motion";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";

interface Recommendation {
  name: string;
  role: string;
  linkedIn: string;
  date: string;
  content: string[];
}

interface RecommendationCardsProps {
  title: string;
  recommendations: Recommendation[];
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
}

export function RecommendationCards({
  title,
  recommendations,
}: RecommendationCardsProps) {
  return (
    <section className="w-full">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-primary mb-8 text-2xl font-bold"
      >
        {title}
      </motion.h2>

      <div className="flex flex-col gap-6">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group border-hover from-hover/50 hover:border-purple/50 relative overflow-hidden rounded-xl border bg-gradient-to-br to-transparent p-6 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(149,128,255,0.3)]"
          >
            {/* Glow effect on hover */}
            <div className="bg-purple/10 absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            {/* Quote decoration */}
            <span className="text-purple/20 pointer-events-none absolute -top-2 left-4 font-serif text-6xl select-none">
              &ldquo;
            </span>

            <div className="relative z-10">
              {/* Header with avatar, name, role, LinkedIn */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple/20 text-purple flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                    {getInitials(rec.name)}
                  </div>
                  <div>
                    <p className="text-primary font-semibold">{rec.name}</p>
                    <p className="text-secondary text-sm">{rec.role}</p>
                  </div>
                </div>
                <a
                  href={rec.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-cyan transition-colors"
                  aria-label={`${rec.name} LinkedIn`}
                >
                  <LinkedInLogoIcon className="h-5 w-5" />
                </a>
              </div>

              {/* Content */}
              {rec.content.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="text-secondary text-base leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
