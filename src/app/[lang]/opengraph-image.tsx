import { ImageResponse } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export const contentType = "image/png";
export const alt = "Juliano Sirtori - FrontEnd Developer";
export const title = "Juliano Sirtori";
export const url = "https://julianosirtori.dev/";

export const size = {
  width: 1200,
  height: 630,
};

export default async function GET() {
  try {
    const fontDataBold = await fetch(
      new URL("../fonts/Biotif-Bold.ttf", import.meta.url),
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div tw="w-full h-full flex text-center px-10 flex-nowrap flex-col justify-center bg-[#08070b]">
          <div tw="flex flex-col justify-center px-10">
            <h1
              style={{
                fontFamily: "Biotif-Bold",
                backgroundImage:
                  "linear-gradient(-225deg, #80ffea 0%, #8aff80 52%, #80ffea 100% )",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: "8px",
                fontSize: "60px",
              }}
            >
              Juliano Sirtori
            </h1>
            <h2
              tw="mb-0 mt-5  text-xl font-semibold text-white text-2xl"
              style={{
                fontFamily: "Biotif-Bold",
              }}
            >
              Front-end Developer
            </h2>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Biotif-Bold",
            data: fontDataBold,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
