import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Callout } from "@/components/Mdx/Callout";
import { Quote } from "@/components/Mdx/Quote";
import { Aside } from "@/components/Mdx/Aside";
import { Figure } from "@/components/Mdx/Figure";

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
  }: {
    alt: string;
    src: string;
    width?: number;
    height?: number;
  }) => <div data-src={src} data-alt={alt} data-testid="next-image" />,
}));

describe("Callout", () => {
  it("renders the title and body", () => {
    render(
      <Callout title="Heads up">
        <p>some body</p>
      </Callout>,
    );
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("some body")).toBeInTheDocument();
  });

  it("renders without a title", () => {
    render(
      <Callout tone="warn">
        <p>warning text</p>
      </Callout>,
    );
    expect(screen.getByText("warning text")).toBeInTheDocument();
  });
});

describe("Quote", () => {
  it("renders the quote and attribution", () => {
    render(
      <Quote author="Linus" cite="Linux Kernel">
        Talk is cheap. Show me the code.
      </Quote>,
    );
    expect(
      screen.getByText(/Talk is cheap. Show me the code/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Linus/)).toBeInTheDocument();
    expect(screen.getByText(/Linux Kernel/)).toBeInTheDocument();
  });

  it("omits attribution caption when neither author nor cite is supplied", () => {
    const { container } = render(<Quote>just a quote</Quote>);
    expect(container.querySelector("figcaption")).toBeNull();
  });
});

describe("Aside", () => {
  it("renders default label and children", () => {
    render(
      <Aside>
        <p>note</p>
      </Aside>,
    );
    expect(screen.getByText(/aside/i)).toBeInTheDocument();
    expect(screen.getByText("note")).toBeInTheDocument();
  });

  it("renders custom label", () => {
    render(<Aside label="footnote">x</Aside>);
    expect(screen.getByText(/footnote/i)).toBeInTheDocument();
  });
});

describe("Figure", () => {
  it("uses next/image when width and height are provided", () => {
    render(
      <Figure src="/x.png" alt="x" caption="cap" width={100} height={50} />,
    );
    expect(screen.getByTestId("next-image")).toBeInTheDocument();
    expect(screen.getByText("cap")).toBeInTheDocument();
  });

  it("falls back to a bare img without dimensions", () => {
    const { container } = render(<Figure src="/x.png" alt="x" />);
    expect(container.querySelector("img")).not.toBeNull();
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("x");
  });
});
