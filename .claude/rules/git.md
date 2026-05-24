---
description: Git workflow rules for this project
---

## Commits

- **Conventional prefixes**: `feat`, `fix`, `chore`, `test`, `doc`, `refactor`, `ci`, `style`, `perf`
- **Present tense, imperative.** Lowercase after the prefix.
- **No emojis.** Anywhere.
- **No mention of AI, agents, or Claude** in messages or PR descriptions.
- **One logical change per commit.** Small commits, even at the cost of more hook runs.
- **Body explains the why**, not the what. The diff shows the what.
- Use a HEREDOC for multi-line messages to keep formatting:
  ```bash
  git commit -m "$(cat <<'EOF'
  fix: short summary

  - bullet one
  - bullet two
  EOF
  )"
  ```

## Pre-commit hook (Husky)

`.husky/pre-commit` runs:
1. PATH augmentation for `node` / `pnpm` (Windows git ships with a sanitized PATH that hides nvm4w / pnpm globals)
2. `pnpm exec lint-staged` (ESLint + Prettier on staged files)
3. `pnpm test run` (vitest one-shot, which itself runs `pretest` → `contentlayer2 build`)

If the hook fails, fix the underlying issue. **Never** pass `--no-verify` unless the user explicitly asks.

## Staging

- Stage files **explicitly**: `git add path/to/file` — don't `git add .` or `git add -A`. Lockfiles and PDFs sneak in otherwise.
- For large refactors, group staging by topic and commit between groups.

## Branches

- Default working branch is `feat/<topic>`
- PRs open against `main`
- Force-pushing to `main` is forbidden

## PRs (GitHub via `gh` CLI)

- Title ≤ 70 chars
- Body uses the project template: `## Summary` (1–3 bullets) + `## Test plan` (checkboxes)
- When the body is multi-line, write it to a temp file and pass `--body-file`. PowerShell here-strings interact poorly with `gh pr create`.

## Destructive operations

- Confirm with the user before: `git reset --hard`, `git push --force`, deleting branches, `rm -rf` of tracked dirs
- Investigate unfamiliar files / branches before deleting; they may be in-progress work
