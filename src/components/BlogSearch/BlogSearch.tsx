"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/locales/navigation";

interface Post {
  title: string;
  slug: string;
  date: string;
  readTime: number;
  categories?: string[];
}

interface BlogSearchProps {
  posts: Post[];
  locale: string;
  translations: {
    searchPlaceholder: string;
    allCategories: string;
    noResults: string;
    readTime: string;
  };
}

export function BlogSearch({ posts, locale, translations }: BlogSearchProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((post) => {
      post.categories?.forEach((cat) => cats.add(cat));
    });
    return Array.from(cats).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        search === "" ||
        post.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !selectedCategory || post.categories?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, selectedCategory]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-3">
        <div className="relative">
          <MagnifyingGlassIcon className="text-fg-subtle absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="border-border bg-bg text-fg placeholder:text-fg-subtle focus:border-accent w-full rounded-md border py-2 pr-9 pl-9 text-sm transition-colors focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-fg-subtle hover:text-fg absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              aria-label="Clear search"
            >
              <Cross2Icon className="h-4 w-4" />
            </button>
          )}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <CategoryPill
              active={!selectedCategory}
              onClick={() => setSelectedCategory(null)}
            >
              {translations.allCategories}
            </CategoryPill>
            {categories.map((category) => (
              <CategoryPill
                key={category}
                active={selectedCategory === category}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category,
                  )
                }
              >
                {category}
              </CategoryPill>
            ))}
          </div>
        )}
      </div>

      <div className="text-fg-subtle mb-4 text-xs">
        {filteredPosts.length}{" "}
        {filteredPosts.length === 1 ? "article" : "articles"}
        {search && ` matching "${search}"`}
        {selectedCategory && ` in ${selectedCategory}`}
      </div>

      <div className="flex flex-col gap-1">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-fg-muted py-12 text-center"
            >
              {translations.noResults}
            </motion.p>
          ) : (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: index * 0.02, duration: 0.2 }}
                layout
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group hover:bg-bg-muted -mx-3 flex flex-col gap-1 rounded-lg px-3 py-3 transition-colors"
                >
                  <h3 className="text-fg group-hover:text-accent text-base font-medium transition-colors">
                    {post.title}
                  </h3>
                  <div className="text-fg-subtle flex flex-wrap items-center gap-2 text-xs">
                    <time>{formatDate(post.date)}</time>
                    <span aria-hidden>·</span>
                    <span>
                      {post.readTime} {translations.readTime}
                    </span>
                    {post.categories && post.categories.length > 0 && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{post.categories.join(", ")}</span>
                      </>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CategoryPill({
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
          ? "bg-fg text-bg rounded-full px-3 py-1 text-xs font-medium transition-colors"
          : "border-border text-fg-muted hover:bg-bg-muted hover:text-fg rounded-full border px-3 py-1 text-xs transition-colors"
      }
    >
      {children}
    </button>
  );
}
