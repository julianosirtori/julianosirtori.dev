import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { NewsletterForm } from "@/components/Audience/Newsletter";
import { copyFor } from "@/components/Audience/copy";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const t = copyFor(lang);
  return {
    title: `${t.title} | Juliano Sirtori`,
    description: t.intro,
    alternates: {
      canonical: `/${lang}/newsletter`,
      languages: { pt: "/pt/newsletter", en: "/en/newsletter" },
    },
  };
}
export default async function NewsletterPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = copyFor(lang);
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-5 pt-16 pb-20 lg:pt-24">
      <p className="text-accent mb-5 font-mono text-xs tracking-widest uppercase">
        Newsletter · {lang === "pt" ? "Quinzenal" : "Every two weeks"}
      </p>
      <div className="grid items-start gap-12 md:grid-cols-[1.15fr_1fr] md:gap-16">
        <section>
          <h1 className="text-fg mb-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            {t.title}
          </h1>
          <p className="text-fg-muted mb-8 text-lg leading-relaxed">
            {t.intro}
          </p>
          <div className="text-fg-muted mb-8 flex items-center gap-3 text-sm">
            <Image
              src="/images/juliano2.jpg"
              alt="Juliano Sirtori"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="text-fg font-medium">Juliano Sirtori</p>
            </div>
          </div>
          <NewsletterForm source="newsletter" />
        </section>
        <aside className="border-border bg-bg-elevated rounded-xl border p-6 sm:p-8">
          <h2 className="text-fg-muted mb-7 font-mono text-xs tracking-wide uppercase">
            {t.sample}
          </h2>
          <div className="text-fg-muted space-y-5 text-sm leading-relaxed">
            <p>{t.sampleText}</p>
            <p>{t.sampleLinks}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
