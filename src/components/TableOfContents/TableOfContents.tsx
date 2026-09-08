"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export interface TocItem {
  level: number;
  text: string;
  slug: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  label: string;
}

export function TableOfContents({ items, label }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!items.length) return;
    const elements = items
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);
    let frame = 0;
    const update = () => {
      const headerHeight =
        document.querySelector("header")?.getBoundingClientRect().height ?? 144;
      const scrollMargin = elements[0]
        ? parseFloat(getComputedStyle(elements[0]).scrollMarginTop) || 0
        : 0;
      const offset = Math.max(headerHeight + 24, scrollMargin) + 8;
      let current: string | null = null;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= offset) current = element.id;
      }
      setActiveSlug(current);
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  if (!items.length) return null;

  const onSelect = (slug: string) => {
    if (detailsRef.current) detailsRef.current.open = false;
    const heading = document.getElementById(slug);
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  };

  return (
    <aside className="min-w-0 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-fit lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
      <nav aria-label={label} className="hidden lg:block">
        <p className="text-fg mb-4 text-sm font-medium">{label}</p>
        <TocList items={items} activeSlug={activeSlug} onSelect={onSelect} />
      </nav>
      <details
        ref={detailsRef}
        className="group border-border border-y lg:hidden"
      >
        <summary className="text-fg focus-visible:ring-accent flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-3 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
          {label}
          <ChevronDownIcon
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <nav aria-label={label} className="max-h-80 overflow-y-auto pb-4">
          <TocList items={items} activeSlug={activeSlug} onSelect={onSelect} />
        </nav>
      </details>
    </aside>
  );
}

function TocList({
  items,
  activeSlug,
  onSelect,
}: {
  items: TocItem[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <ul className="border-border border-l text-sm">
      {items.map((item) => {
        const isActive = item.slug === activeSlug;
        return (
          <li key={item.slug}>
            <a
              href={`#${item.slug}`}
              onClick={() => onSelect(item.slug)}
              aria-current={isActive ? "location" : undefined}
              className={`focus-visible:ring-accent -ml-px flex min-h-11 items-center border-l py-2 pr-2 leading-relaxed transition-colors focus-visible:ring-2 focus-visible:outline-none lg:min-h-0 ${item.level === 3 ? "pl-6" : "pl-3"} ${isActive ? "text-accent border-accent font-medium" : "text-fg-muted hover:text-fg border-transparent"}`}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
