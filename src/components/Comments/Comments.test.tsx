import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { useTheme } from "next-themes";
import { Comments } from "./Comments";
import pt from "@/locales/pt/blog.json";
import en from "@/locales/en/blog.json";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ resolvedTheme: "light" })),
}));
vi.mock("next/dynamic", () => ({
  default: () =>
    function MockGiscus(props: { theme: string; lang: string }) {
      return (
        <div
          data-testid="giscus"
          data-theme={props.theme}
          data-lang={props.lang}
        />
      );
    },
}));

describe("Comments", () => {
  for (const [locale, messages] of [
    ["pt", pt],
    ["en", en],
  ] as const) {
    it(`loads only after interaction and uses the active theme in ${locale}`, () => {
      vi.mocked(useTheme).mockReturnValue({
        resolvedTheme: "light",
        themes: ["light", "dark"],
        setTheme: vi.fn(),
      });
      const ui = (
        <NextIntlClientProvider locale={locale} messages={{ blog: messages }}>
          <Comments locale={locale} />
        </NextIntlClientProvider>
      );
      const { rerender } = render(ui);
      expect(screen.queryByTestId("giscus")).not.toBeInTheDocument();
      fireEvent.click(
        screen.getByRole("button", { name: messages.comments.load }),
      );
      expect(screen.getByTestId("giscus")).toHaveAttribute(
        "data-theme",
        "light",
      );
      expect(screen.getByTestId("giscus")).toHaveAttribute("data-lang", locale);
      vi.mocked(useTheme).mockReturnValue({
        resolvedTheme: "dark",
        themes: ["light", "dark"],
        setTheme: vi.fn(),
      });
      rerender(
        <NextIntlClientProvider locale={locale} messages={{ blog: messages }}>
          <Comments locale={locale} />
        </NextIntlClientProvider>,
      );
      expect(screen.getByTestId("giscus")).toHaveAttribute(
        "data-theme",
        "dark",
      );
    });
  }
});
