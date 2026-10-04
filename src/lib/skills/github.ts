import "server-only";

import { SKILLS_BRANCH, SKILLS_REPO, repoRawUrl } from "@/lib/skills/constants";
import {
  SkillsSourceError,
  type RepoTreeEntry,
  type SkillsSource,
} from "@/lib/skills/source";

const API = `https://api.github.com/repos/${SKILLS_REPO}`;
const TIMEOUT_MS = 8000;

/**
 * Call budget per refresh: two REST calls (head SHA and recursive tree). Files
 * come from raw.githubusercontent.com pinned to the SHA, which does not count
 * against the REST limit and skips the branch CDN cache, so a webhook refresh
 * never reads stale content. Update dates cost one REST call per skill, so they
 * are only fetched with a token.
 */
export function githubSource(
  token = process.env.SKILLS_GITHUB_TOKEN,
): SkillsSource {
  const headers = (accept: string): HeadersInit => ({
    Accept: accept,
    "User-Agent": "julianosirtori.dev skills catalog",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  async function request(url: string, accept: string) {
    let response: Response;
    try {
      response = await fetch(url, {
        headers: headers(accept),
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new SkillsSourceError(
        `GitHub request failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return response;
  }

  async function expectOk(response: Response, what: string) {
    if (!response.ok) {
      throw new SkillsSourceError(
        `GitHub ${what} responded ${response.status}`,
        response.status,
      );
    }
    return response;
  }

  const source: SkillsSource = {
    async resolveHead() {
      const response = await expectOk(
        await request(
          `${API}/commits/${SKILLS_BRANCH}`,
          "application/vnd.github.sha",
        ),
        "head",
      );
      const sha = (await response.text()).trim();
      if (!/^[0-9a-f]{40}$/.test(sha)) {
        throw new SkillsSourceError("GitHub head is not a commit SHA");
      }
      return sha;
    },

    async listTree(sha) {
      const response = await expectOk(
        await request(
          `${API}/git/trees/${sha}?recursive=1`,
          "application/vnd.github+json",
        ),
        "tree",
      );
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("tree" in data)) {
        throw new SkillsSourceError("GitHub tree has an unexpected shape");
      }
      const { tree, truncated } = data as {
        tree: unknown;
        truncated?: boolean;
      };
      if (truncated) {
        console.warn(
          "[skills] GitHub tree was truncated; some skills may be missing",
        );
      }
      if (!Array.isArray(tree)) {
        throw new SkillsSourceError("GitHub tree has an unexpected shape");
      }
      return tree.flatMap((entry): RepoTreeEntry[] => {
        if (!entry || typeof entry !== "object") return [];
        const { path, type, size } = entry as Record<string, unknown>;
        if (typeof path !== "string") return [];
        if (type !== "blob" && type !== "tree") return [];
        return [
          { path, type, size: typeof size === "number" ? size : undefined },
        ];
      });
    },

    async readFile(sha, path) {
      const response = await request(repoRawUrl(sha, path), "text/plain");
      if (response.status === 404) return null;
      await expectOk(response, `file ${path}`);
      return response.text();
    },
  };

  if (token) {
    source.lastCommitDate = async (sha, path) => {
      const response = await expectOk(
        await request(
          `${API}/commits?sha=${sha}&path=${encodeURIComponent(path)}&per_page=1`,
          "application/vnd.github+json",
        ),
        "commits",
      );
      const data: unknown = await response.json();
      if (!Array.isArray(data) || !data.length) return null;
      const date = (data[0] as { commit?: { committer?: { date?: unknown } } })
        .commit?.committer?.date;
      return typeof date === "string" ? date : null;
    };
  }

  return source;
}
