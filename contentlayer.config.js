import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath,
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
};

const Meta = defineNestedType(() => ({
  name: "Meta",
  fields: {
    keywords: {
      type: "list",
      of: {
        type: "string",
      },
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
    description: {
      type: "string",
      required: true,
    },
    categories: {
      type: "list",
      of: {
        type: "string",
      },
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
          theme: "one-dark-pro",
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
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
