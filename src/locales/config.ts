import { LocalePrefix } from "next-intl/dist/types/src/shared/types";
import { locales } from "./languages";

export const config = {
  locales,
  defaultLocale: "en",
  localePrefix: "always" as LocalePrefix,
};

export function getDefaultTimeZoneByLocale(locale: string) {
  return locale === "en" ? "US/Eastern" : "America/Sao_Paulo";
}
