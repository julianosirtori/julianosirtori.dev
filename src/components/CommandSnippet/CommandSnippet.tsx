"use client";

import { useRef, useState, type ReactNode } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

import { CopyButton } from "@/components/CopyButton";

export interface CommandSnippetProps {
  /** Bar label, e.g. "terminal" or "1 · clone". Also names the scroll area. */
  label: string;
  /** Exact text copied. The `pre` shows the same characters. */
  text: string;
  /** Optional decorated rendering of `text`; its text content must equal `text`. */
  children?: ReactNode;
  /** Wrap long lines instead of scrolling (used for the prompt). */
  wrap?: boolean;
  /** Screen-reader context for the copy button, e.g. "install command for Codex". */
  copyContext: string;
  onCopied?: () => void;
}

export function CommandSnippet({
  label,
  text,
  children,
  wrap = false,
  copyContext,
  onCopied,
}: CommandSnippetProps) {
  const t = useTranslations("skills.copy");
  const preRef = useRef<HTMLPreElement>(null);
  const [failed, setFailed] = useState(false);

  // When the Clipboard API fails, select the command so it can be copied by hand.
  const selectText = () => {
    const pre = preRef.current;
    const selection = window.getSelection();
    if (!pre || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(pre);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <div>
      <div className="bg-bg-muted border-border overflow-hidden rounded-lg border">
        <div className="border-border text-fg-muted flex min-h-11 items-center justify-between gap-4 border-b pr-1.5 pl-4">
          <span className="font-mono text-xs">{label}</span>
          <CopyButton
            text={text}
            label={t("copy")}
            copiedLabel={t("copied")}
            context={copyContext}
            onCopied={() => {
              setFailed(false);
              onCopied?.();
            }}
            onError={() => {
              setFailed(true);
              selectText();
            }}
          />
        </div>
        <pre
          ref={preRef}
          tabIndex={0}
          aria-label={label}
          className={`text-fg focus-visible:ring-accent [scrollbar-width:thin] px-4 py-3.5 font-mono text-sm leading-relaxed focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset sm:px-5 ${
            wrap
              ? "[overflow-wrap:anywhere] whitespace-pre-wrap"
              : "overflow-x-auto whitespace-pre"
          }`}
        >
          {children ?? text}
        </pre>
      </div>
      {failed && (
        <p
          role="alert"
          className="text-fg-muted mt-2 flex items-start gap-2 text-sm"
        >
          <ExclamationTriangleIcon
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          {t("failed")}
        </p>
      )}
    </div>
  );
}
