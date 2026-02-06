import { setRequestLocale, getTranslations } from "next-intl/server";

import { experiences, recommendations } from "@/data/about";
import { AboutHero } from "@/components/AboutHero";
import { RecommendationCards } from "@/components/RecommendationCards";
import { CareerTimeline } from "@/components/CareerTimeline";

export interface AboutProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function About({ params }: AboutProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("about");

  const bioPhrase1 = t.rich("bio.phrase1", {
    important: (chunks) => <strong className="text-primary">{chunks}</strong>,
  });
  const bioPhrase2 = t.rich("bio.phrase2", {
    important: (chunks) => <strong className="text-primary">{chunks}</strong>,
  });
  const bioPhrase3 = t.rich("bio.phrase3", {
    important: (chunks) => <strong className="text-primary">{chunks}</strong>,
  });

  return (
    <main className="py-nav-height-mobile selection:bg-pink lg:py-nav-height-desktop mx-auto flex w-full max-w-4xl flex-1 flex-col gap-24 px-5 selection:text-black">
      <AboutHero
        title={t("title")}
        bioPhrase1={bioPhrase1}
        bioPhrase2={bioPhrase2}
        bioPhrase3={bioPhrase3}
      />

      <RecommendationCards
        title={t("recommendations")}
        recommendations={recommendations}
      />

      <CareerTimeline
        title={t("career")}
        experiences={experiences}
        presentLabel={t("present")}
        skillsLabel={t("skills")}
      />
    </main>
  );
}
