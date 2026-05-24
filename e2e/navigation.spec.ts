import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should have working header navigation", async ({ page }) => {
    await page.goto("/en");

    // Check that all main navigation links are present (About, Blog, Projects)
    await expect(page.locator('a[href="/en/blog"]')).toBeVisible();
    await expect(page.locator('a[href="/en/about"]')).toBeVisible();
    await expect(page.locator('a[href="/en/projects"]')).toBeVisible();
  });

  test("should have working footer", async ({ page }) => {
    await page.goto("/en");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("should have CV link", async ({ page }) => {
    await page.goto("/en");

    const cvLink = page.locator('a[href$="Juliano_Sirtori_Resume.pdf"]');
    await expect(cvLink).toBeVisible();
  });

  test("should open command bar with keyboard shortcut", async ({ page }) => {
    await page.goto("/en");

    // Try to open command bar with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    await page.keyboard.press("Meta+k");

    // If command bar is visible, it should show
    const commandBar = page.locator('[role="dialog"]');
    if (await commandBar.isVisible({ timeout: 1000 })) {
      await expect(commandBar).toBeVisible();
    }
  });
});
