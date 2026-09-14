"use client";

import { ArrowUpIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="border-border bg-bg/85 text-fg-muted hover:text-fg hover:bg-bg-muted hover:border-fg-muted fixed right-6 bottom-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-colors"
          aria-label="Back to top"
        >
          <ArrowUpIcon className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
