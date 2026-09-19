import { test, expect } from "@playwright/test";
for (const lang of ["pt", "en"]) {
  test(`${lang}: newsletter layout, explicit confirmation and failure recovery`, async ({
    page,
  }) => {
    await page.goto(`/${lang}/newsletter`);
    await expect(
      page.getByRole("heading", { name: "Notas do Juliano" }),
    ).toBeVisible();
    await expect(page.locator("input[type=email]")).toHaveCount(1);
    await page.route("**/api/newsletter/subscribe", (route) =>
      route.fulfill({ status: 503, json: { error: "unavailable" } }),
    );
    await page.locator("input[type=email]").fill("reader@example.com");
    await page
      .getByRole("button", {
        name: lang === "pt" ? "Quero receber" : "Subscribe",
      })
      .click();
    await expect(page.getByRole("status")).toContainText(
      lang === "pt" ? "Tente novamente" : "try again",
    );
    await page.route("**/api/newsletter/subscribe", (route) =>
      route.fulfill({ json: { pending: true } }),
    );
    await page
      .getByRole("button", {
        name: lang === "pt" ? "Quero receber" : "Subscribe",
      })
      .click();
    await expect(page.getByRole("status")).toContainText(
      lang === "pt" ? "caixa de entrada" : "inbox",
    );
    let confirmations = 0;
    await page.route("**/api/newsletter/confirm", (route) => {
      confirmations++;
      return route.fulfill({ json: { confirmed: true, fresh: true } });
    });
    await page.goto(`/${lang}/newsletter/confirm?token=test`);
    expect(confirmations).toBe(0);
    await page
      .getByRole("button", {
        name:
          lang === "pt"
            ? "Confirmar minha inscrição"
            : "Confirm my subscription",
      })
      .click();
    await expect(page.getByRole("status")).toContainText(
      lang === "pt" ? "Inscrição confirmada" : "You're subscribed",
    );
    expect(confirmations).toBe(1);
    expect(page.url()).not.toContain("token=");
  });
  test(`${lang}: guestbook empty, unavailable and local draft recovery`, async ({
    page,
  }) => {
    await page.route("**/api/guestbook/session", (route) =>
      route.fulfill({ status: 401, json: { error: "unauthorized" } }),
    );
    await page.route("**/api/guestbook", (route) =>
      route.fulfill({ json: { entries: [] } }),
    );
    await page.addInitScript(() =>
      localStorage.setItem(
        "guestbook:entries",
        JSON.stringify([{ message: "My old local note" }]),
      ),
    );
    await page.goto(`/${lang}/guestbook`);
    await expect(
      page.getByText(
        lang === "pt"
          ? "Nenhum recado publicado ainda. Você pode deixar o primeiro."
          : "No published notes yet. You can leave the first one.",
      ),
    ).toBeVisible();
    await page
      .getByRole("button", {
        name: lang === "pt" ? "Usar este rascunho" : "Use this draft",
      })
      .click();
    await expect(page.locator("textarea")).toHaveValue("My old local note");
    await expect(page.locator("textarea")).toBeDisabled();
    await page.route("**/api/guestbook", (route) =>
      route.fulfill({ status: 503, json: { error: "unavailable" } }),
    );
    await page.reload();
    await expect(
      page.getByText(
        lang === "pt"
          ? "O mural está indisponível no momento. Tente novamente."
          : "The guestbook is unavailable right now. Please try again.",
      ),
    ).toBeVisible();
  });
}
test("newsletter and guestbook fit mobile, light and dark", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const lang of ["pt", "en"])
    for (const path of ["newsletter", "guestbook"]) {
      await page.goto(`/${lang}/${path}`);
      for (const dark of [false, true]) {
        await page.evaluate(
          (dark) => document.documentElement.classList.toggle("dark", dark),
          dark,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        const button = page.locator("main button").first();
        await expect(button).toBeVisible();
        expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
    }
});
test("testimonials preserve the three originals and admin is private", async ({
  page,
}) => {
  await page.goto("/pt/work-with-me");
  await expect(page.locator("#recommendations figure")).toHaveCount(3);
  await expect(page.locator("#recommendations")).toContainText(
    "I had the pleasure of working with Juliano",
  );
  await page.goto("/pt/admin/guestbook");
  await expect(
    page.getByRole("heading", { name: "Moderação do guestbook" }),
  ).toHaveCount(0);
});

test("reactions persist across independent browsers and share PT/EN slug totals", async ({
  page,
  browser,
}) => {
  await page.goto("/pt/blog/hello-world");
  const like = page.getByRole("button", { name: "Gostei", exact: true });
  await expect(like).toBeEnabled();
  const before = await page.evaluate(async () =>
    (await fetch("/api/reactions/hello-world")).json(),
  );
  await like.click();
  await expect(like).toBeEnabled();
  await expect(like).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(like).toHaveAttribute("aria-pressed", "true");
  const second = await browser.newContext();
  const other = await second.newPage();
  try {
    await other.goto("/en/blog/hello-world");
    const otherLike = other.getByRole("button", { name: "Like", exact: true });
    await expect(otherLike).toBeEnabled();
    const snapshot = await other.evaluate(async () =>
      (await fetch("/api/reactions/hello-world")).json(),
    );
    expect(snapshot.counts.like).toBe((before.counts.like || 0) + 1);
    expect(snapshot.selected).toEqual([]);
  } finally {
    await second.close();
    await like.click();
    await expect(like).toBeEnabled();
  }
});

test("a signed-in guest sees review confirmation and never a fabricated public note", async ({
  page,
}) => {
  await page.route("**/api/guestbook/session", (route) =>
    route.fulfill({ json: { name: "Test visitor" } }),
  );
  await page.route("**/api/guestbook", (route) =>
    route.fulfill({
      json:
        route.request().method() === "POST"
          ? { pending: true }
          : { entries: [] },
    }),
  );
  await page.goto("/pt/guestbook");
  await page.getByLabel("Seu recado").fill("A note awaiting moderation");
  await page
    .getByRole("button", { name: "Enviar recado", exact: true })
    .click();
  await expect(
    page.getByText("Recebi seu recado. Ele aparece aqui depois da revisão."),
  ).toBeVisible();
  await expect(page.locator("main article")).toHaveCount(0);
});

test("switching confirmation language keeps the token without confirming automatically", async ({
  page,
}) => {
  let token: unknown;
  await page.route("**/api/newsletter/confirm", (route) => {
    token = route.request().postDataJSON().token;
    return route.fulfill({ json: { confirmed: true, fresh: true } });
  });
  await page.goto("/pt/newsletter/confirm?token=retained-token");
  await page.getByRole("combobox", { name: "change language" }).click();
  await page.getByRole("option", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(
    /\/en\/newsletter\/confirm\?token=retained-token/,
  );
  expect(token).toBeUndefined();
  await page.getByRole("button", { name: "Confirm my subscription" }).click();
  await expect(page.getByRole("status")).toContainText("You're subscribed");
  expect(token).toBe("retained-token");
});
