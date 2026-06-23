import { ThemeToggle } from "julianosirtori.dev";

export function Default() {
  return (
    <div style={{ padding: 24, display: "inline-flex" }}>
      <ThemeToggle />
    </div>
  );
}

export function InHeaderBar() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: 12,
        borderRadius: 8,
      }}
    >
      <span style={{ fontSize: 14, opacity: 0.7 }}>Theme</span>
      <ThemeToggle />
    </div>
  );
}
