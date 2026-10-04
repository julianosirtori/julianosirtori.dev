// Shared by server and client code. Nothing here may touch the network or env.

export const SKILLS_REPO_OWNER = "julianosirtori";
export const SKILLS_REPO_NAME = "skills";
export const SKILLS_REPO = `${SKILLS_REPO_OWNER}/${SKILLS_REPO_NAME}`;
export const SKILLS_BRANCH = "main";
export const SKILLS_DIR = "skills";
export const SKILLS_REPO_URL = `https://github.com/${SKILLS_REPO}`;

/** From this many skills on, the list shows the text and category filters. */
export const SKILLS_FILTER_THRESHOLD = 8;

/** Same rule as `NAME_RE` in the skills repo `scripts/validate.py`. */
export const SKILL_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const SKILL_NAME_MAX_LENGTH = 64;

export function isValidSkillSlug(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= SKILL_NAME_MAX_LENGTH &&
    SKILL_NAME_PATTERN.test(value)
  );
}

/** Folder on `main`, used by "View on GitHub", the copy link and the CLI. */
export function skillFolderUrl(name: string): string {
  return `${SKILLS_REPO_URL}/tree/${SKILLS_BRANCH}/${SKILLS_DIR}/${name}`;
}

/** A path inside the repository pinned to the commit the page was built from. */
export function repoBlobUrl(sha: string, path: string): string {
  return `${SKILLS_REPO_URL}/blob/${sha}/${encodePath(path)}`;
}

export function repoTreeUrl(sha: string, path: string): string {
  return `${SKILLS_REPO_URL}/tree/${sha}/${encodePath(path)}`;
}

export function repoRawUrl(sha: string, path: string): string {
  return `https://raw.githubusercontent.com/${SKILLS_REPO}/${sha}/${encodePath(path)}`;
}

function encodePath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}
