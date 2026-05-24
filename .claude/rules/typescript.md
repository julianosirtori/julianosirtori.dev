---
description: TypeScript + React conventions for this project (Next 16 App Router, Tailwind v4, semantic tokens)
paths:
  - "src/**/*.{ts,tsx}"
  - "__tests__/**/*.{ts,tsx}"
---

## Component layout

- Folder per component: `src/components/Name/{Name.tsx, Name.types.ts?, index.ts}`
- `index.ts` re-exports the component (and optionally types) by name
- Import via `@/components/Name`
- Server components by default. Add `"use client"` only when the component owns state, effects, browser APIs, animations, or third-party client libs (cmdk, framer-motion, next-themes, etc.)

## Types

- Strict mode is on. No `any`. Use `unknown` + narrowing for external data.
- Props types end in `Props` (`HeaderProps`). Prefer named `interface` over inline objects.
- Avoid the `I` prefix unless it disambiguates (e.g. `IPostProps` exists for legacy parity).
- Use union types over enums (`type Theme = "light" | "dark" | "system"`).

## Styling

- Tailwind v4. No `tailwind.config.ts`. Tokens live in `src/app/globals.css` `@theme`.
- **Use semantic tokens** for new code: `bg-bg`, `bg-bg-elevated`, `bg-bg-muted`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-border`, `border-border-strong`, `text-accent`, `bg-accent-muted`, `text-success`, `text-warn`, `text-error`.
- Legacy aliases (`text-primary`, `bg-hover`, `text-cyan`, etc.) still resolve. Don't introduce new uses. When touching a file that has them, prefer to migrate.
- Light/dark switches on `.dark` class. Avoid hardcoded hex unless theme-locked (e.g. terminal frame).
- Mobile-first responsive: `min-[480px]:`, `sm:`, `lg:`, `xl:`.

## State and storage

- Use `createStorage("namespace")` from `src/utils/storage.ts` for any localStorage. It's SSR-safe, try/catch-wrapped, and namespaced. Validate parsed values with a type guard before using.
- For new shared state across components, prefer context + hook (`use<Feature>`) co-located with the provider.

## Error handling

- Validate at boundaries: API routes, parsed user input, parsed localStorage. Trust internal code.
- Don't swallow errors with empty `catch {}` in production code (storage util's quota-tolerant catch is the exception). Log via `console.error` and surface a fallback.

## Hooks

- React 19 hooks plugin v7 has stricter rules. Three are disabled project-wide (`react-hooks/set-state-in-effect`, `static-components`, `error-boundaries`) because they flag SSR-safe patterns (mounted flag, localStorage hydration, MDX dynamic component). Re-enable per file when refactoring to `useSyncExternalStore`.

## Conventions cheat sheet

| Thing | Pattern |
|---|---|
| New component | `src/components/Name/{Name.tsx, index.ts}` |
| New page | `src/app/[lang]/feature/page.tsx` + locale entries in `src/locales/{en,pt}/feature.json` |
| New utility | `src/utils/name.ts`, exported by name |
| MDX components | Register in `src/components/Mdx/Mdx.tsx` `components` map |
| Translations | `useTranslations("scope")` client, `getTranslations({ locale, namespace })` server |
| Navigation | `useRouter` / `Link` from `@/locales/navigation` (next-intl-aware) |
