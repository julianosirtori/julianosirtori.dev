import { dateTool } from "@/utils/date";
import { allPosts } from "contentlayer/generated";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/locales/navigation";

export default function Blog() {
  const t = useTranslations("blog");
  const locale = useLocale();

  const dayjs = dateTool(locale);

  const postsSorted = allPosts
    .filter((post) => post.language === locale)
    .sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return -1;
      }
      return 1;
    });

  return (
    <main className="mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col	 px-5 py-nav-height-mobile text-base  leading-8 text-secondary selection:bg-yellow selection:text-black lg:py-nav-height-desktop">
      <h1 className="mb-4 text-5xl font-bold text-primary">
        <span className="bg-gradient-to-r from-yellow to-pink bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h1>
      <p className="text-base leading-8 text-secondary ">{t("description")}</p>
      <section className="mt-14 w-full">
        <h2 className="px-2 text-2xl font-semibold leading-8 text-primary">
          {t("allArticles")}
        </h2>
        <ul className="mt-2 w-full">
          {postsSorted.map((post) => (
            <li
              key={post.title}
              className="w-full rounded-none border-b border-hover px-2 transition-all duration-200 hover:rounded-md hover:bg-hover"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="flex w-full flex-col py-5 text-secondary"
              >
                <span className="text-left text-lg font-bold leading-10">
                  {post.title}
                </span>
                <span className="text-sm font-medium ">
                  {dayjs(post.date).format("MMM DD, YYYY")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
