import { expect, test, type BrowserContext, type Page } from "@playwright/test";

/*
 * Skills catalog, in fixture mode.
 *
 * playwright.config.ts starts the server with SKILLS_FIXTURE=one, so the
 * catalog never calls GitHub. Each test can switch the dataset for its own
 * requests with the `skills-fixture` cookie:
 *
 *   empty    no skills
 *   one      mac-cleanup (default)
 *   many     12 skills in 3 categories (filters on)
 *   thirty   30 skills
 *   invalid  one valid skill, invalid ones left out, broken marketplace.json
 *   down     GitHub unreachable with nothing cached
 *
 * Datasets live in src/lib/skills/fixtures. If you reuse a dev server, start
 * it with SKILLS_FIXTURE=one or these tests will read the real repository.
 */

type Fixture = "empty" | "one" | "many" | "thirty" | "invalid" | "down";

const SLUG = "mac-cleanup";
const SHA = "180c1b57fdc1024c9a699436b313fd0a7bfd7e5e";
const FOLDER_URL = `https://github.com/julianosirtori/skills/tree/main/skills/${SLUG}`;
const NPX = `npx skills add julianosirtori/skills --skill ${SLUG} -g`;

async function useFixture(context: BrowserContext, fixture: Fixture) {
  await context.addCookies([
    { name: "skills-fixture", value: fixture, url: "http://localhost:3000" },
  ]);
}

/** Records what the page writes to the clipboard, in any browser. */
async function recordClipboard(page: Page, { fail = false } = {}) {
  await page.addInitScript((shouldFail) => {
    const copied: string[] = [];
    Object.assign(window, { __copied: copied });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          if (shouldFail) throw new Error("Clipboard blocked");
          copied.push(text);
        },
      },
    });
  }, fail);
  return async () =>
    page.evaluate(() => (window as unknown as { __copied: string[] }).__copied);
}

async function lastCopied(read: () => Promise<string[]>) {
  await expect.poll(async () => (await read()).length).toBeGreaterThan(0);
  return (await read()).at(-1);
}

test.describe("Skills list", () => {
  test("lists the skill with its metadata in English", async ({ page }) => {
    await page.goto("/en/skills");

    await expect(
      page.getByRole("heading", { level: 1, name: "Agent skills" }),
    ).toBeVisible();
    await expect(page.getByText("1 skill", { exact: true })).toBeVisible();
    await expect(page.getByRole("searchbox")).toHaveCount(0);

    const row = page.getByRole("link", { name: SLUG });
    await expect(row).toHaveAttribute("href", `/en/skills/${SLUG}`);
    for (const text of [
      "productivity",
      "v1.0.0",
      "Updated Oct 3, 2026",
      "macOS 13 or later.",
      "3 scripts",
      "3 references",
    ]) {
      await expect(row).toContainText(text);
    }
  });

  test("uses Portuguese copy and dates", async ({ page }) => {
    await page.goto("/pt/skills");

    await expect(
      page.getByRole("heading", { level: 1, name: "Skills para agentes" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: SLUG })).toContainText(
      "Atualizada em 3 de out. de 2026",
    );
  });

  test("explains an empty repository", async ({ page, context }) => {
    await useFixture(context, "empty");
    await page.goto("/en/skills");

    await expect(page.getByText("No skills published yet.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Open the repository/ }),
    ).toBeVisible();
    await expect(page.getByText(/^\d+ skills?$/)).toHaveCount(0);
  });

  test("shows the error state with HTTP 200 and noindex when GitHub is down", async ({
    page,
    context,
  }) => {
    await useFixture(context, "down");
    const response = await page.goto("/en/skills");

    expect(response?.status()).toBe(200);
    await expect(
      page.getByText("Couldn't reach GitHub right now."),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Try again" })).toHaveAttribute(
      "href",
      "/en/skills",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });

  test("filters eight or more skills by text and category", async ({
    page,
    context,
  }) => {
    await useFixture(context, "many");
    await page.goto("/en/skills");

    const results = page.locator("#skills-results li");
    await expect(results).toHaveCount(12);

    const filter = page.getByRole("searchbox", {
      name: "Filter by name or keyword",
    });
    await filter.fill("pr-description");
    await expect(results).toHaveCount(1);
    await expect(page.getByRole("status").first()).toHaveText(
      "Showing 1 of 12",
    );

    await filter.fill("zzz");
    await expect(page.getByText('No skill matches "zzz".')).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).first().click();
    await expect(results).toHaveCount(12);

    const categories = page.getByRole("group", { name: "Categories" });
    await categories.getByRole("button", { name: /writing/ }).click();
    await expect(results).toHaveCount(3);
    await expect(
      categories.getByRole("button", { name: /writing/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("shows thirty skills without pagination", async ({ page, context }) => {
    await useFixture(context, "thirty");
    await page.goto("/en/skills");
    await expect(page.locator("#skills-results li")).toHaveCount(30);
  });

  test("leaves invalid skills out", async ({ page, context }) => {
    await useFixture(context, "invalid");
    await page.goto("/en/skills");

    await expect(page.locator("#skills-results li")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "valid-skill" })).toBeVisible();
    await expect(page.getByText("name-mismatch")).toHaveCount(0);
  });
});

test.describe("Skill detail", () => {
  test("opens from the list with the universal command selected", async ({
    page,
  }) => {
    await page.goto("/en/skills");
    await page.getByRole("link", { name: SLUG }).click();

    await expect(page).toHaveURL(`/en/skills/${SLUG}`);
    await expect(
      page.getByRole("heading", { level: 1, name: SLUG }),
    ).toBeVisible();
    await expect(page.getByRole("tab", { name: "Any agent" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("tabpanel")).toContainText(NPX);
  });

  test("copies the universal command and the GitHub link", async ({ page }) => {
    const copied = await recordClipboard(page);
    await page.goto(`/en/skills/${SLUG}`);

    await page
      .getByRole("button", { name: "Copy install command for any agent" })
      .click();
    expect(await lastCopied(copied)).toBe(NPX);
    await expect(page.locator("#install p[role=status]")).toHaveText(
      "Command copied",
    );

    await page.getByRole("button", { name: "Copy GitHub link" }).click();
    await expect.poll(async () => (await copied()).at(-1)).toBe(FOLDER_URL);
  });

  for (const { tab, agent, name } of [
    { tab: "Claude Code", agent: "claude-code", name: "Claude Code" },
    { tab: "OpenCode", agent: "opencode", name: "OpenCode" },
    { tab: "Codex", agent: "codex", name: "Codex" },
    { tab: "Other agents", agent: "cursor", name: "Cursor" },
    { tab: "Other agents", agent: "gemini-cli", name: "Gemini CLI" },
    { tab: "Other agents", agent: "github-copilot", name: "GitHub Copilot" },
  ]) {
    test(`copies the ${agent} command`, async ({ page }) => {
      const copied = await recordClipboard(page);
      await page.goto(`/en/skills/${SLUG}`);

      await page.getByRole("tab", { name: tab }).click();
      await page
        .getByRole("button", { name: `Copy install command for ${name}` })
        .click();
      await expect
        .poll(async () => (await copied()).at(-1))
        .toBe(`${NPX} -a ${agent}`);
    });
  }

  test("copies the two Claude Code plugin commands one at a time", async ({
    page,
  }) => {
    const copied = await recordClipboard(page);
    await page.goto(`/en/skills/${SLUG}`);

    await page.getByRole("tab", { name: "Claude Code" }).click();
    await page.getByRole("button", { name: "Copy plugin step 1" }).click();
    await page.getByRole("button", { name: "Copy plugin step 2" }).click();
    await expect
      .poll(copied)
      .toEqual([
        "/plugin marketplace add julianosirtori/skills",
        "/plugin install mac-cleanup@julianosirtori-skills",
      ]);
  });

  test("offers the prompt and the manual install, following the agent", async ({
    page,
  }) => {
    const copied = await recordClipboard(page);
    await page.goto(`/en/skills/${SLUG}`);

    await page.getByText("Ask your agent").click();
    await page
      .getByRole("button", { name: "Copy prompt for your agent" })
      .click();
    const prompt = await lastCopied(copied);
    expect(prompt).toContain(FOLDER_URL);
    expect(prompt).toContain(`\`${NPX}\``);

    await page.getByText("Install by hand").click();
    const manual = page.locator("details", { hasText: "Install by hand" });
    await expect(manual).toContainText(
      "git clone https://github.com/julianosirtori/skills.git ~/Developer/skills",
    );
    await expect(manual).toContainText(
      `ln -s ~/Developer/skills/skills/${SLUG} ~/.claude/skills/${SLUG}`,
    );
    await manual.getByLabel("Agent").selectOption("codex");
    await expect(manual).toContainText(`~/.agents/skills/${SLUG}`);

    await page.getByRole("tab", { name: "OpenCode" }).click();
    await expect(manual.getByLabel("Agent")).toHaveValue("opencode");
  });

  test("moves between agent tabs with the keyboard", async ({ page }) => {
    const copied = await recordClipboard(page);
    await page.goto(`/en/skills/${SLUG}`);

    const anyAgent = page.getByRole("tab", { name: "Any agent" });
    await anyAgent.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Claude Code" })).toBeFocused();
    await page.keyboard.press("End");
    await expect(
      page.getByRole("tab", { name: "Other agents" }),
    ).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(anyAgent).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Copy install command for any agent" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    expect(await lastCopied(copied)).toBe(NPX);
  });

  test("keeps the command selectable when the clipboard fails", async ({
    page,
  }) => {
    await recordClipboard(page, { fail: true });
    await page.goto(`/en/skills/${SLUG}`);

    await page
      .getByRole("button", { name: "Copy install command for any agent" })
      .click();
    await expect(page.locator("#install").getByRole("alert")).toContainText(
      "Couldn't copy",
    );
    expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(
      NPX,
    );
  });

  test("renders SKILL.md as sanitized markdown", async ({ page }) => {
    await page.goto(`/en/skills/${SLUG}`);

    const body = page.locator("#instructions .prose");
    await expect(body).toHaveAttribute("lang", "en");
    await expect(
      body.getByRole("heading", { name: "Three tiers" }),
    ).toBeVisible();
    await expect(
      body.getByRole("heading", { name: "Mac Cleanup" }),
    ).toHaveCount(0);
    await expect(body.locator("details")).toHaveCount(1);
    await expect(
      body.getByRole("link", { name: "the locations guide" }),
    ).toHaveAttribute(
      "href",
      `https://github.com/julianosirtori/skills/blob/${SHA}/skills/${SLUG}/references/locations.md`,
    );
    await body.getByText("unsafe link").click();
    expect(
      await page.evaluate(
        () => (window as { __skillXss?: boolean }).__skillXss,
      ),
    ).toBeUndefined();
    await expect(body.locator("script")).toHaveCount(0);
  });

  test("shows the scripts notice, the files and the pre-approved tools", async ({
    page,
  }) => {
    await page.goto(`/en/skills/${SLUG}`);

    await expect(
      page.getByText("This skill ships 3 scripts that run on your machine."),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /See the scripts/ }),
    ).toHaveAttribute("href", `${FOLDER_URL}/scripts`);
    const details = page.locator("#details");
    await expect(
      details.getByRole("link", { name: /SKILL\.md/ }),
    ).toBeVisible();
    await expect(details.getByRole("link", { name: /scan\.sh/ })).toBeVisible();
    await expect(details).toContainText("Bash(bash scripts/scan.sh:*)");
  });

  test("marks the English content on the Portuguese page", async ({ page }) => {
    await page.goto(`/pt/skills/${SLUG}`);

    await expect(
      page.getByRole("heading", { level: 2, name: "Instalar" }),
    ).toBeVisible();
    await expect(
      page.getByText("A skill é escrita em inglês, igual no repositório."),
    ).toBeVisible();
    await expect(page.locator("#instructions .prose")).toHaveAttribute(
      "lang",
      "en",
    );
    await expect(
      page.getByRole("button", {
        name: "Copiar comando de instalação (qualquer agente)",
      }),
    ).toBeVisible();
  });

  test("answers 404 for an unknown skill and links back to the catalog", async ({
    page,
  }) => {
    const response = await page.goto("/en/skills/does-not-exist");

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "This skill isn't in the catalog." }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "See all skills" }),
    ).toHaveAttribute("href", "/en/skills");
  });

  test("answers 404 for a slug outside the name format", async ({
    request,
  }) => {
    expect((await request.get("/en/skills/Not_A_Skill")).status()).toBe(404);
  });

  test("shows an error, not a 404, when GitHub is down", async ({
    page,
    context,
  }) => {
    await useFixture(context, "down");
    const response = await page.goto(`/en/skills/${SLUG}`);

    expect(response?.status()).toBe(200);
    await expect(
      page.getByText("This skill's files are still in the repository."),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Open the folder on GitHub/ }),
    ).toHaveAttribute("href", FOLDER_URL);
  });
});

test.describe("Skills SEO and privacy", () => {
  test("list and detail have canonical, hreflang and Open Graph", async ({
    page,
  }) => {
    for (const path of ["/en/skills", `/pt/skills/${SLUG}`]) {
      await page.goto(path);
      await expect(page).toHaveTitle(/Juliano Sirtori/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://julianosirtori.dev${path}`,
      );
      for (const lang of ["en", "pt"]) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${lang}"]`),
        ).toHaveCount(1);
      }
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    }
    await expect(page).toHaveTitle(/mac-cleanup/);
  });

  test("serves 1200x630 OG images, even with GitHub down", async ({
    page,
    context,
    request,
  }) => {
    for (const path of ["/en/skills", `/en/skills/${SLUG}`]) {
      await page.goto(path);
      const url = new URL(
        (await page
          .locator('meta[property="og:image"]')
          .getAttribute("content"))!,
      );
      await expect(
        page.locator('meta[property="og:image:width"]'),
      ).toHaveAttribute("content", "1200");
      const image = await request.get(url.pathname);
      expect(image.status()).toBe(200);
      expect(image.headers()["content-type"]).toBe("image/png");
    }

    await useFixture(context, "down");
    const fallback = await context.request.get(
      `/en/skills/${SLUG}/opengraph-image/card`,
    );
    expect(fallback.status()).toBe(200);
  });

  test("lists the catalog and each skill in the sitemap", async ({
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of [
      "/en/skills",
      "/pt/skills",
      `/en/skills/${SLUG}`,
      `/pt/skills/${SLUG}`,
    ]) {
      expect(sitemap).toContain(`${path}</loc>`);
    }
  });

  test("never calls GitHub from the browser", async ({ page }) => {
    const githubRequests: string[] = [];
    page.on("request", (request) => {
      if (/api\.github\.com|raw\.githubusercontent\.com/.test(request.url())) {
        githubRequests.push(request.url());
      }
    });
    await recordClipboard(page);
    await page.goto("/en/skills");
    await page.getByRole("link", { name: SLUG }).click();
    await page.getByRole("tab", { name: "Codex" }).click();
    await page
      .getByRole("button", { name: /^Copy install command/ })
      .first()
      .click();
    expect(githubRequests).toEqual([]);
  });
});

test.describe("Skills entry points", () => {
  for (const lang of ["en", "pt"]) {
    test(`footer and command palette lead to the catalog (${lang})`, async ({
      page,
    }) => {
      await page.goto(`/${lang}`);
      await expect(
        page.locator(`footer a[href="/${lang}/skills"]`),
      ).toBeVisible();
      await expect(
        page.locator(`header a[href="/${lang}/skills"]`),
      ).toHaveCount(0);
    });
  }

  test("finds the catalog in the command palette", async ({ page }) => {
    await page.goto("/en");
    await page.locator("body").press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.type("codex");
    await dialog.getByRole("option", { name: "Agent skills" }).click();
    await expect(page).toHaveURL("/en/skills");
  });

  test("links the catalog from about and work with me", async ({ page }) => {
    await page.goto("/en/work-with-me");
    await expect(
      page.getByRole("link", { name: "agent skills I wrote and use" }),
    ).toHaveAttribute("href", "/en/skills");

    await page.goto("/pt/about");
    await page.getByText("O que estou estudando hoje").click();
    await expect(
      page.getByRole("link", { name: "skills para agentes que escrevi e uso" }),
    ).toHaveAttribute("href", "/pt/skills");
  });
});
