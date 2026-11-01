import { describe, expect, it } from "vitest";

import { PORTFOLIO_URL, portfolioLink } from "./site";

describe("portfolioLink", () => {
  it("tags the referral with the placement", () => {
    expect(portfolioLink("footer")).toBe(
      "https://portfolio.julianosirtori.dev/?utm_source=julianosirtori.dev&utm_medium=referral&utm_campaign=dev-site&utm_content=footer",
    );
  });

  it("keeps the path when linking deeper", () => {
    const url = new URL(portfolioLink("projects", "/cases/"));
    expect(url.origin + url.pathname).toBe(`${PORTFOLIO_URL}/cases/`);
    expect(url.searchParams.get("utm_content")).toBe("projects");
  });
});
