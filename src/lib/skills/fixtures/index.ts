// Fixed datasets for unit tests, e2e and QA. They feed the same SkillsSource
// interface as GitHub, so validation and parsing run exactly as in production.

import {
  SkillsSourceError,
  type RepoTreeEntry,
  type SkillsSource,
} from "../source";
import {
  MAC_CLEANUP_FILES,
  MAC_CLEANUP_PLUGIN,
  MAC_CLEANUP_SKILL_MD,
} from "./mac-cleanup";

export const SKILLS_FIXTURES = [
  "empty",
  "one",
  "many",
  "thirty",
  "invalid",
  "down",
] as const;

export type SkillsFixtureName = (typeof SKILLS_FIXTURES)[number];

export function isSkillsFixtureName(
  value: unknown,
): value is SkillsFixtureName {
  return (
    typeof value === "string" &&
    (SKILLS_FIXTURES as readonly string[]).includes(value)
  );
}

export const FIXTURE_SHA = "180c1b57fdc1024c9a699436b313fd0a7bfd7e5e";

interface MemoryRepo {
  files: Record<string, string>;
  /** Last commit date per skill folder (`skills/<name>`). */
  dates?: Record<string, string>;
}

export function memorySource(
  repo: MemoryRepo,
  sha = FIXTURE_SHA,
): SkillsSource {
  const encoder = new TextEncoder();
  const source: SkillsSource = {
    async resolveHead() {
      return sha;
    },
    async listTree() {
      const entries = new Map<string, RepoTreeEntry>();
      for (const [path, content] of Object.entries(repo.files)) {
        const segments = path.split("/");
        for (let i = 1; i < segments.length; i += 1) {
          const dir = segments.slice(0, i).join("/");
          entries.set(dir, { path: dir, type: "tree" });
        }
        entries.set(path, {
          path,
          type: "blob",
          size: encoder.encode(content).length,
        });
      }
      return [...entries.values()].sort((a, b) => a.path.localeCompare(b.path));
    },
    async readFile(_sha, path) {
      return repo.files[path] ?? null;
    },
  };
  if (repo.dates) {
    const dates = repo.dates;
    source.lastCommitDate = async (_sha, path) => dates[path] ?? null;
  }
  return source;
}

function marketplace(plugins: object[]): string {
  return JSON.stringify(
    {
      name: "julianosirtori-skills",
      owner: { name: "Juliano Sirtori" },
      plugins,
    },
    null,
    2,
  );
}

function skillMd(name: string, description: string, extra = ""): string {
  return `---\nname: ${name}\ndescription: ${description}\nlicense: MIT\n${extra}---\n\n# ${name}\n\nInstructions for ${name}.\n\n## Usage\n\nRun it when the description matches.\n`;
}

interface GeneratedSkill {
  name: string;
  category: string;
  keywords: string[];
  description: string;
  date: string;
  scripts?: number;
}

const MANY: GeneratedSkill[] = [
  [
    "git-tidy",
    "productivity",
    ["git", "branches"],
    "Clean up merged branches and stale remotes in a git repository.",
  ],
  [
    "inbox-triage",
    "productivity",
    ["email", "triage"],
    "Sort an exported inbox into reply, read later and archive.",
  ],
  [
    "meeting-notes",
    "productivity",
    ["notes", "meetings"],
    "Turn a raw meeting transcript into decisions and next steps.",
  ],
  [
    "focus-timer",
    "productivity",
    ["timer", "pomodoro"],
    "Plan a work session in focused blocks with short breaks.",
  ],
  [
    "a11y-audit",
    "frontend",
    ["accessibility", "wcag"],
    "Audit a page for keyboard, contrast and screen reader issues.",
  ],
  [
    "css-refactor",
    "frontend",
    ["css", "tailwind"],
    "Refactor legacy CSS into design tokens and utility classes.",
  ],
  [
    "component-docs",
    "frontend",
    ["react", "docs"],
    "Write usage docs for React components from their props.",
  ],
  [
    "bundle-check",
    "frontend",
    ["performance", "webpack"],
    "Find the heaviest modules in a JavaScript bundle.",
  ],
  [
    "pr-description",
    "writing",
    ["github", "review"],
    "Draft a pull request description from the diff and commits.",
  ],
  [
    "changelog-writer",
    "writing",
    ["changelog", "release"],
    "Write a changelog entry from merged pull requests.",
  ],
  [
    "release-notes",
    "writing",
    ["release", "announcement"],
    "Turn a changelog into release notes for users.",
  ],
].map(([name, category, keywords, description], index) => ({
  name: name as string,
  category: category as string,
  keywords: keywords as string[],
  description: description as string,
  date: new Date(Date.UTC(2026, 8, 30 - index)).toISOString(),
  scripts: index % 3 === 0 ? 1 : 0,
}));

function generatedRepo(
  skills: GeneratedSkill[],
  withMacCleanup: boolean,
): MemoryRepo {
  const files: Record<string, string> = {};
  const dates: Record<string, string> = {};
  const plugins: object[] = [];
  if (withMacCleanup) {
    files["skills/mac-cleanup/SKILL.md"] = MAC_CLEANUP_SKILL_MD;
    for (const [path, content] of Object.entries(MAC_CLEANUP_FILES)) {
      files[`skills/mac-cleanup/${path}`] = content;
    }
    dates["skills/mac-cleanup"] = "2026-10-03T04:09:09Z";
    plugins.push(MAC_CLEANUP_PLUGIN);
  }
  for (const skill of skills) {
    files[`skills/${skill.name}/SKILL.md`] = skillMd(
      skill.name,
      skill.description,
      `metadata:\n  version: "0.${skill.keywords.length}.0"\n`,
    );
    for (let i = 1; i <= (skill.scripts ?? 0); i += 1) {
      files[`skills/${skill.name}/scripts/run-${i}.sh`] =
        "#!/usr/bin/env bash\n";
    }
    dates[`skills/${skill.name}`] = skill.date;
    plugins.push({
      name: skill.name,
      source: "./",
      description: skill.description,
      category: skill.category,
      keywords: skill.keywords,
      skills: [`./skills/${skill.name}`],
    });
  }
  files[".claude-plugin/marketplace.json"] = marketplace(plugins);
  return { files, dates };
}

const THIRTY: GeneratedSkill[] = Array.from({ length: 29 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const category = ["productivity", "frontend", "writing"][index % 3];
  return {
    name: `sample-skill-${number}`,
    category,
    keywords: [category, `topic-${number}`],
    description: `Sample skill number ${number} for checking long lists.`,
    date: new Date(Date.UTC(2026, 7, 31 - index)).toISOString(),
  };
});

const INVALID: MemoryRepo = {
  files: {
    "skills/valid-skill/SKILL.md": skillMd(
      "valid-skill",
      "A valid skill that is not listed in any plugin. It still installs with npx.",
    ),
    "skills/name-mismatch/SKILL.md": skillMd(
      "other-name",
      "Name differs from the folder.",
    ),
    "skills/no-description/SKILL.md":
      "---\nname: no-description\nlicense: MIT\n---\n\n# No description\n",
    "skills/no-frontmatter/SKILL.md": "# Missing frontmatter\n",
    "skills/broken-yaml/SKILL.md":
      "---\nname: broken-yaml\ndescription: [unclosed\n---\n\nBody\n",
    "skills/Bad_Name/SKILL.md": skillMd(
      "Bad_Name",
      "Name breaks the spec format.",
    ),
    "skills/.hidden/SKILL.md": skillMd(".hidden", "Dot folders are ignored."),
    "skills/no-skill-md/README.md": "Not a skill.\n",
    ".claude-plugin/marketplace.json": "{ not json",
  },
};

function fixtureRepo(name: Exclude<SkillsFixtureName, "down">): MemoryRepo {
  switch (name) {
    case "empty":
      return { files: { "README.md": "# skills\n" }, dates: {} };
    case "one":
      return generatedRepo([], true);
    case "many":
      return generatedRepo(MANY, true);
    case "thirty":
      return generatedRepo(THIRTY, true);
    case "invalid":
      return INVALID;
  }
}

export function fixtureSource(name: SkillsFixtureName): SkillsSource {
  if (name === "down") {
    const down = () =>
      Promise.reject(new SkillsSourceError("Fixture: GitHub is down", 503));
    return { resolveHead: down, listTree: down, readFile: down };
  }
  return memorySource(fixtureRepo(name));
}
