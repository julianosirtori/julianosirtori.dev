// `.claude-plugin/marketplace.json` is optional enrichment. When it is missing
// or broken, skills still show up, only without the Claude Code plugin option,
// the category and the short human description.

import { SKILLS_DIR } from "./constants";

export interface MarketplacePlugin {
  name: string;
  description?: string;
  version?: string;
  category?: string;
  keywords: string[];
  /** Skill folders the plugin ships, normalized to `skills/<folder>`. */
  skills: string[];
}

export interface Marketplace {
  /** Marketplace name, used as `/plugin install <plugin>@<name>`. */
  name?: string;
  plugins: MarketplacePlugin[];
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** `./skills/foo/`, `skills/foo` and `./plugin/../skills/foo` all become `skills/foo`. */
export function normalizeRepoPath(path: string): string {
  const out: string[] = [];
  for (const segment of path.replace(/\\/g, "/").split("/")) {
    if (!segment || segment === ".") continue;
    if (segment === "..") out.pop();
    else out.push(segment);
  }
  return out.join("/");
}

export function parseMarketplace(raw: string): Marketplace | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const record = data as Record<string, unknown>;
  const plugins = Array.isArray(record.plugins) ? record.plugins : [];

  return {
    name: text(record.name),
    plugins: plugins.flatMap((item): MarketplacePlugin[] => {
      if (!item || typeof item !== "object") return [];
      const plugin = item as Record<string, unknown>;
      const name = text(plugin.name);
      if (!name) return [];
      // Skill paths are relative to the plugin source, which is the repo root
      // ("./") for this marketplace.
      const source = text(plugin.source) ?? "./";
      const skills = Array.isArray(plugin.skills) ? plugin.skills : [];
      return [
        {
          name,
          description: text(plugin.description),
          version: text(plugin.version),
          category: text(plugin.category),
          keywords: Array.isArray(plugin.keywords)
            ? plugin.keywords.filter(
                (keyword): keyword is string =>
                  typeof keyword === "string" && keyword.trim() !== "",
              )
            : [],
          skills: skills
            .filter((skill): skill is string => typeof skill === "string")
            .map((skill) => normalizeRepoPath(`${source}/${skill}`)),
        },
      ];
    }),
  };
}

/** The plugin whose `skills` array lists `./skills/<folder>`. */
export function pluginForSkill(
  marketplace: Marketplace | null,
  folder: string,
): MarketplacePlugin | undefined {
  const target = `${SKILLS_DIR}/${folder}`;
  return marketplace?.plugins.find((plugin) => plugin.skills.includes(target));
}
