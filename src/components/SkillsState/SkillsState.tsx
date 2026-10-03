import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";

import {
  secondaryButtonClass,
  textButtonClass,
} from "@/components/Audience/copy";
import { SKILLS_REPO_URL, skillFolderUrl } from "@/lib/skills/constants";

export interface SkillsStateProps {
  variant: "empty" | "error" | "detailError";
  /** Locale-prefixed URL of the current page, for "Try again" without JS. */
  retryHref?: string;
  slug?: string;
}

/** Empty and error states for the list and the detail. No red, no blame. */
export async function SkillsState({
  variant,
  retryHref,
  slug,
}: SkillsStateProps) {
  const t = await getTranslations("skills");
  const external =
    variant === "detailError" && slug
      ? { href: skillFolderUrl(slug), label: t("state.openFolder") }
      : { href: SKILLS_REPO_URL, label: t("state.openRepo") };

  return (
    <div className="border-border border-y py-12 sm:py-16">
      <p className="text-fg max-w-[52ch] text-lg leading-relaxed">
        {t(`state.${variant}`)}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={external.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${secondaryButtonClass} hover:bg-bg-muted`}
        >
          {external.label}
          <ArrowTopRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
          <span className="sr-only"> ({t("detail.newTab")})</span>
        </a>
        {variant !== "empty" && retryHref && (
          <a
            href={retryHref}
            className={`${textButtonClass} hover:bg-bg-muted hover:text-fg`}
          >
            {t("state.retry")}
          </a>
        )}
      </div>
    </div>
  );
}
