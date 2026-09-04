import { describe, it, expect } from "vitest";

import { closestMatch, distance } from "@/components/Terminal/levenshtein";

describe("distance", () => {
  it("returns 0 for identical strings", () => {
    expect(distance("hello", "hello")).toBe(0);
  });

  it("computes edit distance", () => {
    expect(distance("kitten", "sitting")).toBe(3);
    expect(distance("abc", "")).toBe(3);
  });
});

describe("closestMatch", () => {
  it("finds a close suggestion", () => {
    expect(closestMatch("hep", ["help", "echo", "ls"])).toBe("help");
    expect(closestMatch("projets", ["projects", "posts"])).toBe("projects");
  });

  it("returns null when nothing is close enough", () => {
    expect(closestMatch("xyz", ["help", "echo"])).toBeNull();
  });
});
