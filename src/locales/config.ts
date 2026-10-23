import { defineRouting } from "next-intl/routing";
import { locales } from "./languages";

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
  // Pages declare hreflang in their metadata, per available translation. The
  // middleware's Link header listed every locale for every path and pointed
  // x-default at an unprefixed URL, contradicting those tags.
  alternateLinks: false,
});

export function getDefaultTimeZoneByLocale(locale: string | undefined) {
  return locale === "en" ? "US/Eastern" : "America/Sao_Paulo";
}
