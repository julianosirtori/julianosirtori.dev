import "server-only";

import { unstable_cache } from "next/cache";

import {
  SKILL_MARKDOWN_VERSION,
  renderSkillMarkdown,
  type RenderedSkillMarkdown,
} from "./markdown";
import type { Skill } from "./types";

/**
 * The rendered tree is keyed by pipeline version, commit, slug and body, so a
 * cached entry is never out of date. Caching it skips shiki on every request.
 */
const renderCached = unstable_cache(
  async (
    slug: string,
    sha: string,
    body: string,
    files: string[],
  ): Promise<RenderedSkillMarkdown> =>
    renderSkillMarkdown(body, { slug, sha, files }),
  ["skill-markdown", SKILL_MARKDOWN_VERSION],
  { revalidate: 60 * 60 * 24 * 30 },
);

export function getSkillMarkdown(
  skill: Skill,
  sha: string,
): Promise<RenderedSkillMarkdown> {
  return renderCached(
    skill.slug,
    sha,
    skill.body,
    skill.files.map((file) => file.path),
  );
}
