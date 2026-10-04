import { SKILLS_DIR, isValidSkillSlug } from "./constants";
import {
  shortCompatibility,
  summaryFromDescription,
  validateSkillFile,
} from "./frontmatter";
import {
  parseMarketplace,
  pluginForSkill,
  type Marketplace,
} from "./marketplace";
import { SkillsSourceError, type SkillsSource } from "./source";
import type { Catalog, Skill, SkillFile, SkillPlugin } from "./types";

/**
 * Part of the catalog cache key. Bump it whenever buildCatalog's output
 * changes (shape, parsing or validation); the Data Cache outlives deploys.
 */
export const CATALOG_FORMAT_VERSION = "v2";

const MARKETPLACE_PATH = ".claude-plugin/marketplace.json";
/** validate.py caps SKILL.md at 500 lines; anything this large is not a skill. */
const MAX_SKILL_MD_BYTES = 256 * 1024;
const CONCURRENCY = 6;

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
}

/**
 * The plugin option is shown only when both names are kebab-case, the format
 * Claude Code requires. Anything else would put a broken or misleading
 * `/plugin install <plugin>@<marketplace>` on the page.
 */
export function installablePlugin(
  plugin: { name: string } | undefined,
  marketplaceName: string | undefined,
  where: string,
): SkillPlugin | undefined {
  if (!plugin || !marketplaceName) return undefined;
  if (!isValidSkillSlug(plugin.name) || !isValidSkillSlug(marketplaceName)) {
    console.warn(
      `[skills] ${where}: plugin "${plugin.name}" or marketplace "${marketplaceName}" is not kebab-case; hiding the plugin install`,
    );
    return undefined;
  }
  return { name: plugin.name, marketplace: marketplaceName };
}

/** Most recently updated first; skills without a date go after, alphabetically. */
export function sortSkills(skills: Skill[]): Skill[] {
  return [...skills].sort((a, b) => {
    if (a.updatedAt && b.updatedAt && a.updatedAt !== b.updatedAt) {
      return b.updatedAt.localeCompare(a.updatedAt);
    }
    if (a.updatedAt && !b.updatedAt) return -1;
    if (!a.updatedAt && b.updatedAt) return 1;
    return a.slug.localeCompare(b.slug);
  });
}

/**
 * Reads `main` once and turns it into the catalog. Throws on any failure that
 * would leave the catalog partial (head, tree, a SKILL.md), so the caller never
 * caches a broken read. Invalid skills are skipped with a warning.
 */
export async function buildCatalog(source: SkillsSource): Promise<Catalog> {
  const sha = await source.resolveHead();
  const tree = await source.listTree(sha);

  const prefix = `${SKILLS_DIR}/`;
  const folders = new Map<
    string,
    { skillMdSize?: number; files: SkillFile[] }
  >();
  for (const entry of tree) {
    if (entry.type !== "blob" || !entry.path.startsWith(prefix)) continue;
    const [folder, ...rest] = entry.path.slice(prefix.length).split("/");
    if (!folder || !rest.length) continue;
    const bucket = folders.get(folder) ?? { files: [] };
    const path = rest.join("/");
    bucket.files.push({ path, size: entry.size ?? 0 });
    if (path === "SKILL.md") bucket.skillMdSize = entry.size ?? 0;
    folders.set(folder, bucket);
  }

  let marketplace: Marketplace | null = null;
  const rawMarketplace = await source.readFile(sha, MARKETPLACE_PATH);
  if (rawMarketplace !== null) {
    marketplace = parseMarketplace(rawMarketplace);
    if (!marketplace) {
      console.warn(
        `[skills] ${MARKETPLACE_PATH} is not valid JSON; ignoring it`,
      );
    }
  }

  const candidates = [...folders.entries()].filter(
    ([folder, bucket]) =>
      !folder.startsWith(".") && bucket.skillMdSize !== undefined,
  );

  const skills = await mapLimit(
    candidates,
    CONCURRENCY,
    async ([folder, bucket]): Promise<Skill | null> => {
      const where = `${SKILLS_DIR}/${folder}`;
      if ((bucket.skillMdSize ?? 0) > MAX_SKILL_MD_BYTES) {
        console.warn(`[skills] skipped ${where}: SKILL.md is too large`);
        return null;
      }
      const text = await source.readFile(sha, `${where}/SKILL.md`);
      if (text === null) {
        throw new SkillsSourceError(`${where}/SKILL.md disappeared at ${sha}`);
      }
      const result = validateSkillFile(folder, text);
      if (!result.ok) {
        console.warn(`[skills] skipped ${where}: ${result.reason}`);
        return null;
      }
      for (const warning of result.warnings) {
        console.warn(`[skills] ${where}: ${warning}`);
      }

      const { frontmatter } = result;
      const plugin = pluginForSkill(marketplace, folder);
      return {
        slug: folder,
        description: frontmatter.description,
        summary:
          plugin?.description ??
          summaryFromDescription(frontmatter.description),
        version: frontmatter.version ?? plugin?.version,
        license: frontmatter.license,
        compatibility: frontmatter.compatibility,
        compatibilityShort: shortCompatibility(frontmatter.compatibility),
        allowedTools: frontmatter.allowedTools,
        category: plugin?.category,
        keywords: plugin?.keywords ?? [],
        plugin: installablePlugin(plugin, marketplace?.name, where),
        files: [...bucket.files].sort((a, b) => a.path.localeCompare(b.path)),
        body: result.body,
      };
    },
  );

  const valid = skills.filter((skill): skill is Skill => skill !== null);

  const { lastCommitDate } = source;
  if (lastCommitDate) {
    await mapLimit(valid, CONCURRENCY, async (skill) => {
      try {
        const date = await lastCommitDate(sha, `${SKILLS_DIR}/${skill.slug}`);
        if (date) skill.updatedAt = date;
      } catch (error) {
        // Dates are optional; a failed lookup must not drop the catalog.
        console.warn(
          `[skills] no update date for ${skill.slug}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    });
  }

  return { sha, skills: sortSkills(valid) };
}

export function countFilesIn(skill: Pick<Skill, "files">, dir: string): number {
  return skill.files.filter((file) => file.path.startsWith(`${dir}/`)).length;
}
