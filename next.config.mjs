import { withContentlayer } from "next-contentlayer2";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/locales/index.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    globalNotFound: true,
    // Avoid restoring stale dev route entries that send existing pages to 404.
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // The "squad" skill was renamed to "crew"; old links and search results
      // still point at the previous slug.
      {
        source: "/:lang/skills/squad",
        destination: "/:lang/skills/crew",
        permanent: true,
      },
      // This slug had the English audio article under the wrong name, and the
      // styled-components post has no English translation yet. Temporary so it
      // can be dropped once that translation exists.
      {
        source: "/en/blog/recreating-styled-components",
        destination: "/en/blog/capture-record-and-send-audio-in-the-browser",
        permanent: false,
      },
    ];
  },
};

export default withContentlayer(withNextIntl(nextConfig));
