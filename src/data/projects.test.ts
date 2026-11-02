import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { PORTFOLIO_URL } from "@/lib/site";
import { projectPreviews } from "./project-previews";
import { projects } from "./projects";

const flatten = (lang: keyof typeof projects) =>
  Object.entries(projects[lang]).flatMap(([year, items]) =>
    items.map((project) => ({ year, ...project })),
  );

describe("projects", () => {
  it("lists the same projects under the same years in both languages", () => {
    const shape = (lang: keyof typeof projects) =>
      flatten(lang).map(({ year, id, href, category, destination }) => ({
        year,
        id,
        href,
        category,
        destination,
      }));
    expect(shape("pt")).toEqual(shape("en"));
  });

  it("tags portfolio links and keeps third-party links clean", () => {
    for (const project of flatten("en")) {
      if (!project.href) continue;
      const url = new URL(project.href);
      if (project.href.startsWith(PORTFOLIO_URL)) {
        expect(url.searchParams.get("utm_content")).toBe("projects-list");
        expect(project.destination).toBe("case");
      } else {
        expect([...url.searchParams.keys()].join()).not.toMatch(/utm_/);
      }
    }
  });

  it("keeps copy free of em dashes and exclamations", () => {
    for (const project of [...flatten("en"), ...flatten("pt")]) {
      expect(`${project.title} ${project.description}`).not.toMatch(/[—!]/);
    }
  });

  it("points every preview at a known project and an existing file", () => {
    const ids = new Set(flatten("en").map((project) => project.id));
    for (const [id, src] of Object.entries(projectPreviews)) {
      expect(ids).toContain(id);
      expect(existsSync(join(process.cwd(), "public", src!))).toBe(true);
    }
  });

  it("keeps previews opaque so they read on both themes", () => {
    for (const src of Object.values(projectPreviews)) {
      const file = readFileSync(join(process.cwd(), "public", src!));
      const chunk = file.toString("ascii", 12, 16);
      // Lossless WebP (VP8L) may carry alpha; VP8X flags it in bit 4.
      expect(chunk, src).not.toBe("VP8L");
      if (chunk === "VP8X") expect(file[20] & 0x10, src).toBe(0);
    }
  });
});
