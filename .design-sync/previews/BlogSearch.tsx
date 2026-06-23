import { BlogSearch } from "julianosirtori.dev";
import { allPosts } from "contentlayer/generated";

const base = allPosts
  .filter((p) => p.language === "en")
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

// Real posts in this repo have no `categories` set. BlogSearch reads only
// title/slug/date/readTime/categories, so we attach categories to a few real
// posts to exercise the category-filter row alongside the result list.
const cats = ["JavaScript", "Next.js", "React", "DevOps"];
const posts = base.map((p, i) => ({
  title: p.title,
  slug: p.slug,
  date: p.date,
  readTime: p.readTime,
  categories: [cats[i % cats.length]],
}));

const translations = {
  searchPlaceholder: "Search articles...",
  allCategories: "All",
  noResults: "No articles found.",
  readTime: "min read",
};

export function Default() {
  return (
    <div style={{ maxWidth: 640 }}>
      <BlogSearch
        posts={posts.slice(0, 6)}
        locale="en"
        translations={translations}
      />
    </div>
  );
}

export function ManyPosts() {
  return (
    <div style={{ maxWidth: 640 }}>
      <BlogSearch posts={posts} locale="en" translations={translations} />
    </div>
  );
}
