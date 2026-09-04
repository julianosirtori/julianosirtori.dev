import { ImageResponse } from "next/og";
import { OgCard } from "@/app/og-card";

export const runtime = "edge";

export const contentType = "image/png";
export const alt = "Juliano Sirtori — Full-stack software engineer.";

export const size = {
  width: 1200,
  height: 630,
};

export default async function GET() {
  try {
    return new ImageResponse(
      <OgCard
        category="Full-stack"
        title="Juliano Sirtori"
        meta="Full-stack software engineer · writing about the craft"
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
