import { GetRequestConfigParams } from 'next-intl/dist/src/server/getRequestConfig';
import {getRequestConfig} from 'next-intl/server';
 
export const importLocale = async ({ locale }: GetRequestConfigParams) => {
  const langs = (await import(`./${locale}`)) ?? {};
  return {
      messages: { ...langs },
  };
}

export default getRequestConfig(importLocale);