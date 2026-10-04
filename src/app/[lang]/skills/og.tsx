import { OgCard } from "@/app/og-card";
import en from "@/locales/en/skills.json";
import pt from "@/locales/pt/skills.json";

export const OG_SIZE = { width: 1200, height: 630 };

export function skillsOgCopy(lang: string) {
  return (lang === "pt" ? pt : en).meta;
}

/** "AI" / "IA" picks the amber accent the AI posts already use. */
function aiCategory(lang: string) {
  return lang === "pt" ? "IA" : "AI";
}

export function SkillsListCard({ lang }: { lang: string }) {
  const copy = skillsOgCopy(lang);
  return (
    <OgCard
      category={aiCategory(lang)}
      title={copy.listTitle}
      meta={copy.ogListMeta}
    />
  );
}

export function SkillDetailCard({
  lang,
  slug,
  version,
}: {
  lang: string;
  slug: string;
  version?: string;
}) {
  const copy = skillsOgCopy(lang);
  return (
    <OgCard
      category={aiCategory(lang)}
      title={slug}
      meta={version ? `${copy.ogDetailMeta} · v${version}` : copy.ogDetailMeta}
      // Slugs have no spaces to wrap on; long ones need a smaller size.
      titleSize={slug.length > 28 ? 52 : undefined}
    />
  );
}
