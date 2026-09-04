import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BackToTop } from "@/components/BackToTop";

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
      className: string;
      "aria-label": string;
    }) => (
      <button onClick={onClick} className={className} aria-label={ariaLabel}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("BackToTop", () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  it("should not be visible when scroll is at top", () => {
    render(<BackToTop />);
    const button = screen.queryByLabelText("Back to top");
    expect(button).not.toBeInTheDocument();
  });

  it("should become visible when scrolled past 500px", () => {
    render(<BackToTop />);

    // Simulate scroll
    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByLabelText("Back to top");
    expect(button).toBeInTheDocument();
  });

  it("should scroll to top when clicked", () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    render(<BackToTop />);

    // Make button visible
    Object.defineProperty(window, "scrollY", { value: 600, writable: true });
    fireEvent.scroll(window);

    const button = screen.getByLabelText("Back to top");
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
