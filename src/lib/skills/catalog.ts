import "server-only";

import { cookies } from "next/headers";
import { connection } from "next/server";
import { unstable_cache } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { cache } from "react";

import { CATALOG_FORMAT_VERSION, buildCatalog } from "./build";
import {
  fixtureSource,
  isSkillsFixtureName,
  type SkillsFixtureName,
} from "./fixtures";
import { githubSource } from "./github";
import type { Catalog, CatalogResult, Skill } from "./types";

/** Invalidated by the GitHub webhook in /api/webhooks/skills. */
export const SKILLS_CACHE_TAG = "skills-catalog";
/** Without the webhook, a new skill shows up within this window. */
export const SKILLS_REVALIDATE_SECONDS = 3600;

export const SKILLS_FIXTURE_COOKIE = "skills-fixture";

const warned = new Set<string>();
function warnOnce(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(message);
}

/**
 * Fixture mode: `SKILLS_FIXTURE=<name>` feeds the catalog from a fixed dataset
 * instead of GitHub. It is ignored on Vercel (Preview and Production), so a
 * stray variable in the project settings can never replace the real catalog.
 */
export function fixtureModeDefault(): SkillsFixtureName | null {
  const value = process.env.SKILLS_FIXTURE;
  if (!value) return null;
  if (process.env.VERCEL) {
    warnOnce("[skills] SKILLS_FIXTURE is ignored on Vercel deployments");
    return null;
  }
  if (!isSkillsFixtureName(value)) {
    warnOnce(
      `[skills] unknown SKILLS_FIXTURE "${value}"; reading GitHub instead`,
    );
    return null;
  }
  return value;
}

/**
 * In fixture mode, a `skills-fixture` cookie picks another dataset for one
 * request, so a single e2e server can cover every scenario.
 */
async function activeFixture(
  allowRequestOverride: boolean,
): Promise<SkillsFixtureName | null> {
  const fallback = fixtureModeDefault();
  if (!fallback || !allowRequestOverride) return fallback;
  const requested = (await cookies()).get(SKILLS_FIXTURE_COOKIE)?.value;
  return isSkillsFixtureName(requested) ? requested : fallback;
}

/**
 * Successful reads are cached for an hour under SKILLS_CACHE_TAG. A failed read
 * throws, so nothing is stored: a cold cache retries on the next request, and
 * a stale entry keeps being served while unstable_cache revalidates it in the
 * background (it swallows the failure and returns the stale value).
 */
const readGithubCatalog = unstable_cache(
  async (): Promise<Catalog> => buildCatalog(githubSource()),
  ["skills-catalog", CATALOG_FORMAT_VERSION],
  { revalidate: SKILLS_REVALIDATE_SECONDS, tags: [SKILLS_CACHE_TAG] },
);

const loadCatalog = cache(
  async (allowRequestOverride: boolean): Promise<CatalogResult> => {
    // The catalog is only ever read at request time, so `next build` never
    // calls GitHub and an outage cannot fail a build or a deploy.
    await connection();
    const fixture = await activeFixture(allowRequestOverride);
    try {
      const catalog = fixture
        ? await buildCatalog(fixtureSource(fixture))
        : await readGithubCatalog();
      return { status: "ok", catalog };
    } catch (error) {
      unstable_rethrow(error);
      console.error(
        `[skills] catalog unavailable: ${error instanceof Error ? error.message : String(error)}`,
      );
      return { status: "error" };
    }
  },
);

export interface CatalogOptions {
  /** Honor the fixture cookie. Off for routes without a user request (sitemap). */
  allowRequestOverride?: boolean;
}

export function getCatalogResult(
  options: CatalogOptions = {},
): Promise<CatalogResult> {
  return loadCatalog(options.allowRequestOverride ?? true);
}

export function findSkill(catalog: Catalog, slug: string): Skill | undefined {
  return catalog.skills.find((skill) => skill.slug === slug);
}
