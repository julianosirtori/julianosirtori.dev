import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { TableOfContents } from "@/components/TableOfContents";

const observe = vi.fn();
const disconnect = vi.fn();
const observerInstances: Array<{
  callback: IntersectionObserverCallback;
}> = [];

beforeEach(() => {
  observe.mockClear();
  disconnect.mockClear();
  observerInstances.length = 0;

  class MockObserver {
    constructor(cb: IntersectionObserverCallback) {
      observerInstances.push({ callback: cb });
    }
    observe = observe;
    disconnect = disconnect;
    unobserve = vi.fn();
    takeRecords = vi.fn(() => []);
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  vi.stubGlobal("IntersectionObserver", MockObserver);
});

const items = [
  { level: 2, text: "Intro", slug: "intro" },
  { level: 3, text: "Why", slug: "why" },
  { level: 2, text: "Outro", slug: "outro" },
];

describe("TableOfContents", () => {
  it("renders nothing when items array is empty", () => {
    const { container } = render(
      <TableOfContents items={[]} label="On this page" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders every item label in the sidebar", () => {
    render(<TableOfContents items={items} label="On this page" />);
    expect(screen.getAllByText("Intro").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Why").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Outro").length).toBeGreaterThan(0);
  });

  it("observes heading elements once mounted", () => {
    document.body.innerHTML = `
      <h2 id="intro">Intro</h2>
      <h3 id="why">Why</h3>
      <h2 id="outro">Outro</h2>
    `;
    render(<TableOfContents items={items} label="On this page" />);
    expect(observe).toHaveBeenCalledTimes(3);
  });

  it("disconnects the observer on unmount", () => {
    document.body.innerHTML = `<h2 id="intro">Intro</h2>`;
    const { unmount } = render(
      <TableOfContents items={items} label="On this page" />,
    );
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("opens and closes the mobile drawer", () => {
    render(<TableOfContents items={items} label="On this page" />);
    const trigger = screen.getByLabelText("On this page");
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
