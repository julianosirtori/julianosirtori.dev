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
    if (preRef.current) {
      const code = preRef.current.textContent || "";
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        console.error("Failed to copy code");
      }
    }
  };

  const language = props["data-language"];

  return (
    <div className="group relative my-6">
      {language && (
        <div className="bg-hover/80 text-secondary absolute top-3 right-12 z-10 rounded-md px-2 py-1 text-xs font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {language}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="bg-hover/80 text-secondary hover:border-cyan hover:text-cyan absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-transparent opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100"
        aria-label={copied ? "Copied!" : "Copy code"}
        title={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <CheckIcon className="text-green h-4 w-4" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}
      </button>
      <pre
        ref={preRef}
        className={`border-hover overflow-x-auto rounded-lg border bg-[#1c1c1c] p-4 text-sm ${className || ""}`}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
