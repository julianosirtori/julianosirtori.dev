import { allPosts } from "contentlayer/generated";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

import { HomeRail } from "@/components/HomeRail";
import { LatestPosts } from "@/components/LatestPosts";
import { TechStack } from "@/components/TechStack";
import { recommendations } from "@/data/about";
import { Link } from "@/locales/navigation";

export interface HomeProps {
  params: Promise<{
    lang: string;
  }>;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-subtle mb-6 font-mono text-xs tracking-[0.14em] uppercase">
    {children}
  </p>
);

export default async function Home({ params }: HomeProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("home");
  const locale = await getLocale();

  const latestPosts = allPosts
    .filter((post) => post.language === locale && !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)
    .map((post) => ({
      title: post.title,
      slug: post.slug,
      date: post.date,
      readTime: post.readTime,
    }));

  const rich = {
    strong: (chunks: React.ReactNode) => (
      <span className="text-fg font-medium">{chunks}</span>
    ),
    accent: (chunks: React.ReactNode) => (
      <span className="text-accent font-medium">{chunks}</span>
    ),
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 pt-20 pb-20 lg:flex-row lg:gap-16 lg:pt-28">
      <div className="lg:w-[36%] lg:shrink-0">
        <HomeRail />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-24">
        <section id="about" className="scroll-mt-24">
          <SectionLabel>{t("about.label")}</SectionLabel>
          <div className="text-fg-muted flex max-w-[64ch] flex-col gap-4 text-base leading-relaxed">
            <p>{t.rich("about.p1", rich)}</p>
            <p>{t.rich("about.p2", rich)}</p>
            <p>{t.rich("about.p3", rich)}</p>
          </div>
        </section>

        <section id="stack" className="scroll-mt-24">
          <TechStack
            title={t("stack.label")}
            studyingLabel={t("stack.studyingLabel")}
            studyingDescription={t("stack.studyingDescription")}
          />
        </section>

        <section id="writing" className="scroll-mt-24">
          <SectionLabel>{t("writing.label")}</SectionLabel>
          <LatestPosts
            posts={latestPosts}
            locale={locale}
            title={t("latestPosts")}
            viewAll={t("viewAllPosts")}
            readTime={t("readTime")}
          />
        </section>

        <section id="recommendations" className="scroll-mt-24">
          <h2 className="text-fg mb-7 text-2xl font-semibold tracking-tight">
            {t("recommendations.label")}
          </h2>
          <div className="divide-border border-border divide-y border-y">
            {recommendations.map((recommendation) => (
              <figure key={recommendation.name} className="py-6">
                <blockquote className="text-fg-muted flex flex-col gap-3 text-[15px] leading-relaxed">
                  {recommendation.content.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <a
                    href={recommendation.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg hover:text-accent font-medium transition-colors"
                  >
                    {recommendation.name}
                  </a>
                  <span className="text-fg-subtle">
                    {" "}
                    · {recommendation.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24">
          <SectionLabel>{t("contact.label")}</SectionLabel>
          <h2 className="text-fg mb-3 max-w-[18ch] text-3xl font-semibold tracking-tight text-balance">
            {t("contact.title")}
          </h2>
          <p className="text-fg-muted mb-7 max-w-[54ch] text-base leading-relaxed">
            {t("contact.description")}
          </p>
          <Link
            href="/work-with-me"
            className="bg-fg text-bg hover:bg-fg/90 inline-flex w-fit rounded-md px-4 py-2.5 text-sm font-medium transition-colors"
          >
            {t("contact.cta")}
          </Link>
        </section>

        <p className="text-fg-subtle font-mono text-xs">{t("footer")}</p>
      </div>
    </main>
  );
}
