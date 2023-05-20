import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

import { i18n } from '@/config/i18n-config';

export const getLocale = (language?: string | null) => {
  let languages = new Negotiator({headers: {'accept-language': language ?? ''} }).languages();
  let defaultLocale = i18n.defaultLocale;
  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales
  return matchLocale(languages, locales, defaultLocale);
}