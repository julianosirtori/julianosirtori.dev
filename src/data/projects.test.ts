import { describe, expect, it } from "vitest";

import { PORTFOLIO_URL } from "@/lib/site";
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
});
