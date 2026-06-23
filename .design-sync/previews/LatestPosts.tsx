import { LatestPosts } from "julianosirtori.dev";
import { allPosts } from "contentlayer/generated";

const posts = allPosts
  .filter((p) => p.language === "en")
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export function Default() {
  return (
    <div style={{ maxWidth: 640 }}>
      <LatestPosts
        posts={posts.slice(0, 4)}
        locale="en"
        title="Latest writing"
        viewAll="View all"
        readTime="min read"
      />
    </div>
  );
}

export function FiveItems() {
  return (
    <div style={{ maxWidth: 640 }}>
      <LatestPosts
        posts={posts.slice(0, 5)}
        locale="en"
        title="From the blog"
        viewAll="All posts"
        readTime="min read"
      />
    </div>
  );
}
