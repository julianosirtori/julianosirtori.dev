import { describe, it, expect } from "vitest";

import { parseInput } from "@/components/Terminal/parser";

describe("parseInput", () => {
  it("returns null for empty input", () => {
    expect(parseInput("")).toBeNull();
    expect(parseInput("   ")).toBeNull();
  });

  it("parses a single command", () => {
    expect(parseInput("help")).toEqual({
      name: "help",
      args: [],
      raw: "help",
    });
  });

  it("parses command with args", () => {
    expect(parseInput("echo hello world")).toEqual({
      name: "echo",
      args: ["hello", "world"],
      raw: "echo hello world",
    });
  });

  it("lowercases the command name only", () => {
    const result = parseInput("Echo Hello");
    expect(result?.name).toBe("echo");
    expect(result?.args).toEqual(["Hello"]);
  });

  it("respects quoted arguments", () => {
    expect(parseInput('cowsay "hello there friend"')?.args).toEqual([
      "hello there friend",
    ]);
  });

  it("parses pipes", () => {
    const result = parseInput("ls | grep about");
    expect(result?.name).toBe("ls");
    expect(result?.pipe).toEqual({ name: "grep", args: ["about"] });
  });

  it("handles pipe without args", () => {
    const result = parseInput("posts | wc");
    expect(result?.pipe).toEqual({ name: "wc", args: [] });
  });

  it("trims whitespace around tokens", () => {
    expect(parseInput("   ls   ")).toEqual({
      name: "ls",
      args: [],
      raw: "ls",
    });
  });
});
