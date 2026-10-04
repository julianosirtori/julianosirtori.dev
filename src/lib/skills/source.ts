export interface RepoTreeEntry {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

/**
 * Where the catalog reads the skills repository from. Production uses GitHub;
 * tests and e2e use an in-memory fixture through the same interface, so both
 * go through the same validation and parsing.
 */
export interface SkillsSource {
  /** Commit SHA the default branch points to. */
  resolveHead(): Promise<string>;
  /** Every entry of the tree at `sha`, recursively. */
  listTree(sha: string): Promise<RepoTreeEntry[]>;
  /** File contents at `sha`, or null when the file does not exist. */
  readFile(sha: string, path: string): Promise<string | null>;
  /** Date of the last commit that touched `path`. Absent when it would cost API calls we cannot afford. */
  lastCommitDate?: (sha: string, path: string) => Promise<string | null>;
}

export class SkillsSourceError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "SkillsSourceError";
  }
}
