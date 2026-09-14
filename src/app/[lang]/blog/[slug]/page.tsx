import { NewsletterBlock } from "@/components/Audience/Newsletter";
import { ArticleAnalytics } from "@/components/Audience/Analytics";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { allPosts, type Post } from "contentlayer/generated";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { Comments } from "@/components/Comments";
import { Mdx } from "@/components/Mdx";
import { ReadingProgress } from "@/components/ReadingProgress";
import { Reactions } from "@/components/Reactions";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PostNavigation } from "@/components/PostNavigation";
import { RelatedPosts } from "@/components/RelatedPosts";
import { importLocale } from "@/locales";
import { routing } from "@/locales/config";
import { Link } from "@/locales/navigation";

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
  const post = allPosts.find(
    (post) => post.slug === slug && post.language === lang && !post.draft,
  );

  if (!post) notFound();

  const title = `Juliano Sirtori - ${post?.title}`;
  const description = post?.description || messages.global.slogan;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://julianosirtori.dev/${lang}/blog/${slug}`,
    },
  };
}

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  allPosts.forEach((post) => {
    if (
      post.slug &&
      !post.draft &&
      routing.locales.includes(post.language as "en" | "pt")
    ) {
      params.push({ lang: post.language, slug: post.slug });
    }
  });
  return params;
}

function findRelated(current: Post, all: Post[]): Post[] {
  const currentTags = new Set([
    ...(current.tags ?? []),
    ...(current.categories ?? []),
    ...(current.meta?.keywords ?? []),
  ]);
  if (currentTags.size === 0) return [];

  const scored = all
    .filter(
      (p) =>
        p.slug !== current.slug && p.language === current.language && !p.draft,
    )
    .map((p) => {
      const tags = new Set([
        ...(p.tags ?? []),
        ...(p.categories ?? []),
        ...(p.meta?.keywords ?? []),
      ]);
      const shared = Array.from(tags).filter((t) => currentTags.has(t)).length;
      return { post: p, score: shared };
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime(),
    )
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
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(date));

  const toc = (post.toc ?? []) as TocItem[];

  return (
    <>
      <ReadingProgress />
      <ArticleAnalytics slug={slug} />
      <main
        className={`mx-auto w-full max-w-[760px] px-5 pt-10 pb-20 lg:pt-16 ${toc.length ? "lg:max-w-[1040px]" : ""}`}
      >
        <div
          className={`grid gap-y-9 ${toc.length ? "lg:grid-cols-[minmax(0,720px)_200px] lg:gap-x-16 lg:gap-y-12" : ""}`}
        >
          <header className="min-w-0">
            <Link
              href="/blog"
              className="text-fg-muted hover:text-accent focus-visible:ring-accent mb-7 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowLeftIcon aria-hidden="true" className="h-4 w-4" />
              {t("backToBlog")}
            </Link>
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
            <h1 className="text-fg mb-5 text-3xl leading-[1.15] font-medium tracking-tight text-pretty sm:text-4xl lg:text-[2.75rem]">
              {post.title}
            </h1>
            <p className="text-fg-muted mb-7 text-base leading-relaxed text-pretty sm:text-lg">
              {post.description}
            </p>
            <div className="border-border text-fg-muted flex flex-wrap items-center gap-x-3 gap-y-2 border-b pb-6 text-sm">
              <Link
                href="/about"
                className="text-fg hover:text-accent focus-visible:ring-accent rounded-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
              >
                {tGlobal("myFullName")}
              </Link>
              <span aria-hidden="true" className="hidden sm:inline">
                ·
              </span>
              <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 sm:w-auto">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>
                  {post.readTime} {t("readTime")}
                </span>
              </div>
              {post.updated && (
                <span className="w-full text-xs">
                  {t("updated")}{" "}
                  <time dateTime={post.updated}>
                    {formatDate(post.updated)}
                  </time>
                </span>
              )}
            </div>
          </header>

          <TableOfContents items={toc} label={t("onThisPage")} />

          <div className="min-w-0 lg:col-start-1">
            <article id="post-content" className="prose">
              <Mdx code={post.body.code} />
            </article>

            <div className="mt-16 flex flex-col gap-10">
              <NewsletterBlock source="article" article={post.slug} />
              <div className="border-border flex flex-col gap-4 border-t pt-8">
                <p className="text-fg-muted text-center text-sm">
                  {t("reactionsPrompt")}
                </p>
                <Reactions slug={post.slug} />
              </div>

              <PostNavigation
                prev={prev ? { title: prev.title, slug: prev.slug } : null}
                next={next ? { title: next.title, slug: next.slug } : null}
                labels={{
                  prev: t("prev"),
                  next: t("next"),
                  navigation: t("postNavigation"),
                }}
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

              <Comments locale={locale} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
