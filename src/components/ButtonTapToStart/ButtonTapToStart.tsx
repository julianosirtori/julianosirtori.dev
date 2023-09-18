"use client";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useKBar } from "kbar";
import { useTranslations } from "next-intl";

export function ButtonTapToStart() {
  const { query } = useKBar();
  const t = useTranslations("global");

  return (
    <button
      onClick={query.toggle}
      className="flex flex-row items-center gap-2 rounded px-3 py-2 text-base font-semibold text-primary transition-all duration-200 hover:bg-hover"
    >
      <span>
        {t.rich("tapToStart", {
          firstKey: (chunk) => (
            <kbd className="rounded bg-secondary px-1 py-[1px] text-sm text-background">
              {chunk}
            </kbd>
          ),
          secondKey: (chunk) => (
            <kbd className="rounded bg-secondary px-1 py-[1px] text-sm text-background">
              {chunk}
            </kbd>
          ),
        })}
      </span>
      <ArrowRightIcon />
    </button>
  );
}
