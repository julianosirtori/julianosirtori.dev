"use client";

import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Experience {
  jobTitle: string;
  company: string;
  companyUrl: string;
  startDate: string;
  endDate?: string;
  location: string;
  skills: string;
}

interface CareerTimelineProps {
  title: string;
  experiences: Experience[];
  presentLabel: string;
  skillsLabel: string;
}

export function CareerTimeline({
  title,
  experiences,
  presentLabel,
  skillsLabel,
}: CareerTimelineProps) {
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

      <div className="relative ml-4 md:ml-8">
        {/* Vertical timeline line */}
        <div className="bg-hover absolute top-0 bottom-0 left-0 w-px" />

        {experiences.map((item, index) => {
          const isCurrentJob = !item.endDate;
          const skillsList = item.skills.split(" · ");
          const startFormatted = dayjs(item.startDate).format("MMM YYYY");
          const endFormatted = item.endDate
            ? dayjs(item.endDate).format("MMM YYYY")
            : presentLabel;
          const duration = dayjs(item.startDate).from(
            dayjs(item.endDate || undefined),
            true,
          );

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative pb-12 pl-8 last:pb-0"
            >
              {/* Dot marker */}
              {isCurrentJob ? (
                <span className="absolute top-2 -left-[6px] flex h-3 w-3">
                  <span className="bg-green absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                  <span className="bg-green relative inline-flex h-3 w-3 rounded-full" />
                </span>
              ) : (
                <span className="border-background bg-cyan absolute top-2.5 -left-[4px] h-2 w-2 rounded-full border-2" />
              )}

              {/* Card content */}
              <div className="group hover:border-hover hover:bg-hover/30 rounded-xl border border-transparent p-5 transition-all duration-300">
                <h3 className="text-primary group-hover:text-cyan text-lg font-semibold transition-colors">
                  {item.jobTitle}
                </h3>

                <p className="text-secondary mt-1 text-sm">
                  <a
                    rel="noopener noreferrer"
                    href={item.companyUrl}
                    target="_blank"
                    className="text-primary hover:text-cyan border-secondary hover:border-cyan border-b transition-colors"
                  >
                    {item.company}
                  </a>
                  <span> &bull; {item.location}</span>
                </p>

                <p className="text-secondary mt-1 text-sm">
                  {startFormatted} &ndash; {endFormatted} &bull; {duration}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-primary text-xs font-semibold">
                    {skillsLabel}:
                  </span>
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="border-hover bg-hover/50 text-secondary inline-block rounded-md border px-2.5 py-0.5 text-xs font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
