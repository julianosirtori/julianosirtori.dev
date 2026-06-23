// Browser polyfill for `process`, imported first by ds-entry.tsx so it runs
// before any bundled library module evaluates. Libraries in the graph
// (next-intl, react-email, framer-motion, ...) read process.env.* beyond
// NODE_ENV, which esbuild's single define doesn't cover; without a process
// object those references throw at module eval and the whole IIFE aborts
// before window.JulianoDS is assigned.
const g = globalThis as unknown as {
  process?: { env: Record<string, string | undefined> };
};
if (!g.process) {
  g.process = { env: { NODE_ENV: "development" } };
} else if (!g.process.env) {
  g.process.env = { NODE_ENV: "development" };
}
export {};
