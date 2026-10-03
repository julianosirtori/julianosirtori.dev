import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { languages } from "@/locales/languages";
import { getCatalogResult } from "@/lib/skills/catalog";

export default async function sitemap() {
  const langs = Object.keys(languages);
  const pages = [
    "about",
    "blog",
    "projects",
    "work-with-me",
    "newsletter",
    "guestbook",
    "skills",
  ];
  const host =
    process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "https://julianosirtori.dev";
  const today = new Date().toISOString().split("T")[0];

  // Read at request time from the skills cache. With GitHub down and nothing
  // cached, the sitemap still answers, only without skill pages.
  const catalog = await getCatalogResult({ allowRequestOverride: false });
  const skills = catalog.status === "ok" ? catalog.catalog.skills : [];

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
        lastModified: today,
      });
    }

    for (const skill of skills) {
      routes.push({
        url: `${host}/${lang}/skills/${skill.slug}`,
        lastModified: skill.updatedAt ?? today,
      });
    }
  }

  return routes;
}
