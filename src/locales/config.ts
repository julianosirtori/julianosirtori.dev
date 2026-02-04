import { defineRouting } from "next-intl/routing";
import { locales } from "./languages";

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export function getDefaultTimeZoneByLocale(locale: string | undefined) {
  return locale === "en" ? "US/Eastern" : "America/Sao_Paulo";
}
