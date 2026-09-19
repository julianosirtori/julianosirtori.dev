import { setRequestLocale } from "next-intl/server";
import { NewsletterActionPage } from "@/components/Audience/Newsletter";
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
    <NewsletterActionPage
      mode="unsubscribe"
      title={copyFor(lang).unsubscribe}
    />
  );
}
