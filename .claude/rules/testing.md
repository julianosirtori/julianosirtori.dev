---
description: Vitest + Playwright conventions in this project
paths:
  - "__tests__/**/*.{ts,tsx}"
  - "e2e/**/*.{ts,tsx}"
---

## Unit tests (Vitest)

- Vitest 4 + @testing-library/react 16 + jsdom
- Location: `__tests__/components/` mirrors `src/components/`
- Setup file: `vitest.setup.ts` (imports `@testing-library/jest-dom/vitest`)
- Path alias `contentlayer/generated` resolves to `.contentlayer/generated`. The `pretest` hook runs `contentlayer2 build` so this exists on fresh checkouts.

### Patterns

- **Mock framer-motion** in tests that render motion components — replace `motion.button`, `motion.div`, `AnimatePresence` with their HTML equivalents.
- **Mock next/image** when asserting on `<img>` markup (the real component skips DOM in jsdom).
- **Mock `@/locales/navigation`** when components call `useRouter`:
  ```ts
  const pushMock = vi.fn();
  vi.mock("@/locales/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));
  ```
- **Mock IntersectionObserver** as a class (not `vi.fn`), since components do `new IntersectionObserver(...)`:
  ```ts
  class MockObserver { observe = fn; disconnect = fn; ... }
  vi.stubGlobal("IntersectionObserver", MockObserver);
  ```
- **Use safe storage in components** instead of raw `localStorage`, so tests can intercept via the same prefixed key.
- When asserting on terminal output, treat lines as `{ kind, content }` objects, not raw strings — `kind` is the source of truth for color/error styling.

### Coverage focus

- Pure logic (parser, registry, levenshtein, pipe, autocomplete) gets thorough unit tests.
- Components with effects (TableOfContents scroll-spy, KonamiEgg sequence, ThemeToggle mount) get tests for the observable behavior, not implementation details.
- Side effects (router.push, setOverlay) get spy assertions; output content also gets snapshot-style assertions on key lines.

## E2E (Playwright)

- Specs in `e2e/*.spec.ts`
- Run with `pnpm test:e2e` (headless chromium) or `pnpm test:e2e:ui` (debug)
- CI runs chromium-only with artifact upload (30-day retention)

### Selector preferences

- **Use semantic / stable selectors**: `a[href*="/blog/"]`, `button[aria-label="..."]`, `getByRole("heading", { level: 2 })`, `getByText(/regex/)`
- **Avoid `ul li`** for blog/project cards — the editorial markup uses divs/motion wrappers, not lists
- Locator chains over CSS positional selectors

### Don'ts

- Don't run e2e against production. Use the local build the workflow spins up.
- Don't assert exact pixel positions or animation timing. Test final state after `await page.waitForLoadState` or after a known transition.
