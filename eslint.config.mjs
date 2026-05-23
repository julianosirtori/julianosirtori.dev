import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".contentlayer/**",
      "node_modules/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.mjs",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettierConfig,
  {
    files: ["contentlayer.config.js", "lighthouserc.js", "postcss.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // React 19 hooks plugin v7 added rules that flag SSR-safe patterns
    // (mounted flag, localStorage load, etc.) as cascading renders. Keep
    // the rules off until we replace those patterns with useSyncExternalStore.
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
      "react-hooks/error-boundaries": "off",
    },
  },
];

export default eslintConfig;
