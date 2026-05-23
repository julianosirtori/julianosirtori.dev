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
      categories: post.categories || [],
    }));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pt-24 pb-20 lg:pt-32">
      <header className="mb-12">
        <h1 className="text-fg mb-3 text-4xl font-medium tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted max-w-prose text-base leading-relaxed">
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
          readTime: t("readTime"),
        }}
      />
    </main>
  );
}
