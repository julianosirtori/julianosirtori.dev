import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { cases, publishedCases } from "@/data/cases";
import { CaseStudies } from "./CaseStudies";

describe("cases data", () => {
  it("keeps the same cases, in the same order, in both languages", () => {
    expect(cases.pt.map((item) => item.id)).toEqual(
      cases.en.map((item) => item.id),
    );
    for (const [index, item] of cases.en.entries())
      expect(cases.pt[index].metrics).toHaveLength(item.metrics.length);
  });

  it("publishes only cases that have numbers", () => {
    const ids = publishedCases("en").map((item) => item.id);
    expect(ids).not.toContain("biomoov");
    expect(ids).not.toContain("fisio-milena-aranha");
    expect(ids).toContain("ciandt");
  });

  it("writes case copy without em dashes or exclamations", () => {
    for (const item of [...cases.en, ...cases.pt])
      expect(JSON.stringify(item)).not.toMatch(/[—–!]/);
  });
});

describe("CaseStudies", () => {
  it("renders each published case with its numbers", () => {
    render(
      <CaseStudies
        lang="pt"
        title="Resultados em números"
        intro="intro"
        stackLabel="Stack"
      />,
    );
    const section = screen.getByRole("region", {
      name: "Resultados em números",
    });
    const items = within(section).getAllByRole("listitem");
    expect(items).toHaveLength(publishedCases("pt").length);
    expect(within(section).getByText("2,7 mi+")).toBeTruthy();
    expect(within(section).getByText("usuários ativos por mês")).toBeTruthy();
    expect(within(section).queryByText("BioMoov")).toBeNull();
  });
});
