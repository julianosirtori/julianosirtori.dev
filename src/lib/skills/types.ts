export interface SkillFile {
  /** Path relative to the skill folder, e.g. `scripts/scan.sh`. */
  path: string;
  /** Size in bytes, as reported by the git tree. */
  size: number;
}

export interface SkillPlugin {
  /** Plugin `name` in `.claude-plugin/marketplace.json`. */
  name: string;
  /** Marketplace `name`, the suffix of `/plugin install <plugin>@<marketplace>`. */
  marketplace: string;
}

export interface Skill {
  /** Folder name, equal to the frontmatter `name`. */
  slug: string;
  /** Full frontmatter `description`, written for the agent. */
  description: string;
  /** Plugin description, or the first sentence of `description`. */
  summary: string;
  version?: string;
  license?: string;
  compatibility?: string;
  /** First sentence of `compatibility` when it fits in 60 characters. */
  compatibilityShort?: string;
  allowedTools: string[];
  category?: string;
  keywords: string[];
  plugin?: SkillPlugin;
  files: SkillFile[];
  /** ISO date of the last commit that touched the folder, when known. */
  updatedAt?: string;
  /** SKILL.md without the frontmatter. */
  body: string;
}

export interface Catalog {
  /** Commit of `main` the catalog was read from. */
  sha: string;
  skills: Skill[];
}

export type CatalogResult =
  | { status: "ok"; catalog: Catalog }
  | { status: "error" };
