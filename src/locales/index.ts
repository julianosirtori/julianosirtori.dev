import { GetRequestConfigParams } from "next-intl/dist/types/src/server/react-server/getRequestConfig";
import { getRequestConfig } from "next-intl/server";
import { getDefaultTimeZoneByLocale } from "./config";

export const importLocale = async ({ locale }: GetRequestConfigParams) => {
  const langs = (await import(`./${locale}`)) ?? {};
  return {
    messages: { ...langs },
    timeZone: getDefaultTimeZoneByLocale(locale),
  };
};

export default getRequestConfig(importLocale);
