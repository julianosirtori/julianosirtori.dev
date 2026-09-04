import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { allPosts, type Post } from "contentlayer/generated";

import { Comments } from "@/components/Comments";
import { Mdx } from "@/components/Mdx";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Reactions } from "@/components/Reactions";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PostNavigation } from "@/components/PostNavigation";
import { RelatedPosts } from "@/components/RelatedPosts";
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

function findRelated(current: Post, all: Post[]): Post[] {
  const currentTags = new Set([
    ...(current.tags ?? []),
    ...(current.categories ?? []),
  ]);
  if (currentTags.size === 0) return [];

  const scored = all
    .filter(
      (p) =>
        p.slug !== current.slug && p.language === current.language && !p.draft,
    )
    .map((p) => {
      const tags = new Set([...(p.tags ?? []), ...(p.categories ?? [])]);
      const shared = Array.from(tags).filter((t) => currentTags.has(t)).length;
      return { post: p, score: shared };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored.map((entry) => entry.post);
}

export default async function PostPage({ params }: IPostProps) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("blog");
  const tGlobal = await getTranslations("global");
  const locale = await getLocale();

  const localePosts = allPosts
    .filter((p) => p.language === locale && !p.draft)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const index = localePosts.findIndex((p) => p.slug === slug);
  const post = index >= 0 ? localePosts[index] : undefined;

  if (!post) notFound();

  const prev = index > 0 ? localePosts[index - 1] : null;
  const next = index < localePosts.length - 1 ? localePosts[index + 1] : null;

  const related = findRelated(post, allPosts);
  const dayjs = dateTool(locale);

  const toc = (post.toc ?? []) as TocItem[];

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto w-full max-w-6xl px-5 pt-24 pb-20 lg:pt-32">
        <div className="grid gap-12 xl:grid-cols-[1fr_220px]">
          <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
            <header className="mb-10">
              {post.categories && post.categories.length > 0 && (
                <div className="mb-5 flex flex-wrap items-center gap-2.5 font-mono text-xs">
                  <span className="bg-accent-muted text-accent rounded-full px-2.5 py-1 tracking-wide uppercase">
                    {post.categories[0]}
                  </span>
                  {post.categories.slice(1).length > 0 && (
                    <span className="text-fg-subtle">
                      {post.categories.slice(1).join(" · ")}
                    </span>
                  )}
                </div>
              )}
              <h1 className="text-fg mb-5 text-4xl leading-[1.08] font-semibold tracking-tight text-balance md:text-5xl">
                {post.title}
              </h1>
              <p className="text-fg-muted mb-7 text-lg leading-relaxed text-pretty">
                {post.description}
              </p>
              <div className="border-border text-fg-subtle flex flex-wrap items-center gap-3.5 border-y py-4 font-mono text-[13px]">
                <span className="text-fg font-medium">
                  {tGlobal("myFullName")}
                </span>
                <span className="opacity-50">·</span>
                <time dateTime={post.date}>
                  {dayjs(post.date).format("MMM DD, YYYY")}
                </time>
                <span className="opacity-50">·</span>
                <span>
                  {post.readTime} {t("readTime")}
                </span>
                {post.updated && (
                  <>
                    <span className="opacity-50">·</span>
                    <span>
                      {t("updated")}{" "}
                      {dayjs(post.updated).format("MMM DD, YYYY")}
                    </span>
                  </>
                )}
              </div>
            </header>

            <article className="prose">
              <Mdx code={post.body.code} />
            </article>

            <div className="mt-16 flex flex-col gap-10">
              <PostNavigation
                prev={prev ? { title: prev.title, slug: prev.slug } : null}
                next={next ? { title: next.title, slug: next.slug } : null}
                labels={{ prev: t("prev"), next: t("next") }}
              />

              <RelatedPosts
                posts={related.map((p) => ({
                  title: p.title,
                  slug: p.slug,
                  date: p.date,
                  readTime: p.readTime,
                }))}
                label={t("related")}
                readTime={t("readTime")}
                locale={locale}
              />

              <div className="border-border flex flex-col gap-4 border-t pt-8">
                <p className="text-fg-subtle font-mono text-xs tracking-[0.1em] uppercase">
                  {t("reactionsPrompt")}
                </p>
                <Reactions slug={post.slug} />
              </div>

              <Comments locale={locale} />
            </div>
          </main>

          <TableOfContents items={toc} label={t("onThisPage")} />
        </div>
      </div>
    </>
  );
}
