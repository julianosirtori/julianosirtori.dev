import { OutputLine } from "./types";

export function applyPipe(
  output: OutputLine[],
  pipe: { name: string; args: string[] },
): OutputLine[] {
  const toText = (l: OutputLine) =>
    typeof l.content === "string" ? l.content : "";

  switch (pipe.name) {
    case "grep": {
      const term = pipe.args.join(" ").toLowerCase();
      if (!term) return output;
      return output.filter((l) => toText(l).toLowerCase().includes(term));
    }
    case "head": {
      const n = parseCount(pipe.args, 10);
      return output.slice(0, n);
    }
    case "tail": {
      const n = parseCount(pipe.args, 10);
      return output.slice(-n);
    }
    case "wc": {
      const text = output.map(toText).join("\n");
      const lines = output.length;
      const words = text.split(/\s+/).filter(Boolean).length;
      const chars = text.length;
      return [
        {
          id: `pipe-${Date.now()}`,
          kind: "text",
          content: `${lines} ${words} ${chars}`,
        },
      ];
    }
    default:
      return [
        {
          id: `pipe-err-${Date.now()}`,
          kind: "error",
          content: `pipe: unknown command '${pipe.name}'`,
        },
      ];
  }
}

function parseCount(args: string[], fallback: number): number {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-n" && args[i + 1]) {
      const n = parseInt(args[i + 1], 10);
      if (!isNaN(n)) return n;
    }
    const direct = parseInt(args[i], 10);
    if (!isNaN(direct)) return direct;
  }
  return fallback;
}
