import { describe, expect, it } from "vitest";

import {
  firstSentence,
  parseAllowedTools,
  shortCompatibility,
  splitFrontmatter,
  summaryFromDescription,
  truncateWords,
  validateSkillFile,
} from "./frontmatter";
import { MAC_CLEANUP_SKILL_MD } from "./fixtures/mac-cleanup";

const skill = (frontmatter: string, body = "# Title\n\nBody\n") =>
  `---\n${frontmatter}\n---\n\n${body}`;

describe("splitFrontmatter", () => {
  it("separates the YAML header from the body", () => {
    expect(splitFrontmatter("---\nname: a\n---\n\n# Hi\n")).toEqual({
      raw: "name: a",
      body: "# Hi\n",
    });
  });

  it("accepts CRLF line endings and a BOM", () => {
    expect(splitFrontmatter("﻿---\r\nname: a\r\n---\r\nBody")).toEqual({
      raw: "name: a",
      body: "Body",
    });
  });

  it("returns null when the file does not start with frontmatter", () => {
    expect(splitFrontmatter("# Title\n---\nname: a\n---\n")).toBeNull();
    expect(splitFrontmatter("---\nname: a\n")).toBeNull();
  });
});

describe("validateSkillFile", () => {
  it("reads the real mac-cleanup frontmatter", () => {
    const result = validateSkillFile("mac-cleanup", MAC_CLEANUP_SKILL_MD);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.frontmatter).toMatchObject({
      name: "mac-cleanup",
      license: "MIT",
      version: "1.0.0",
      allowedTools: ["Bash(bash scripts/scan.sh:*)", "Read", "Glob"],
    });
    expect(result.frontmatter.description).toMatch(/^Analyze and safely/);
    expect(result.frontmatter.compatibility).toMatch(/^macOS 13 or later\./);
    expect(result.body.startsWith("# Mac Cleanup")).toBe(true);
    expect(result.warnings).toEqual([]);
  });

  it("supports folded and quoted YAML values", () => {
    const result = validateSkillFile(
      "folded",
      skill(
        'name: "folded"\ndescription: >\n  Line one\n  line two.\nmetadata:\n  version: 2',
      ),
    );
    expect(result.ok && result.frontmatter.description).toBe(
      "Line one line two.",
    );
    expect(result.ok && result.frontmatter.version).toBe("2");
  });

  it.each([
    ["hidden folder", ".hidden", skill("name: .hidden\ndescription: x")],
    ["missing frontmatter", "a", "# Title\n"],
    ["missing name", "a", skill("description: x")],
    ["name differs from folder", "a", skill("name: b\ndescription: x")],
    ["missing description", "a", skill("name: a")],
    ["empty description", "a", skill('name: a\ndescription: "  "')],
    ["uppercase name", "Bad", skill("name: Bad\ndescription: x")],
    ["double hyphen", "a--b", skill("name: a--b\ndescription: x")],
    ["broken YAML", "a", skill("name: a\ndescription: [oops")],
    ["frontmatter is a list", "a", skill("- name: a")],
    [
      "description over 1024 chars",
      "a",
      skill(`name: a\ndescription: ${"x".repeat(1025)}`),
    ],
    [
      "compatibility over 500 chars",
      "a",
      skill(`name: a\ndescription: x\ncompatibility: ${"y".repeat(501)}`),
    ],
    [
      "name over 64 chars",
      "a".repeat(65),
      skill(`name: ${"a".repeat(65)}\ndescription: x`),
    ],
  ])("rejects %s", (_, folder, text) => {
    expect(validateSkillFile(folder, text).ok).toBe(false);
  });

  it("keeps a skill with unknown keys but reports them", () => {
    const result = validateSkillFile(
      "a",
      skill("name: a\ndescription: x\nauthor: someone"),
    );
    expect(result.ok).toBe(true);
    expect(result.ok && result.warnings[0]).toMatch(/author/);
  });
});

describe("parseAllowedTools", () => {
  it("splits the spec's space-delimited form without breaking parentheses", () => {
    expect(parseAllowedTools("Bash(git status:*) Read  Grep")).toEqual([
      "Bash(git status:*)",
      "Read",
      "Grep",
    ]);
  });

  it("accepts Claude Code's comma-separated form and YAML lists", () => {
    expect(parseAllowedTools("Read, Grep, Glob")).toEqual([
      "Read",
      "Grep",
      "Glob",
    ]);
    expect(parseAllowedTools(["Read", " ", 3, "Bash"])).toEqual([
      "Read",
      "Bash",
    ]);
    expect(parseAllowedTools(undefined)).toEqual([]);
  });
});

describe("summaries", () => {
  it("takes the first sentence without stopping at abbreviations", () => {
    expect(
      firstSentence('Use it when asked (e.g. "clean up"). Then more.'),
    ).toBe('Use it when asked (e.g. "clean up").');
    expect(firstSentence("No period at all")).toBe("No period at all");
  });

  it("cuts long text at a word boundary with an ellipsis", () => {
    const text = "word ".repeat(60).trim();
    const cut = truncateWords(text, 160);
    expect(cut.length).toBeLessThanOrEqual(160);
    expect(cut.endsWith("word…")).toBe(true);
    expect(truncateWords("short", 160)).toBe("short");
  });

  it("builds the card summary from the description", () => {
    expect(
      summaryFromDescription(
        "Analyze and safely free up disk space on macOS. Measures what is using storage.",
      ),
    ).toBe("Analyze and safely free up disk space on macOS.");
  });

  it("only shortens compatibility when the first sentence fits 60 chars", () => {
    expect(
      shortCompatibility(
        "macOS 13 or later. Uses the stock bash 3.2, du, df, mdfind.",
      ),
    ).toBe("macOS 13 or later.");
    expect(shortCompatibility(`${"x".repeat(61)}.`)).toBeUndefined();
    expect(shortCompatibility(undefined)).toBeUndefined();
  });
});
