// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const cookieStore = vi.hoisted(() => ({
  value: undefined as string | undefined,
}));

vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === "skills-fixture" && cookieStore.value
        ? { name, value: cookieStore.value }
        : undefined,
  }),
}));
// Pass-through: the cache layer is Next's; here we test what feeds it.
vi.mock("next/cache", () => ({
  unstable_cache: <T extends (...args: never[]) => unknown>(fn: T) => fn,
}));
vi.mock("react", async (original) => ({
  ...(await original<typeof import("react")>()),
  cache: <T>(fn: T) => fn,
}));

import { fixtureModeDefault, getCatalogResult } from "./catalog";

const fetchMock = vi.fn();

beforeEach(() => {
  cookieStore.value = undefined;
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fixture mode", () => {
  it("is off without SKILLS_FIXTURE", () => {
    vi.stubEnv("SKILLS_FIXTURE", "");
    expect(fixtureModeDefault()).toBeNull();
  });

  it("serves the fixture without touching the network", async () => {
    vi.stubEnv("SKILLS_FIXTURE", "one");
    vi.stubEnv("VERCEL", "");
    const result = await getCatalogResult();
    expect(result.status).toBe("ok");
    expect(result.status === "ok" && result.catalog.skills[0].slug).toBe(
      "mac-cleanup",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("lets a cookie pick another dataset for one request", async () => {
    vi.stubEnv("SKILLS_FIXTURE", "one");
    vi.stubEnv("VERCEL", "");
    cookieStore.value = "empty";
    const result = await getCatalogResult();
    expect(result.status === "ok" && result.catalog.skills).toEqual([]);
    expect(
      (await getCatalogResult({ allowRequestOverride: false })).status === "ok",
    ).toBe(true);
  });

  it("ignores unknown cookie values", async () => {
    vi.stubEnv("SKILLS_FIXTURE", "one");
    vi.stubEnv("VERCEL", "");
    cookieStore.value = "../../etc";
    const result = await getCatalogResult();
    expect(result.status === "ok" && result.catalog.skills).toHaveLength(1);
  });

  it("maps the down fixture to the error state", async () => {
    vi.stubEnv("SKILLS_FIXTURE", "down");
    vi.stubEnv("VERCEL", "");
    expect(await getCatalogResult()).toEqual({ status: "error" });
  });

  it("can never activate on Vercel, even with the variable and the cookie set", async () => {
    vi.stubEnv("SKILLS_FIXTURE", "one");
    vi.stubEnv("VERCEL", "1");
    cookieStore.value = "many";
    expect(fixtureModeDefault()).toBeNull();
    fetchMock.mockRejectedValue(new Error("offline"));
    expect(await getCatalogResult()).toEqual({ status: "error" });
    expect(fetchMock).toHaveBeenCalled();
    expect(String(fetchMock.mock.calls[0][0])).toContain("api.github.com");
  });

  it.each(["empty", "one", "many", "thirty", "invalid", "down"])(
    "reads GitHub on Vercel even with SKILLS_FIXTURE and the %s cookie",
    async (cookie) => {
      vi.stubEnv("SKILLS_FIXTURE", "one");
      vi.stubEnv("VERCEL", "1");
      vi.stubEnv("VERCEL_ENV", "preview");
      cookieStore.value = cookie;
      const sha = "b".repeat(40);
      fetchMock.mockImplementation(async (input: string) => {
        const url = String(input);
        if (url.endsWith("/commits/main")) return new Response(sha);
        if (url.includes("/git/trees/")) {
          return Response.json({
            tree: [
              { path: "skills/from-github/SKILL.md", type: "blob", size: 70 },
            ],
          });
        }
        if (url.endsWith("/skills/from-github/SKILL.md")) {
          return new Response(
            "---\nname: from-github\ndescription: Served by GitHub.\n---\nBody\n",
          );
        }
        return new Response("missing", { status: 404 });
      });

      expect(fixtureModeDefault()).toBeNull();
      const result = await getCatalogResult();
      expect(result.status).toBe("ok");
      expect(
        result.status === "ok" &&
          result.catalog.skills.map((skill) => skill.slug),
      ).toEqual(["from-github"]);
      expect(result.status === "ok" && result.catalog.sha).toBe(sha);
    },
  );

  it("ignores unknown fixture names", () => {
    vi.stubEnv("SKILLS_FIXTURE", "everything");
    vi.stubEnv("VERCEL", "");
    expect(fixtureModeDefault()).toBeNull();
  });
});

describe("GitHub source", () => {
  beforeEach(() => {
    vi.stubEnv("SKILLS_FIXTURE", "");
    vi.stubEnv("SKILLS_GITHUB_TOKEN", "");
  });

  it("uses two REST calls and raw files pinned to the commit", async () => {
    const sha = "a".repeat(40);
    fetchMock.mockImplementation(async (input: string) => {
      const url = String(input);
      if (url.endsWith("/commits/main")) return new Response(sha);
      if (url.includes("/git/trees/")) {
        return Response.json({
          truncated: false,
          tree: [
            { path: "skills/demo/SKILL.md", type: "blob", size: 60 },
            { path: "skills/demo", type: "tree" },
          ],
        });
      }
      if (
        url ===
        `https://raw.githubusercontent.com/julianosirtori/skills/${sha}/skills/demo/SKILL.md`
      ) {
        return new Response(
          "---\nname: demo\ndescription: Demo skill.\n---\nBody\n",
        );
      }
      return new Response("missing", { status: 404 });
    });

    const result = await getCatalogResult();
    expect(result.status === "ok" && result.catalog.skills[0].slug).toBe(
      "demo",
    );
    const urls = fetchMock.mock.calls.map(([url]) => new URL(String(url)));
    expect(
      urls.filter((url) => url.hostname === "api.github.com"),
    ).toHaveLength(2);
    expect(
      urls.filter(
        (url) =>
          url.hostname === "raw.githubusercontent.com" &&
          url.pathname.startsWith("/julianosirtori/skills/main/"),
      ),
    ).toEqual([]);
    // No token, no per-skill date lookups.
    expect(urls.some((url) => url.pathname.endsWith("/commits"))).toBe(false);
  });

  it("returns the error state when GitHub answers with an error", async () => {
    fetchMock.mockResolvedValue(new Response("rate limited", { status: 403 }));
    expect(await getCatalogResult()).toEqual({ status: "error" });
  });
});
