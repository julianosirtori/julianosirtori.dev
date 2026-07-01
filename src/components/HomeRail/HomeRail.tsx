"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

const SECTIONS = ["about", "work", "writing", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

export function HomeRail() {
  const t = useTranslations("home");
  const tGlobal = useTranslations("global");
  const [active, setActive] = useState<SectionId>("about");

  const [firstName, ...rest] = tGlobal("myFullName").split(" ");
  const lastName = rest.join(" ");

  const nav = useMemo(
    () =>
      SECTIONS.map((id) => ({ id, label: t(`nav.${id}`) })) as {
        id: SectionId;
        label: string;
      }[],
    [t],
  );

  useEffect(() => {
    const elements = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id as SectionId);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: SectionId) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 96,
      behavior: "smooth",
    });
  };

  return (
    <aside className="flex flex-col gap-12 lg:sticky lg:top-24 lg:h-fit">
      <div>
        <p className="text-accent mb-4 font-mono text-xs tracking-[0.16em] uppercase">
          {t("greeting")}
        </p>
        <h1 className="text-fg mb-3 text-5xl leading-[1.04] font-semibold tracking-tight">
          {firstName}
          {lastName && (
            <>
              <br />
              {lastName}
            </>
          )}
        </h1>
        <p className="text-fg mb-4 text-lg font-medium">{t("role")}</p>
        <p className="text-fg-muted max-w-[34ch] text-sm leading-relaxed">
          {t("bio")}
        </p>

        <nav className="mt-11 flex flex-col gap-4">
          {nav.map(({ id, label }) => {
            const on = id === active;
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="group flex items-center gap-4 text-left"
              >
                <span
                  className={
                    on
                      ? "bg-fg h-px w-16 transition-all"
                      : "bg-border-strong group-hover:bg-fg-muted h-px w-8 transition-all"
                  }
                />
                <span
                  className={
                    on
                      ? "text-fg font-mono text-xs tracking-[0.14em] uppercase transition-colors"
                      : "text-fg-subtle group-hover:text-fg-muted font-mono text-xs tracking-[0.14em] uppercase transition-colors"
                  }
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="mb-5 flex items-center gap-4">
          <a
            href={tGlobal("social.github")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-fg-subtle hover:text-fg transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a
            href={tGlobal("social.linkedin")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-fg-subtle hover:text-fg transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href={tGlobal("social.twitter")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="text-fg-subtle hover:text-fg transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
        <p className="text-fg-subtle flex items-center gap-2 font-mono text-xs">
          <span className="bg-success h-1.5 w-1.5 animate-pulse rounded-full" />
          {t("status")}
        </p>
      </div>
    </aside>
  );
}
