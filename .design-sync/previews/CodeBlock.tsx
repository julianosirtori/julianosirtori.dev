import { CodeBlock } from "julianosirtori.dev";

export function TypeScript() {
  return (
    <div style={{ maxWidth: 560 }}>
      <CodeBlock data-language="ts">
        <code>{`export function readTime(content: string): number {
  const words = content.trim().split(/\\s+/).length;
  return Math.ceil(words / 200);
}`}</code>
      </CodeBlock>
    </div>
  );
}

export function Bash() {
  return (
    <div style={{ maxWidth: 560 }}>
      <CodeBlock data-language="bash">
        <code>{`pnpm dev          # next dev --turbopack
pnpm build        # prebuild runs contentlayer first
pnpm test         # vitest, jsdom
pnpm test:e2e     # playwright, chromium`}</code>
      </CodeBlock>
    </div>
  );
}

export function NoLanguage() {
  return (
    <div style={{ maxWidth: 560 }}>
      <CodeBlock>
        <code>{`GET /en/blog/editorial-rebrand  200  in 42ms
GET /pt/blog/editorial-rebrand  200  in 39ms`}</code>
      </CodeBlock>
    </div>
  );
}
