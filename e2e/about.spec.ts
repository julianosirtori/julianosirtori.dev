import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test("should display the about page with bio", async ({ page }) => {
    await page.goto("/en/about");

    await expect(page.locator("h1")).toContainText("Discover more about me");
    await expect(page.locator("img[alt='juliano']")).toBeVisible();
  });

  test("should display career section", async ({ page }) => {
    await page.goto("/en/about");

    await expect(page.getByRole("heading", { name: /career/i })).toBeVisible();
  });

  test("should display recommendations section", async ({ page }) => {
    await page.goto("/en/about");

    await expect(
      page.getByRole("heading", { name: /recommendations/i }),
    ).toBeVisible();
  });

  test("should display about page in Portuguese", async ({ page }) => {
    await page.goto("/pt/about");

    await expect(page.locator("h1")).toContainText("Descubra mais sobre mim");
    await expect(page.locator("img[alt='juliano']")).toBeVisible();
  });
});
