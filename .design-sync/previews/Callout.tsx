import { Callout } from "julianosirtori.dev";

export function Info() {
  return (
    <div style={{ maxWidth: 560 }}>
      <Callout tone="info" title="Heads up">
        This site runs on Next.js 16, React 19, and Tailwind v4. The theme
        switches on a single .dark class.
      </Callout>
    </div>
  );
}

export function Tones() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        maxWidth: 560,
      }}
    >
      <Callout tone="info" title="Info">
        Semantic tokens keep light and dark in sync.
      </Callout>
      <Callout tone="tip" title="Tip">
        Read translations with useTranslations, never hardcode strings.
      </Callout>
      <Callout tone="warn" title="Watch out">
        Every copy change has to ship in both English and Portuguese.
      </Callout>
      <Callout tone="success" title="Shipped">
        The build passed lint and tests with zero warnings.
      </Callout>
    </div>
  );
}
