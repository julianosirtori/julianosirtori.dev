import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer2/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import GithubSlugger from "github-slugger";

/** @type {import('contentlayer2/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/")[1],
  },
  language: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/")[0],
  },
  url: {
    type: "string",
    resolve: (post) => `/content/${post._raw.flattenedPath}`,
  },
  urlImage: {
    type: "string",
    resolve: (post) => {
      const bannerIdSplitted = post.bannerCloudinaryId.split("/");
      switch (bannerIdSplitted[0]) {
        case "unsplash":
          return `https://images.unsplash.com/${bannerIdSplitted[1]}`;
        default:
          return post.bannerCloudinaryId;
      }
    },
  },
  readTime: {
    type: "number",
    resolve: (post) => {
      const wordsPerMinute = 200;
      const textLength = post.body.raw.split(" ").length;
      return Math.ceil(textLength / wordsPerMinute);
    },
  },
  toc: {
    type: "json",
    resolve: (post) => {
      const slugger = new GithubSlugger();
      const raw = post.body.raw;
      const lines = raw.split("\n");
      const items = [];
      let inFence = false;
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
          inFence = !inFence;
          continue;
        }
        if (inFence) continue;
        const match = line.match(/^(#{2,3})\s+(.+?)\s*$/);
        if (!match) continue;
        const level = match[1].length;
        const text = match[2].replace(/`/g, "");
        items.push({ level, text, slug: slugger.slug(text) });
      }
      return items;
    },
  },
};

const Meta = defineNestedType(() => ({
  name: "Meta",
  fields: {
    keywords: {
      type: "list",
      of: { type: "string" },
      required: true,
    },
  },
}));

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
      required: true,
    },
    updated: {
      type: "date",
    },
    description: {
      type: "string",
      required: true,
    },
    categories: {
      type: "list",
      of: { type: "string" },
    },
    tags: {
      type: "list",
      of: { type: "string" },
    },
    meta: {
      type: "nested",
      of: Meta,
    },
    bannerCloudinaryId: {
      type: "string",
      required: true,
    },
    bannerCredit: {
      type: "string",
      required: true,
    },
    bannerAlt: {
      type: "string",
    },
    featured: {
      type: "boolean",
    },
    draft: {
      type: "boolean",
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "dracula-soft",
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
});
