import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyButton } from "./CopyButton";

const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
});

afterEach(() => vi.useRealTimers());

const props = {
  text: "npx skills add julianosirtori/skills --skill mac-cleanup -g",
  label: "Copy",
  copiedLabel: "Copied",
  context: "install command for any agent",
};

describe("CopyButton", () => {
  it("names the button with the visible label first and the context after", () => {
    render(<CopyButton {...props} />);
    expect(
      screen.getByRole("button", {
        name: "Copy install command for any agent",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
  });

  it("copies the exact text and confirms for two seconds", async () => {
    vi.useFakeTimers();
    const onCopied = vi.fn();
    render(<CopyButton {...props} onCopied={onCopied} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(writeText).toHaveBeenCalledWith(props.text);
    expect(onCopied).toHaveBeenCalledOnce();
    expect(screen.getByRole("button")).toHaveTextContent("Copied");

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("button")).toHaveTextContent(/^Copy /);
  });

  it("reports a rejected clipboard write and keeps the idle label", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    const onCopied = vi.fn();
    const onError = vi.fn();
    render(<CopyButton {...props} onCopied={onCopied} onError={onError} />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(onError).toHaveBeenCalledOnce();
    expect(onCopied).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveTextContent(/^Copy /);
  });

  it("treats a missing Clipboard API as an error", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    const onError = vi.fn();
    render(<CopyButton {...props} onError={onError} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(onError).toHaveBeenCalledOnce();
  });

  it("is a native button, so Enter and Space work from the keyboard", () => {
    render(<CopyButton {...props} />);
    const button = screen.getByRole("button");
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
  });
});
