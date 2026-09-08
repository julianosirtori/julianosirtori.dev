"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { TComments } from "./Comments.types";

const Giscus = dynamic(() => import("@giscus/react"), { ssr: false });

export const Comments = ({ locale }: TComments) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const t = useTranslations("blog.comments");
  return (
    <section
      aria-labelledby="comments-title"
      className="border-border border-t pt-8"
    >
      <h2
        id="comments-title"
        className="text-fg text-lg font-medium tracking-tight"
      >
        {t("title")}
      </h2>
      <p className="text-fg-muted mt-2 text-sm leading-relaxed">
        {t("description")}
      </p>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="post-comments"
        disabled={isOpen}
        className="border-border text-fg hover:border-accent hover:text-accent focus-visible:ring-accent mt-5 min-h-11 rounded-md border px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:hidden"
      >
        {t("load")}
      </button>
      {!isOpen && (
        <p className="text-fg-muted mt-3 text-xs leading-relaxed">
          {t("hint")}
        </p>
      )}
      <div id="post-comments" className={isOpen ? "mt-6" : undefined}>
        {isOpen && (
          <Giscus
            id="comments"
            repo="julianosirtori/julianosirtori.dev"
            repoId="R_kgDOJlgXxA"
            category="Site Comments"
            categoryId="DIC_kwDOJlgXxM4Caq6B"
            mapping="pathname"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="bottom"
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            lang={locale}
          />
        )}
      </div>
    </section>
  );
};
