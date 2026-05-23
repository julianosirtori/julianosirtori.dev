"use client";

import { ThemePalette } from "./types";

interface MobileKeysProps {
  palette: ThemePalette;
  onKey: (key: string) => void;
  onTab: () => void;
  onHistory: (dir: -1 | 1) => void;
  onClear: () => void;
}

const QUICK = ["help", "ls", "projects", "posts", "joke", "snake"];

export function MobileKeys({
  palette,
  onKey,
  onTab,
  onHistory,
  onClear,
}: MobileKeysProps) {
  const btn = (label: string, action: () => void, key = label) => (
    <button
      key={key}
      type="button"
      onClick={action}
      className="rounded-md border px-2 py-1 text-xs"
      style={{ borderColor: palette.border, color: palette.muted }}
    >
      {label}
    </button>
  );

  return (
    <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
      {btn("TAB", onTab)}
      {btn("↑", () => onHistory(-1), "up")}
      {btn("↓", () => onHistory(1), "down")}
      {btn("|", () => onKey("|"))}
      {btn("/", () => onKey("/"))}
      {btn("clear", onClear)}
      {QUICK.map((cmd) => btn(cmd, () => onKey(cmd + " ")))}
    </div>
  );
}
