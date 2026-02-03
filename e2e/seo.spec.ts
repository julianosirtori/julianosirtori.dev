import { test, expect } from "@playwright/test";

test.describe("SEO", () => {
  test("should have proper meta tags on home page", async ({ page }) => {
    await page.goto("/en");

    await expect(page).toHaveTitle(/Juliano Sirtori/);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toBeTruthy();

    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute("content");
    expect(ogTitle).toBeTruthy();
  });

  test("should have proper meta tags on blog post", async ({ page }) => {
    await page.goto("/en/blog");

    const firstPost = page.locator("ul li a").first();
    await firstPost.click();

    await expect(page).toHaveTitle(/Juliano Sirtori/);
  });

  test("should have proper HTML lang attribute", async ({ page }) => {
    await page.goto("/en");
    const htmlLang = await page.locator("html").getAttribute("lang");
    expect(htmlLang).toBe("en");

    await page.goto("/pt");
    const htmlLangPt = await page.locator("html").getAttribute("lang");
    expect(htmlLangPt).toBe("pt");
  });
});
