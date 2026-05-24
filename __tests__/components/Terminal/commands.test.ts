import { describe, it, expect, vi } from "vitest";

import { registry } from "@/components/Terminal/commands";
import type {
  CommandContext,
  CommandDef,
  Cwd,
  Lang,
  OutputLine,
} from "@/components/Terminal/types";

interface MockEnv {
  push: ReturnType<typeof vi.fn>;
  router: { push: ReturnType<typeof vi.fn> };
  setTheme: ReturnType<typeof vi.fn>;
  setLang: ReturnType<typeof vi.fn>;
  setCwd: ReturnType<typeof vi.fn>;
  setOverlay: ReturnType<typeof vi.fn>;
  setHighScore: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
  theme: "dracula";
  history: string[];
  highScore: number;
}

function mockCtx(overrides: Partial<CommandContext> = {}): CommandContext {
  const env: MockEnv = {
    push: vi.fn(),
    router: { push: vi.fn() },
    setTheme: vi.fn(),
    setLang: vi.fn(),
    setCwd: vi.fn(),
    setOverlay: vi.fn(),
    setHighScore: vi.fn(),
    clear: vi.fn(),
    theme: "dracula",
    history: [],
    highScore: 0,
  };
  return {
    args: [],
    raw: "",
    lang: "en" as Lang,
    cwd: "/" as Cwd,
    env: env as unknown as CommandContext["env"],
    ...overrides,
  };
}

async function run(
  cmd: CommandDef,
  ctx: CommandContext,
): Promise<OutputLine[]> {
  return Promise.resolve(cmd.run(ctx));
}

function lineText(out: OutputLine[]): string {
  return out
    .map((l) => (typeof l.content === "string" ? l.content : ""))
    .join("\n");
}

describe("help", () => {
  it("renders command names with descriptions from the registry", async () => {
    const out = await run(registry.help, mockCtx());
    const text = lineText(out);
    expect(text).toContain("whoami");
    expect(text).toContain(registry.whoami.description.en);
    expect(text).toContain(registry.skills.description.en);
  });

  it("translates descriptions in pt", async () => {
    const out = await run(registry.help, mockCtx({ lang: "pt" }));
    const text = lineText(out);
    expect(text).toContain(registry.whoami.description.pt);
  });
});

describe("theme", () => {
  it("rejects unknown theme name with an error line", async () => {
    const out = await run(registry.theme, mockCtx({ args: ["nope"] }));
    expect(out[0].kind).toBe("error");
    expect(lineText(out)).toContain("unknown theme");
  });

  it("calls setTheme for a valid theme", async () => {
    const ctx = mockCtx({ args: ["matrix"] });
    await run(registry.theme, ctx);
    expect((ctx.env as unknown as MockEnv).setTheme).toHaveBeenCalledWith(
      "matrix",
    );
  });
});

describe("cat", () => {
  it("returns an error when no argument is provided", async () => {
    const out = await run(registry.cat, mockCtx());
    expect(out[0].kind).toBe("error");
  });

  it("returns an error for missing files", async () => {
    const out = await run(registry.cat, mockCtx({ args: ["nope.md"] }));
    expect(out[0].kind).toBe("error");
    expect(lineText(out)).toContain("no such file");
  });
});

describe("ls", () => {
  it("lists root entries", async () => {
    const out = await run(registry.ls, mockCtx());
    expect(lineText(out)).toContain("about/");
    expect(lineText(out)).toContain("projects/");
  });

  it("errors on missing directory", async () => {
    const out = await run(registry.ls, mockCtx({ args: ["nope"] }));
    expect(out[0].kind).toBe("error");
  });
});

describe("cd", () => {
  it("changes directory when target exists", async () => {
    const ctx = mockCtx({ args: ["about"] });
    await run(registry.cd, ctx);
    expect((ctx.env as unknown as MockEnv).setCwd).toHaveBeenCalledWith(
      "/about",
    );
  });

  it("returns to root with ~", async () => {
    const ctx = mockCtx({ args: ["~"], cwd: "/about" as Cwd });
    await run(registry.cd, ctx);
    expect((ctx.env as unknown as MockEnv).setCwd).toHaveBeenCalledWith("/");
  });

  it("errors on unknown target", async () => {
    const out = await run(registry.cd, mockCtx({ args: ["bogus"] }));
    expect(out[0].kind).toBe("error");
  });
});

describe("posts", () => {
  it("does not navigate without --open", async () => {
    const ctx = mockCtx();
    await run(registry.posts, ctx);
    expect((ctx.env as unknown as MockEnv).router.push).not.toHaveBeenCalled();
  });

  it("navigates to /blog with --open", async () => {
    const ctx = mockCtx({ args: ["--open"] });
    await run(registry.posts, ctx);
    expect((ctx.env as unknown as MockEnv).router.push).toHaveBeenCalledWith(
      "/blog",
    );
  });
});

describe("contact", () => {
  it("does not navigate without --open", async () => {
    const ctx = mockCtx();
    await run(registry.contact, ctx);
    expect((ctx.env as unknown as MockEnv).router.push).not.toHaveBeenCalled();
  });

  it("navigates with --open", async () => {
    const ctx = mockCtx({ args: ["--open"] });
    await run(registry.contact, ctx);
    expect((ctx.env as unknown as MockEnv).router.push).toHaveBeenCalledWith(
      "/contact",
    );
  });
});

describe("clear", () => {
  it("calls env.clear and returns no lines", async () => {
    const ctx = mockCtx();
    const out = await run(registry.clear, ctx);
    expect(out).toEqual([]);
    expect((ctx.env as unknown as MockEnv).clear).toHaveBeenCalled();
  });
});

describe("sudo (hidden)", () => {
  it("renders distinct messages per language", async () => {
    const en = await run(registry.sudo, mockCtx());
    const pt = await run(registry.sudo, mockCtx({ lang: "pt" }));
    expect(lineText(en)).not.toBe(lineText(pt));
    expect(lineText(pt)).toContain("Permissão");
  });
});
