/**
 * Canonical origin of the production site. The apex domain redirects here, so
 * canonical, og:url and JSON-LD must point at it to avoid a redirect hop.
 * Kept free of imports so e2e tests can read it too.
 */
export const SITE_URL = "https://www.julianosirtori.dev";

/**
 * Commercial portfolio for companies hiring a project. JSON-LD and llms.txt
 * use the clean URL; on-page links go through `portfolioLink` so referrals
 * show up tagged by placement.
 */
export const PORTFOLIO_URL = "https://portfolio.julianosirtori.dev";

export type PortfolioPlacement =
  | "footer"
  | "home-cta"
  | "projects"
  | "projects-list";

export const portfolioLink = (placement: PortfolioPlacement, path = "/") => {
  const url = new URL(path, PORTFOLIO_URL);
  url.searchParams.set("utm_source", "julianosirtori.dev");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "dev-site");
  url.searchParams.set("utm_content", placement);
  return url.toString();
};
