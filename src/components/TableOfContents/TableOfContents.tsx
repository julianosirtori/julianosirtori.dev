"use client";

import { useEffect, useState } from "react";
import { ListBulletIcon, Cross2Icon } from "@radix-ui/react-icons";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSlug(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    const elements = items
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      <aside className="sticky top-24 hidden h-fit max-h-[calc(100vh-7rem)] overflow-y-auto xl:block">
        <p className="text-fg-subtle mb-3 font-mono text-xs tracking-wide uppercase">
          {label}
        </p>
        <TocList items={items} activeSlug={activeSlug} onSelect={() => {}} />
      </aside>

      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label={label}
        className="border-border bg-bg-elevated text-fg-muted hover:text-fg fixed right-5 bottom-20 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition-colors xl:hidden"
      >
        <ListBulletIcon className="h-4 w-4" />
      </button>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm xl:hidden"
          onClick={() => setDrawerOpen(false)}
          role="presentation"
        >
          <div
            className="border-border bg-bg-elevated absolute right-0 bottom-0 left-0 max-h-[70vh] overflow-y-auto rounded-t-xl border-t p-5"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={label}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-fg-subtle font-mono text-xs tracking-wide uppercase">
                {label}
              </p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                className="text-fg-muted hover:text-fg inline-flex h-7 w-7 items-center justify-center"
              >
                <Cross2Icon className="h-4 w-4" />
              </button>
            </div>
            <TocList
              items={items}
              activeSlug={activeSlug}
              onSelect={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

function TocList({
  items,
  activeSlug,
  onSelect,
}: {
  items: TocItem[];
  activeSlug: string | null;
  onSelect: () => void;
}) {
  return (
    <ul className="flex flex-col gap-1 text-sm">
      {items.map((item) => {
        const isActive = item.slug === activeSlug;
        return (
          <li key={item.slug} className={item.level === 3 ? "ml-3" : undefined}>
            <a
              href={`#${item.slug}`}
              onClick={onSelect}
              className={
                isActive
                  ? "text-accent border-accent block border-l-2 pl-3 transition-colors"
                  : "text-fg-muted hover:text-fg border-border block border-l-2 pl-3 transition-colors"
              }
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
