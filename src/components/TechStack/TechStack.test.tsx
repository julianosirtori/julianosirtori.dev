import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TechStack } from "@/components/TechStack";

const props = {
  title: "Tech Stack",
  studyingLabel: "Studying",
  studyingDescription: "What I am actively learning, not a delivery stack.",
};

describe("TechStack", () => {
  it("should render the title", () => {
    render(<TechStack {...props} />);

    expect(screen.getByText("Tech Stack")).toBeInTheDocument();
  });

  it("groups the current delivery stack", () => {
    render(<TechStack {...props} />);

    expect(screen.getByRole("heading", { name: "Front" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Back" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mobile" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Desktop" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Cloud & Tooling" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("NestJS")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("React Native")).toBeInTheDocument();
    expect(screen.getByText("Tauri")).toBeInTheDocument();
    expect(screen.getByText("Rust")).toBeInTheDocument();
    expect(
      screen.getByText("Model Context Protocol (MCP)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Vitest")).toBeInTheDocument();
  });

  it("separates subjects that are still being studied", () => {
    render(<TechStack {...props} />);

    expect(
      screen.getByRole("heading", { name: "Studying" }),
    ).toBeInTheDocument();
    expect(screen.getByText(props.studyingDescription)).toBeInTheDocument();
    expect(screen.getByText("LLM apps")).toBeInTheDocument();
    expect(screen.getByText("RAG")).toBeInTheDocument();
    expect(screen.getByText("Agents")).toBeInTheDocument();
  });
});
