import { CopyCodeButton } from "julianosirtori.dev";

export function OnCodeBlock() {
  return (
    <div
      style={{
        position: "relative",
        maxWidth: 560,
        borderRadius: 8,
        border: "1px solid #2a2a2a",
        background: "#0f1115",
        color: "#e6e6e6",
        padding: 16,
        fontFamily:
          "var(--font-geist-mono, ui-monospace, SFMono-Regular, monospace)",
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <CopyCodeButton code="pnpm add contentlayer2 next-contentlayer2" />
      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
        {`$ pnpm add contentlayer2 next-contentlayer2
$ pnpm exec contentlayer2 build
Generated 18 documents in .contentlayer/generated`}
      </pre>
    </div>
  );
}

export function StandaloneToolbar() {
  return (
    <div
      style={{
        position: "relative",
        maxWidth: 320,
        height: 72,
        borderRadius: 8,
        border: "1px solid #2a2a2a",
        background: "#0f1115",
      }}
    >
      <CopyCodeButton code="git switch -c feat/editorial-rebrand" />
    </div>
  );
}
