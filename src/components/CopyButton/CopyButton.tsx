"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon, Link2Icon } from "@radix-ui/react-icons";

export interface CopyButtonProps {
  /** Exact text that goes to the clipboard. */
  text: string;
  /** Visible label, e.g. "Copy". */
  label: string;
  /** Visible label for two seconds after a successful copy. */
  copiedLabel: string;
  /**
   * Screen-reader-only words appended to the visible label, so each button
   * has a distinct name that still starts with what is on screen.
   */
  context?: string;
  icon?: "copy" | "link";
  className?: string;
  onCopied?: () => void;
  /** Called when the Clipboard API is missing or rejects the write. */
  onError?: (error: unknown) => void;
}

const COPIED_MS = 2000;

const defaultClassName =
  "text-fg hover:bg-bg focus-visible:ring-accent inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none";

export function CopyButton({
  text,
  label,
  copiedLabel,
  context,
  icon = "copy",
  className = defaultClassName,
  onCopied,
  onError,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(text);
    } catch (error) {
      setCopied(false);
      onError?.(error);
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    onCopied?.();
  };

  const Icon = copied ? CheckIcon : icon === "link" ? Link2Icon : CopyIcon;

  return (
    <button type="button" onClick={copy} className={className}>
      <Icon
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 ${copied ? "text-success" : ""}`}
      />
      <span>{copied ? copiedLabel : label}</span>
      {context && (
        <>
          {" "}
          <span className="sr-only">{context}</span>
        </>
      )}
    </button>
  );
}
