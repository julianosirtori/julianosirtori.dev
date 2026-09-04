import { test, expect } from "@playwright/test";

test.describe("Not found page", () => {
  test("shows the English page for an unknown localized route", async ({
    page,
  }) => {
    await page.goto("/en/route-that-does-not-exist");

    await expect(
      page.getByRole("heading", { name: "This page was not found." }),
    ).toBeVisible();
  });

  test("shows the Portuguese page for an unknown localized route", async ({
    page,
  }) => {
    await page.goto("/pt/rota-que-nao-existe");

    await expect(
      page.getByRole("heading", { name: "Esta página não foi encontrada." }),
    ).toBeVisible();
  });

  test("returns 404 for an unknown request outside locale routing", async ({
    request,
  }) => {
    const response = await request.get("/missing.txt");

    expect(response.status()).toBe(404);
  });

  test("shows the custom page outside locale routing", async ({ page }) => {
    await page.goto("/missing.txt");

    await expect(
      page.getByRole("heading", { name: "This page was not found." }),
    ).toBeVisible();
  });
});
