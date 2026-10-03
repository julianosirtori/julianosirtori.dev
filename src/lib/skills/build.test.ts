import { afterEach, describe, expect, it, vi } from "vitest";

import { buildCatalog, countFilesIn, sortSkills } from "./build";
import { FIXTURE_SHA, fixtureSource, memorySource } from "./fixtures";
import {
  normalizeRepoPath,
  parseMarketplace,
  pluginForSkill,
} from "./marketplace";
import { SKILLS_FILTER_THRESHOLD } from "./constants";
import type { SkillsSource } from "./source";
import type { Skill } from "./types";

afterEach(() => vi.restoreAllMocks());

describe("buildCatalog with fixtures", () => {
  it("returns no skills for an empty repository", async () => {
    const catalog = await buildCatalog(fixtureSource("empty"));
    expect(catalog).toEqual({ sha: FIXTURE_SHA, skills: [] });
  });

  it("reads mac-cleanup with marketplace enrichment", async () => {
    const { skills } = await buildCatalog(fixtureSource("one"));
    expect(skills).toHaveLength(1);
    const [skill] = skills;
    expect(skill).toMatchObject({
      slug: "mac-cleanup",
      version: "1.0.0",
      category: "productivity",
      license: "MIT",
      compatibilityShort: "macOS 13 or later.",
      keywords: ["macos", "disk-space", "cleanup", "storage", "caches"],
      plugin: { name: "mac-cleanup", marketplace: "julianosirtori-skills" },
      updatedAt: "2026-10-03T04:09:09Z",
    });
    expect(skill.summary).toMatch(
      /^Analyze and safely free up disk space on macOS:/,
    );
    expect(skill.files.map((file) => file.path)).toEqual([
      "references/automation.md",
      "references/locations.md",
      "references/uninstall.md",
      "scripts/leftovers.sh",
      "scripts/safe-clean.sh",
      "scripts/scan.sh",
      "SKILL.md",
    ]);
    expect(countFilesIn(skill, "scripts")).toBe(3);
    expect(countFilesIn(skill, "references")).toBe(3);
    expect(skill.body).not.toMatch(/^---/);
  });

  it("covers the filter threshold with two or more categories", async () => {
    const { skills } = await buildCatalog(fixtureSource("many"));
    expect(skills.length).toBeGreaterThanOrEqual(SKILLS_FILTER_THRESHOLD);
    expect(
      new Set(skills.map((skill) => skill.category)).size,
    ).toBeGreaterThanOrEqual(2);
    // Most recently updated first.
    expect(skills[0].slug).toBe("mac-cleanup");
    const dates = skills.map((skill) => skill.updatedAt ?? "");
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("lists thirty skills", async () => {
    expect((await buildCatalog(fixtureSource("thirty"))).skills).toHaveLength(
      30,
    );
  });

  it("skips invalid skills with a warning and survives a broken marketplace", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { skills } = await buildCatalog(fixtureSource("invalid"));
    expect(skills.map((skill) => skill.slug)).toEqual(["valid-skill"]);
    expect(skills[0].plugin).toBeUndefined();
    expect(skills[0].category).toBeUndefined();
    expect(skills[0].summary).toBe(
      "A valid skill that is not listed in any plugin.",
    );
    const messages = warn.mock.calls.map(([message]) => String(message));
    for (const folder of [
      "name-mismatch",
      "no-description",
      "no-frontmatter",
      "broken-yaml",
      "Bad_Name",
    ]) {
      expect(
        messages.some((message) => message.includes(`skills/${folder}`)),
      ).toBe(true);
    }
    expect(messages.some((message) => message.includes(".hidden"))).toBe(false);
    expect(
      messages.some((message) => message.includes("marketplace.json")),
    ).toBe(true);
  });

  it("throws when GitHub is down so nothing gets cached", async () => {
    await expect(buildCatalog(fixtureSource("down"))).rejects.toThrow(/down/);
  });
});

describe("buildCatalog failure handling", () => {
  const files = {
    "skills/a/SKILL.md": "---\nname: a\ndescription: Does a.\n---\nBody\n",
  };

  it("throws when a SKILL.md read fails instead of caching a partial catalog", async () => {
    const source: SkillsSource = {
      ...memorySource({ files }),
      readFile: async (_sha, path) => {
        if (path.endsWith("SKILL.md")) throw new Error("raw 502");
        return null;
      },
    };
    await expect(buildCatalog(source)).rejects.toThrow("raw 502");
  });

  it("keeps the catalog when only an update date fails", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const source: SkillsSource = {
      ...memorySource({ files }),
      lastCommitDate: async () => {
        throw new Error("rate limited");
      },
    };
    const { skills } = await buildCatalog(source);
    expect(skills).toHaveLength(1);
    expect(skills[0].updatedAt).toBeUndefined();
  });

  it("only asks for dates when the source can afford them", async () => {
    const source = memorySource({ files });
    expect(source.lastCommitDate).toBeUndefined();
    expect((await buildCatalog(source)).skills[0].updatedAt).toBeUndefined();
  });
});

describe("sortSkills", () => {
  const make = (slug: string, updatedAt?: string) =>
    ({ slug, updatedAt }) as Skill;

  it("orders by date, then alphabetically without dates", () => {
    expect(
      sortSkills([
        make("b"),
        make("old", "2025-01-01T00:00:00Z"),
        make("a"),
        make("new", "2026-01-01T00:00:00Z"),
      ]).map((skill) => skill.slug),
    ).toEqual(["new", "old", "a", "b"]);
  });
});

describe("marketplace", () => {
  it("finds the plugin by skill path, not by name", () => {
    const marketplace = parseMarketplace(
      JSON.stringify({
        name: "market",
        plugins: [
          {
            name: "bundle",
            source: "./",
            skills: ["./skills/one", "./skills/two/"],
          },
        ],
      }),
    );
    expect(pluginForSkill(marketplace, "two")?.name).toBe("bundle");
    expect(pluginForSkill(marketplace, "three")).toBeUndefined();
    expect(pluginForSkill(null, "two")).toBeUndefined();
  });

  it("returns null for invalid JSON", () => {
    expect(parseMarketplace("{")).toBeNull();
    expect(parseMarketplace("[]")).toBeNull();
  });

  it("normalizes repo paths", () => {
    expect(normalizeRepoPath("./plugin/../skills/a/")).toBe("skills/a");
  });
});
