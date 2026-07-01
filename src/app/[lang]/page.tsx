import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { allPosts } from "contentlayer/generated";

import { HomeRail } from "@/components/HomeRail";
import { LatestPosts } from "@/components/LatestPosts";
import { ContactForm } from "@/components/ContactForm";
import { liveSignals } from "@/data/live-signals";
import { selectedWork } from "@/data/selected-work";
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
  const tGlobal = await getTranslations("global");
  const locale = await getLocale();

  const posts = allPosts
    .filter((post) => post.language === locale && !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const featured = posts[0];
  const latestPosts = posts.slice(1, 5).map((post) => ({
    title: post.title,
    slug: post.slug,
    date: post.date,
    readTime: post.readTime,
  }));

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      day: "numeric",
      month: "long",
    });

  const work = selectedWork[locale as keyof typeof selectedWork];
  const signals = liveSignals[locale as keyof typeof liveSignals];

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
        {/* ABOUT */}
        <section id="about" className="scroll-mt-24">
          <SectionLabel>{t("about.label")}</SectionLabel>
          <div className="text-fg-muted flex max-w-[60ch] flex-col gap-4 text-base leading-relaxed">
            <p>{t.rich("about.p1", rich)}</p>
            <p>{t.rich("about.p2", rich)}</p>
            <p>{t.rich("about.p3", rich)}</p>
          </div>

          <div className="mt-9">
            <p className="text-fg-subtle mb-4 flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase">
              <span className="bg-success h-1.5 w-1.5 animate-pulse rounded-full" />
              {t("about.signalsLabel")}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="border-border bg-bg-elevated hover:border-fg-muted rounded-xl border p-3.5 transition-colors"
                >
                  <p className="text-fg-subtle mb-1.5 font-mono text-[10px] tracking-wide uppercase">
                    {t("about.lastArticleLabel")}
                  </p>
                  <p className="text-fg text-[13px] font-medium">
                    {featured.title}
                  </p>
                  <p className="text-fg-subtle mt-1 text-xs">
                    {formatDate(featured.date)}
                  </p>
                </Link>
              )}
              {signals.map((signal) => (
                <div
                  key={signal.label}
                  className="border-border bg-bg-elevated rounded-xl border p-3.5"
                >
                  <p className="text-fg-subtle mb-1.5 font-mono text-[10px] tracking-wide uppercase">
                    {signal.label}
                  </p>
                  <p className="text-fg text-[13px] font-medium">
                    {signal.value}
                  </p>
                  {signal.meta && (
                    <p className="text-fg-subtle mt-1 text-xs">{signal.meta}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="scroll-mt-24">
          <SectionLabel>{t("work.label")}</SectionLabel>
          <div className="flex flex-col">
            {work.map((item) => {
              const internal = item.href.startsWith("/");
              const content = (
                <>
                  <div>
                    <span className="text-fg-subtle font-mono text-xs">
                      {item.year}
                    </span>
                    <br />
                    <span className="text-accent mt-2 inline-block font-mono text-[10px] tracking-wide uppercase">
                      {item.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-fg mb-2 inline-flex items-center gap-1.5 text-lg font-semibold">
                      {item.title}
                      <span className="text-accent" aria-hidden>
                        ↗
                      </span>
                    </h3>
                    <p className="text-fg-muted mb-3 text-sm leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.techs.map((tech) => (
                        <span
                          key={tech}
                          className="bg-accent-muted text-accent rounded-full px-2.5 py-1 font-mono text-[11px]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              );
              const className =
                "group hover:bg-bg-elevated hover:border-border grid grid-cols-[100px_1fr] gap-5 rounded-2xl border border-transparent p-5 transition-colors";
              return internal ? (
                <Link key={item.title} href={item.href} className={className}>
                  {content}
                </Link>
              ) : (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {content}
                </a>
              );
            })}
          </div>
          <Link
            href="/projects"
            className="text-fg mt-4 ml-5 inline-flex items-center gap-2 text-sm font-medium"
          >
            {t("work.viewAll")} <span className="text-accent">→</span>
          </Link>
        </section>

        {/* WRITING */}
        <section id="writing" className="scroll-mt-24">
          <SectionLabel>{t("writing.label")}</SectionLabel>
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="bg-accent-muted mb-6 block rounded-2xl p-5"
            >
              <span className="text-accent font-mono text-[11px] tracking-wide uppercase">
                {t("writing.featuredKicker")}
              </span>
              <h3 className="text-fg mt-2.5 mb-1.5 text-lg font-semibold">
                {featured.title}
              </h3>
              <p className="text-fg-muted max-w-[52ch] text-sm leading-relaxed">
                {featured.description}
              </p>
            </Link>
          )}
          <LatestPosts
            posts={latestPosts}
            locale={locale}
            title={t("latestPosts")}
            viewAll={t("viewAllPosts")}
            readTime={t("readTime")}
          />
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-24">
          <SectionLabel>{t("contact.label")}</SectionLabel>
          <h2 className="text-fg mb-2.5 max-w-[18ch] text-2xl font-semibold tracking-tight text-balance">
            {t("contact.title")}
          </h2>
          <p className="text-fg-muted mb-3 max-w-[50ch] text-[15px] leading-relaxed">
            {t("contact.description")}
          </p>
          <div className="mb-7 flex flex-wrap gap-2.5">
            <a
              href={`mailto:${tGlobal("email")}`}
              className="border-border text-fg hover:bg-bg-muted inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {tGlobal("email")}
            </a>
            <a
              href={tGlobal("social.linkedin")}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-fg hover:bg-bg-muted inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {t("contact.linkedin")}
            </a>
          </div>
          <div className="max-w-[480px]">
            <ContactForm />
          </div>
        </section>

        <p className="text-fg-subtle font-mono text-xs">{t("footer")}</p>
      </div>
    </main>
  );
}
