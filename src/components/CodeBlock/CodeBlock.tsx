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
        <div className="absolute top-4 right-12 z-10 font-mono text-[10px] tracking-wide text-white/50">
          {language}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
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
        className={`bg-bg-muted overflow-x-auto rounded-xl p-4 text-sm sm:p-5 ${className || ""}`}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
