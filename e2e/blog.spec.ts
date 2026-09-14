import { test, expect } from "@playwright/test";

test.describe("Blog Page", () => {
  test("keeps published articles reachable after a missing route", async ({
    page,
  }) => {
    for (const locale of ["pt", "en"]) {
      const missing = await page.goto(`/${locale}/missing/route`);
      expect(missing?.status()).toBe(404);

      const article = await page.goto(`/${locale}/blog/sse`);
      expect(article?.status()).toBe(200);
      await expect(page.locator("#post-content")).toContainText(
        "Server-Sent Events",
      );
      await expect(page).toHaveTitle(/Juliano Sirtori - .*SSE/);
    }
  });

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

    await expect(page.locator("article")).toBeVisible();
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
    await expect(
      codeBlock.getByRole("button", { name: "Copiar código" }),
    ).toBeVisible();
    await expect(codeBlock.locator("pre")).toHaveAttribute("tabindex", "0");
    await expect(codeBlock.locator("code")).toHaveAttribute(
      "data-theme",
      /github-light/,
    );
  });

  for (const locale of ["pt", "en"] as const) {
    test(`searches keywords, combines filters and resets in ${locale}`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/blog`);
      const search = page.getByRole("searchbox");
      const topic = page.getByRole("combobox", {
        name: locale === "pt" ? "Tema" : "Topic",
      });
      const results = page.locator("#blog-results");
      const originalCount = await results.getByRole("link").count();
      await topic.selectOption("next.js");
      await expect(results.getByRole("link")).toHaveCount(2);
      await search.fill("SSE");
      await expect(results.getByRole("link")).toHaveCount(1);
      await expect(page.locator("main").getByRole("status")).toHaveText(
        locale === "pt" ? "1 artigo" : "1 article",
      );
      await search.fill("zz-no-match");
      await expect(results.getByRole("link")).toHaveCount(0);
      await expect(results).toContainText(
        locale === "pt" ? "Nenhum artigo encontrado" : "No articles found",
      );
      await page
        .getByRole("button", {
          name: locale === "pt" ? "Limpar filtros" : "Clear filters",
        })
        .click();
      await expect(search).toBeFocused();
      await expect(topic).toHaveValue("");
      await expect(results.getByRole("link")).toHaveCount(originalCount);
    });

    test(`keeps post metadata and navigation localized in ${locale}`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/blog/sse`);
      const title = await page.locator("h1").innerText();
      await expect(page).toHaveTitle(`Juliano Sirtori - ${title}`);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        `https://julianosirtori.dev/${locale}/blog/sse`,
      );
      const navigation = page.getByRole("navigation", {
        name:
          locale === "pt" ? "Navegação entre artigos" : "Article navigation",
      });
      await expect(navigation.getByRole("link")).toHaveCount(2);
      for (const link of await navigation.getByRole("link").all())
        await expect(link).toHaveAttribute(
          "href",
          new RegExp(`^/${locale}/blog/`),
        );
      const related = page.getByRole("region", {
        name: locale === "pt" ? "Leia em seguida" : "Read next",
      });
      await expect(related.getByRole("link")).toHaveCount(2);
      await expect(related.locator('a[href$="/sse"]')).toHaveCount(0);
      await page
        .getByRole("link", {
          name: locale === "pt" ? "Voltar ao blog" : "Back to the blog",
        })
        .click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/blog$`));
    });
  }

  test("keeps publication dates stable in a negative UTC offset", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      timezoneId: "America/Sao_Paulo",
    });
    const page = await context.newPage();
    await page.goto("/pt/blog");
    const date = page.locator('#blog-results time[datetime^="2026-01-08"]');
    await expect(date).toHaveText("8 de jan.");
    await page.goto("/pt/blog/primeiro-video");
    await expect(
      page.locator('main header time[datetime^="2026-01-08"]'),
    ).toHaveText("8 de jan. de 2026");
    await expect(page.locator("main aside")).toHaveCount(0);
    await context.close();
  });

  test("uses a keyboard-operable inline index on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/pt/blog/sse");
    const details = page.locator("main aside details");
    const summary = details.locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    const link = details.getByRole("link", { name: "Exemplo com Next.js" });
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(details).not.toHaveAttribute("open");
    const heading = page.locator("#exemplo-com-nextjs");
    await expect(heading).toBeFocused();
    await expect(page).toHaveURL(/#exemplo-com-nextjs$/);
    expect(
      await heading.evaluate((el) => el.getBoundingClientRect().top),
    ).toBeGreaterThan(
      await page
        .locator("header")
        .first()
        .evaluate((el) => el.getBoundingClientRect().bottom),
    );
  });

  test("tracks the active section in the desktop sidebar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/pt/blog/sse");
    const toc = page.getByRole("navigation", { name: "Neste artigo" });
    const example = toc.getByRole("link", { name: "Exemplo com Next.js" });
    await example.click();
    await expect(example).toHaveAttribute("aria-current", "location");
    const first = toc.getByRole("link", {
      name: "Server-Sent Events",
      exact: true,
    });
    await first.click();
    await expect(first).toHaveAttribute("aria-current", "location");
    await expect(example).not.toHaveAttribute("aria-current");
  });

  test("keeps mobile text, images and code within the viewport in both themes", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const theme of ["light", "dark"]) {
      await page.addInitScript(
        (value) => localStorage.setItem("theme", value),
        theme,
      );
      for (const route of [
        "/pt/blog",
        "/pt/blog/sse",
        "/en/blog/primeiro-video",
      ]) {
        await page.goto(route);
        await expect(page.locator("h1")).toBeVisible();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(320);
      }
      await page.goto("/pt/blog/sse");
      await expect(page.locator("article ul").first()).toHaveCSS(
        "list-style-type",
        "disc",
      );
      await expect(page.locator("article li").first()).toHaveCSS(
        "font-size",
        "18px",
      );
      const pre = page.locator("article pre").first();
      expect(await pre.evaluate((el) => el.scrollWidth)).toBeGreaterThan(
        await pre.evaluate((el) => el.clientWidth),
      );
      await expect(pre).toHaveCSS("overflow-x", "auto");
      const code = page.locator("[data-code-block]").first();
      const toolbar = code.getByRole("button", { name: "Copiar código" });
      expect((await toolbar.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await toolbar.scrollIntoViewIfNeeded();
      expect(
        await toolbar.evaluate((el) => el.getBoundingClientRect().bottom),
      ).toBeLessThanOrEqual(
        await pre.evaluate((el) => el.getBoundingClientRect().top),
      );
    }
  });

  test("keeps comments opt-in and copies the complete code example", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/pt/blog/sse");
    await expect(page.locator("giscus-widget, .giscus-frame")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Carregar comentários" }),
    ).toHaveAttribute("aria-expanded", "false");
    const code = page.locator("[data-code-block]").first();
    const content = await code.locator("pre").textContent();
    await code.getByRole("button", { name: "Copiar código" }).click();
    await expect(code.getByRole("button", { name: "Copiado" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      content,
    );
  });

  test("renders the archive and article outline without JavaScript", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto("/pt/blog");
    await expect(page.locator('#blog-results a[href*="/blog/"]')).toHaveCount(
      15,
    );
    await page.goto("/pt/blog/sse");
    await expect(page.locator("article")).toContainText(
      "Reconexão automática.",
    );
    await page.locator("summary").click();
    await expect(
      page
        .getByRole("link", { name: "Exemplo com Next.js", exact: true })
        .first(),
    ).toBeVisible();
    await context.close();
  });
});
