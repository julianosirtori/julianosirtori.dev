# design-sync notes — julianosirtori.dev

This repo is a **Next.js 16 application, not a packaged component library**. There is
no `dist/` and no `.d.ts` exports, so the bundle is built from a **hand-authored entry**
(`.design-sync/ds-entry.tsx`) that re-exports the site's presentational components plus a
`PreviewProvider`. The converter runs with `--entry ./.design-sync/ds-entry.tsx` and
`componentSrcMap` pins each component's source for prop extraction / grouping / docs.

## Build / re-sync recipe (run from repo root)

1. Install deps if fresh clone: `pnpm i --frozen-lockfile`, then `pnpm exec contentlayer2 build` (generates `.contentlayer/generated`, needed by the `contentlayer/generated` alias and Mdx preview).
2. Re-copy staged scripts (per base SKILL.md) and `npm i` the `.ds-sync` deps incl. `@tailwindcss/cli` and `playwright@1.60.0` (chromium-1223 is in the ms-playwright cache; install with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`).
3. **Recompile the Tailwind stylesheet** (the app generates utility CSS on demand, so none ships statically):
   `.ds-sync/node_modules/.bin/tailwindcss -i .design-sync/tw-input.css -o .design-sync/compiled.css`
   `cfg.cssEntry` points at `compiled.css` (gitignored, regenerated each sync). `tw-input.css` imports `globals.css`, declares `@source ../src` + `@source ../.design-sync/previews`, and maps `--font-geist-sans/-mono` to the shipped @font-face families.
4. Build: `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./.design-sync/ds-entry.tsx --out ./ds-bundle`
5. Validate: `node .ds-sync/package-validate.mjs ./ds-bundle`

## Why the stubs exist (`.design-sync/stubs/`, wired via `cfg.tsconfig` = `tsconfig.ds.json`)

`tsconfig.ds.json` is a design-sync-only path map fed to the esbuild paths plugin. It is
NOT named `tsconfig.json`, so esbuild's native discovery still reads the real
`tsconfig.json` for `@/` and `jsx: react-jsx`. **Do not add `@/*` to it** — that breaks
barrel-directory resolution (the plugin's `''` ext matches a directory and esbuild can't
read it); let native discovery handle `@/`.

- `next-navigation.ts` — App Router hooks (`usePathname`/`useRouter`) throw outside Next's runtime. Inert stub so Header / CommandBar / `@/locales/navigation` render. Navigation is a no-op in a static card.
- `framer-motion.ts` — entrance animations from `initial={{opacity:0}}` don't settle in headless capture (ProjectCard's `motion.a` went invisible). Stub renders each `motion.<tag>` at its FINAL visual state (animation props stripped). **Side effect:** the shipped bundle's components don't animate. `useScroll`/`useSpring` return static 0 — this is why ReadingProgress (a scroll-progress bar) cannot be previewed.
- `empty.ts` — Node builtins (`fs`/`stream`/`zlib`) pulled transitively into the client graph by `next/dist/compiled/gzip-size`. Inert; never executed on the preview path.
- `contentlayer/generated` aliased to `.contentlayer/generated/index.mjs` (the plugin's ext list lacks `.mjs`, so the real generated file wouldn't resolve otherwise).

`.design-sync/ds-polyfills.ts` is imported FIRST by the entry — defines `globalThis.process`
before any bundled lib evaluates (`process.env.*` beyond NODE_ENV throws otherwise, aborting
the whole IIFE).

## PreviewProvider (in `ds-entry.tsx`)

Supplies next-intl (locale `en`, all locale JSON namespaces) + next-themes (light). It does
**NOT** supply `CommandBarContext`. Any component calling `useCommandBar()` (Header's cmdk
trigger, ButtonTapToStart) must be wrapped in `<CommandBar>` inside its preview — CommandBar
provides the context and renders children with the dialog closed. `useCommandBar` is exported
from the entry so previews can open the palette from inside the context.

## Floor cards (deliberate baseline — not failures)

- **TemplateEmail** — react-email document (`<Html>`); the client `createRoot` mount hoists the nested `<html>` out of the cell. Not preview-fixable without an iframe-srcdoc harness. Falls back to the default render (the email field labels).
- **ReadingProgress** — scroll-progress bar; `scaleX` comes from `useScroll` (stubbed to 0). Not statically previewable.
- **Toast** — Radix Toast is transient/fixed-position; controlled `open` from initial render doesn't settle in the solo `?story=` capture.
- **BackToTop** — only appears past `scrollY > 500`; the forced-scroll trick doesn't surface the fixed button in the solo capture.

## Authored-preview notes

- Previews import from `"julianosirtori.dev"` (shimmed to `window.JulianoDS`). Use INLINE styles for wrappers; every Tailwind class used anywhere in `src/` is already in `compiled.css`, so do not introduce NEW utility classes in previews (they won't be compiled unless you recompile with the previews dir in `@source`).
- Blog components import real posts: `import { allPosts } from "contentlayer/generated"` then `.filter(p => p.language === "en")`. Real EN posts have NO `categories`/`tags` — BlogSearch's filter pills need them, so its preview injects a synthetic `categories` field onto real posts (component reads only title/slug/date/readTime/categories).
- Figure: omit `width`/`height` to take the plain `<img>` branch (next/image won't resolve statically).
- `cfg.overrides` viewport widening: TableOfContents (xl sidebar), Header (full nav), CommandBar (open palette).

## Components shipped on the default render (not authored, render-check clean)

Terminal, FeaturedProjects, ContactForm, Reactions — render fully with zero/default props
(internal data), so they ship the default render rather than an authored preview.

## Known render warns

- TemplateEmail/ReadingProgress/Toast/BackToTop show the typographic floor card. Expected.
- Comments mounts a live Giscus iframe (network-dependent); a no-network capture renders thinner. Acceptable.

## Re-sync risks (watch-list)

- **`compiled.css` is generated** — must recompile Tailwind (step 3) before each build, or component styles silently regress to whatever was last on disk. It is gitignored.
- **Stubs are tied to upstream APIs** — if next/navigation, framer-motion, or next-intl's navigation surface changes (major bump), the stubs may need new exports. Symptom: previews fail "Element type is invalid" or a hook returns undefined.
- **`process` polyfill / node-builtin stubs** assume nothing in the graph actually executes those at render. A new dependency that calls `fs`/`zlib` at render would surface as a runtime error.
- **BlogSearch categories are synthetic** in the preview; if real posts gain categories, drop the injection.
- **Geist fonts** are copied from `node_modules/geist/dist/fonts` (variable woff2). If the geist package restructures, `fonts.css` url() paths break (`[FONT_MISSING]`/`[FONT_DANGLING]`).
- **Animations are stripped** bundle-wide (framer-motion stub). If a future need requires real animation in designs, the stub would have to become preview-only (not currently supported by the shared paths plugin).
