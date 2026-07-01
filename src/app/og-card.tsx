// Shared Open Graph card (1200×630), theme-locked dark, rendered by next/og.
// satori does not support color-mix or CSS filters, so colours are precomputed.

const CATEGORY_ACCENT: Record<string, string> = {
  Carreira: "#a78bfa",
  Career: "#a78bfa",
  TypeScript: "#38bdf8",
  "Web APIs": "#34d399",
  JavaScript: "#34d399",
  IA: "#fbbf24",
  AI: "#fbbf24",
  "Open source": "#f472b6",
  CSS: "#f472b6",
  React: "#818cf8",
};

const DEFAULT_ACCENT = "#818cf8";

export function categoryAccent(category?: string): string {
  return (category && CATEGORY_ACCENT[category]) || DEFAULT_ACCENT;
}

function rgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const MONO = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

interface OgCardProps {
  title: string;
  category?: string;
  meta: string;
}

export function OgCard({ title, category, meta }: OgCardProps) {
  const accent = categoryAccent(category);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "68px 76px",
        backgroundColor: "#0a0a0a",
        backgroundImage: `radial-gradient(circle at 92% -10%, ${rgba(
          accent,
          0.22,
        )}, transparent 46%)`,
        color: "#fafafa",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8px",
          backgroundColor: accent,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {category ? (
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              fontFamily: MONO,
              padding: "9px 20px",
              borderRadius: "999px",
              color: accent,
              backgroundColor: rgba(accent, 0.16),
            }}
          >
            {category}
          </div>
        ) : (
          <div style={{ display: "flex" }} />
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "5px",
              backgroundColor: accent,
            }}
          />
          <div style={{ display: "flex", fontSize: "24px", fontWeight: 600 }}>
            julianosirtori.dev
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: "66px",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          maxWidth: "920px",
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: rgba(accent, 0.24),
            color: accent,
            fontFamily: MONO,
            fontSize: "22px",
            fontWeight: 600,
          }}
        >
          JS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: "26px", fontWeight: 600 }}>
            Juliano Sirtori
          </div>
          <div style={{ display: "flex", fontSize: "21px", color: "#a3a3a3" }}>
            {meta}
          </div>
        </div>
      </div>
    </div>
  );
}
