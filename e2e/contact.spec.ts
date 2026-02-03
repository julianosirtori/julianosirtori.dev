import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test("should display the contact page with form", async ({ page }) => {
    await page.goto("/en/contact");

    await expect(page.locator("h1")).toContainText("Contact");
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.goto("/en/contact");

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await expect(page.locator('input[name="name"]:invalid')).toBeVisible();
  });

  test("should display contact page in Portuguese", async ({ page }) => {
    await page.goto("/pt/contact");

    await expect(page.locator("h1")).toContainText("Contato");
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });
});
