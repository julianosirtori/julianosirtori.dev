import { ImageResponse } from "next/og";
import { IPostProps } from "./page";
import { allPosts } from "contentlayer/generated";

export const runtime = "edge";

export const contentType = "image/png";
export const alt =
  "Juliano Sirtori — Front-end engineer writing about the craft.";

export const size = {
  width: 1200,
  height: 630,
};

export default async function GET({ params }: IPostProps) {
  try {
    const { slug } = await params;
    const post = allPosts.find((post) => post.slug === slug);

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {post?.title}
        </h1>
        <p
          style={{
            fontSize: "24px",
            color: "#a3a3a3",
            margin: 0,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        >
          juliano sirtori.
        </p>
      </div>,
      { ...size },
    );
  } catch (e: unknown) {
    console.error(`[og]`, e instanceof Error ? e.message : String(e));
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
