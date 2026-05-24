import { visibleCommandNames } from "./commands";
import { listDir } from "./fs";
import { Cwd } from "./types";

interface CompleteResult {
  completed: string;
  options: string[];
}

const FS_AWARE = new Set(["cd", "ls", "cat"]);

export function autocomplete(input: string, cwd: Cwd): CompleteResult {
  const trailingSpace = input.endsWith(" ");
  const tokens = input.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return { completed: input, options: visibleCommandNames };
  }

  if (tokens.length === 1 && !trailingSpace) {
    return completeFrom(tokens[0], visibleCommandNames, input);
  }

  if (FS_AWARE.has(tokens[0])) {
    const partial = trailingSpace ? "" : tokens[tokens.length - 1];
    const entries = listDir(cwd).map((e) =>
      e.kind === "dir" ? `${e.name}/` : e.name,
    );
    return completeFrom(partial, entries, input);
  }

  return { completed: input, options: [] };
}

function completeFrom(
  partial: string,
  pool: string[],
  fullInput: string,
): CompleteResult {
  const matches = pool.filter((opt) => opt.startsWith(partial));
  if (matches.length === 0) return { completed: fullInput, options: [] };
  if (matches.length === 1) {
    const replaced = replaceLastToken(fullInput, matches[0]);
    return { completed: replaced + " ", options: [] };
  }
  const common = commonPrefix(matches);
  const completed =
    common.length > partial.length
      ? replaceLastToken(fullInput, common)
      : fullInput;
  return { completed, options: matches };
}

function replaceLastToken(input: string, replacement: string): string {
  const m = input.match(/^(.*?)([^\s]*)$/);
  if (!m) return input;
  return m[1] + replacement;
}

function commonPrefix(items: string[]): string {
  if (items.length === 0) return "";
  let prefix = items[0];
  for (let i = 1; i < items.length; i++) {
    while (!items[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}
