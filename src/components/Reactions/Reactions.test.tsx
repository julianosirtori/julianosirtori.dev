import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Reactions } from "./Reactions";
vi.mock("next-intl", () => ({ useLocale: () => "en" }));
const fetchMock = vi.fn();
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const response = (data: unknown, ok = true) => ({ ok, json: async () => data });
describe("persistent reaction UI", () => {
  it("renders all types and waits for backend identity", async () => {
    fetchMock.mockResolvedValue(response({ counts: {}, selected: [] }));
    render(<Reactions slug="hello-world" />);
    for (const label of ["Like", "Fire", "Insightful", "Celebrate", "Love"])
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText("Like")).toBeEnabled());
  });
  it("optimistically adds and rolls back on a failed PUT", async () => {
    fetchMock.mockResolvedValueOnce(
      response({ counts: { like: 4 }, selected: [] }),
    );
    render(<Reactions slug="hello-world" />);
    await waitFor(() => expect(screen.getByLabelText("Like")).toBeEnabled());
    fetchMock.mockResolvedValueOnce(response({}, false));
    fireEvent.click(screen.getByLabelText("Like"));
    expect(screen.getByLabelText("Like")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await waitFor(() =>
      expect(screen.getByLabelText("Like")).toHaveAttribute(
        "aria-pressed",
        "false",
      ),
    );
    expect(screen.getByText("4")).toBeInTheDocument();
  });
  it("migrates choices once and never imports historical local totals", async () => {
    localStorage.setItem("reactions:user-hello-world", '["like","invalid"]');
    localStorage.setItem("reactions:counts-hello-world", '{"like":99999}');
    fetchMock
      .mockResolvedValueOnce(response({ counts: {}, selected: [] }))
      .mockResolvedValueOnce(
        response({ counts: { like: 1 }, selected: ["like"] }),
      );
    render(<Reactions slug="hello-world" />);
    await waitFor(() => expect(screen.getByLabelText("Like")).toBeEnabled());
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
      type: "like",
      active: true,
    });
    expect(screen.queryByText("99999")).not.toBeInTheDocument();
    expect(localStorage.getItem("reactions:migrated-hello-world")).toBe("1");
    cleanup();
    fetchMock.mockResolvedValue(
      response({ counts: { like: 1 }, selected: ["like"] }),
    );
    render(<Reactions slug="hello-world" />);
    await waitFor(() => expect(screen.getByLabelText("Like")).toBeEnabled());
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
