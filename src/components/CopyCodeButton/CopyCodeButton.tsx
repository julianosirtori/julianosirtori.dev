"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

interface CopyCodeButtonProps {
  code: string;
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy code");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="border-hover bg-background/80 text-secondary hover:border-cyan hover:bg-hover hover:text-cyan absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-md border backdrop-blur-sm transition-all duration-200"
      aria-label={copied ? "Copied!" : "Copy code"}
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <CheckIcon className="text-green h-4 w-4" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </button>
  );
}
