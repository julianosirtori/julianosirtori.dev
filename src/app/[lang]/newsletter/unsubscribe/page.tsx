import { setRequestLocale } from "next-intl/server";
import { NewsletterAction } from "@/components/Audience/Newsletter";
import { copyFor } from "@/components/Audience/copy";
export const metadata = {
  title: "Newsletter | Juliano Sirtori",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  return (
    <main className="mx-auto w-full max-w-[760px] flex-1 px-5 py-20">
      <h1 className="mb-8 text-3xl font-semibold">
        {copyFor(lang).unsubscribe}
      </h1>
      <NewsletterAction mode="unsubscribe" />
    </main>
  );
}
