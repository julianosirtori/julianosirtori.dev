"use client";

import { useState, useRef, useEffect, type ComponentProps } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

interface CodeBlockProps extends ComponentProps<"pre"> {
  "data-language"?: string;
  "data-theme"?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const t = useTranslations("blog");
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const preRef = useRef<HTMLPreElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    if (!preRef.current) return;
    const code = preRef.current.textContent || "";
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  };

  const language = props["data-language"];
  const copyLabel = status === "copied" ? t("copiedCode") : t("copyCode");

  return (
    <div
      data-code-block
      className="bg-bg-muted my-6 overflow-hidden rounded-lg"
    >
      <div className="border-border text-fg-muted flex min-h-12 items-center justify-between gap-4 border-b px-4">
        <span className="font-mono text-xs">
          {language && language !== "plaintext" ? language : t("codeLabel")}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="hover:text-accent focus-visible:ring-accent -mr-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-2 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label={copyLabel}
          title={copyLabel}
        >
          {status === "copied" ? (
            <CheckIcon aria-hidden="true" className="h-3.5 w-3.5" />
          ) : (
            <CopyIcon aria-hidden="true" className="h-3.5 w-3.5" />
          )}
          {copyLabel}
        </button>
      </div>
      <span role="status" className="sr-only">
        {status === "copied" ? t("copiedCode") : ""}
      </span>
      {status === "error" && (
        <p role="alert" className="px-4 text-sm">
          {t("copyFailed")}
        </p>
      )}
      <pre
        {...props}
        ref={preRef}
        tabIndex={0}
        aria-label={language || t("codeLabel")}
        className={`focus-visible:ring-accent overflow-x-auto p-4 text-sm focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset sm:p-5 ${className || ""}`}
      >
        {children}
      </pre>
    </div>
  );
}
