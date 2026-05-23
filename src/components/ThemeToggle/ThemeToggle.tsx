"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, DesktopIcon } from "@radix-ui/react-icons";

const ORDER = ["system", "light", "dark"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = mounted ? (theme ?? "system") : "system";
  const next =
    ORDER[
      (ORDER.indexOf(current as (typeof ORDER)[number]) + 1) % ORDER.length
    ];

  const Icon =
    current === "dark" ? MoonIcon : current === "light" ? SunIcon : DesktopIcon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch theme (current: ${current})`}
      title={`Theme: ${current} (click for ${next})`}
      className="text-fg-muted hover:text-fg hover:bg-bg-muted focus-visible:ring-accent inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
