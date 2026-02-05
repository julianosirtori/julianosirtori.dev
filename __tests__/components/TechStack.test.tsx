import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TechStack } from "@/components/TechStack";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => <div className={className}>{children}</div>,
  },
}));

describe("TechStack", () => {
  it("should render the title", () => {
    render(<TechStack title="Tech Stack" />);

    expect(screen.getByText("Tech Stack")).toBeInTheDocument();
  });

  it("should render all technologies", () => {
    render(<TechStack title="Tech Stack" />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
    expect(screen.getByText("GraphQL")).toBeInTheDocument();
    expect(screen.getByText("Git")).toBeInTheDocument();
  });

  it("should render technology icons", () => {
    render(<TechStack title="Tech Stack" />);

    // Check for emojis
    expect(screen.getByText("⚛️")).toBeInTheDocument(); // React
    expect(screen.getByText("📘")).toBeInTheDocument(); // TypeScript
    expect(screen.getByText("▲")).toBeInTheDocument(); // Next.js
  });

  it("should render correct number of technology items", () => {
    render(<TechStack title="Tech Stack" />);

    // There are 8 technologies
    const techItems = screen.getAllByText(
      /React|TypeScript|Next.js|JavaScript|Node.js|Tailwind|GraphQL|Git/,
    );
    expect(techItems).toHaveLength(8);
  });
});
