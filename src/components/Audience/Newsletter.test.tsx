import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NewsletterForm } from "./Newsletter";
import { audienceCopy } from "./copy";

const mocks = vi.hoisted(() => ({
  locale: "pt",
  fetch: vi.fn(),
  track: vi.fn(),
}));
vi.mock("next-intl", () => ({ useLocale: () => mocks.locale }));
vi.mock("@/lib/analytics", () => ({ track: mocks.track }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.locale = "pt";
  vi.stubGlobal("fetch", mocks.fetch);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function submit() {
  const t = audienceCopy[mocks.locale as "pt" | "en"];
  fireEvent.change(screen.getByLabelText(t.email), {
    target: { value: "reader@example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: t.subscribe }));
}

describe("newsletter submission feedback", () => {
  it.each(["pt", "en"] as const)(
    "explains the Preview restriction in %s and recovers on a successful retry",
    async (lang) => {
      mocks.locale = lang;
      const t = audienceCopy[lang];
      mocks.fetch.mockResolvedValueOnce(
        Response.json({ error: "newsletter_test_recipient" }, { status: 403 }),
      );
      render(<NewsletterForm source="newsletter" />);
      submit();

      expect(
        await screen.findByText(t.newsletterTestRecipient),
      ).toHaveAttribute("role", "status");
      expect(screen.queryByText(t.error)).not.toBeInTheDocument();
      expect(screen.getByLabelText(t.email)).toHaveValue("reader@example.com");
      expect(screen.getByRole("button", { name: t.subscribe })).toBeEnabled();

      mocks.fetch.mockResolvedValueOnce(Response.json({ pending: true }));
      submit();
      expect(await screen.findByText(t.check)).toBeInTheDocument();
      expect(
        screen.queryByText(t.newsletterTestRecipient),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: t.subscribe })).toBeDisabled();
      expect(JSON.stringify(mocks.track.mock.calls)).not.toContain("reader@");
    },
  );

  it.each(["pt", "en"] as const)(
    "explains rate limiting in %s",
    async (lang) => {
      mocks.locale = lang;
      mocks.fetch.mockResolvedValueOnce(
        Response.json({ error: "rate_limited" }, { status: 429 }),
      );
      render(<NewsletterForm source="footer" />);
      submit();
      expect(
        await screen.findByText(audienceCopy[lang].newsletterRateLimited),
      ).toBeInTheDocument();
    },
  );

  it.each([
    [403, { error: "origin" }],
    [503, { error: "unavailable" }],
    [403, { error: "untrusted provider details" }],
  ])("keeps unknown %i errors private", async (status, payload) => {
    mocks.fetch.mockResolvedValueOnce(Response.json(payload, { status }));
    render(<NewsletterForm source="newsletter" />);
    submit();
    expect(await screen.findByText(audienceCopy.pt.error)).toBeInTheDocument();
    expect(
      screen.queryByText(audienceCopy.pt.newsletterTestRecipient),
    ).not.toBeInTheDocument();
  });

  it("handles a non-JSON server error without losing recovery controls", async () => {
    mocks.fetch.mockResolvedValueOnce(
      new Response("Bad gateway", { status: 502 }),
    );
    render(<NewsletterForm source="newsletter" />);
    submit();
    expect(await screen.findByText(audienceCopy.pt.error)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: audienceCopy.pt.subscribe }),
    ).toBeEnabled();
  });
});
