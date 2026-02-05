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
    .sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return -1;
      }
      return 1;
    })
    .map((post) => ({
      title: post.title,
      slug: post.slug,
      date: post.date,
      readTime: post.readTime,
      categories: post.categories || [],
    }));

  return (
    <main className="py-nav-height-mobile text-secondary selection:bg-yellow lg:py-nav-height-desktop mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col px-5 text-base leading-8 selection:text-black">
      <h1 className="text-primary mb-4 text-5xl font-bold">
        <span className="from-yellow to-pink bg-gradient-to-r bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h1>
      <p className="text-secondary mb-10 text-base leading-8">
        {t("description")}
      </p>

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
