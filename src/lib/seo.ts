import { locales } from "@/locales/languages";

/**
 * Self-referencing canonical plus hreflang alternates for every locale of `path`.
 * `path` starts with "/" and has no locale prefix (e.g. "/about", "" for home).
 */
export function alternatesFor(lang: string, path: string) {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `/${locale}${path}`]),
  );
  return {
    canonical: `/${lang}${path}`,
    languages,
  };
}
