import { Mdx } from "julianosirtori.dev";
import { allPosts } from "contentlayer/generated";

const en = allPosts.filter((p) => p.language === "en");

// A real article rich in prose + headings + code fences.
const article =
  en.find((p) => p.slug === "array-merging-in-javascript") ?? en[0];

export function RealArticle() {
  return (
    <div style={{ maxWidth: 680 }}>
      <Mdx code={article.body.code} />
    </div>
  );
}

const shorter =
  en.find((p) => p.slug === "create-monorepo-with-pnpm-workspaces") ?? en[0];

export function ShortArticle() {
  return (
    <div style={{ maxWidth: 680 }}>
      <Mdx code={shorter.body.code} />
    </div>
  );
}
