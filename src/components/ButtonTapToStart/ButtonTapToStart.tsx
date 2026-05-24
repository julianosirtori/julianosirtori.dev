"use client";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

import { useCommandBar } from "@/components/CommandBar";

export function ButtonTapToStart() {
  const { toggle } = useCommandBar();
  const t = useTranslations("global");

  return (
    <button
      type="button"
      onClick={toggle}
      className="text-fg hover:bg-bg-muted inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
    >
      <span>
        {t.rich("tapToStart", {
          firstKey: (chunk) => (
            <kbd className="border-border bg-bg text-fg-muted ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[10px]">
              {chunk}
            </kbd>
          ),
          secondKey: (chunk) => (
            <kbd className="border-border bg-bg text-fg-muted inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[10px]">
              {chunk}
            </kbd>
          ),
        })}
      </span>
      <ArrowRightIcon className="h-3.5 w-3.5" />
    </button>
  );
}
