import { test, expect } from "@playwright/test";

test.describe("Projects Page", () => {
  test("should display the projects page", async ({ page }) => {
    await page.goto("/en/projects");

    await expect(page.locator("h1")).toContainText(
      "Projects and side projects",
    );
    await expect(page.locator('a[target="_blank"]').first()).toBeVisible();
    await expect(page.getByText("ClinicaALL")).toHaveCount(0);
    await expect(page.getByText(/case stud/i)).toHaveCount(0);
  });

  test("should display projects grouped by year", async ({ page }) => {
    await page.goto("/en/projects");

    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("should display projects page in Portuguese", async ({ page }) => {
    await page.goto("/pt/projects");

    await expect(page.locator("h1")).toContainText("Projetos e side projects");
  });
});
