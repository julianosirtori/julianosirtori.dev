import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CodeBlock } from "@/components/CodeBlock";
import messages from "@/locales/en/blog.json";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: keyof typeof messages) => messages[key],
}));

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn(() => Promise.resolve()),
};

Object.defineProperty(navigator, "clipboard", {
  value: mockClipboard,
  writable: true,
});

describe("CodeBlock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children", () => {
    render(
      <CodeBlock>
        <code>const hello = &quot;world&quot;;</code>
      </CodeBlock>,
    );

    expect(screen.getByText(/const hello/)).toBeInTheDocument();
  });

  it("should render copy button", () => {
    render(
      <CodeBlock>
        <code>console.log(&quot;test&quot;);</code>
      </CodeBlock>,
    );

    const copyButton = screen.getByTitle("Copy code");
    expect(copyButton).toBeInTheDocument();
  });

  it("should show language label when data-language is provided", () => {
    render(
      <CodeBlock data-language="typescript">
        <code>const x: number = 1;</code>
      </CodeBlock>,
    );

    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("should copy code to clipboard when copy button is clicked", async () => {
    render(
      <CodeBlock>
        <code>const code = &quot;test&quot;;</code>
      </CodeBlock>,
    );

    const copyButton = screen.getByTitle("Copy code");
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalled();
    });
  });

  it("should show copied state after clicking copy", async () => {
    render(
      <CodeBlock>
        <code>const code = &quot;test&quot;;</code>
      </CodeBlock>,
    );

    const copyButton = screen.getByTitle("Copy code");
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByTitle("Copied")).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent("Copied");
    });
  });

  it("should apply custom className", () => {
    const { container } = render(
      <CodeBlock className="custom-class">
        <code>test</code>
      </CodeBlock>,
    );

    const pre = container.querySelector("pre");
    expect(pre).toHaveClass("custom-class");
    expect(pre).toHaveAttribute("tabindex", "0");
  });

  it("shows a helpful error if clipboard access fails", async () => {
    mockClipboard.writeText.mockRejectedValueOnce(
      new Error("Permission denied"),
    );
    render(
      <CodeBlock>
        <code>const x = 1;</code>
      </CodeBlock>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      messages.copyFailed,
    );
    expect(screen.getByRole("button", { name: "Copy code" })).toBeEnabled();
  });
});
