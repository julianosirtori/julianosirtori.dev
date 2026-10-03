// @vitest-environment node
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { splitFrontmatter } from "./frontmatter";
import { MAC_CLEANUP_SKILL_MD } from "./fixtures/mac-cleanup";
import {
  renderSkillMarkdown,
  resolveSkillUrl,
  type SkillMarkdownContext,
} from "./markdown";

const SHA = "180c1b57fdc1024c9a699436b313fd0a7bfd7e5e";
const context: SkillMarkdownContext = {
  slug: "mac-cleanup",
  sha: SHA,
  files: ["SKILL.md", "references/locations.md", "scripts/scan.sh"],
};

async function html(body: string) {
  const rendered = await renderSkillMarkdown(body, context);
  return {
    ...rendered,
    html: renderToStaticMarkup(
      toJsxRuntime(rendered.tree, { Fragment, jsx, jsxs }),
    ),
  };
}

describe("resolveSkillUrl", () => {
  it("points relative links to the file on GitHub at the commit", () => {
    expect(resolveSkillUrl("references/locations.md", "link", context)).toBe(
      `https://github.com/julianosirtori/skills/blob/${SHA}/skills/mac-cleanup/references/locations.md`,
    );
    expect(resolveSkillUrl("./scripts/scan.sh#L10", "link", context)).toBe(
      `https://github.com/julianosirtori/skills/blob/${SHA}/skills/mac-cleanup/scripts/scan.sh#L10`,
    );
  });

  it("uses tree URLs for folders", () => {
    expect(resolveSkillUrl("scripts/", "link", context)).toBe(
      `https://github.com/julianosirtori/skills/tree/${SHA}/skills/mac-cleanup/scripts`,
    );
    expect(resolveSkillUrl("references", "link", context)).toBe(
      `https://github.com/julianosirtori/skills/tree/${SHA}/skills/mac-cleanup/references`,
    );
  });

  it("resolves parent and root-relative paths inside the repository", () => {
    expect(resolveSkillUrl("../other/SKILL.md", "link", context)).toBe(
      `https://github.com/julianosirtori/skills/blob/${SHA}/skills/other/SKILL.md`,
    );
    expect(resolveSkillUrl("/README.md", "link", context)).toBe(
      `https://github.com/julianosirtori/skills/blob/${SHA}/README.md`,
    );
    expect(resolveSkillUrl("../../../../etc/passwd", "link", context)).toBe(
      `https://github.com/julianosirtori/skills/blob/${SHA}/etc/passwd`,
    );
  });

  it("loads relative images from raw.githubusercontent.com by SHA", () => {
    expect(resolveSkillUrl("assets/diagram one.png", "image", context)).toBe(
      `https://raw.githubusercontent.com/julianosirtori/skills/${SHA}/skills/mac-cleanup/assets/diagram%20one.png`,
    );
  });

  it("leaves absolute URLs and anchors alone", () => {
    for (const url of [
      "https://example.com/a",
      "mailto:me@example.com",
      "#workflow",
      "//cdn.example.com/x.png",
    ]) {
      expect(resolveSkillUrl(url, "link", context)).toBe(url);
    }
  });
});

describe("renderSkillMarkdown", () => {
  it("renders mac-cleanup without the frontmatter, the H1 or anything executable", async () => {
    const body = splitFrontmatter(MAC_CLEANUP_SKILL_MD)!.body;
    const { html: out, headings, h2Count } = await html(body);

    expect(out).not.toContain("name: mac-cleanup");
    expect(out).not.toContain("Mac Cleanup</h");
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toMatch(/onclick|onerror/i);
    expect(out).not.toMatch(/javascript:/i);
    expect(out).toContain("<details>");
    expect(out).toContain(
      `href="https://github.com/julianosirtori/skills/blob/${SHA}/skills/mac-cleanup/references/locations.md"`,
    );
    expect(out).toContain("<table>");

    expect(h2Count).toBe(4);
    expect(headings.map((heading) => heading.slug)).toEqual([
      "three-tiers",
      "ground-rules-and-why",
      "workflow",
      "automation",
    ]);
    expect(out).toContain(
      '<h3 id="three-tiers"><a class="anchor" href="#three-tiers">',
    );
    expect(out).toContain('<h4 id="1-baseline">');
  });

  it("highlights code blocks like the blog", async () => {
    const { html: out } = await html("```bash\nbash scripts/scan.sh\n```\n");
    expect(out).toContain('data-language="bash"');
    expect(out).toMatch(/--shiki-light:#[0-9a-f]{6}/i);
    expect(out).toMatch(/--shiki-dark:#[0-9a-f]{6}/i);
  });

  it("falls back to plain text for unknown languages", async () => {
    const { html: out } = await html("```not-a-language\nhello\n```\n");
    expect(out).toContain("hello");
  });

  it("strips script tags, event handlers and dangerous URLs from raw HTML", async () => {
    const { html: out } = await html(
      [
        "<script>alert(1)</script>",
        '<img src="x.png" onerror="alert(1)">',
        '<a href="javascript:alert(1)">x</a>',
        '<iframe src="https://evil.example"></iframe>',
        '<div style="position:fixed" class="overlay">styled</div>',
        "<form action='/'><input name='q'></form>",
      ].join("\n\n"),
    );
    expect(out).not.toMatch(
      /<script|alert\(1\)|onerror|javascript:|<iframe|<form|style=|class="overlay"/i,
    );
    // GitHub's schema only keeps inputs as disabled task-list checkboxes.
    expect(out).toContain('<input disabled="" type="checkbox"');
    expect(out).toContain(
      `src="https://raw.githubusercontent.com/julianosirtori/skills/${SHA}/skills/mac-cleanup/x.png"`,
    );
  });

  it("does not let body headings collide with the page section ids", async () => {
    const { html: out } = await html(
      "## Install\n\n## Details\n\n### Install\n",
    );
    expect(out).toContain('id="install-1"');
    expect(out).toContain('id="details-1"');
    expect(out).toContain('id="install-2"');
    expect(out).not.toContain('id="install"');
  });

  it("only drops the H1 when it is the first node and shifts the rest", async () => {
    const { html: out } = await html("Intro\n\n# Later title\n\n###### Deep\n");
    expect(out).toContain('<h2 id="later-title">');
    expect(out).toContain('<h6 id="deep">');
  });

  it("marks external links as nofollow", async () => {
    const { html: out } = await html("[site](https://example.com)");
    expect(out).toContain('rel="nofollow noopener noreferrer"');
  });
});
