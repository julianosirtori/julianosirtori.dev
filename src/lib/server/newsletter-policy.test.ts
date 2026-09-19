// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/newsletter/subscribe/route";
import { newsletterProvider } from "./newsletter-provider";
import { newsletterRecipientAllowed } from "./newsletter-policy";

const mocks = vi.hoisted(() => ({
  subscribe: vi.fn(),
  limit: vi.fn(),
  send: vi.fn(),
  client: vi.fn(),
}));
vi.mock("./newsletter", () => ({ subscribe: mocks.subscribe }));
vi.mock("./posts", () => ({ isPublishedSlug: () => true }));
vi.mock("./security", async (original) => ({
  ...(await original<typeof import("./security")>()),
  limit: mocks.limit,
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
    constructor() {
      mocks.client();
    }
  },
}));

const allowed = "owner+preview@example.com";
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("NEWSLETTER_ALLOWED_EMAILS", allowed);
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("NEWSLETTER_SECRET", "a".repeat(48));
  vi.stubEnv("RESEND_SEGMENT_PT", "segment-pt");
  vi.stubEnv("RESEND_SEGMENT_EN", "segment-en");
  vi.stubEnv("BETTER_AUTH_URL", "https://preview.example.com");
  mocks.send.mockResolvedValue({ data: { id: "sent-id" } });
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
function request(email: string) {
  return new Request("https://preview.example.com/api/newsletter/subscribe", {
    method: "POST",
    headers: {
      Origin: "https://preview.example.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, language: "pt", source: "newsletter" }),
  });
}

describe("newsletter Preview recipient restrictions", () => {
  it("rejects another address before database limits or subscription writes", async () => {
    const response = await POST(request("reader@example.com"));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      error: "newsletter_test_recipient",
    });
    expect(mocks.limit).not.toHaveBeenCalled();
    expect(mocks.subscribe).not.toHaveBeenCalled();
  });

  it("allows only an exact address after trimming and case normalization", async () => {
    vi.stubEnv("NEWSLETTER_ALLOWED_EMAILS", ` ${allowed.toUpperCase()} `);
    expect((await POST(request(allowed.toUpperCase()))).status).toBe(200);
    expect(mocks.subscribe).toHaveBeenCalledWith(
      allowed,
      "pt",
      "newsletter",
      null,
    );
    expect(newsletterRecipientAllowed("owner@example.com")).toBe(false);
    expect(newsletterRecipientAllowed(`${allowed}.evil`)).toBe(false);
    vi.stubEnv("NEWSLETTER_ALLOWED_EMAILS", "*@example.com");
    expect(newsletterRecipientAllowed(allowed)).toBe(false);
  });

  it("fails closed when Preview has no allowlist and logs only variable names", async () => {
    vi.stubEnv("NEWSLETTER_ALLOWED_EMAILS", "");
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect((await POST(request(allowed))).status).toBe(503);
    expect(warning).toHaveBeenCalledWith("[newsletter] configuration_missing", {
      variables: ["NEWSLETTER_ALLOWED_EMAILS"],
    });
    expect(newsletterRecipientAllowed(allowed)).toBe(false);
    expect(mocks.subscribe).not.toHaveBeenCalled();
  });

  it("rejects incomplete or conflicting segments before accepting a subscription", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("RESEND_SEGMENT_EN", "");
    expect((await POST(request(allowed))).status).toBe(503);
    vi.stubEnv("RESEND_SEGMENT_EN", "segment-pt");
    expect((await POST(request(allowed))).status).toBe(503);
    expect(mocks.subscribe).not.toHaveBeenCalled();
  });

  it("blocks sends, contact activation and cancellation from background jobs too", async () => {
    const denied = "reader@example.com";
    await expect(
      newsletterProvider.send(
        { to: denied, subject: "test", text: "test" },
        "job",
      ),
    ).rejects.toMatchObject({ status: 403 });
    await expect(
      newsletterProvider.activate(denied, "pt"),
    ).rejects.toMatchObject({ status: 403 });
    await expect(newsletterProvider.unsubscribe(denied)).rejects.toMatchObject({
      status: 403,
    });
    expect(mocks.client).not.toHaveBeenCalled();
  });

  it("allows the configured test recipient to reach the sending provider", async () => {
    await expect(
      newsletterProvider.send(
        { to: allowed, subject: "test", text: "test" },
        "job",
      ),
    ).resolves.toBe("sent-id");
    expect(mocks.send).toHaveBeenCalledOnce();
  });

  it("renders template metadata as React email without forwarding private fields", async () => {
    await newsletterProvider.send(
      {
        to: allowed,
        subject: "Confirm",
        text: "Plain fallback",
        template: "confirmation",
        language: "pt",
        actionUrl:
          "https://preview.example.com/pt/newsletter/confirm?token=test",
      },
      "job",
    );

    expect(mocks.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: allowed,
        text: "Plain fallback",
        react: expect.anything(),
      }),
      { idempotencyKey: "job" },
    );
    expect(mocks.send.mock.calls[0][0]).not.toHaveProperty("template");
    expect(mocks.send.mock.calls[0][0]).not.toHaveProperty("actionUrl");
  });

  it("keeps public production subscriptions available without a Preview allowlist", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEWSLETTER_ALLOWED_EMAILS", "");
    expect((await POST(request("reader@example.com"))).status).toBe(200);
    expect(mocks.subscribe).toHaveBeenCalledOnce();
  });
});
