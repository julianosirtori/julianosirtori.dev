import { describe, it, expect, vi } from "vitest";
import { safePath, excludedPath, sanitizeParams, track } from "./analytics";
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
