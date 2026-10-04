// SKILL.md comes from a public repository that accepts pull requests, so it is
// rendered as plain GFM, never MDX: raw HTML is parsed and then sanitized with
// GitHub's schema before anything else touches the tree. Code blocks go
// through the same rehype-pretty-code setup as the blog.

import GithubSlugger from "github-slugger";
import type { Element, Root } from "hast";
import { toString } from "hast-util-to-string";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

import { SKILLS_DIR, repoBlobUrl, repoRawUrl, repoTreeUrl } from "./constants";

/**
 * Every id and name that comes from SKILL.md carries this prefix exactly once,
 * as on GitHub. Unprefixed ids could clobber page globals through named access
 * on `window` (an element with id `__next_f` breaks hydration) or collide with
 * the page's own ids (`install`, `details`...).
 */
export const CONTENT_ID_PREFIX = "user-content-";

/**
 * Part of the render cache key. Bump it whenever the pipeline's output
 * changes; the Data Cache outlives deploys and would keep the old render.
 */
export const SKILL_MARKDOWN_VERSION = "v2";

const FOOTNOTE_LABEL_ID = `${CONTENT_ID_PREFIX}footnote-label`;

export interface SkillHeading {
  level: number;
  text: string;
  slug: string;
}

export interface SkillMarkdownContext {
  slug: string;
  sha: string;
  /** Paths relative to the skill folder, used to tell files from folders. */
  files: string[];
}

export interface RenderedSkillMarkdown {
  tree: Root;
  /** The body's original h2s (h3 after the shift), for the table of contents. */
  headings: SkillHeading[];
  /** Number of h2s in the original SKILL.md. */
  h2Count: number;
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
  defaultLang: { block: "plaintext" },
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
};

const SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

/**
 * GitHub's schema, but `<style>` is removed with its content. By default only
 * `<script>` is, so CSS from a SKILL.md would show up as visible text.
 */
const sanitizeSchema = {
  ...defaultSchema,
  strip: [...(defaultSchema.strip ?? []), "style"],
};

/**
 * Relative links point to the file on GitHub and relative images load from
 * raw.githubusercontent.com, both pinned to the commit the page was read from.
 * Absolute URLs, in-page anchors and protocol-relative URLs stay as they are.
 */
export function resolveSkillUrl(
  url: string,
  kind: "link" | "image",
  context: SkillMarkdownContext,
): string {
  const value = url.trim();
  if (!value || value.startsWith("#") || value.startsWith("//")) return value;
  if (SCHEME_RE.test(value)) return value;

  const [, pathPart = "", suffix = ""] =
    /^([^?#]*)([?#].*)?$/.exec(value) ?? [];
  const base = `https://repo.invalid/${SKILLS_DIR}/${context.slug}/`;
  let repoPath: string;
  try {
    repoPath = decodeURIComponent(
      new URL(
        pathPart || ".",
        value.startsWith("/") ? "https://repo.invalid/" : base,
      ).pathname,
    ).replace(/^\/+/, "");
  } catch {
    return value;
  }
  const isDir = pathPart.endsWith("/") || pathPart === "" || pathPart === ".";
  const clean = repoPath.replace(/\/+$/, "");

  if (kind === "image") return repoRawUrl(context.sha, clean);

  const skillPrefix = `${SKILLS_DIR}/${context.slug}/`;
  const relative = clean.startsWith(skillPrefix)
    ? clean.slice(skillPrefix.length)
    : null;
  const knownDir =
    relative !== null &&
    context.files.some((file) => file.startsWith(`${relative}/`));
  const target =
    isDir || knownDir || clean === `${SKILLS_DIR}/${context.slug}`
      ? repoTreeUrl(context.sha, clean)
      : repoBlobUrl(context.sha, clean);
  // Keep the query and the fragment (`?plain=1#L3` selects lines on GitHub).
  return `${target}${suffix}`;
}

function headingRank(node: Element): number | null {
  const match = /^h([1-6])$/.exec(node.tagName);
  return match ? Number(match[1]) : null;
}

/** In-page `#foo` links point to `#user-content-foo` when that target exists. */
function resolveFragment(href: string, targets: Set<string>): string {
  let fragment: string;
  try {
    fragment = decodeURIComponent(href.slice(1));
  } catch {
    return href;
  }
  if (targets.has(`${CONTENT_ID_PREFIX}${fragment}`)) {
    return `#${CONTENT_ID_PREFIX}${fragment}`;
  }
  return href;
}

function rehypeSkillStructure(
  context: SkillMarkdownContext,
  output: Pick<RenderedSkillMarkdown, "headings" | "h2Count">,
) {
  return (tree: Root) => {
    // The page already has the skill name as its H1.
    const first = tree.children.findIndex(
      (node) => node.type !== "text" || node.value.trim() !== "",
    );
    const firstNode = tree.children[first];
    if (firstNode?.type === "element" && firstNode.tagName === "h1") {
      tree.children.splice(first, 1);
    }

    // rehype-sanitize already prefixed every id and name from the source.
    // Reserve them so a heading cannot take the same id.
    const targets = new Set<string>();
    const slugger = new GithubSlugger();
    visit(tree, "element", (node) => {
      for (const key of ["id", "name"] as const) {
        const value = node.properties[key];
        if (typeof value !== "string") continue;
        targets.add(value);
        if (!headingRank(node) && value.startsWith(CONTENT_ID_PREFIX)) {
          slugger.slug(value.slice(CONTENT_ID_PREFIX.length));
        }
      }
    });

    visit(tree, "element", (node) => {
      const rank = headingRank(node);
      if (!rank) return;
      node.tagName = `h${Math.min(rank + 1, 6)}`;
      // GFM's visually hidden "Footnotes" heading keeps the id its
      // references point to and stays out of the table of contents.
      if (node.properties.id === FOOTNOTE_LABEL_ID) return;
      if (rank === 2) output.h2Count += 1;
      const text = toString(node).trim();
      const id = `${CONTENT_ID_PREFIX}${slugger.slug(text)}`;
      node.properties.id = id;
      targets.add(id);
      if (rank === 2) output.headings.push({ level: 3, text, slug: id });
    });

    visit(tree, "element", (node) => {
      if (node.tagName === "a" && typeof node.properties.href === "string") {
        const raw = node.properties.href.trim();
        const href = raw.startsWith("#")
          ? resolveFragment(raw, targets)
          : resolveSkillUrl(raw, "link", context);
        node.properties.href = href;
        if (/^https?:/i.test(href)) {
          node.properties.rel = ["nofollow", "noopener", "noreferrer"];
        }
      }
      if (node.tagName === "img" && typeof node.properties.src === "string") {
        node.properties.src = resolveSkillUrl(
          node.properties.src,
          "image",
          context,
        );
        node.properties.loading = "lazy";
      }
    });
  };
}

export async function renderSkillMarkdown(
  body: string,
  context: SkillMarkdownContext,
): Promise<RenderedSkillMarkdown> {
  const output = { headings: [] as SkillHeading[], h2Count: 0 };
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    // The sanitizer adds CONTENT_ID_PREFIX; adding it here too would double it.
    .use(remarkRehype, { allowDangerousHtml: true, clobberPrefix: "" })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeSkillStructure, context, output)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["anchor"] },
    })
    .use(rehypePrettyCode, prettyCodeOptions);

  const tree = (await processor.run(processor.parse(body))) as Root;
  // Positions are dead weight in the cache.
  visit(tree, (node) => {
    delete node.position;
  });
  return { tree, ...output };
}
