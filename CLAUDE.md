# CLAUDE.md - AI Assistant Guide for julianosirtori.dev

This document provides guidance for AI assistants working with this codebase.

## Project Overview

**julianosirtori.dev** is a personal blog and portfolio for Juliano Sirtori (front-end engineer). It is a bilingual (EN/PT) Next.js 16 application featuring:

- Editorial light/dark theme with semantic Tailwind v4 tokens
- MDX blog with TOC sidebar, prev/next navigation, related posts, custom MDX components
- Project showcases, contact form, guestbook, now page
- Command palette (`cmdk`) with `⌘K` / `Ctrl+K`
- Interactive `/playground` terminal with ~30 commands, Snake mini-game, Matrix overlay
- Konami code easter egg + console greeting

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 6 |
| UI | React 19 |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Theme | next-themes (light/dark via `.dark` class) |
| Fonts | Geist Sans + Geist Mono (`geist` package) |
| Command palette | cmdk + Radix Dialog |
| Content | contentlayer2 + MDX + github-slugger (TOC) |
| i18n | next-intl 4 (EN default, PT bilingual) |
| Email | Resend + React Email |
| Animations | Framer Motion 12 |
| Unit tests | Vitest 4 + @testing-library/react (jsdom) |
| E2E | Playwright (chromium) |
| Package manager | pnpm |
| Node version | 22 (CI), 20+ locally |

## Quick Commands

```bash
pnpm dev          # next dev --turbopack (localhost:3000)
pnpm build        # next build  (runs `prebuild` → contentlayer2 build first)
pnpm start        # next start
pnpm lint         # eslint . --max-warnings 0
pnpm test         # vitest  (runs `pretest` → contentlayer2 build first)
pnpm test:e2e     # playwright test
pnpm test:e2e:ui  # playwright test --ui
```

The `prebuild` and `pretest` hooks run `contentlayer2 build` so a fresh checkout has `.contentlayer/generated` available before next build or vitest transforms.

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── [lang]/                  # Localized pages (en, pt)
│   │   │   ├── page.tsx             # Home
│   │   │   ├── about/
│   │   │   ├── blog/                # Blog listing + [slug] posts
│   │   │   ├── contact/
│   │   │   ├── guestbook/
│   │   │   ├── now/
│   │   │   ├── playground/          # Interactive terminal
│   │   │   ├── projects/
│   │   │   ├── layout.tsx           # Wraps in ThemeProvider, CommandBar, KonamiEgg, ConsoleGreeting
│   │   │   ├── opengraph-image.tsx  # OG image generator (editorial style)
│   │   │   └── blog/[slug]/opengraph-image.tsx
│   │   ├── api/email/               # Email API (server-validated)
│   │   ├── fonts/                   # geist re-exports
│   │   ├── globals.css              # Tailwind v4 @theme + semantic tokens + light/dark
│   │   ├── layout.tsx               # Root layout
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── BackToTop/
│   │   ├── BlogSearch/
│   │   ├── CommandBar/              # cmdk + Radix Dialog + useCommandBar context
│   │   ├── Comments/                # Giscus
│   │   ├── ConsoleGreeting/         # ASCII greeting + playground hint on mount
│   │   ├── ContactForm/
│   │   ├── FeaturedProjects/
│   │   ├── Footer/
│   │   ├── Guestbook/               # uses safe storage util
│   │   ├── Header/                  # Wordmark, nav, CV, lang, ThemeToggle, cmdk trigger
│   │   ├── KonamiEgg/               # Global keydown listener
│   │   ├── LatestPosts/
│   │   ├── Mdx/                     # Mdx.tsx + Callout, Quote, Aside, Figure
│   │   ├── PostNavigation/          # prev/next links
│   │   ├── ProjectCard/
│   │   ├── Reactions/               # uses safe storage util
│   │   ├── ReadingProgress/
│   │   ├── RelatedPosts/            # by shared tags/categories
│   │   ├── TableOfContents/         # sticky sidebar + mobile drawer + IntersectionObserver
│   │   ├── TechStack/
│   │   ├── TemplateEmail/
│   │   ├── Terminal/                # See "Playground" section below
│   │   ├── ThemeProvider/           # next-themes wrapper
│   │   ├── ThemeToggle/             # 3-state cycle (system/light/dark)
│   │   └── Toast/
│   ├── data/                        # Static data (projects, experiences, featured-projects)
│   ├── locales/                     # i18n translations
│   │   ├── en/                      # global, home, blog, about, contacts, projects, guestbook, now, playground
│   │   └── pt/                      # same set
│   ├── utils/
│   │   └── storage.ts               # Safe namespaced localStorage wrapper
│   └── middleware.ts                # next-intl routing
├── content/
│   ├── en/                          # English MDX articles
│   └── pt/                          # Portuguese MDX articles
├── public/
│   └── Juliano_Sirtori_Resume.pdf
├── __tests__/                       # Vitest unit tests (mirror src structure)
│   ├── components/
│   │   ├── Terminal/                # parser, pipe, levenshtein, autocomplete, registry, commands
│   │   ├── KonamiEgg.test.tsx
│   │   ├── TableOfContents.test.tsx
│   │   ├── Mdx.test.tsx
│   │   ├── BlogSearch.test.tsx
│   │   ├── BackToTop.test.tsx
│   │   ├── CodeBlock.test.tsx
│   │   ├── Reactions.test.tsx
│   │   └── TechStack.test.tsx
│   └── example.test.tsx
├── e2e/                             # Playwright tests
│   ├── about.spec.ts
│   ├── blog.spec.ts
│   ├── contact.spec.ts
│   ├── home.spec.ts
│   ├── i18n.spec.ts
│   ├── navigation.spec.ts
│   ├── projects.spec.ts
│   └── seo.spec.ts
├── docs/
│   ├── prd/                         # Product requirement docs (rebrand, blog, playground)
│   └── voice-guide.md               # Writing voice rules (bilingual)
├── .husky/
│   └── pre-commit                   # PATH-augmented for node/pnpm on Windows
├── .github/workflows/
│   └── ci.yml                       # Lint+tests, Build, E2E, Lighthouse jobs
├── eslint.config.mjs                # ESLint flat config (eslint-config-next 16)
├── contentlayer.config.js           # Post schema + computed fields (toc, readTime, url, etc.)
├── next.config.mjs                  # withContentlayer + next-intl plugins
├── postcss.config.js                # @tailwindcss/postcss
├── vitest.config.mts                # jsdom + alias `contentlayer/generated` → `.contentlayer/generated`
├── playwright.config.ts
└── pnpm-workspace.yaml              # pnpm 11 build-script approval scope
```

## Code Conventions

### Component Structure

```
src/components/ComponentName/
├── ComponentName.tsx       # Main component
├── ComponentName.types.ts  # Type definitions when complex
└── index.ts                # Re-export
```

Import via `@/components/ComponentName`.

### Naming

- **Components**: PascalCase
- **Functions / variables**: camelCase
- **Constants**: UPPERCASE
- **Type interfaces**: `Props` suffix for props (`HeaderProps`), `I` prefix only when it disambiguates (`IPostProps`)

### Client vs Server Components

- **Server components** (default): pages, layouts, data-fetching, OG image generators
- **Client components** (`"use client"`): forms, animations, the command palette, KonamiEgg/ConsoleGreeting, Terminal, TableOfContents, ThemeToggle

### Path Aliases

```typescript
import { something } from "@/components/...";   // → ./src/...
import { allPosts } from "contentlayer/generated";
```

### Styling

- **Tailwind v4** via `@tailwindcss/postcss`, configured CSS-first in `src/app/globals.css`
- **Semantic tokens** declared inside `@theme`: `bg-bg`, `bg-bg-elevated`, `bg-bg-muted`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-border`, `border-border-strong`, `text-accent`, `bg-accent-muted`, `text-success`, `text-warn`, `text-error`
- **Light defaults** in `:root`, **dark overrides** in `.dark` selector (next-themes toggles the class on `<html>`)
- **Legacy aliases** preserved (`text-primary`, `bg-hover`, `text-cyan`, etc.) so older components keep rendering during migration; new code should use semantic tokens
- **Responsive**: mobile-first (`min-[480px]:`, `sm:`, `lg:`, `xl:`)
- **No `tailwind.config.ts`** (Tailwind v4 removed JS config)

## Theme System

Light + dark with persistence and no flash:

1. `<ThemeProvider>` (wraps the localized layout) uses next-themes with `attribute="class"`, `defaultTheme="system"`, `disableTransitionOnChange`
2. `<html suppressHydrationWarning>` so next-themes can set the class before hydration
3. `<ThemeToggle>` in the Header cycles `system → light → dark`
4. CSS variables in `globals.css` switch on `.dark`; semantic tokens reference them

The Terminal renders inside its own dark palette (independent of the site theme), set via inline `style={{ backgroundColor, color }}` on the terminal frame, so the playground stays dark even when the rest of the site is light.

## Internationalization (i18n)

- **EN** (default), **PT** (Brazilian Portuguese)
- URLs: `/{lang}/...` (`/en/blog`, `/pt/projetos`)
- Locales under `src/locales/{en,pt}/*.json`, re-exported from `src/locales/{en,pt}/index.ts`
- Read with `useTranslations("scope")` in components, `getTranslations({ locale, namespace })` in server contexts
- **Every copy change must ship in both languages** (no half-language commits)
- Follow `docs/voice-guide.md`: no em dashes, no exclamations, no clichés, specific verbs, rewrite (don't translate) between EN and PT

## Blog Content (Contentlayer)

### Article Location

```
content/
├── en/article-slug.mdx
└── pt/article-slug.mdx
```

### Frontmatter Schema

```yaml
title: "Article Title"
date: 2024-08-23
updated: 2024-09-01        # optional; shows "Updated" badge in header
description: "Article description"
categories: [category1, category2]
tags: [tag1, tag2]          # optional; used for RelatedPosts matching
featured: true              # optional; flag for future homepage pinning
meta:
  keywords: [keyword1, keyword2]
bannerCloudinaryId: "cloudinary-id"   # or "unsplash/photo-id"
bannerCredit: "Photo by Author"
bannerAlt: "Image alt text"
draft: false
```

### Computed Fields

- `slug` — from file path
- `language` — `en` / `pt` from parent directory
- `url` — full URL path
- `urlImage` — resolved Cloudinary/Unsplash URL
- `readTime` — `Math.ceil(wordCount / 200)`
- `toc` — array of `{ level, text, slug }` for h2/h3 headings (github-slugger; skips code fences)

### Banner Convention

Articles already include the banner image as the first MDX node (`![alt](url)`). The page renders the post header (date, read time, optional `updated`, title) and then the MDX body. Standardizing a header banner is a future TODO (requires a content migration).

## Playground

`/[lang]/playground` mounts `<Terminal>` from `src/components/Terminal/`:

- **Parser** (`parser.ts`): tokenizer + pipe (`cmd | grep ...`)
- **Registry** (`commands/index.ts`): assembles `CommandDef` objects from `commands/{system,nav,info,files,fun,games}.ts` with aliases and hidden flag
- **Hook** (`useTerminal.ts`): output buffer, input, cwd, theme, lang, history, overlay state
- **UI** (`Terminal.tsx` + `Line.tsx`): mac-window header, scrollable output, monospace input, mobile keys
- **Side panels** (`SnakeGame.tsx`, `MatrixOverlay.tsx`): full-screen overlays triggered by commands
- **Virtual FS** (`fs.ts`): in-memory directory tree (`/about`, `/projects`, `/blog`, ...)
- **Pipes** (`pipe.ts`): grep, head, tail, wc applied to any command output
- **Autocomplete** (`autocomplete.ts`): tab completion against commands and FS entries
- **Levenshtein** (`levenshtein.ts`): did-you-mean for unknown commands
- **Themes** (`themes.ts`): dracula, matrix, mono, solar (scoped to the terminal frame)

The `posts`, `contact`, and `hire-me` commands navigate the router. `posts` and `contact` are opt-in via `--open`; `hire-me` is hidden and intentionally side-effecting.

## API Routes

### Email — `POST /api/email`

Validates `name`, `email` (regex + length cap), and `message` server-side. Returns:
- 400 `{ message: "Invalid request" }` for malformed input
- 200 `{ message: "Email sent" }` on success
- 500 `{ message: "Failed to send email" }` on Resend failure (no internals leaked)

## Environment Variables

```env
NEXT_PUBLIC_LOCAL_DOMAIN=https://julianosirtori.dev   # sitemap/robots
RESEND_API_KEY=re_xxxxxxxxx                            # Resend email API
```

## Git Workflow

### Pre-commit Hook

`.husky/pre-commit` runs:
1. PATH augmentation for `node` / `pnpm` (Windows git hooks ship with a sanitized PATH)
2. `pnpm exec lint-staged` (ESLint + Prettier on staged files)
3. `pnpm test run` (vitest one-shot)

### Commit Guidelines

Conventional commits (`feat:`, `fix:`, `chore:`, `test:`, `doc:`, `refactor:`). Present tense, imperative, lowercase, no emojis. One logical change per commit.

## Testing

### Unit Tests (Vitest)

- Framework: Vitest 4 + @testing-library/react 16 + jsdom
- Setup file: `vitest.setup.ts` (imports `@testing-library/jest-dom/vitest`)
- Path alias `contentlayer/generated` → `.contentlayer/generated` (the prebuild/pretest hooks ensure it exists)
- Mock `framer-motion` in tests that render motion components
- Tests in `__tests__/components/` mirror `src/components/` paths

### E2E (Playwright)

```bash
pnpm test:e2e         # headless chromium
pnpm test:e2e:ui      # debug UI
```

Specs live in `e2e/*.spec.ts`. Use stable selectors (`a[href*="/blog/"]`, `button[aria-label="..."]`) rather than positional ones; the editorial markup doesn't always use `<ul>/<li>`.

## Important Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next + Contentlayer + next-intl wrappers |
| `contentlayer.config.js` | Post schema + computed fields (toc, readTime, urlImage) |
| `src/app/globals.css` | Tailwind v4 `@theme` + semantic tokens + light/dark |
| `src/middleware.ts` | next-intl routing |
| `src/locales/config.ts` | next-intl routing config |
| `eslint.config.mjs` | ESLint flat config (eslint-config-next 16 native) |

## Notes for AI Assistants

1. **Always use pnpm**. Package manager is pnpm; lockfile is `pnpm-lock.yaml`.
2. **Both languages**. Any content/translation change ships in `en` and `pt`.
3. **Voice guide is binding**. See `docs/voice-guide.md` — no em dashes, no exclamations, no "create interactions" or generic clichés.
4. **TypeScript strict mode** is on.
5. **Semantic tokens** are preferred over legacy color aliases for new code.
6. **Contentlayer regenerates** during `pnpm dev` (turbopack) and via `prebuild`/`pretest` hooks.
7. **Server components by default**; reach for `"use client"` only when interactivity demands it.
8. **Tests**: run `pnpm test` for vitest; CI also runs Playwright + Lighthouse. Don't ship without local lint + test passing.
9. **Storage**: use `src/utils/storage.ts` (`createStorage(namespace)`) for any new localStorage need — it's SSR-safe and quota-tolerant.
10. **Terminal commands**: each `CommandDef` carries its own bilingual `description`. Don't duplicate descriptions outside the command file.
