import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Reactions } from "@/components/Reactions";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      onClick,
      className,
      "aria-label": ariaLabel,
    }: {
      children: React.ReactNode;
      onClick: () => void;
      className?: string;
      "aria-label"?: string;
    }) => (
      <button onClick={onClick} className={className} aria-label={ariaLabel}>
        {children}
      </button>
    ),
    span: ({ children }: { children: React.ReactNode }) => (
      <span>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Reactions", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should render all reaction buttons", () => {
    render(<Reactions slug="test-post" />);

    expect(screen.getByLabelText("Like")).toBeInTheDocument();
    expect(screen.getByLabelText("Fire")).toBeInTheDocument();
    expect(screen.getByLabelText("Insightful")).toBeInTheDocument();
    expect(screen.getByLabelText("Celebrate")).toBeInTheDocument();
    expect(screen.getByLabelText("Love")).toBeInTheDocument();
  });

  it("should show initial message when no reactions", () => {
    render(<Reactions slug="test-post" />);

    expect(screen.getByText("Be the first to react")).toBeInTheDocument();
  });

  it("should increment reaction count when clicked", () => {
    render(<Reactions slug="test-post" />);

    const likeButton = screen.getByLabelText("Like");
    fireEvent.click(likeButton);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("1 reaction")).toBeInTheDocument();
  });

  it("should toggle reaction when clicked twice", () => {
    render(<Reactions slug="test-post" />);

    const likeButton = screen.getByLabelText("Like");

    // First click - add reaction
    fireEvent.click(likeButton);
    expect(screen.getByText("1")).toBeInTheDocument();

    // Second click - remove reaction
    fireEvent.click(likeButton);
    expect(screen.getByText("Be the first to react")).toBeInTheDocument();
  });

  it("should persist reactions to localStorage", () => {
    render(<Reactions slug="test-post" />);

    const likeButton = screen.getByLabelText("Like");
    fireEvent.click(likeButton);

    const storedReactions = JSON.parse(
      localStorageMock.getItem("reactions:counts-test-post") || "{}",
    );
    expect(storedReactions.like).toBe(1);

    const storedUserReactions = JSON.parse(
      localStorageMock.getItem("reactions:user-test-post") || "[]",
    );
    expect(storedUserReactions).toContain("like");
  });

  it("should allow multiple different reactions", () => {
    render(<Reactions slug="test-post" />);

    fireEvent.click(screen.getByLabelText("Like"));
    fireEvent.click(screen.getByLabelText("Fire"));

    expect(screen.getByText("2 reactions")).toBeInTheDocument();
  });
});
