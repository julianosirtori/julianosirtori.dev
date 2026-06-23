import { RelatedPosts } from "julianosirtori.dev";
import { allPosts } from "contentlayer/generated";

const posts = allPosts
  .filter((p) => p.language === "en")
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export function ThreeRelated() {
  return (
    <div style={{ maxWidth: 640 }}>
      <RelatedPosts
        posts={posts.slice(0, 3)}
        label="Related posts"
        readTime="min read"
        locale="en"
      />
    </div>
  );
}

export function TwoRelated() {
  return (
    <div style={{ maxWidth: 640 }}>
      <RelatedPosts
        posts={posts.slice(2, 4)}
        label="Keep reading"
        readTime="min read"
        locale="en"
      />
    </div>
  );
}
