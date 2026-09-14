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

    await expect(
      page.locator("#project-results").getByRole("heading", { level: 2 }),
    ).toHaveText(["2024", "2023", "2022", "2021", "2020", "2018"]);
    await expect(page.locator("#project-results li")).toHaveCount(8);
  });

  test("should display projects page in Portuguese", async ({ page }) => {
    await page.goto("/pt/projects");

    await expect(page.locator("h1")).toContainText("Projetos e side projects");
    await expect(
      page.getByText(
        "Dicas do livro O Programador Pragmático, direto no terminal.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Fisio Milena Aranha" }),
    ).toBeVisible();
  });

  for (const locale of [
    {
      lang: "pt",
      group: "Filtrar projetos",
      all: "Todos",
      personal: "Pessoais",
      client: "Clientes",
      company: "Em equipe",
      singleResult: "1 projeto nesta seleção",
      experience: "veja minha experiência",
    },
    {
      lang: "en",
      group: "Filter projects",
      all: "All",
      personal: "Personal",
      client: "Clients",
      company: "Teamwork",
      singleResult: "1 project in this selection",
      experience: "see my experience",
    },
  ]) {
    test(`should filter projects and preserve year grouping in ${locale.lang}`, async ({
      page,
    }) => {
      await page.goto(`/${locale.lang}/projects`);
      const filters = page.getByRole("group", { name: locale.group });
      const results = page.locator("#project-results");

      await filters
        .getByRole("button", { name: locale.personal, exact: true })
        .click();
      await expect(results.locator("li")).toHaveCount(4);
      await expect(results.getByRole("heading", { level: 2 })).toHaveText([
        "2024",
        "2023",
        "2022",
      ]);

      await filters
        .getByRole("button", { name: locale.company, exact: true })
        .click();
      await expect(results.locator("li")).toHaveCount(3);
      await expect(results.getByRole("heading", { level: 2 })).toHaveText([
        "2021",
        "2020",
        "2018",
      ]);

      await filters
        .getByRole("button", { name: locale.client, exact: true })
        .click();
      await expect(results.locator("li")).toHaveCount(1);
      await expect(results.getByRole("heading", { level: 2 })).toHaveText([
        "2024",
      ]);
      await expect(results.getByRole("heading", { level: 3 })).toHaveText([
        "Fisio Milena Aranha",
      ]);
      await expect(page.locator("main").getByRole("status")).toHaveText(
        locale.singleResult,
      );
      await expect(filters.locator('[aria-pressed="true"]')).toHaveCount(1);

      await filters
        .getByRole("button", { name: locale.all, exact: true })
        .click();
      await expect(results.locator("li")).toHaveCount(8);
      await expect(
        page.getByRole("link", { name: locale.experience }),
      ).toHaveAttribute("href", `/${locale.lang}/about#experience`);
    });
  }

  test("should support keyboard filtering and preserve focus", async ({
    page,
  }) => {
    await page.goto("/en/projects");
    const filters = page.getByRole("group", { name: "Filter projects" });
    const all = filters.getByRole("button", { name: "All", exact: true });
    const personal = filters.getByRole("button", {
      name: "Personal",
      exact: true,
    });
    const clients = filters.getByRole("button", {
      name: "Clients",
      exact: true,
    });

    await all.focus();
    await page.keyboard.press("Tab");
    await expect(personal).toBeFocused();
    await page.keyboard.press("Space");
    await expect(personal).toHaveAttribute("aria-pressed", "true");
    await expect(personal).toBeFocused();
    await expect(page.locator("#project-results li")).toHaveCount(4);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(clients).toHaveAttribute("aria-pressed", "true");
    await expect(clients).toBeFocused();
    await expect(page.locator("#project-results li")).toHaveCount(1);
  });

  test("should describe external destinations and open them safely", async ({
    page,
  }) => {
    await page.goto("/pt/projects");
    const packageLink = page.getByRole("link", {
      name: "cowsay-pragmatic-programmer",
      exact: true,
    });
    await expect(packageLink).toHaveAttribute(
      "href",
      "https://www.npmjs.com/package/cowsay-pragmatic-programmer",
    );
    await expect(packageLink).toHaveAccessibleDescription(
      "Ver no npm — Abre em uma nova aba",
    );
    const videoLink = page.getByRole("link", {
      name: "aiqfome no super app do Magalu",
      exact: true,
    });
    await expect(videoLink).toHaveAccessibleDescription(
      "Ver vídeo — Abre em uma nova aba",
    );
    for (const link of await page.locator("#project-results a").all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  test("should fit a narrow mobile screen with readable filters", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/pt/projects");
    const filters = page.getByRole("group", { name: "Filtrar projetos" });
    for (const button of await filters.getByRole("button").all()) {
      await expect(button).toBeVisible();
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
    await filters
      .getByRole("button", { name: "Em equipe", exact: true })
      .click();
    await expect(page.locator("#project-results li")).toHaveCount(3);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
  });
});
