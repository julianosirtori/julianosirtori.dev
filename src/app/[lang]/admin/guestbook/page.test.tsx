// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { identity } from "@/lib/server/auth";
import { HttpError } from "@/lib/server/security";
import { GuestbookAdmin } from "@/components/Audience/Guestbook";
import Page from "./page";

const { requestHeaders, redirect, notFound } = vi.hoisted(() => ({
  requestHeaders: new Headers({ cookie: "test-session" }),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("not-found");
  }),
}));
vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));
vi.mock("next/navigation", () => ({ redirect, notFound }));
vi.mock("@/lib/server/auth", () => ({ identity: vi.fn() }));
vi.mock("@/components/Audience/Guestbook", () => ({
  GuestbookAdmin: () => null,
}));

beforeEach(() => vi.clearAllMocks());

describe("guestbook administrator page", () => {
  it.each(["pt", "en"])(
    "sends an anonymous visitor to the %s guestbook to sign in",
    async (lang) => {
      vi.mocked(identity).mockRejectedValue(new HttpError(401, "unauthorized"));

      await expect(Page({ params: Promise.resolve({ lang }) })).rejects.toThrow(
        `redirect:/${lang}/guestbook`,
      );
      expect(notFound).not.toHaveBeenCalled();
    },
  );

  it("keeps the administrator page hidden from other accounts", async () => {
    vi.mocked(identity).mockRejectedValue(new HttpError(403, "forbidden"));

    await expect(
      Page({ params: Promise.resolve({ lang: "pt" }) }),
    ).rejects.toThrow("not-found");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("does not disguise an authentication service failure as a missing page", async () => {
    const failure = new Error("Authentication unavailable");
    vi.mocked(identity).mockRejectedValue(failure);

    await expect(
      Page({ params: Promise.resolve({ lang: "pt" }) }),
    ).rejects.toBe(failure);
    expect(redirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });

  it("renders moderation after checking the owner using the request session", async () => {
    vi.mocked(identity).mockResolvedValue({
      user: { id: "owner", name: "Owner" },
      githubId: "123",
    } as Awaited<ReturnType<typeof identity>>);

    const page = await Page({ params: Promise.resolve({ lang: "pt" }) });

    expect(identity).toHaveBeenCalledWith(requestHeaders, true);
    expect(page.props.children[1].type).toBe(GuestbookAdmin);
    expect(redirect).not.toHaveBeenCalled();
    expect(notFound).not.toHaveBeenCalled();
  });
});
