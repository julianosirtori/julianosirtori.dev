import { describe, expect, it } from "vitest";

import * as en from "./en";
import * as pt from "./pt";
import { audienceCopy } from "@/components/Audience/copy";

const pages = (messages: typeof en, lang: "en" | "pt") => ({
  home: messages.global.metaDescription,
  about: messages.about.metaDescription,
  blog: messages.blog.metaDescription,
  projects: messages.projects.metaDescription,
  workWithMe: messages.workWithMe.metaDescription,
  skills: messages.skills.meta.listDescription,
  playground: messages.playground.description,
  newsletter: audienceCopy[lang].newsletterMetaDescription,
  guestbook: audienceCopy[lang].guestbookMetaDescription,
});

describe.each([
  ["en", en],
  ["pt", pt],
] as const)("%s meta descriptions", (lang, messages) => {
  it.each(Object.entries(pages(messages, lang)))(
    "%s fits a search snippet and follows the voice guide",
    (_, description) => {
      expect(description.length).toBeGreaterThanOrEqual(130);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(description).not.toMatch(/[—–!]/);
    },
  );

  it("names the role in the default title without em dashes", () => {
    expect(messages.global.metaTitle).toMatch(/^Juliano Sirtori · /);
    expect(messages.global.metaTitle).not.toMatch(/[—–!]/);
  });
});

it("writes each description for its own language", () => {
  const english = pages(en, "en");
  const portuguese = pages(pt, "pt");
  for (const key of Object.keys(english) as (keyof typeof english)[])
    expect(english[key]).not.toBe(portuguese[key]);
});
