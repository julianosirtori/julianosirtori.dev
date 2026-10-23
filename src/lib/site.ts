/**
 * Canonical origin of the production site. The apex domain redirects here, so
 * canonical, og:url and JSON-LD must point at it to avoid a redirect hop.
 * Kept free of imports so e2e tests can read it too.
 */
export const SITE_URL = "https://www.julianosirtori.dev";
