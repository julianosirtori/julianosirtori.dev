"use client";
import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import {
  reactionTypes,
  type ReactionSnapshot,
  type ReactionType,
} from "@/lib/reactions";
import { track } from "@/lib/analytics";
const emoji = ["👍", "🔥", "💡", "🎉", "❤️"];
const labels = {
  pt: ["Gostei", "Fogo", "Inspirador", "Comemorar", "Amei"],
  en: ["Like", "Fire", "Insightful", "Celebrate", "Love"],
};
async function request(
  slug: string,
  type?: ReactionType,
  active?: boolean,
): Promise<ReactionSnapshot> {
  const response = await fetch(
    `/api/reactions/${encodeURIComponent(slug)}`,
    type
      ? {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, active }),
        }
      : undefined,
  );
  if (!response.ok) throw new Error("unavailable");
  return response.json();
}
const migrations = new Map<string, Promise<ReactionSnapshot>>();
async function loadReactions(slug: string) {
  // Single flight also covers React strict-mode remounts, avoiding competing first-cookie writes.
  const existing = migrations.get(slug);
  if (existing) return existing;
  const pending = (async () => {
    let snapshot = await request(slug);
    try {
      const marker = `reactions:migrated-${slug}`;
      if (!localStorage.getItem(marker)) {
        const value: unknown = JSON.parse(
          localStorage.getItem(`reactions:user-${slug}`) || "[]",
        );
        const keys = Array.isArray(value)
          ? reactionTypes.filter((k) => value.includes(k))
          : [];
        for (const key of keys)
          if (!snapshot.selected.includes(key))
            snapshot = await request(slug, key, true);
        localStorage.setItem(marker, "1");
      }
    } catch {
      /* Keep the migration unmarked on failure; the next visit retries idempotently. */
    }
    return snapshot;
  })();
  migrations.set(slug, pending);
  try {
    return await pending;
  } finally {
    migrations.delete(slug);
  }
}
export function Reactions({ slug }: { slug: string }) {
  const lang = useLocale() === "pt" ? "pt" : "en";
  const [snapshot, setSnapshot] = useState<ReactionSnapshot>({
    counts: {},
    selected: [],
  });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  const lock = useRef(false);
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setError(false);
    loadReactions(slug)
      .then((data) => {
        if (!cancelled) {
          setSnapshot(data);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, retry]);
  const total = Object.values(snapshot.counts).reduce(
    (a, b) => a + (b || 0),
    0,
  );
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-fg-muted text-xs">
        {total
          ? `${total} ${lang === "pt" ? "reações" : "reactions"}`
          : lang === "pt"
            ? "Seja o primeiro a reagir"
            : "Be the first to react"}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {reactionTypes.map((type, index) => (
          <button
            key={type}
            type="button"
            aria-label={labels[lang][index]}
            aria-pressed={snapshot.selected.includes(type)}
            disabled={!ready || busy}
            className={`min-h-11 min-w-11 rounded-full border px-3 py-2 text-sm transition-colors disabled:opacity-50 ${snapshot.selected.includes(type) ? "border-accent bg-accent-muted text-fg" : "border-border text-fg-muted hover:border-accent"}`}
            onClick={async () => {
              if (lock.current) return;
              lock.current = true;
              setBusy(true);
              setError(false);
              const before = snapshot;
              const active = !snapshot.selected.includes(type);
              setSnapshot({
                counts: {
                  ...snapshot.counts,
                  [type]: Math.max(
                    0,
                    (snapshot.counts[type] || 0) + (active ? 1 : -1),
                  ),
                },
                selected: active
                  ? [...snapshot.selected, type]
                  : snapshot.selected.filter((k) => k !== type),
              });
              try {
                setSnapshot(await request(slug, type, active));
                track("reaction_change", {
                  location: "article",
                  content_id: slug,
                  action_id: type,
                  active,
                });
              } catch {
                setSnapshot(before);
                setError(true);
              } finally {
                lock.current = false;
                setBusy(false);
              }
            }}
          >
            <span aria-hidden="true">{emoji[index]}</span>
            {snapshot.counts[type] ? (
              <span className="ml-1.5">{snapshot.counts[type]}</span>
            ) : null}
          </button>
        ))}
      </div>
      {error && (
        <div role="status" className="text-fg-muted text-center text-xs">
          <p>
            {lang === "pt"
              ? "Reações indisponíveis. Tente novamente."
              : "Reactions unavailable. Please try again."}
          </p>
          {!ready && (
            <button
              className="text-accent min-h-11"
              onClick={() => setRetry((n) => n + 1)}
            >
              {lang === "pt" ? "Tentar novamente" : "Try again"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
export function ReactionSummary() {
  const lang = useLocale();
  const [data, setData] = useState<{
    reactions: number;
    articles: number;
  } | null>(null);
  useEffect(() => {
    fetch("/api/reactions/summary")
      .then(async (response) => {
        if (response.ok) setData(await response.json());
      })
      .catch(() => undefined);
  }, []);
  if (!data || !data.reactions) return null;
  return (
    <p className="text-fg-muted mt-6 text-sm">
      {data.reactions} {lang === "pt" ? "reações em" : "reactions across"}{" "}
      {data.articles} {lang === "pt" ? "artigos" : "articles"}
    </p>
  );
}
