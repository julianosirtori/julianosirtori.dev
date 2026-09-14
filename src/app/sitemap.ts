import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { languages } from "@/locales/languages";

export default async function sitemap() {
  const langs = Object.keys(languages);
  const pages = [
    "about",
    "blog",
    "projects",
    "work-with-me",
    "newsletter",
    "guestbook",
  ];
  const host =
    process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "https://julianosirtori.dev";

  const routes: MetadataRoute.Sitemap = [];
  for (const lang of langs) {
    for (const post of allPosts.filter(
      (post) => post.language === lang && !post.draft,
    )) {
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
