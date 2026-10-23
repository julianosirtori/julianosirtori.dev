import { describe, expect, it } from "vitest";
import { alternatesFor, languagesFor } from "./seo";

describe("alternatesFor", () => {
  it("self-canonicalizes and points x-default at the default locale", () => {
    expect(alternatesFor("pt", "/about")).toEqual({
      canonical: "/pt/about",
      languages: { en: "/en/about", pt: "/pt/about", "x-default": "/en/about" },
    });
  });
});

describe("languagesFor", () => {
  it("falls back to the only locale when the default one is missing", () => {
    expect(languagesFor(["pt"], (locale) => `/${locale}/blog/post`)).toEqual({
      pt: "/pt/blog/post",
      "x-default": "/pt/blog/post",
    });
  });

  it("returns an empty map without locales", () => {
    expect(languagesFor([], (locale) => `/${locale}`)).toEqual({});
  });
});
