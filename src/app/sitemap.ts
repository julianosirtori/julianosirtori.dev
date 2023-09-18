import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { languages } from "@/locales/languages";

export default async function sitemap() {
  const langs = Object.keys(languages);
  const pages = ["about", "blog", "contact", "project"];
  const host = process.env.NEXT_PUBLIC_LOCAL_DOMAIN;

  let routes: MetadataRoute.Sitemap = [];
  langs.forEach((lang) => {
    allPosts.forEach((post) => {
      routes.push({
        url: `${host}/${lang}/blog/${post.slug}`,
        lastModified: post.date,
      });
    });

    pages.forEach((page) => {
      routes.push({
        url: `${host}/${lang}/${page}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  return routes;
}
