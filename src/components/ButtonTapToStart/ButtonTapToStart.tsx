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
      className="flex flex-row items-center gap-2 px-3 py-2 text-base font-semibold text-primary "
    >
      <span>{t("tapToStart")}</span>
      <ArrowRightIcon />
    </button>
  );
}
