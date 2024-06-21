import { locales } from "./languages";

type LocalePrefix = "as-needed" | "always" | "never";
export const config = {
  locales,
  defaultLocale: "en",
  localePrefix: "always" as LocalePrefix,
};

export function getDefaultTimeZoneByLocale(locale: string) {
  return locale === "en" ? "US/Eastern" : "America/Sao_Paulo";
}
