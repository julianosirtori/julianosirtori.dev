import { act, cleanup, render } from "@testing-library/react";
import { beforeEach, afterEach, it, expect, vi } from "vitest";
import { SiteAnalytics, ArticleAnalytics } from "./Analytics";
const { navigation } = vi.hoisted(() => ({ navigation: { path: "/pt" } }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.path }));
vi.mock("next/script", () => ({ default: () => null }));
beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
  window.gtag = vi.fn();
  window.history.replaceState(null, "", "/pt");
  navigation.path = "/pt";
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
it("emits one pageview per navigation and excludes administrative pages", () => {
  const { rerender } = render(<SiteAnalytics />);
  rerender(<SiteAnalytics />);
  const count = () =>
    vi
      .mocked(window.gtag!)
      .mock.calls.filter(
        (call) => call[0] === "event" && call[1] === "page_view",
      ).length;
  expect(count()).toBe(1);
  navigation.path = "/pt/newsletter/confirm";
  window.history.replaceState(
    null,
    "",
    "/pt/newsletter/confirm?token=private#private",
  );
  rerender(<SiteAnalytics />);
  expect(count()).toBe(2);
  expect(JSON.stringify(vi.mocked(window.gtag!).mock.calls)).not.toContain(
    "private",
  );
  navigation.path = "/pt/admin/guestbook";
  window.history.replaceState(null, "", navigation.path);
  rerender(<SiteAnalytics />);
  expect(count()).toBe(2);
});
it("counts article milestones once and requires thirty visible seconds at the end", () => {
  vi.useFakeTimers();
  let visible = "visible";
  vi.spyOn(document, "visibilityState", "get").mockImplementation(
    () => visible as DocumentVisibilityState,
  );
  const article = document.createElement("article");
  article.id = "post-content";
  document.body.appendChild(article);
  article.getBoundingClientRect = () => ({
    top: 0,
    bottom: 100,
    height: 100,
    left: 0,
    right: 100,
    width: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  render(<ArticleAnalytics slug="hello-world" />);
  act(() => vi.advanceTimersByTime(20_000));
  const events = () =>
    vi
      .mocked(window.gtag!)
      .mock.calls.filter((call) => call[0] === "event")
      .map((call) => call[1]);
  expect(events().filter((e) => e === "article_read_progress")).toHaveLength(4);
  expect(events()).not.toContain("article_read_complete");
  visible = "hidden";
  act(() => vi.advanceTimersByTime(40_000));
  expect(events()).not.toContain("article_read_complete");
  visible = "visible";
  act(() => vi.advanceTimersByTime(11_000));
  expect(events().filter((e) => e === "article_read_complete")).toHaveLength(1);
  article.remove();
});
