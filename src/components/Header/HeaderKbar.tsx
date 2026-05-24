"use client";

import { useCommandBar } from "@/components/CommandBar";

export function HeaderKBar() {
  const { toggle } = useCommandBar();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Open command palette"
      title="Command palette (⌘K)"
      className="text-fg-muted hover:text-fg hover:bg-bg-muted focus-visible:ring-accent inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <kbd className="border-border bg-bg flex h-5 items-center rounded border px-1 font-mono text-[10px]">
        ⌘K
      </kbd>
    </button>
  );
}
