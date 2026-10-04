import { describe, expect, it } from "vitest";

import { formatFileSize } from "./format";

describe("formatFileSize", () => {
  it.each([
    [0, "en", "0 B"],
    [38, "en", "38 B"],
    [38, "pt", "38 B"],
    [999, "en", "999 B"],
    [1000, "en", "1.0 kB"],
    [8579, "en", "8.6 kB"],
    [8579, "pt", "8,6 kB"],
    [11590, "pt", "11,6 kB"],
  ])("formats %d bytes in %s as %s", (bytes, locale, expected) => {
    expect(formatFileSize(bytes, locale)).toBe(expected);
  });
});
