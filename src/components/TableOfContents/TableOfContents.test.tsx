import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { TableOfContents } from "@/components/TableOfContents";

const items = [
  { level: 2, text: "Intro", slug: "intro" },
  { level: 3, text: "Why", slug: "why" },
  { level: 2, text: "Outro", slug: "outro" },
];

afterEach(() => vi.restoreAllMocks());

describe("TableOfContents", () => {
  it("renders nothing without headings", () => {
    const { container } = render(
      <TableOfContents items={[]} label="On this page" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders native heading links in desktop and mobile navigation", () => {
    render(<TableOfContents items={items} label="On this page" />);
    for (const item of items) {
      for (const link of screen.getAllByText(item.text))
        expect(link).toHaveAttribute("href", `#${item.slug}`);
    }
  });

  it("uses a native disclosure and closes it when a heading is selected", () => {
    const { container } = render(
      <>
        <h2 id="intro">Article heading</h2>
        <TableOfContents items={items} label="On this page" />
      </>,
    );
    const details = container.querySelector("details")!;
    details.open = true;
    fireEvent.click(details.querySelector('a[href="#intro"]')!);
    expect(details.open).toBe(false);
    expect(screen.getByText("Article heading")).toHaveFocus();
  });

  it("tracks the last heading passed, including when scrolling backwards", () => {
    let top = 300;
    let callback: FrameRequestCallback = () => {};
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
      callback = fn;
      return 1;
    });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        return {
          top: this.id === "why" ? top : this.id === "intro" ? 0 : 1000,
        } as DOMRect;
      },
    );
    const { container } = render(
      <>
        <h2 id="intro">Heading</h2>
        <h3 id="why">Subheading</h3>
        <h2 id="outro">End</h2>
        <TableOfContents items={items} label="On this page" />
      </>,
    );
    expect(container.querySelector('a[href="#intro"]')).toHaveAttribute(
      "aria-current",
      "location",
    );
    top = 20;
    fireEvent.scroll(window);
    act(() => callback(0));
    expect(container.querySelector('a[href="#why"]')).toHaveAttribute(
      "aria-current",
      "location",
    );
    top = 300;
    fireEvent.scroll(window);
    act(() => callback(1));
    expect(container.querySelector('a[href="#intro"]')).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(container.querySelector('a[href="#why"]')).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("removes scroll and resize listeners on unmount", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(
      <TableOfContents items={items} label="On this page" />,
    );
    unmount();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
