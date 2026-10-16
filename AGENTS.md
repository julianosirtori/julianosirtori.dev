# AGENTS.md

Bilingual (EN/PT) personal site and blog: Next.js 16 App Router, Tailwind v4, contentlayer2 MDX, next-intl, Turso/libSQL with Drizzle, Better Auth. Setup for humans is in [README.md](README.md).

## Commands

Use pnpm only (`packageManager: pnpm@11`, Node 22 from `.nvmrc`).

| Task | Command |
|---|---|
| Install | `pnpm install --frozen-lockfile` |
| Database (local) | `pnpm db:migrate` (needs `TURSO_DATABASE_URL`, `file:./local.db` locally) |
| Dev server | `pnpm dev` |
| Lint | `pnpm lint` (zero warnings allowed) |
| Unit tests, once | `pnpm test run` |
| One test file | `pnpm test run src/lib/analytics.test.ts` |
| Build | `pnpm build` |
| E2E | `pnpm exec playwright test --project=chromium` |
| New migration | edit `src/lib/db/schema.ts`, then `pnpm db:generate` |

Before finishing: `pnpm lint` and `pnpm test run`. The pre-commit hook runs lint-staged (eslint --fix, prettier) and `pnpm test run`; CI also runs `pnpm build` and the Playwright suite.

## Gotchas

- `pnpm test` without `run` starts Vitest in watch mode and never exits.
- `pretest` and `prebuild` run `contentlayer2 build`, which creates `.contentlayer/generated` (imported as `contentlayer/generated`). Calling `vitest` or `next build` directly skips it.
- The database client throws when `TURSO_DATABASE_URL` is unset. Copy `.env.example` to `.env.local` and run `pnpm db:migrate` before `pnpm dev` or the tests. CI uses `file:./test.db`.
- Playwright starts its own server with `SKILLS_FIXTURE=one`, so the skills catalog reads `src/lib/skills/fixtures/` instead of GitHub. Fixture modes: `empty|one|many|thirty|invalid|down`; ignored on Vercel.
- The skills catalog reads GitHub only at request time (`connection()`, `unstable_cache` tagged `skills-catalog`). Builds never call GitHub; `POST /api/webhooks/skills` revalidates the tag.
- `turbopackFileSystemCacheForDev: false` in `next.config.mjs` is deliberate: the cache made existing articles and API routes return 404. Don't re-enable it.
- `.husky/pre-commit` adds node/pnpm to PATH for Windows git hooks. Keep those lines.
- The playground terminal keeps its own dark palette, independent of the site theme.

## Conventions

- Every copy change ships in both languages: `src/locales/{en,pt}/*.json` and `content/{en,pt}/*.mdx`. `docs/voice-guide.md` is binding: no em dashes, no exclamations, no clichés; rewrite between EN and PT instead of translating.
- Components live in `src/components/Name/` (`Name.tsx` + `index.ts`) and are imported from `@/components/Name`. Server components by default; add `"use client"` only for interactivity.
- Tests sit next to the code as `*.test.ts(x)` under `src/`. Mock `framer-motion` in tests that render motion components. In `e2e/`, use stable selectors (`a[href*="/blog/"]`, `button[aria-label="..."]`), not positions.
- Tailwind v4 is configured CSS-first in `src/app/globals.css`; there is no `tailwind.config`. New code uses the semantic tokens (`bg-bg`, `text-fg`, `text-fg-muted`, `border-border`, `text-accent`...). The legacy aliases (`text-primary`, `text-cyan`...) exist only for older components.
- localStorage goes through `createStorage(namespace)` from `src/utils/storage.ts` (SSR-safe, quota-tolerant).
- Analytics events and params form a closed list in `src/lib/analytics.ts`: add new ones there, and never send form values.
- Blog frontmatter and computed fields are defined in `contentlayer.config.js`.
- Terminal commands carry their own bilingual `description` in their `CommandDef`; don't duplicate it elsewhere.
- Skill pages render SKILL.md as GFM, never MDX, and raw HTML goes through `rehype-sanitize` first. Skill validation mirrors the validator of the [julianosirtori/skills](https://github.com/julianosirtori/skills) repo, not a script in this one.

## Boundaries

- Ask first: database schema changes and migrations against remote Turso databases (see `docs/phase-2/turso.md`), rotating `BETTER_AUTH_SECRET` or `NEWSLETTER_SECRET` (it breaks stored tokens and unsubscribe links), new dependencies, and changes to `.github/workflows/` (`cd.yml` deploys to production).
- Never: commit `.env.local` or real keys, put a secret in a `NEXT_PUBLIC_` variable, give CI real provider keys (providers are mocked in tests), or run `newsletter:retry`, `audience:status` or `ga4:setup` against production unless asked.

## Commits

Conventional commits (`feat:`, `fix:`, `chore:`, `test:`, `doc:`, `refactor:`): imperative, lowercase, no emojis, one logical change per commit.

## More context

- `docs/phase-2/operations.md`: newsletter, guestbook, reactions, env vars and launch steps (Portuguese). `turso.md`, `oauth.md`, `resend.md` and `security.md` in the same folder cover each service.
- `docs/prd/`: product specs, including the skills catalog.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
