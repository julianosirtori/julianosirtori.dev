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
    expect(screen.getByText("Vue.js")).toBeInTheDocument();
    expect(screen.getByText("Astro")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("NestJS")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("Drizzle ORM")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("Vitest")).toBeInTheDocument();
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

    // There are 12 technologies
    const techItems = screen.getAllByText(
      /React|TypeScript|Next\.js|Vue\.js|Astro|Tailwind|Node\.js|NestJS|PostgreSQL|Drizzle ORM|Docker|Vitest/,
    );
    expect(techItems).toHaveLength(12);
  });
});
