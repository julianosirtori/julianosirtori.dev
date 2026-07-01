import { ImageResponse } from "next/og";
import { IPostProps } from "./page";
import { allPosts } from "contentlayer/generated";
import { OgCard } from "@/app/og-card";

export const runtime = "edge";

export const contentType = "image/png";
export const alt = "Juliano Sirtori — Full-stack software engineer.";

export const size = {
  width: 1200,
  height: 630,
};

export default async function GET({ params }: IPostProps) {
  try {
    const { lang, slug } = await params;
    const post = allPosts.find((post) => post.slug === slug);

    const readLabel = lang === "pt" ? "min de leitura" : "min read";
    const meta = post
      ? `${post.readTime} ${readLabel}`
      : "Full-stack software engineer";

    return new ImageResponse(
      <OgCard
        category={post?.categories?.[0]}
        title={post?.title ?? "Juliano Sirtori"}
        meta={meta}
      />,
      { ...size },
    );
  } catch (e: unknown) {
    console.error(`[og]`, e instanceof Error ? e.message : String(e));
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
