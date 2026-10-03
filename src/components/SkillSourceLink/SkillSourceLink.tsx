"use client";

import type { ReactNode } from "react";

import { track } from "@/lib/analytics";

export interface SkillSourceLinkProps {
  href: string;
  slug: string;
  className?: string;
  /** Screen-reader note for the new tab, e.g. "opens in a new tab". */
  newTabLabel: string;
  children: ReactNode;
}

/** External link to the skill on GitHub that reports `skill_source_click`. */
export function SkillSourceLink({
  href,
  slug,
  className,
  newTabLabel,
  children,
}: SkillSourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        track("skill_source_click", { location: "skills", content_id: slug })
      }
    >
      {children}
      <span className="sr-only"> ({newTabLabel})</span>
    </a>
  );
}
