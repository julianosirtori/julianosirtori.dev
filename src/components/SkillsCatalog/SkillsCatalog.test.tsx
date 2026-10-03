import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { SKILLS_FILTER_THRESHOLD } from "@/lib/skills/constants";
import en from "@/locales/en/skills.json";
import { SkillsCatalog, type SkillsCatalogItem } from "./SkillsCatalog";

vi.mock("@/locales/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function makeSkills(count: number, categories = ["productivity", "frontend"]) {
  return Array.from(
    { length: count },
    (_, index): SkillsCatalogItem => ({
      slug: `skill-${index + 1}`,
      summary: `Summary ${index + 1}.`,
      category: categories[index % categories.length],
      keywords: index === 2 ? ["ação-especial"] : [],
      fileCounts: [],
    }),
  );
}

function renderCatalog(skills: SkillsCatalogItem[]) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ skills: en }}>
      <SkillsCatalog skills={skills} />
    </NextIntlClientProvider>,
  );
}

describe("SkillsCatalog by volume", () => {
  it("keeps the threshold at 8", () => {
    expect(SKILLS_FILTER_THRESHOLD).toBe(8);
  });

  it("shows a plain list below the threshold", () => {
    renderCatalog(makeSkills(SKILLS_FILTER_THRESHOLD - 1));
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(7);
  });

  it("renders a single skill as a normal row", () => {
    renderCatalog(makeSkills(1));
    expect(screen.getByRole("link", { name: "skill-1" })).toHaveAttribute(
      "href",
      "/skills/skill-1",
    );
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("adds the text filter and category buttons at the threshold", () => {
    renderCatalog(makeSkills(SKILLS_FILTER_THRESHOLD));
    expect(
      screen.getByRole("searchbox", { name: en.filter.label }),
    ).toBeInTheDocument();
    const group = screen.getByRole("group", { name: en.filter.categories });
    expect(
      within(group)
        .getAllByRole("button")
        .map((button) => button.textContent),
    ).toEqual(["All8", "frontend4", "productivity4"]);
  });

  it("hides category buttons with a single category", () => {
    renderCatalog(makeSkills(10, ["productivity"]));
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("filters by name, summary and keywords, ignoring accents and case", () => {
    renderCatalog(makeSkills(12));
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "ACAO" } });
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByRole("status")).toHaveTextContent("Showing 1 of 12");

    fireEvent.change(input, { target: { value: "skill-1" } });
    // skill-1, skill-10, skill-11, skill-12
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("filters by category with pressed buttons", () => {
    renderCatalog(makeSkills(12));
    const frontend = screen.getByRole("button", { name: /frontend/ });
    fireEvent.click(frontend);
    expect(frontend).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
  });

  it("explains an empty result and clears back to the full list", () => {
    renderCatalog(makeSkills(30));
    expect(screen.getAllByRole("listitem")).toHaveLength(30);
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "nothing here" } });
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(
      screen.getByText('No skill matches "nothing here".'),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getAllByRole("button", { name: en.filter.clearFilters })[0],
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(30);
    expect(input).toHaveFocus();
  });
});
