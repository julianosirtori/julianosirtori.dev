"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

import { textButtonClass } from "@/components/Audience/copy";
import { SkillCard, type SkillCardData } from "@/components/SkillCard";
import { track } from "@/lib/analytics";
import { SKILLS_FILTER_THRESHOLD } from "@/lib/skills/constants";

export interface SkillsCatalogItem extends SkillCardData {
  keywords: string[];
}

export interface SkillsCatalogProps {
  skills: SkillsCatalogItem[];
}

const normalize = (text: string) =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const ALL = "";

/**
 * The catalog list. Below SKILLS_FILTER_THRESHOLD it is a plain list; from
 * there on it adds a text filter and, with two or more categories, category
 * buttons. Order never changes with the filter.
 */
export function SkillsCatalog({ skills }: SkillsCatalogProps) {
  const t = useTranslations("skills.filter");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const inputRef = useRef<HTMLInputElement>(null);

  const showFilters = skills.length >= SKILLS_FILTER_THRESHOLD;

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const skill of skills) {
      if (skill.category) {
        counts.set(skill.category, (counts.get(skill.category) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort(
      ([a, countA], [b, countB]) => countB - countA || a.localeCompare(b),
    );
  }, [skills]);
  const showCategories = showFilters && categories.length >= 2;

  const haystacks = useMemo(
    () =>
      new Map(
        skills.map((skill) => [
          skill.slug,
          normalize([skill.slug, skill.summary, ...skill.keywords].join(" ")),
        ]),
      ),
    [skills],
  );

  const needle = normalize(query);
  const visible = skills.filter(
    (skill) =>
      (category === ALL || skill.category === category) &&
      (!needle || haystacks.get(skill.slug)?.includes(needle)),
  );
  const filtering = Boolean(needle) || category !== ALL;

  // Only the result count leaves the browser, never the typed text.
  useEffect(() => {
    if (!needle) return;
    const timer = setTimeout(
      () =>
        track("skill_search", {
          location: "skills",
          result_count: visible.length,
        }),
      800,
    );
    return () => clearTimeout(timer);
  }, [needle, visible.length]);

  const clearAll = () => {
    setQuery("");
    setCategory(ALL);
    inputRef.current?.focus();
  };

  return (
    <div>
      {showFilters && (
        <>
          <div
            role="search"
            aria-label={t("region")}
            className="mb-2 grid gap-4"
          >
            <div>
              <label
                htmlFor="skills-filter"
                className="text-fg-muted mb-2 block text-sm"
              >
                {t("label")}
              </label>
              <div className="relative">
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="text-fg-muted pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
                />
                <input
                  ref={inputRef}
                  id="skills-filter"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-controls="skills-results"
                  autoComplete="off"
                  className="border-border bg-bg-elevated text-fg focus:border-accent focus:ring-accent h-12 w-full rounded-md border pr-12 pl-10 text-base focus:ring-1 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label={t("clear")}
                    className="text-fg-muted hover:text-fg focus-visible:ring-accent absolute top-0.5 right-0.5 inline-flex h-11 w-11 items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Cross2Icon aria-hidden="true" className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            {showCategories && (
              <div
                role="group"
                aria-label={t("categories")}
                className="flex flex-wrap gap-x-6 gap-y-1"
              >
                {[[ALL, skills.length] as const, ...categories].map(
                  ([value, count]) => (
                    <button
                      key={value || "all"}
                      type="button"
                      aria-pressed={category === value}
                      aria-controls="skills-results"
                      onClick={() => setCategory(value)}
                      className={`text-fg-muted hover:text-fg aria-pressed:border-accent aria-pressed:text-fg focus-visible:ring-accent flex min-h-11 cursor-pointer items-center gap-2 border-b-2 border-transparent px-0.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none ${value ? "font-mono" : ""}`}
                    >
                      {value || t("all")}
                      <span
                        aria-hidden="true"
                        className="font-mono text-[11px] tabular-nums"
                      >
                        {count}
                      </span>
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
          <div className="text-fg-muted flex min-h-12 items-center justify-between gap-4 text-xs">
            <p role="status" aria-atomic="true" className="font-mono">
              {filtering
                ? t("showing", {
                    visible: visible.length,
                    total: skills.length,
                  })
                : ""}
            </p>
            {filtering && (
              <button
                type="button"
                onClick={clearAll}
                className={textButtonClass}
              >
                {t("clearFilters")}
              </button>
            )}
          </div>
        </>
      )}

      <div id="skills-results">
        {visible.length === 0 ? (
          <div className="border-border border-y py-16 text-center">
            <p className="text-fg-muted text-base">
              {t("noResults", { query: query.trim() })}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className={`${textButtonClass} mt-4`}
            >
              {t("clearFilters")}
            </button>
          </div>
        ) : (
          <ul className="divide-border border-border divide-y border-y">
            {visible.map((skill) => (
              <li key={skill.slug}>
                <SkillCard skill={skill} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
