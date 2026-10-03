import { ImageResponse } from "next/og";

import { findSkill, getCatalogResult } from "@/lib/skills/catalog";
import { isValidSkillSlug } from "@/lib/skills/constants";
import { OG_SIZE, SkillDetailCard, SkillsListCard, skillsOgCopy } from "../og";

export const contentType = "image/png";
export const size = OG_SIZE;

interface ImageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateImageMetadata({ params }: ImageProps) {
  const { lang } = await params;
  return [{ id: "card", alt: skillsOgCopy(lang).ogAlt, size, contentType }];
}

export default async function Image({ params }: ImageProps) {
  const { lang, slug } = await params;
  if (!isValidSkillSlug(slug))
    return new Response("Not found", { status: 404 });

  const result = await getCatalogResult();
  // GitHub down and nothing cached: the generic catalog card, never a 500.
  if (result.status === "error") {
    return new ImageResponse(<SkillsListCard lang={lang} />, { ...size });
  }

  const skill = findSkill(result.catalog, slug);
  if (!skill) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    <SkillDetailCard lang={lang} slug={skill.slug} version={skill.version} />,
    { ...size },
  );
}
