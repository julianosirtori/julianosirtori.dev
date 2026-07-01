import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import { allPosts } from "contentlayer/generated";
import { BlogSearch } from "@/components/BlogSearch";

interface BlogProps {
  params: Promise<{
    lang: string;
  }>;
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
      tags: post.tags?.length ? post.tags : (post.categories ?? []),
    }));

  return (
    <main className="mx-auto flex w-full max-w-[920px] flex-1 flex-col px-5 pt-20 pb-20 lg:pt-28">
      <header className="pb-9">
        <p className="text-accent mb-5 font-mono text-xs tracking-[0.16em] uppercase">
          {t("kicker")}
        </p>
        <h1 className="text-fg mb-6 text-5xl font-semibold tracking-tight md:text-6xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted max-w-[54ch] text-lg leading-relaxed text-pretty">
          {t("description")}
        </p>
      </header>

      <BlogSearch
        posts={postsSorted}
        locale={locale}
        translations={{
          searchPlaceholder: t("searchPlaceholder"),
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
