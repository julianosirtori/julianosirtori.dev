import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the home page in English", async ({ page }) => {
    await page.goto("/en");

    await expect(page).toHaveTitle(/Juliano Sirtori/);
    await expect(page.locator("h1")).toContainText("Juliano Sirtori");
    await expect(page.locator("h2").first()).toContainText("Front-end");
  });

  test("should display the home page in Portuguese", async ({ page }) => {
    await page.goto("/pt");

    await expect(page).toHaveTitle(/Juliano Sirtori/);
    await expect(page.locator("h1")).toContainText("Juliano Sirtori");
  });

  test("should navigate to blog page", async ({ page }) => {
    await page.goto("/en");

    await page.click('a[href="/en/blog"]');
    await expect(page).toHaveURL(/.*\/blog/);
  });

  test("should navigate to about page", async ({ page }) => {
    await page.goto("/en");

    await page.click('a[href="/en/about"]');
    await expect(page).toHaveURL(/.*\/about/);
  });

  test("should navigate to contact page", async ({ page }) => {
    await page.goto("/en");

    await page.click('a[href="/en/contact"]');
    await expect(page).toHaveURL(/.*\/contact/);
  });

  test("should navigate to projects page", async ({ page }) => {
    await page.goto("/en");

    await page.click('a[href="/en/projects"]');
    await expect(page).toHaveURL(/.*\/projects/);
  });
});
