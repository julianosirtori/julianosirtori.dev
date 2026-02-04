import { test, expect } from "@playwright/test";

test.describe("Blog Page", () => {
  test("should display the blog page with articles", async ({ page }) => {
    await page.goto("/en/blog");

    await expect(page.locator("h1")).toContainText("Teaching is learning");
    await expect(page.locator("ul li").first()).toBeVisible();
  });

  test("should navigate to a blog post", async ({ page }) => {
    await page.goto("/en/blog");

    const firstPost = page.locator("ul li a").first();
    await firstPost.click();

    await expect(page.locator("article, main")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should display blog in Portuguese", async ({ page }) => {
    await page.goto("/pt/blog");

    await expect(page.locator("h1")).toContainText("Ensinar é aprender");
    await expect(page.locator("ul li").first()).toBeVisible();
  });
});
