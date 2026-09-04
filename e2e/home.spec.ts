import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the home page in English", async ({ page }) => {
    await page.goto("/en");

    await expect(page).toHaveTitle(/Juliano Sirtori/);
    await expect(page.locator("h1")).toContainText("Juliano Sirtori");
    await expect(page.getByText("Building Things")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Front" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Recommendations" }),
    ).toBeVisible();
    await expect(page.getByText("Use cases", { exact: true })).toHaveCount(0);
    const latestPosts = page.locator('#writing a[href^="/en/blog/"]');
    await expect(latestPosts).toHaveCount(2);
    await expect(latestPosts.first()).toBeVisible();
    await expect(latestPosts.last()).toBeVisible();
  });

  test("should display the home page in Portuguese", async ({ page }) => {
    await page.goto("/pt");

    await expect(page).toHaveTitle(/Juliano Sirtori/);
    await expect(page.locator("h1")).toContainText("Juliano Sirtori");
    await expect(page.getByText("Building Things")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Recomendações" }),
    ).toBeVisible();
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

  test("should navigate to projects page", async ({ page }) => {
    await page.goto("/en");

    await page.click('a[href="/en/projects"]');
    await expect(page).toHaveURL(/.*\/projects/);
  });

  test("should navigate to work-with-me", async ({ page }) => {
    await page.goto("/en");

    await page.click('a[href="/en/work-with-me"]');
    await expect(page).toHaveURL(/.*\/work-with-me/);
  });
});
