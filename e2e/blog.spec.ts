import { test, expect } from "@playwright/test";

test.describe("Blog Page", () => {
  test("should display the blog page with articles", async ({ page }) => {
    await page.goto("/en/blog");

    await expect(
      page.getByRole("heading", { level: 1, name: "All articles" }),
    ).toBeVisible();
    await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible();
  });

  test("should navigate to a blog post", async ({ page }) => {
    await page.goto("/en/blog");

    const firstPost = page.locator('a[href*="/blog/"]').first();
    await firstPost.click();

    await expect(page.locator("article, main")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should display blog in Portuguese", async ({ page }) => {
    await page.goto("/pt/blog");

    await expect(
      page.getByRole("heading", { level: 1, name: "Todos os artigos" }),
    ).toBeVisible();
    await expect(page.locator('a[href*="/blog/"]').first()).toBeVisible();
  });

  test("should render code blocks without the legacy frame", async ({
    page,
  }) => {
    await page.goto("/pt/blog/sse");

    const codeBlock = page.locator("[data-rehype-pretty-code-figure]").first();

    await expect(codeBlock.locator("pre")).toHaveCSS("border-top-width", "0px");
    await expect(codeBlock.locator("code")).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
  });
});
