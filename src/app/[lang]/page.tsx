import { setRequestLocale } from "next-intl/server";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { allPosts } from "contentlayer/generated";

import { FeaturedProjects } from "@/components/FeaturedProjects";
import { LatestPosts } from "@/components/LatestPosts";
import { TechStack } from "@/components/TechStack";
import { Link } from "@/locales/navigation";

export interface HomeProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function Home({ params }: HomeProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("global");
  const tHome = await getTranslations("home");
  const locale = await getLocale();

  const latestPosts = allPosts
    .filter((post) => post.language === locale && !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map((post) => ({
      title: post.title,
      slug: post.slug,
      date: post.date,
      readTime: post.readTime,
    }));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-24 px-5 pt-24 pb-20 lg:pt-32">
      <section className="flex min-h-[50vh] flex-col justify-center">
        <div className="border-border text-fg-muted mb-8 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="bg-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
            <span className="bg-success relative inline-flex h-1.5 w-1.5 rounded-full" />
          </span>
          {tHome("currentlyWork")}
          <a
            href={tHome("currentlyCompanyLink")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg hover:text-accent font-medium"
          >
            {tHome("currentlyCompany")}
          </a>
        </div>

        <h1 className="text-fg mb-6 text-5xl leading-[1.05] font-medium tracking-tight md:text-6xl">
          {t("myFullName")}
        </h1>

        <p className="text-fg-muted mb-10 max-w-xl text-lg leading-relaxed">
          {t("slogan")}
        </p>

        <p className="text-fg-muted mb-10 max-w-xl text-base leading-relaxed">
          {tHome("subtitle")}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/blog"
            className="bg-fg text-bg hover:bg-fg/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            {tHome("latestPosts")}
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/contact"
            className="border-border text-fg hover:bg-bg-muted inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
          >
            {tHome("contactButton")}
          </Link>
        </div>
      </section>

      <FeaturedProjects
        locale={locale}
        title={tHome("featuredProjects")}
        viewAll={tHome("viewAllProjects")}
      />

      <LatestPosts
        posts={latestPosts}
        locale={locale}
        title={tHome("latestPosts")}
        viewAll={tHome("viewAllPosts")}
        readTime={tHome("readTime")}
      />

      <TechStack title={tHome("techStack")} />

      <section className="border-border rounded-xl border p-8 md:p-12">
        <h2 className="text-fg mb-3 text-2xl font-medium tracking-tight md:text-3xl">
          {tHome("getInTouch")}
        </h2>
        <p className="text-fg-muted mb-6 max-w-md">
          {tHome("contactDescription")}
        </p>
        <Link
          href="/contact"
          className="bg-fg text-bg hover:bg-fg/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          {tHome("contactButton")}
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </section>
    </main>
  );
}
