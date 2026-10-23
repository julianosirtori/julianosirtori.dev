import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { languages } from "@/locales/languages";
import { getCatalogResult } from "@/lib/skills/catalog";
import { SITE_URL } from "@/lib/site";
import { languagesFor } from "@/lib/seo";

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
  const host = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || SITE_URL;
  const today = new Date().toISOString().split("T")[0];

  // Read at request time from the skills cache. With GitHub down and nothing
  // cached, the sitemap still answers, only without skill pages.
  const catalog = await getCatalogResult({ allowRequestOverride: false });
  const skills = catalog.status === "ok" ? catalog.catalog.skills : [];

  const published = allPosts.filter((post) => !post.draft);
  // Posts only list the locales where that slug has a translation.
  const alternates = (available: readonly string[], path: string) => ({
    languages: languagesFor(available, (locale) => `${host}/${locale}${path}`),
  });

  const routes: MetadataRoute.Sitemap = [];
  for (const lang of langs) {
    for (const post of published.filter((post) => post.language === lang)) {
      const available = langs.filter((locale) =>
        published.some((p) => p.slug === post.slug && p.language === locale),
      );
      routes.push({
        url: `${host}/${lang}/blog/${post.slug}`,
        lastModified: post.date,
        alternates: alternates(available, `/blog/${post.slug}`),
      });
    }

    for (const page of pages) {
      routes.push({
        url: `${host}/${lang}/${page}`,
        lastModified: today,
        alternates: alternates(langs, `/${page}`),
      });
    }

    for (const skill of skills) {
      routes.push({
        url: `${host}/${lang}/skills/${skill.slug}`,
        lastModified: skill.updatedAt ?? today,
        alternates: alternates(langs, `/skills/${skill.slug}`),
      });
    }
  }

  return routes;
}
