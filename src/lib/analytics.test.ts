import { describe, it, expect, vi } from "vitest";
import {
  safePath,
  excludedPath,
  sanitizeParams,
  track,
  trackLead,
  leadActions,
} from "./analytics";
describe("analytics privacy boundary", () => {
  it("strips queries and fragments, rejects unknown URL shapes", () => {
    expect(safePath("/pt/newsletter/confirm?token=secret#email")).toBe(
      "/pt/newsletter/confirm",
    );
    expect(safePath("/pt/blog/hello-world#heading")).toBe(
      "/pt/blog/hello-world",
    );
    expect(safePath("/arbitrary@email")).toBe("/");
    expect(excludedPath("/pt/admin/guestbook")).toBe(true);
    expect(excludedPath("/api/auth/callback/github")).toBe(true);
  });
  it("drops unrecognized fields and unsafe identifiers", () => {
    const payload = {
      email: "private@example.com",
      message: "private",
      content_id: "hello-world",
      action_id: "name@example.com",
      result_count: 4,
    };
    expect(sanitizeParams(payload)).toEqual({
      content_id: "hello-world",
      result_count: 4,
    });
  });
  it("never sends in tests and cannot disrupt user actions", () => {
    window.gtag = vi.fn(() => {
      throw new Error();
    });
    expect(() =>
      track("newsletter_submit", { location: "newsletter" }),
    ).not.toThrow();
    expect(window.gtag).not.toHaveBeenCalled();
  });
});
describe("skills catalog events", () => {
  it("keeps install method ids and drops anything that is not an identifier", () => {
    expect(
      sanitizeParams({
        location: "skills",
        content_id: "mac-cleanup",
        action_id: "npx-claude-code",
      }),
    ).toEqual({
      location: "skills",
      content_id: "mac-cleanup",
      action_id: "npx-claude-code",
    });
    expect(
      sanitizeParams({ location: "skills", action_id: "mac cleanup query" }),
    ).toEqual({ location: "skills" });
  });
});
describe("generate_lead", () => {
  it("sends the lead channel as action_id and nothing from the form", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
    window.history.replaceState(null, "", "/en/work-with-me?email=private");
    window.gtag = vi.fn();
    try {
      for (const action of leadActions) trackLead(action);
      const calls = vi.mocked(window.gtag).mock.calls;
      expect(calls).toHaveLength(leadActions.length);
      for (const [index, action] of leadActions.entries()) {
        expect(calls[index][0]).toBe("event");
        expect(calls[index][1]).toBe("generate_lead");
        expect(calls[index][2]).toMatchObject({
          location: "contact",
          action_id: action,
          route: "/en/work-with-me",
        });
      }
      expect(JSON.stringify(calls)).not.toContain("private");
    } finally {
      vi.unstubAllEnvs();
      window.history.replaceState(null, "", "/");
    }
  });
});
