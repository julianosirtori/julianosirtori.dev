import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BlogSearch } from "@/components/BlogSearch";

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
    excerpt: "A gentle intro to hooks.",
    tags: ["React", "JavaScript"],
  },
  {
    title: "TypeScript Best Practices",
    slug: "typescript-best",
    date: "2024-02-10",
    readTime: 8,
    excerpt: "Patterns that hold up.",
    tags: ["TypeScript"],
  },
  {
    title: "CSS Grid Layout",
    slug: "css-grid",
    date: "2023-03-05",
    readTime: 4,
    excerpt: "Two-dimensional layout.",
    tags: ["CSS"],
  },
];

const mockTranslations = {
  searchPlaceholder: "Search articles...",
  allCategories: "All",
  noResults: "No articles found",
  clearFilters: "Clear filters",
  readTime: "min read",
  article: "article",
  articles: "articles",
  post: "post",
  posts: "posts",
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

  it("should group posts by year with a divider", () => {
    render(
      <BlogSearch
        posts={mockPosts}
        locale="en"
        translations={mockTranslations}
      />,
    );

    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
  });

  it("should filter posts by search query (title, excerpt or tag)", () => {
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

  it("should filter posts by tag", () => {
    render(
      <BlogSearch
        posts={mockPosts}
        locale="en"
        translations={mockTranslations}
      />,
    );

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

    expect(screen.getByText(/No articles found/)).toBeInTheDocument();
  });

  it("should render tag pills", () => {
    render(
      <BlogSearch
        posts={mockPosts}
        locale="en"
        translations={mockTranslations}
      />,
    );

    const buttons = screen.getAllByRole("button");
    const buttonTexts = buttons.map((btn) => btn.textContent);

    expect(buttonTexts).toContain("All");
    expect(buttonTexts).toContain("React");
    expect(buttonTexts).toContain("JavaScript");
    expect(buttonTexts).toContain("TypeScript");
    expect(buttonTexts).toContain("CSS");
  });

  it("should clear the tag filter when clicking All", () => {
    render(
      <BlogSearch
        posts={mockPosts}
        locale="en"
        translations={mockTranslations}
      />,
    );

    const buttons = screen.getAllByRole("button");
    const typescriptButton = buttons.find(
      (btn) => btn.textContent === "TypeScript",
    );
    fireEvent.click(typescriptButton!);
    expect(screen.queryByText("React Hooks Tutorial")).not.toBeInTheDocument();

    const allButton = buttons.find((btn) => btn.textContent === "All");
    fireEvent.click(allButton!);
    expect(screen.getByText("React Hooks Tutorial")).toBeInTheDocument();
    expect(screen.getByText("TypeScript Best Practices")).toBeInTheDocument();
    expect(screen.getByText("CSS Grid Layout")).toBeInTheDocument();
  });
});
