import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { languages } from "@/locales/languages";

export default async function sitemap() {
  const langs = Object.keys(languages);
  const pages = ["about", "blog", "contact", "project"];
  const host = process.env.NEXT_PUBLIC_LOCAL_DOMAIN;

  const routes: MetadataRoute.Sitemap = [];
  for (const lang of langs) {
    for (const post of allPosts) {
      routes.push({
        url: `${host}/${lang}/blog/${post.slug}`,
        lastModified: post.date,
      });
    }

    for (const page of pages) {
      routes.push({
        url: `${host}/${lang}/${page}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    }
  }

  return routes;
}
