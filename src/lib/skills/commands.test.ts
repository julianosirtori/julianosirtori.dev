import { describe, expect, it } from "vitest";

import { SKILL_AGENTS } from "@/data/skill-agents";
import {
  manualInstallCommands,
  npxInstallCommand,
  npxInstallMethod,
  pluginInstallCommands,
} from "./commands";
import { isValidSkillSlug, skillFolderUrl } from "./constants";

describe("install commands", () => {
  it("builds the universal npx command", () => {
    expect(npxInstallCommand("mac-cleanup")).toBe(
      "npx skills add julianosirtori/skills --skill mac-cleanup -g",
    );
    expect(npxInstallMethod()).toBe("npx");
  });

  it.each([
    ["claude-code"],
    ["opencode"],
    ["codex"],
    ["cursor"],
    ["gemini-cli"],
    ["github-copilot"],
  ] as const)("targets %s with -a", (agent) => {
    expect(npxInstallCommand("mac-cleanup", agent)).toBe(
      `npx skills add julianosirtori/skills --skill mac-cleanup -g -a ${agent}`,
    );
    expect(npxInstallMethod(agent)).toBe(`npx-${agent}`);
  });

  it("builds the two Claude Code plugin commands", () => {
    expect(
      pluginInstallCommands("mac-cleanup", "julianosirtori-skills"),
    ).toEqual([
      "/plugin marketplace add julianosirtori/skills",
      "/plugin install mac-cleanup@julianosirtori-skills",
    ]);
  });

  it("links the manual install into the chosen agent's user folder", () => {
    expect(manualInstallCommands("mac-cleanup", "claude-code")).toEqual([
      "git clone https://github.com/julianosirtori/skills.git ~/Developer/skills",
      "ln -s ~/Developer/skills/skills/mac-cleanup ~/.claude/skills/mac-cleanup",
    ]);
    expect(manualInstallCommands("mac-cleanup", "codex")[1]).toBe(
      "ln -s ~/Developer/skills/skills/mac-cleanup ~/.agents/skills/mac-cleanup",
    );
    expect(manualInstallCommands("mac-cleanup", "opencode")[1]).toBe(
      "ln -s ~/Developer/skills/skills/mac-cleanup ~/.config/opencode/skills/mac-cleanup",
    );
  });

  it("copies the GitHub folder link", () => {
    expect(skillFolderUrl("mac-cleanup")).toBe(
      "https://github.com/julianosirtori/skills/tree/main/skills/mac-cleanup",
    );
  });

  it("never emits trailing whitespace or newlines", () => {
    const all = [
      npxInstallCommand("a"),
      ...SKILL_AGENTS.map((agent) => npxInstallCommand("a", agent.id)),
      ...pluginInstallCommands("a", "m"),
      ...SKILL_AGENTS.flatMap((agent) => manualInstallCommands("a", agent.id)),
    ];
    for (const command of all) expect(command).toBe(command.trim());
  });
});

describe("isValidSkillSlug", () => {
  it.each(["mac-cleanup", "a", "skill-01", "a".repeat(64)])(
    "accepts %s",
    (slug) => expect(isValidSkillSlug(slug)).toBe(true),
  );

  it.each([
    "",
    "Mac-Cleanup",
    "-lead",
    "trail-",
    "a--b",
    "under_score",
    "dot.ted",
    "../etc",
    "a".repeat(65),
  ])("rejects %s", (slug) => expect(isValidSkillSlug(slug)).toBe(false));
});
