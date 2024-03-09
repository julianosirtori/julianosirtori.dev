import { Metadata } from "next";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { allPosts } from "contentlayer/generated";
import { unstable_setRequestLocale } from "next-intl/server";

import { Comments } from "@/components/Comments";
import { Mdx } from "@/components/Mdx";
import { importLocale } from "@/locales";
import { dateTool } from "@/utils/date";
import { LOCALES } from "@/common/constants";

export interface IPostProps {
  params: {
    lang: string;
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: IPostProps): Promise<Metadata> {
  const messages = (await importLocale({ locale: params.lang })).messages;
  const post = allPosts.find((post) => post.slug === params.slug);

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
    if (post.slug && LOCALES.includes(post.language)) {
      params.push({
        lang: post.language,
        slug: post.slug,
      });
    }
  });

  return params;
}

export default function Post({ params }: IPostProps) {
  unstable_setRequestLocale(params.lang);

  const t = useTranslations("blog");
  const locale = useLocale();
  const post = allPosts.find(
    (post) => post.slug === params.slug && post.language === locale,
  );

  const dayjs = dateTool(locale);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col	 px-5 py-nav-height-mobile text-base  leading-8 text-secondary selection:bg-white selection:text-black lg:py-nav-height-desktop">
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="mt-20 text-center text-4xl font-semibold leading-[42px] text-primary lg:text-5xl lg:leading-[60px] ">
          {post.title}
        </h1>
        <h2 className="mb-20 text-base font-medium text-secondary">
          {dayjs(post.date).format("MMM DD, YYYY")} •{" "}
          {`${post.readTime} ${t("readTime")}`}
        </h2>
      </div>

      <Mdx code={post.body.code} />
      <Comments locale={locale} />
    </main>
  );
}
