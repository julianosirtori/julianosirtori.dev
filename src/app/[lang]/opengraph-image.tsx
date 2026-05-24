import { ImageResponse } from "next/og";

export const runtime = "edge";

export const contentType = "image/png";
export const alt =
  "Juliano Sirtori — Front-end engineer writing about the craft.";

export const size = {
  width: 1200,
  height: 630,
};

export default async function GET() {
  try {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: "84px",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          juliano sirtori.
        </h1>
        <p
          style={{
            fontSize: "32px",
            color: "#a3a3a3",
            marginTop: "32px",
            marginBottom: 0,
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          Front-end engineer writing about the craft.
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
