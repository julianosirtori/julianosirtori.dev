import "server-only";

import { unstable_cache } from "next/cache";

import { renderSkillMarkdown, type RenderedSkillMarkdown } from "./markdown";
import type { Skill } from "./types";

/**
 * The rendered tree is keyed by commit, slug and body, so a cached entry can
 * never be out of date. Caching it skips shiki on every detail request.
 */
const renderCached = unstable_cache(
  async (
    slug: string,
    sha: string,
    body: string,
    files: string[],
  ): Promise<RenderedSkillMarkdown> =>
    renderSkillMarkdown(body, { slug, sha, files }),
  ["skill-markdown", "v1"],
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
