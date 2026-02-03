import { getRequestConfig } from "next-intl/server";
import { routing } from "./config";
import { getDefaultTimeZoneByLocale } from "./config";

export const importLocale = async (locale: string) => {
  const langs = (await import(`./${locale}`)) ?? {};
  return {
    locale,
    messages: { ...langs },
    timeZone: getDefaultTimeZoneByLocale(locale),
  };
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "pt")) {
    locale = routing.defaultLocale;
  }

  return importLocale(locale);
});
