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

  // Get all unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    posts.forEach((post) => {
      post.categories?.forEach((cat) => cats.add(cat));
    });
    return Array.from(cats).sort();
  }, [posts]);

  // Filter posts based on search and category
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative">
          <MagnifyingGlassIcon className="text-secondary absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="border-hover bg-hover/30 text-primary placeholder:text-secondary/50 focus:border-cyan w-full rounded-xl border py-3 pr-10 pl-12 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-secondary hover:text-primary absolute top-1/2 right-4 -translate-y-1/2"
            >
              <Cross2Icon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                !selectedCategory
                  ? "bg-cyan text-background"
                  : "bg-hover/50 text-secondary hover:bg-hover hover:text-primary"
              }`}
            >
              {translations.allCategories}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category,
                  )
                }
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-cyan text-background"
                    : "bg-hover/50 text-secondary hover:bg-hover hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-secondary mb-4 text-sm">
        {filteredPosts.length}{" "}
        {filteredPosts.length === 1 ? "article" : "articles"}
        {search && ` for "${search}"`}
        {selectedCategory && ` in ${selectedCategory}`}
      </div>

      {/* Posts List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-secondary py-12 text-center"
            >
              {translations.noResults}
            </motion.p>
          ) : (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.03 }}
                layout
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group hover:border-hover hover:bg-hover/30 flex flex-col gap-2 rounded-xl border border-transparent p-4 transition-all duration-300"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {post.categories?.map((cat) => (
                      <span
                        key={cat}
                        className="bg-cyan/10 text-cyan rounded-md px-2 py-0.5 text-xs font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-primary group-hover:text-cyan text-lg font-semibold transition-colors">
                    {post.title}
                  </h3>
                  <div className="text-secondary flex items-center gap-3 text-sm">
                    <span>{formatDate(post.date)}</span>
                    <span className="bg-secondary h-1 w-1 rounded-full" />
                    <span>
                      {post.readTime} {translations.readTime}
                    </span>
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
