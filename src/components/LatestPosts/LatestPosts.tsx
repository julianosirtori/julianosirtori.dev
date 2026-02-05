"use client";

import { ArrowTopRightIcon, ArrowRightIcon } from "@radix-ui/react-icons";
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
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-primary text-2xl font-bold">{title}</h2>
        <Link
          href="/blog"
          className="group text-secondary hover:text-pink flex items-center gap-1 text-sm transition-colors"
        >
          {viewAll}
          <ArrowTopRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group hover:border-hover hover:bg-hover/50 flex items-center justify-between rounded-lg border border-transparent px-4 py-4 transition-all duration-300"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-primary group-hover:text-pink font-medium transition-colors">
                  {post.title}
                </h3>
                <div className="text-secondary flex items-center gap-3 text-xs">
                  <span>{formatDate(post.date)}</span>
                  <span className="bg-secondary h-1 w-1 rounded-full" />
                  <span>
                    {post.readTime} {readTime}
                  </span>
                </div>
              </div>
              <ArrowRightIcon className="text-secondary group-hover:text-pink h-5 w-5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
