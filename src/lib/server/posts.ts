import { allPosts } from "contentlayer/generated";
export const publishedSlugs = Array.from(
  new Set(allPosts.filter((p) => !p.draft).map((p) => p.slug)),
);
export const isPublishedSlug = (slug: unknown): slug is string =>
  typeof slug === "string" && publishedSlugs.includes(slug);
