"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { Link } from "@/locales/navigation";

import { track } from "@/lib/analytics";

interface Post {
  title: string;
  slug: string;
  date: string;
  readTime: number;
  excerpt?: string;
  tags?: string[];
}

interface BlogSearchProps {
  posts: Post[];
  locale: string;
  translations: {
    searchPlaceholder: string;
    searchLabel: string;
    clearSearch: string;
    topicLabel: string;
    allCategories: string;
    noResults: string;
    clearFilters: string;
    readTime: string;
    article: string;
    articles: string;
    post: string;
    posts: string;
  };
}

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function BlogSearch({ posts, locale, translations }: BlogSearchProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((post) => post.tags?.forEach((tag) => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, locale));
  }, [posts, locale]);

  const filteredPosts = useMemo(() => {
    const query = normalize(search);
    return posts.filter((post) => {
      if (activeTag && !post.tags?.includes(activeTag)) return false;
      const haystack = [
        post.title,
        post.excerpt ?? "",
        ...(post.tags ?? []),
      ].join(" ");
      return !query || normalize(haystack).includes(query);
    });
  }, [posts, search, activeTag]);

  useEffect(() => {
    if (!search.trim()) return;
    const timer = setTimeout(
      () =>
        track("blog_search", {
          location: "content",
          result_count: filteredPosts.length,
        }),
      800,
    );
    return () => clearTimeout(timer);
  }, [search, filteredPosts.length]);

  const postsByYear = useMemo(() => {
    const groups = new Map<string, Post[]>();
    filteredPosts.forEach((post) => {
      const year = post.date.slice(0, 4);
      const bucket = groups.get(year) ?? [];
      bucket.push(post);
      groups.set(year, bucket);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredPosts]);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(new Date(date));

  const clearAll = () => {
    setSearch("");
    setActiveTag("");
    inputRef.current?.focus();
  };

  const hasFilters = Boolean(search || activeTag);
  const countLabel = `${filteredPosts.length} ${
    filteredPosts.length === 1 ? translations.article : translations.articles
  }`;

  return (
    <div className="w-full">
      <div
        role="search"
        aria-label={translations.searchLabel}
        className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-5"
      >
        <div>
          <label
            htmlFor="blog-search"
            className="text-fg-muted mb-2 block text-sm"
          >
            {translations.searchLabel}
          </label>
          <div className="relative">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="text-fg-muted pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
            />
            <input
              ref={inputRef}
              id="blog-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={translations.searchPlaceholder}
              aria-controls="blog-results"
              className="border-border bg-bg-elevated text-fg placeholder:text-fg-muted focus:border-accent focus:ring-accent h-12 w-full rounded-md border pr-12 pl-10 text-base transition-colors focus:ring-1 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  inputRef.current?.focus();
                }}
                className="text-fg-muted hover:text-fg focus-visible:ring-accent absolute top-0.5 right-0.5 inline-flex h-11 w-11 items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                aria-label={translations.clearSearch}
              >
                <Cross2Icon aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        {tags.length > 0 && (
          <div>
            <label
              htmlFor="blog-topic"
              className="text-fg-muted mb-2 block text-sm"
            >
              {translations.topicLabel}
            </label>
            <select
              id="blog-topic"
              value={activeTag}
              onChange={(event) => {
                setActiveTag(event.target.value);
                track("blog_filter_change", {
                  location: "content",
                  action_id:
                    event.target.value.replace(/[^a-zA-Z0-9_-]/g, "_") || "all",
                });
              }}
              aria-controls="blog-results"
              className="border-border bg-bg-elevated text-fg focus:border-accent focus:ring-accent h-12 w-full rounded-md border px-3 text-base focus:ring-1 focus:outline-none"
            >
              <option value="">{translations.allCategories}</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="text-fg-muted flex min-h-16 items-center justify-between gap-4 text-xs">
        <p role="status" aria-atomic="true" className="font-mono">
          {countLabel}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="hover:text-accent focus-visible:ring-accent decoration-border-strong min-h-11 rounded-sm text-sm underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
          >
            {translations.clearFilters}
          </button>
        )}
      </div>

      <div id="blog-results" className="border-border border-t">
        {filteredPosts.length === 0 ? (
          <p className="text-fg-muted py-16 text-center text-base">
            {translations.noResults}
          </p>
        ) : (
          postsByYear.map(([year, yearPosts]) => (
            <section
              key={year}
              aria-labelledby={`blog-year-${year}`}
              className="border-border grid border-b py-6 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-8 sm:py-8"
            >
              <h2
                id={`blog-year-${year}`}
                className="text-fg-muted mb-2 font-mono text-sm sm:pt-4"
              >
                {year}
              </h2>
              <ul className="min-w-0">
                {yearPosts.map((post) => (
                  <li
                    key={post.slug}
                    className="border-border border-b last:border-0"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      aria-labelledby={`post-${post.slug}`}
                      className="group hover:bg-bg-muted focus-visible:ring-accent -mx-3 grid grid-cols-[minmax(0,1fr)_16px] gap-4 rounded-sm px-3 py-5 transition-colors focus-visible:ring-2 focus-visible:outline-none sm:py-6"
                    >
                      <div className="min-w-0">
                        <div className="text-fg-muted mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                          <time dateTime={post.date}>
                            {formatDate(post.date)}
                          </time>
                          <span aria-hidden="true">·</span>
                          <span>
                            {post.readTime} {translations.readTime}
                          </span>
                        </div>
                        <h3
                          id={`post-${post.slug}`}
                          className="text-fg group-hover:text-accent text-lg leading-snug font-medium tracking-tight text-pretty transition-colors sm:text-xl"
                        >
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-fg-muted mt-2 max-w-[72ch] text-sm leading-relaxed text-pretty">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <ArrowRightIcon
                        aria-hidden="true"
                        className="text-fg-muted group-hover:text-accent mt-7 h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
