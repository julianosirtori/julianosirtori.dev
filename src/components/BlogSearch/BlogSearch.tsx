"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Link } from "@/locales/navigation";

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

export function BlogSearch({ posts, locale, translations }: BlogSearchProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((post) => post.tags?.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const query = search.toLowerCase().trim();
    return posts.filter((post) => {
      if (activeTag && !post.tags?.includes(activeTag)) return false;
      if (!query) return true;
      const haystack = [post.title, post.excerpt ?? "", ...(post.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [posts, search, activeTag]);

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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const clearAll = () => {
    setSearch("");
    setActiveTag(null);
  };

  const countLabel = `${filteredPosts.length} ${
    filteredPosts.length === 1 ? translations.article : translations.articles
  }`;

  return (
    <div className="w-full">
      <div className="relative mb-3">
        <MagnifyingGlassIcon className="text-fg-subtle absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={translations.searchPlaceholder}
          className="border-border bg-bg-elevated text-fg placeholder:text-fg-subtle focus:border-accent h-12 w-full rounded-[10px] border pr-10 pl-11 text-sm transition-colors focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-fg-subtle hover:text-fg absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
            aria-label="Clear search"
          >
            <Cross2Icon className="h-4 w-4" />
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          <TagPill active={!activeTag} onClick={() => setActiveTag(null)}>
            {translations.allCategories}
          </TagPill>
          {tags.map((tag) => (
            <TagPill
              key={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </TagPill>
          ))}
        </div>
      )}

      <p className="text-fg-subtle mb-7 font-mono text-xs">{countLabel}</p>

      {filteredPosts.length === 0 ? (
        <p className="text-fg-subtle py-12 text-center text-sm">
          {translations.noResults}{" "}
          <button
            type="button"
            onClick={clearAll}
            className="text-accent cursor-pointer"
          >
            {translations.clearFilters}
          </button>
        </p>
      ) : (
        postsByYear.map(([year, yearPosts]) => (
          <section key={year} className="mb-3">
            <div className="flex items-center gap-4 py-4">
              <span className="text-fg-subtle font-mono text-[13px] font-medium">
                {year}
              </span>
              <span className="bg-border h-px flex-1" />
              <span className="text-fg-subtle font-mono text-[11px]">
                {yearPosts.length}{" "}
                {yearPosts.length === 1
                  ? translations.post
                  : translations.posts}
              </span>
            </div>
            {yearPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group hover:border-border-strong hover:bg-bg-elevated -mx-5 grid grid-cols-[110px_1fr] items-start gap-6 rounded-2xl border border-transparent px-5 py-5 transition-colors"
              >
                <div className="pt-0.5">
                  <p className="text-fg-subtle font-mono text-xs">
                    {formatDate(post.date)}
                  </p>
                  <p className="text-fg-subtle mt-1 font-mono text-[11px] opacity-75">
                    {post.readTime} {translations.readTime}
                  </p>
                </div>
                <div className="min-w-0">
                  <h2 className="text-fg group-hover:text-accent mb-2 text-xl font-semibold tracking-tight transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-fg-muted mb-3.5 max-w-[60ch] text-[15px] leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-accent-muted text-accent rounded-full px-2.5 py-1 font-mono text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </section>
        ))
      )}
    </div>
  );
}

function TagPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "bg-accent text-accent-fg border-accent rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
          : "border-border text-fg-muted hover:text-fg rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
      }
    >
      {children}
    </button>
  );
}
