import { routing } from "@/locales/config";
import { locales } from "@/locales/languages";
import { SITE_URL } from "@/lib/site";

/**
 * hreflang map for the given locales of a path, plus `x-default` pointing at
 * the default locale when available, otherwise at the first given locale.
 * `pathFor` returns the full path for a locale (e.g. "/en/about").
 */
export function languagesFor(
  available: readonly string[],
  pathFor: (locale: string) => string,
) {
  const languages: Record<string, string> = Object.fromEntries(
    available.map((locale) => [locale, pathFor(locale)]),
  );
  const fallback = available.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : available[0];
  if (fallback) languages["x-default"] = pathFor(fallback);
  return languages;
}

/**
 * Self-referencing canonical plus hreflang alternates for every locale of `path`.
 * `path` starts with "/" and has no locale prefix (e.g. "/about", "" for home).
 */
export function alternatesFor(lang: string, path: string) {
  return {
    canonical: `/${lang}${path}`,
    languages: languagesFor(locales, (locale) => `/${locale}${path}`),
  };
}

/**
 * Open Graph block for a page. A page-level `openGraph` replaces the one the
 * [lang] segment would inherit, including its generated image, so each page has
 * to name the image itself (the per-locale card at /{lang}/opengraph-image).
 */
export function openGraphFor(
  lang: string,
  path: string,
  title: string,
  description: string,
) {
  return {
    title,
    description,
    url: `${SITE_URL}/${lang}${path}`,
    images: [
      {
        url: `${SITE_URL}/${lang}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
}
