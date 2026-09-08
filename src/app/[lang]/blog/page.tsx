import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import { allPosts } from "contentlayer/generated";
import { BlogSearch } from "@/components/BlogSearch";
import { importLocale } from "@/locales";

interface BlogProps {
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogProps): Promise<Metadata> {
  const { lang } = await params;
  const { messages } = await importLocale(lang);
  const title = `${messages.blog.title} | Juliano Sirtori`;
  const description = messages.blog.description;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://julianosirtori.dev/${lang}/blog`,
    },
  };
}

export default async function Blog({ params }: BlogProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("blog");
  const locale = await getLocale();

  const postsSorted = allPosts
    .filter((post) => post.language === locale && !post.draft)
    .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
    .map((post) => ({
      title: post.title,
      slug: post.slug,
      date: post.date,
      readTime: post.readTime,
      excerpt: post.description,
      tags: Array.from(
        new Set([
          ...(post.tags ?? []),
          ...(post.categories ?? []),
          ...(post.meta?.keywords ?? []),
        ]),
      ),
    }));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 pt-12 pb-20 lg:pt-24">
      <header className="pb-10 sm:pb-12">
        <h1 className="text-fg mb-6 text-3xl leading-tight font-medium tracking-tight sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted max-w-[64ch] text-base leading-relaxed text-pretty sm:text-lg">
          {t("description")}
        </p>
      </header>

      <BlogSearch
        posts={postsSorted}
        locale={locale}
        translations={{
          searchPlaceholder: t("searchPlaceholder"),
          searchLabel: t("searchLabel"),
          clearSearch: t("clearSearch"),
          topicLabel: t("topicLabel"),
          allCategories: t("allCategories"),
          noResults: t("noResults"),
          clearFilters: t("clearFilters"),
          readTime: t("readTime"),
          article: t("article"),
          articles: t("articles"),
          post: t("post"),
          posts: t("posts"),
        }}
      />
    </main>
  );
}
