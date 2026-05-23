import { render, fireEvent, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { KonamiEgg } from "@/components/KonamiEgg";

const pushMock = vi.fn();

vi.mock("@/locales/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function press(key: string) {
  fireEvent.keyDown(window, { key });
}

describe("KonamiEgg", () => {
  beforeEach(() => {
    pushMock.mockClear();
    vi.useFakeTimers();
  });

  it("does nothing on a random key", () => {
    render(<KonamiEgg />);
    press("x");
    expect(screen.queryByText(/cheat code/i)).not.toBeInTheDocument();
  });

  it("renders the overlay after the full sequence", () => {
    render(<KonamiEgg />);
    for (const key of SEQUENCE) press(key);
    expect(screen.getByText(/cheat code accepted/i)).toBeInTheDocument();
  });

  it("routes to /playground after the overlay timeout", () => {
    render(<KonamiEgg />);
    for (const key of SEQUENCE) press(key);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(pushMock).toHaveBeenCalledWith("/playground");
  });

  it("recovers when a wrong key matches the first sequence char", () => {
    render(<KonamiEgg />);
    press("ArrowUp");
    press("ArrowUp");
    press("z"); // breaks
    // After a break that matches SEQUENCE[0] we expect progress to retry
    press("ArrowUp");
    press("ArrowUp");
    press("ArrowDown");
    press("ArrowDown");
    press("ArrowLeft");
    press("ArrowRight");
    press("ArrowLeft");
    press("ArrowRight");
    press("b");
    press("a");
    expect(screen.getByText(/cheat code accepted/i)).toBeInTheDocument();
  });

  it("ignores input when focus is inside an input element", () => {
    render(
      <div>
        <input data-testid="probe" />
        <KonamiEgg />
      </div>,
    );
    const input = screen.getByTestId("probe");
    input.focus();
    for (const key of SEQUENCE) fireEvent.keyDown(input, { key });
    expect(screen.queryByText(/cheat code/i)).not.toBeInTheDocument();
  });
});
