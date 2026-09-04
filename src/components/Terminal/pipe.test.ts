import { describe, it, expect } from "vitest";

import { applyPipe } from "@/components/Terminal/pipe";
import { line } from "@/components/Terminal/lines";

describe("applyPipe", () => {
  const source = [
    line("react"),
    line("typescript"),
    line("next.js"),
    line("vue"),
  ];

  it("filters with grep", () => {
    const result = applyPipe(source, { name: "grep", args: ["react"] });
    expect(result).toHaveLength(1);
    expect((result[0].content as string).toLowerCase()).toContain("react");
  });

  it("returns all when grep term empty", () => {
    expect(applyPipe(source, { name: "grep", args: [] })).toEqual(source);
  });

  it("limits with head", () => {
    expect(applyPipe(source, { name: "head", args: ["2"] })).toHaveLength(2);
  });

  it("limits with tail", () => {
    const result = applyPipe(source, { name: "tail", args: ["1"] });
    expect(result).toHaveLength(1);
    expect(result[0].content).toBe("vue");
  });

  it("counts with wc", () => {
    const result = applyPipe(source, { name: "wc", args: [] });
    expect(result).toHaveLength(1);
    const content = result[0].content as string;
    expect(content.startsWith("4 ")).toBe(true);
  });

  it("reports unknown pipe commands", () => {
    const result = applyPipe(source, { name: "nope", args: [] });
    expect(result).toHaveLength(1);
    expect(result[0].kind).toBe("error");
  });
});
