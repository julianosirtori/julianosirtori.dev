import { describe, it, expect } from "vitest";

import { registry, visibleCommandNames } from "@/components/Terminal/commands";

describe("command registry", () => {
  it("exposes core commands", () => {
    for (const name of [
      "help",
      "whoami",
      "ls",
      "cd",
      "pwd",
      "cat",
      "clear",
      "echo",
      "theme",
      "projects",
      "posts",
      "snake",
      "matrix",
    ]) {
      expect(registry[name]).toBeDefined();
    }
  });

  it("registers aliases", () => {
    expect(registry["?"]).toBe(registry.help);
    expect(registry.bio).toBe(registry.about);
    expect(registry.cls).toBe(registry.clear);
  });

  it("does not expose hidden commands in the visible list", () => {
    expect(visibleCommandNames).not.toContain("sudo");
    expect(visibleCommandNames).not.toContain("iddqd");
    expect(visibleCommandNames).toContain("help");
  });

  it("every command has a description in both langs", () => {
    for (const key of Object.keys(registry)) {
      const cmd = registry[key];
      expect(cmd.description.en, `${key} missing en desc`).toBeTruthy();
      expect(cmd.description.pt, `${key} missing pt desc`).toBeTruthy();
    }
  });
});
