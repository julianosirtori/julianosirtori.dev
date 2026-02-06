import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BlogSearch } from "@/components/BlogSearch";

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
    p: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => <p className={className}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock next-intl navigation
vi.mock("@/locales/navigation", () => ({
  Link: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockPosts = [
  {
    title: "React Hooks Tutorial",
    slug: "react-hooks",
    date: "2024-01-15",
    readTime: 5,
    categories: ["React", "JavaScript"],
  },
  {
    title: "TypeScript Best Practices",
    slug: "typescript-best",
    date: "2024-02-10",
    readTime: 8,
    categories: ["TypeScript"],
  },
  {
    title: "CSS Grid Layout",
    slug: "css-grid",
    date: "2024-03-05",
    readTime: 4,
    categories: ["CSS"],
  },
];

const mockTranslations = {
  searchPlaceholder: "Search articles...",
  allCategories: "All",
  noResults: "No articles found",
  readTime: "min read",
};

describe("BlogSearch", () => {
  it("should render all posts initially", () => {
    render(
      <BlogSearch
        posts={mockPosts}
        locale="en"
        translations={mockTranslations}
      />,
    );

    expect(screen.getByText("React Hooks Tutorial")).toBeInTheDocument();
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument();
    expect(screen.getByText("CSS Grid Layout")).toBeInTheDocument();
  });

  it("should filter posts by search query", () => {
    render(
      <BlogSearch
        posts={mockPosts}
        locale="en"
        translations={mockTranslations}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search articles...");
    fireEvent.change(searchInput, { target: { value: "React" } });

    expect(screen.getByText("React Hooks Tutorial")).toBeInTheDocument();
    expect(
      screen.queryByText("TypeScript Best Practices"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("CSS Grid Layout")).not.toBeInTheDocument();
  });

  it("should filter posts by category", () => {
    render(
      <BlogSearch
        posts={mockPosts}
        locale="en"
        translations={mockTranslations}
      />,
    );

    // Get the category button (not the tag in post card)
    const buttons = screen.getAllByRole("button");
    const typescriptButton = buttons.find(
      (btn) => btn.textContent === "TypeScript",
    );
    fireEvent.click(typescriptButton!);

    expect(screen.queryByText("React Hooks Tutorial")).not.toBeInTheDocument();
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument();
    expect(screen.queryByText("CSS Grid Layout")).not.toBeInTheDocument();
  });

  it("should show no results message when no posts match", () => {
    render(
      <BlogSearch
        posts={mockPosts}
        locale="en"
        translations={mockTranslations}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search articles...");
    fireEvent.change(searchInput, { target: { value: "xyz123" } });

    expect(screen.getByText("No articles found")).toBeInTheDocument();
  });

  it("should render category pills", () => {
    render(
      <BlogSearch
        posts={mockPosts}
        locale="en"
        translations={mockTranslations}
      />,
    );

    // Get all buttons (category pills)
    const buttons = screen.getAllByRole("button");
    const buttonTexts = buttons.map((btn) => btn.textContent);

    expect(buttonTexts).toContain("All");
    expect(buttonTexts).toContain("React");
    expect(buttonTexts).toContain("JavaScript");
    expect(buttonTexts).toContain("TypeScript");
    expect(buttonTexts).toContain("CSS");
  });

  it("should clear category filter when clicking All", () => {
    render(
      <BlogSearch
        posts={mockPosts}
        locale="en"
        translations={mockTranslations}
      />,
    );

    // First filter by category
    const buttons = screen.getAllByRole("button");
    const typescriptButton = buttons.find(
      (btn) => btn.textContent === "TypeScript",
    );
    fireEvent.click(typescriptButton!);
    expect(screen.queryByText("React Hooks Tutorial")).not.toBeInTheDocument();

    // Then click All
    const allButton = buttons.find((btn) => btn.textContent === "All");
    fireEvent.click(allButton!);
    expect(screen.getByText("React Hooks Tutorial")).toBeInTheDocument();
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument();
    expect(screen.getByText("CSS Grid Layout")).toBeInTheDocument();
  });
});
