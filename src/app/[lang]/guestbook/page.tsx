import { setRequestLocale } from "next-intl/server";
import { GuestbookClient } from "@/components/Audience/Guestbook";
import { copyFor } from "@/components/Audience/copy";
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const t = copyFor(lang);
  return {
    title: `${t.guestbook} | Juliano Sirtori`,
    description: t.guestIntro,
    alternates: {
      canonical: `/${lang}/guestbook`,
      languages: { pt: "/pt/guestbook", en: "/en/guestbook" },
    },
  };
}
export default async function GuestbookPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = copyFor(lang);
  return (
    <main className="mx-auto w-full max-w-[760px] flex-1 px-5 pt-16 pb-20">
      <p className="text-accent mb-4 font-mono text-xs uppercase">Guestbook</p>
      <h1 className="mb-6 text-4xl font-semibold tracking-tight">
        {t.guestbook}
      </h1>
      <p className="text-fg-muted mb-10 text-lg leading-relaxed">
        {t.guestIntro}
      </p>
      <GuestbookClient />
    </main>
  );
}
