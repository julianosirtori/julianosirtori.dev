import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { allPosts } from "contentlayer/generated";

import { Comments } from "@/components/Comments";
import { Mdx } from "@/components/Mdx";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Reactions } from "@/components/Reactions";
import { importLocale } from "@/locales";
import { dateTool } from "@/utils/date";
import { routing } from "@/locales/config";

export interface IPostProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: IPostProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const { messages } = await importLocale(lang);
  const post = allPosts.find((post) => post.slug === slug);

  const title = `Juliano Sirtori - ${post?.title}`;
  const description = post?.description || messages.global.slogan;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://julianosirtori.dev/",
    },
  };
}

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  allPosts.forEach((post) => {
    if (post.slug && routing.locales.includes(post.language as "en" | "pt")) {
      params.push({ lang: post.language, slug: post.slug });
    }
  });
  return params;
}

export default async function Post({ params }: IPostProps) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("blog");
  const locale = await getLocale();
  const post = allPosts.find(
    (post) => post.slug === slug && post.language === locale,
  );

  if (!post) notFound();

  const dayjs = dateTool(locale);

  return (
    <>
      <ReadingProgress />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pt-24 pb-20 lg:pt-32">
        <header className="mb-10">
          <div className="text-fg-muted mb-4 flex items-center gap-2 text-sm">
            <time dateTime={post.date}>
              {dayjs(post.date).format("MMM DD, YYYY")}
            </time>
            <span aria-hidden>·</span>
            <span>
              {post.readTime} {t("readTime")}
            </span>
          </div>
          <h1 className="text-fg text-3xl leading-tight font-medium tracking-tight md:text-4xl">
            {post.title}
          </h1>
        </header>

        <article className="prose">
          <Mdx code={post.body.code} />
        </article>

        <div className="border-border mt-16 border-t pt-10">
          <Reactions slug={post.slug} />
        </div>

        <div className="mt-10">
          <Comments locale={locale} />
        </div>
      </main>
    </>
  );
}
