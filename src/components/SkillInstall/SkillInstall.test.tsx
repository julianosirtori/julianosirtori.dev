import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import en from "@/locales/en/skills.json";
import { SkillInstall } from "./SkillInstall";

// AC-32: every install copy reports `skill_install_copy` with the slug and the
// method, and nothing is reported when the clipboard write fails.
const { track } = vi.hoisted(() => ({ track: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ track }));

const SLUG = "mac-cleanup";
const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  track.mockClear();
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0);
    return 0;
  });
});

afterEach(() => vi.restoreAllMocks());

function renderInstall(withPlugin = true) {
  render(
    <NextIntlClientProvider locale="en" messages={{ skills: en }}>
      <SkillInstall
        slug={SLUG}
        scriptsCount={3}
        plugin={
          withPlugin
            ? { name: "mac-cleanup", marketplace: "julianosirtori-skills" }
            : undefined
        }
      />
    </NextIntlClientProvider>,
  );
}

async function copy(name: string) {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name, hidden: true }));
  });
}

function lastEvent() {
  return track.mock.calls.at(-1);
}

describe("SkillInstall analytics", () => {
  it.each([
    ["Copy install command for any agent", "npx"],
    ["Copy install command for Claude Code", "npx-claude-code"],
    ["Copy install command for OpenCode", "npx-opencode"],
    ["Copy install command for Codex", "npx-codex"],
    ["Copy install command for Cursor", "npx-cursor"],
    ["Copy install command for Gemini CLI", "npx-gemini-cli"],
    ["Copy install command for GitHub Copilot", "npx-github-copilot"],
    ["Copy plugin step 1", "claude-plugin"],
    ["Copy plugin step 2", "claude-plugin"],
    ["Copy manual step 1", "manual"],
    ["Copy manual step 2", "manual"],
    ["Copy prompt for your agent", "prompt"],
    ["Copy GitHub link", "link"],
  ])("reports %s as %s", async (button, method) => {
    renderInstall();
    await copy(button);
    expect(track).toHaveBeenCalledTimes(1);
    expect(lastEvent()).toEqual([
      "skill_install_copy",
      { location: "skills", content_id: SLUG, action_id: method },
    ]);
  });

  it("does not report a copy when the clipboard write fails", async () => {
    writeText.mockRejectedValue(new Error("blocked"));
    renderInstall();
    await copy("Copy install command for any agent");
    expect(track).not.toHaveBeenCalled();
    expect(
      within(screen.getByRole("tabpanel")).getByRole("alert"),
    ).toHaveTextContent("Couldn't copy automatically.");
  });

  it("announces each copy in the single live region", async () => {
    renderInstall();
    const status = screen.getByRole("status");
    await copy("Copy install command for any agent");
    expect(status).toHaveTextContent("Command copied");
    await copy("Copy GitHub link");
    expect(status).toHaveTextContent("Link copied");
    await copy("Copy prompt for your agent");
    expect(status).toHaveTextContent("Prompt copied");
  });

  it("leaves the plugin option out when the skill is not in the marketplace", () => {
    renderInstall(false);
    expect(
      screen.queryByRole("button", { name: /Copy plugin step/, hidden: true }),
    ).toBeNull();
    expect(
      screen.getByRole("button", {
        name: "Copy install command for Claude Code",
        hidden: true,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy manual step 2", hidden: true }),
    ).toBeInTheDocument();
  });
});

describe("Copy GitHub link fallback", () => {
  const URL = `https://github.com/julianosirtori/skills/tree/main/skills/${SLUG}`;

  it("shows the link selected with an alert when the clipboard fails", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    renderInstall();
    await copy("Copy GitHub link");

    expect(screen.getByRole("alert")).toHaveTextContent(en.copy.failed);
    expect(screen.getByText(URL)).toBeInTheDocument();
    expect(window.getSelection()?.toString()).toBe(URL);
    expect(track).not.toHaveBeenCalled();
  });

  it("hides the fallback after a later copy works", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    renderInstall();
    await copy("Copy GitHub link");
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await copy("Copy GitHub link");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(lastEvent()?.[1]).toMatchObject({ action_id: "link" });
  });
});
