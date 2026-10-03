import { Fragment, type ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Link } from "@/locales/navigation";

/** Display-ready card data. Strings are already translated by the page. */
export interface SkillCardData {
  slug: string;
  summary: string;
  category?: string;
  version?: string;
  updated?: { iso: string; label: string };
  compatibility?: string;
  /** e.g. ["3 scripts", "3 references"] */
  fileCounts: string[];
}

function Dotted({
  items,
  className,
}: {
  items: ReactNode[];
  className: string;
}) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <span aria-hidden="true">·</span>}
          {item}
        </Fragment>
      ))}
    </div>
  );
}

/** One row of the catalog. The whole row links to the detail page. */
export function SkillCard({ skill }: { skill: SkillCardData }) {
  const meta = [
    skill.category && (
      <span key="category" className="font-mono">
        {skill.category}
      </span>
    ),
    skill.version && (
      <span key="version" className="font-mono">
        v{skill.version}
      </span>
    ),
    skill.updated && (
      <time key="updated" dateTime={skill.updated.iso}>
        {skill.updated.label}
      </time>
    ),
  ].filter(Boolean) as ReactNode[];

  return (
    <Link
      href={`/skills/${skill.slug}`}
      aria-labelledby={`skill-${skill.slug}`}
      className="group hover:bg-bg-muted focus-visible:ring-accent -mx-3 grid grid-cols-[minmax(0,1fr)_16px] gap-4 rounded-sm px-3 py-5 transition-colors focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none sm:py-6"
    >
      <div className="min-w-0">
        {meta.length > 0 && (
          <Dotted
            items={meta}
            className="text-fg-muted mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs"
          />
        )}
        <h2
          id={`skill-${skill.slug}`}
          className="text-fg group-hover:text-accent font-mono text-lg leading-snug font-medium [overflow-wrap:anywhere] transition-colors sm:text-xl"
        >
          {skill.slug}
        </h2>
        <p
          lang="en"
          className="text-fg-muted mt-2 max-w-[68ch] text-sm leading-relaxed text-pretty"
        >
          {skill.summary}
        </p>
        {(skill.compatibility || skill.fileCounts.length > 0) && (
          <div className="text-fg-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {skill.compatibility && (
              <span lang="en">{skill.compatibility}</span>
            )}
            {skill.fileCounts.length > 0 && (
              <Dotted
                items={skill.fileCounts.map((label) => (
                  <span key={label}>{label}</span>
                ))}
                className="flex flex-wrap items-center gap-x-2 font-mono"
              />
            )}
          </div>
        )}
      </div>
      <ArrowRightIcon
        aria-hidden="true"
        className="text-fg-muted group-hover:text-accent mt-7 h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
      />
    </Link>
  );
}
