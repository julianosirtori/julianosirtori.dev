import { ImageResponse } from "next/og";

import { OG_SIZE, SkillsListCard, skillsOgCopy } from "./og";

export const contentType = "image/png";
export const size = OG_SIZE;

interface ImageProps {
  params: Promise<{ lang: string }>;
}

export async function generateImageMetadata({ params }: ImageProps) {
  const { lang } = await params;
  return [{ id: "card", alt: skillsOgCopy(lang).ogAlt, size, contentType }];
}

// Does not depend on GitHub, so it can never fail because of it.
export default async function Image({ params }: ImageProps) {
  const { lang } = await params;
  return new ImageResponse(<SkillsListCard lang={lang} />, { ...size });
}
