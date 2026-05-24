import { describe, it, expect } from "vitest";

import { autocomplete } from "@/components/Terminal/autocomplete";

describe("autocomplete", () => {
  it("completes a single matching command", () => {
    const result = autocomplete("whoa", "/");
    expect(result.completed).toBe("whoami ");
    expect(result.options).toHaveLength(0);
  });

  it("returns options when ambiguous", () => {
    const result = autocomplete("p", "/");
    expect(result.options.length).toBeGreaterThan(1);
  });

  it("completes file paths after fs-aware commands", () => {
    const result = autocomplete("ls a", "/");
    expect(result.completed).toBe("ls about/ ");
  });

  it("leaves input unchanged when no match", () => {
    const result = autocomplete("zzzz", "/");
    expect(result.completed).toBe("zzzz");
  });
});
