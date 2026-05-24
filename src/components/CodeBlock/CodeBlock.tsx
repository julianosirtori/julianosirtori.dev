"use client";

import { useState, useRef, ReactNode } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
  "data-language"?: string;
  "data-theme"?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (!preRef.current) return;
    const code = preRef.current.textContent || "";
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy code");
    }
  };

  const language = props["data-language"];

  return (
    <div className="group relative my-6">
      {language && (
        <div className="bg-bg-muted text-fg-subtle border-border absolute top-3 right-12 z-10 rounded-md border px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase">
          {language}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="bg-bg-muted text-fg-muted hover:text-fg border-border hover:border-fg-muted absolute top-3 right-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors"
        aria-label={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy code"}
      >
        {copied ? (
          <CheckIcon className="text-success h-3.5 w-3.5" />
        ) : (
          <CopyIcon className="h-3.5 w-3.5" />
        )}
      </button>
      <pre
        ref={preRef}
        className={`border-border bg-bg-muted overflow-x-auto rounded-lg border p-4 text-sm ${className || ""}`}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
