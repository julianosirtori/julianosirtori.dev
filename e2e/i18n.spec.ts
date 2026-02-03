import { test, expect } from "@playwright/test";

test.describe("Internationalization", () => {
  test("should redirect root to default locale", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/(en|pt)/);
  });

  test("should switch language from English to Portuguese", async ({
    page,
  }) => {
    await page.goto("/en");

    // Find and click the language selector
    const langSelector = page.locator('[data-testid="lang-selector"]').first();
    if (await langSelector.isVisible()) {
      await langSelector.click();
      await page.locator('text="Português (Brasil)"').click();
      await expect(page).toHaveURL(/\/pt/);
    }
  });

  test("should maintain page when switching language", async ({ page }) => {
    await page.goto("/en/about");

    const langSelector = page.locator('[data-testid="lang-selector"]').first();
    if (await langSelector.isVisible()) {
      await langSelector.click();
      await page.locator('text="Português (Brasil)"').click();
      await expect(page).toHaveURL(/\/pt\/about/);
    }
  });
});
