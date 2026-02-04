import { test, expect } from "@playwright/test";

test.describe("Contact Page", () => {
  test("should display the contact page with form", async ({ page }) => {
    await page.goto("/en/contact");

    await expect(page.locator("h1")).toContainText("Get in touch with me");
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test("should have submit button", async ({ page }) => {
    await page.goto("/en/contact");

    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText("Send");
  });

  test("should display contact page in Portuguese", async ({ page }) => {
    await page.goto("/pt/contact");

    await expect(page.locator("h1")).toContainText("Entre em contato comigo");
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });
});
