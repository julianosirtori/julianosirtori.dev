// Reads and validates SKILL.md. The rules mirror `scripts/validate.py` in the
// skills repository: the folder cannot start with ".", `name` and `description`
// are required, `name` equals the folder and follows the spec's name format,
// and the length limits hold. A skill that fails is left out of the catalog, so
// the site never shows an install command that would not work.

import { parse as parseYaml } from "yaml";

import { SKILL_NAME_MAX_LENGTH, SKILL_NAME_PATTERN } from "./constants";

export const ALLOWED_FRONTMATTER_KEYS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);

export const DESCRIPTION_MAX_LENGTH = 1024;
export const COMPATIBILITY_MAX_LENGTH = 500;
export const SUMMARY_MAX_LENGTH = 160;
export const COMPATIBILITY_SHORT_MAX_LENGTH = 60;

export interface SkillFrontmatter {
  name: string;
  description: string;
  license?: string;
  compatibility?: string;
  version?: string;
  allowedTools: string[];
}

export type SkillFileValidation =
  | {
      ok: true;
      frontmatter: SkillFrontmatter;
      body: string;
      warnings: string[];
    }
  | { ok: false; reason: string };

const FRONTMATTER_RE = /^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/;

/** Splits `---` frontmatter from the body. Returns null without frontmatter. */
export function splitFrontmatter(
  text: string,
): { raw: string; body: string } | null {
  const normalized = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const match = FRONTMATTER_RE.exec(normalized);
  if (!match) return null;
  return {
    raw: match[1],
    body: normalized.slice(match[0].length).replace(/^\n+/, ""),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalText(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number") return String(value);
  return undefined;
}

/**
 * `allowed-tools` is a space-separated string in the Agent Skills spec and a
 * comma-separated string or a list in Claude Code. Spaces inside parentheses
 * belong to the tool (`Bash(git status:*)`).
 */
export function parseAllowedTools(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value !== "string") return [];
  if (value.includes(",")) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  const tools: string[] = [];
  let current = "";
  let depth = 0;
  for (const char of value.trim()) {
    if (char === "(") depth += 1;
    if (char === ")") depth = Math.max(0, depth - 1);
    if (/\s/.test(char) && depth === 0) {
      if (current) tools.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current) tools.push(current);
  return tools;
}

export function validateSkillFile(
  folder: string,
  text: string,
): SkillFileValidation {
  if (folder.startsWith(".")) return { ok: false, reason: "hidden folder" };

  const parts = splitFrontmatter(text);
  if (!parts) {
    return { ok: false, reason: "SKILL.md must start with YAML frontmatter" };
  }

  let data: unknown;
  try {
    data = parseYaml(parts.raw);
  } catch (error) {
    return {
      ok: false,
      reason: `invalid YAML frontmatter (${error instanceof Error ? error.message.split("\n")[0] : "parse error"})`,
    };
  }
  if (!isRecord(data)) {
    return { ok: false, reason: "frontmatter is not a mapping" };
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  if (!name) return { ok: false, reason: "'name' is required" };
  if (name !== folder) {
    return {
      ok: false,
      reason: `name '${name}' must match the folder name`,
    };
  }
  if (name.length > SKILL_NAME_MAX_LENGTH || !SKILL_NAME_PATTERN.test(name)) {
    return {
      ok: false,
      reason: "name must be 1-64 chars of a-z, 0-9 and single hyphens",
    };
  }

  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  if (!description) return { ok: false, reason: "'description' is required" };
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return {
      ok: false,
      reason: `description is ${description.length} chars (max ${DESCRIPTION_MAX_LENGTH})`,
    };
  }

  const compatibility = optionalText(data.compatibility);
  if (compatibility && compatibility.length > COMPATIBILITY_MAX_LENGTH) {
    return {
      ok: false,
      reason: `compatibility is longer than ${COMPATIBILITY_MAX_LENGTH} chars`,
    };
  }

  const warnings: string[] = [];
  const unknown = Object.keys(data).filter(
    (key) => !ALLOWED_FRONTMATTER_KEYS.has(key),
  );
  if (unknown.length) {
    warnings.push(`unsupported frontmatter keys ${unknown.sort().join(", ")}`);
  }

  const metadata = isRecord(data.metadata) ? data.metadata : {};

  return {
    ok: true,
    body: parts.body,
    warnings,
    frontmatter: {
      name,
      description,
      license: optionalText(data.license),
      compatibility,
      version: optionalText(metadata.version),
      allowedTools: parseAllowedTools(data["allowed-tools"]),
    },
  };
}

/**
 * First sentence: up to a `.`, `!` or `?` followed by the end or by whitespace
 * and a capital letter, so abbreviations such as "e.g." do not end it.
 */
export function firstSentence(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  const match = /^(.+?[.!?])(?=$|\s+[A-Z])/.exec(clean);
  return match ? match[1] : clean;
}

/** Cuts at a word boundary and adds an ellipsis when the text is too long. */
export function truncateWords(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s.,;:!?-]+$/, "")}…`;
}

export function summaryFromDescription(description: string): string {
  return truncateWords(firstSentence(description), SUMMARY_MAX_LENGTH);
}

export function shortCompatibility(
  compatibility: string | undefined,
): string | undefined {
  if (!compatibility) return undefined;
  const sentence = firstSentence(compatibility);
  return sentence.length <= COMPATIBILITY_SHORT_MAX_LENGTH
    ? sentence
    : undefined;
}
