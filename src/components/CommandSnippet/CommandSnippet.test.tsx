import { act, fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

import en from "@/locales/en/skills.json";
import pt from "@/locales/pt/skills.json";
import { CommandSnippet } from "./CommandSnippet";

const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
});

const COMMAND =
  "npx skills add julianosirtori/skills --skill mac-cleanup -g -a opencode";

function renderSnippet(locale: "en" | "pt" = "en", onCopied = vi.fn()) {
  render(
    <NextIntlClientProvider
      locale={locale}
      messages={{ skills: locale === "en" ? en : pt }}
    >
      <CommandSnippet
        label="terminal"
        text={COMMAND}
        copyContext={
          locale === "en"
            ? "install command for OpenCode"
            : "comando de instalação (OpenCode)"
        }
        onCopied={onCopied}
      >
        npx skills add julianosirtori/skills --skill mac-cleanup -g{" "}
        <span>-a opencode</span>
      </CommandSnippet>
    </NextIntlClientProvider>,
  );
  return onCopied;
}

describe("CommandSnippet", () => {
  it("shows exactly the copied text in a focusable, labelled pre", () => {
    renderSnippet();
    const pre = screen.getByLabelText("terminal");
    expect(pre.tagName).toBe("PRE");
    expect(pre).toHaveAttribute("tabindex", "0");
    expect(pre.textContent).toBe(COMMAND);
  });

  it("copies the command with a translated, contextual button", async () => {
    const onCopied = renderSnippet("pt");
    const button = screen.getByRole("button", {
      name: "Copiar comando de instalação (OpenCode)",
    });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(writeText).toHaveBeenCalledWith(COMMAND);
    expect(onCopied).toHaveBeenCalledOnce();
    expect(button).toHaveTextContent("Copiado");
  });

  it("selects the command and explains when the clipboard fails", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    const onCopied = renderSnippet();
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: "Copy install command for OpenCode",
        }),
      );
    });
    expect(screen.getByRole("alert")).toHaveTextContent(en.copy.failed);
    expect(window.getSelection()?.toString()).toBe(COMMAND);
    expect(screen.getByLabelText("terminal").textContent).toBe(COMMAND);
    expect(onCopied).not.toHaveBeenCalled();
  });
});
