import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const host = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || SITE_URL;
  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/api/",
        "/pt/admin/",
        "/en/admin/",
        "/pt/newsletter/confirm",
        "/en/newsletter/confirm",
        "/pt/newsletter/unsubscribe",
        "/en/newsletter/unsubscribe",
      ],
    },
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
