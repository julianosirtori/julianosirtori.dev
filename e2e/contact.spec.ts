import { test, expect } from "@playwright/test";

test.describe("Work With Me Page", () => {
  test("should display the collaboration form", async ({ page }) => {
    await page.goto("/en/work-with-me");

    await expect(page.locator("h1")).toContainText("Let's work together");
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="companyOrProject"]')).toBeVisible();
    await expect(
      page.locator('select[name="collaborationType"]'),
    ).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test("should have submit button", async ({ page }) => {
    await page.goto("/en/work-with-me");

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Send");
  });

  test("should display the page in Portuguese", async ({ page }) => {
    await page.goto("/pt/work-with-me");

    await expect(page.locator("h1")).toContainText("Vamos trabalhar juntos");
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test("should redirect the previous contact URL", async ({ page }) => {
    await page.goto("/en/contact");

    await expect(page).toHaveURL(/\/en\/work-with-me$/);
  });
});
