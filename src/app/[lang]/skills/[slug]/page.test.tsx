// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCatalogResult, notFound } = vi.hoisted(() => ({
  getCatalogResult: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
}));

vi.mock("@/lib/skills/catalog", () => ({
  getCatalogResult,
  findSkill: vi.fn(),
}));
vi.mock("@/lib/skills/render", () => ({ getSkillMarkdown: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound, unstable_rethrow: vi.fn() }));
vi.mock("next/server", () => ({ connection: vi.fn(async () => {}) }));
vi.mock("@/locales/navigation", () => ({ Link: () => null }));
vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn(async () => (key: string) => key),
}));

import SkillPage, { generateMetadata } from "./page";

const params = (slug: string) => Promise.resolve({ lang: "en", slug });

beforeEach(() => {
  getCatalogResult.mockReset();
  notFound.mockClear();
});

describe("skill detail with an impossible slug", () => {
  it.each(["Bad_Slug", "..%2Fetc", "a--b", "x".repeat(65)])(
    "answers 404 for %s without reading the catalog",
    async (slug) => {
      await expect(SkillPage({ params: params(slug) })).rejects.toThrow(
        "NEXT_HTTP_ERROR_FALLBACK;404",
      );
      expect(notFound).toHaveBeenCalledOnce();
      expect(getCatalogResult).not.toHaveBeenCalled();
      expect(await generateMetadata({ params: params(slug) })).toEqual({});
      expect(getCatalogResult).not.toHaveBeenCalled();
    },
  );
});
