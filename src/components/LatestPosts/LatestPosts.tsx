"use client";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { Link } from "@/locales/navigation";

interface Post {
  title: string;
  slug: string;
  date: string;
  readTime: number;
}

interface LatestPostsProps {
  posts: Post[];
  locale: string;
  title: string;
  viewAll: string;
  readTime: string;
}

export function LatestPosts({
  posts,
  locale,
  title,
  viewAll,
  readTime,
}: LatestPostsProps) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <section className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-fg text-xl font-medium tracking-tight">{title}</h2>
        <Link
          href="/blog"
          className="group text-fg-muted hover:text-fg inline-flex items-center gap-1 text-sm transition-colors"
        >
          {viewAll}
          <ArrowTopRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="flex flex-col">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group border-border hover:border-fg-muted flex items-center justify-between border-b py-4 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-fg group-hover:text-accent text-base font-medium transition-colors">
                  {post.title}
                </h3>
                <div className="text-fg-subtle flex items-center gap-2 text-xs">
                  <time>{formatDate(post.date)}</time>
                  <span aria-hidden>·</span>
                  <span>
                    {post.readTime} {readTime}
                  </span>
                </div>
              </div>
              <ArrowTopRightIcon className="text-fg-subtle group-hover:text-fg h-4 w-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
