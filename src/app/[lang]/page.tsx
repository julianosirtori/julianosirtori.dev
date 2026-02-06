import { setRequestLocale } from "next-intl/server";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { allPosts } from "contentlayer/generated";

import { ButtonTapToStart } from "@/components/ButtonTapToStart";
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

  // Get latest 4 posts
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
    <main className="py-nav-height-mobile selection:bg-green lg:py-nav-height-desktop mx-auto flex w-full max-w-4xl flex-1 flex-col gap-24 px-5 selection:text-black">
      {/* Hero Section */}
      <section className="flex min-h-[60vh] flex-col justify-center">
        <div className="relative">
          {/* Decorative gradient blob */}
          <div className="from-cyan/20 via-green/10 absolute -top-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-br to-transparent blur-3xl" />
          <div className="from-pink/20 via-purple/10 absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gradient-to-br to-transparent blur-3xl" />

          <div className="relative z-10">
            {/* Status badge */}
            <div className="border-hover bg-hover/50 text-secondary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="bg-green absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                <span className="bg-green relative inline-flex h-2 w-2 rounded-full" />
              </span>
              {tHome("currentlyWork")}
              <a
                href={tHome("currentlyCompanyLink")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-cyan font-medium"
              >
                {tHome("currentlyCompany")}
              </a>
            </div>

            <h1 className="animate-textclip bg-linear-dracula mb-4 bg-[length:200%] bg-clip-text text-5xl leading-tight font-bold text-transparent md:text-7xl">
              {t("myFullName")}
            </h1>

            <h2 className="text-primary mb-4 text-xl font-semibold lg:text-2xl">
              {t("role")}
            </h2>

            <p className="text-secondary mb-8 max-w-xl text-lg leading-relaxed">
              {t("slogan")}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <ButtonTapToStart />
              <Link
                href="/contact"
                className="group border-cyan/50 bg-cyan/10 text-cyan hover:bg-cyan/20 flex items-center gap-2 rounded-lg border px-5 py-2.5 font-medium transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(128,255,234,0.5)]"
              >
                {tHome("contactButton")}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <FeaturedProjects
        locale={locale}
        title={tHome("featuredProjects")}
        viewAll={tHome("viewAllProjects")}
      />

      {/* Latest Posts */}
      <LatestPosts
        posts={latestPosts}
        locale={locale}
        title={tHome("latestPosts")}
        viewAll={tHome("viewAllPosts")}
        readTime={tHome("readTime")}
      />

      {/* Tech Stack */}
      <TechStack title={tHome("techStack")} />

      {/* Contact CTA */}
      <section className="border-hover from-hover/50 via-background to-hover/30 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 md:p-12">
        <div className="bg-pink/10 absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl" />
        <div className="bg-cyan/10 absolute -bottom-10 -left-10 h-40 w-40 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-primary mb-4 text-3xl font-bold md:text-4xl">
            {tHome("getInTouch")}
          </h2>
          <p className="text-secondary mb-8 max-w-md">
            {tHome("contactDescription")}
          </p>
          <Link
            href="/contact"
            className="group from-cyan to-green text-background flex items-center gap-2 rounded-lg bg-gradient-to-r px-8 py-3 font-semibold transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(128,255,234,0.5)]"
          >
            {tHome("contactButton")}
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
