import { describe, expect, it } from "vitest";

import * as en from "@/locales/en";
import * as pt from "@/locales/pt";
import { PORTFOLIO_URL, SITE_URL } from "./site";
import {
  GITHUB_PROFILE_URL,
  personAndWebsiteGraph,
  serviceKeys,
} from "./person-schema";

const personOf = (graph: ReturnType<typeof personAndWebsiteGraph>) =>
  graph["@graph"][0] as Record<string, unknown> & {
    sameAs: string[];
    knowsAbout: readonly string[];
    makesOffer: Array<{
      "@type": string;
      url: string;
      itemOffered: { "@type": string; name: string; provider: object };
    }>;
  };

describe("personAndWebsiteGraph", () => {
  it("links the profiles the site already shows", () => {
    const person = personOf(personAndWebsiteGraph("en", en));
    expect(person.sameAs).toEqual([
      en.global.social.linkedin,
      GITHUB_PROFILE_URL,
      en.global.social.bluesky,
      PORTFOLIO_URL,
    ]);
    expect(person.sameAs.join()).not.toMatch(/twitter\.com|x\.com/);
  });

  it("lists the stack the site writes about", () => {
    const { knowsAbout } = personOf(personAndWebsiteGraph("en", en));
    for (const topic of ["React", "Next.js", "Node.js", "TypeScript"])
      expect(knowsAbout).toContain(topic);
    expect(knowsAbout).toContain("LLM integration");
  });

  it.each([
    ["en", en],
    ["pt", pt],
  ] as const)("offers each /work-with-me service in %s", (lang, messages) => {
    const { makesOffer } = personOf(personAndWebsiteGraph(lang, messages));
    expect(makesOffer).toHaveLength(serviceKeys.length);
    for (const [index, key] of serviceKeys.entries()) {
      const offer = makesOffer[index];
      expect(offer["@type"]).toBe("Offer");
      expect(offer.url).toBe(`${SITE_URL}/${lang}/work-with-me`);
      expect(offer.itemOffered["@type"]).toBe("Service");
      expect(offer.itemOffered.name).toBe(
        messages.workWithMe.services[key].name,
      );
      expect(offer.itemOffered.provider).toEqual({
        "@id": `${SITE_URL}/#person`,
      });
    }
  });

  it("writes service copy without em dashes or exclamations", () => {
    for (const messages of [en, pt])
      for (const key of serviceKeys) {
        const { name, description } = messages.workWithMe.services[key];
        expect(`${name} ${description}`).not.toMatch(/[—–!]/);
      }
  });
});
