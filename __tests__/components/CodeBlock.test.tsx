import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CodeBlock } from "@/components/CodeBlock";

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
  });
});
