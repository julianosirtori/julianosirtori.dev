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
      params.push({
        lang: post.language,
        slug: post.slug,
      });
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

  const dayjs = dateTool(locale);

  if (!post) {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <main className="py-nav-height-mobile text-secondary lg:py-nav-height-desktop mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col px-5 text-base leading-8 selection:bg-white selection:text-black">
        <div className="flex w-full flex-col items-center justify-center">
          <h1 className="text-primary mt-20 text-center text-4xl leading-[42px] font-semibold lg:text-5xl lg:leading-[60px]">
            {post.title}
          </h1>
          <h2 className="text-secondary mb-4 text-base font-medium">
            {dayjs(post.date).format("MMM DD, YYYY")} •{" "}
            {`${post.readTime} ${t("readTime")}`}
          </h2>
        </div>

        <Mdx code={post.body.code} />
        <Reactions slug={post.slug} />
        <Comments locale={locale} />
      </main>
    </>
  );
}
