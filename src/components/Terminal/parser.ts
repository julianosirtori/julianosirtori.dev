export interface ParsedCommand {
  name: string;
  args: string[];
  raw: string;
  pipe?: { name: string; args: string[] };
}

export function parseInput(input: string): ParsedCommand | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const [head, tail] = splitOnce(trimmed, "|");
  const main = tokenize(head);
  if (main.length === 0) return null;

  const parsed: ParsedCommand = {
    name: main[0].toLowerCase(),
    args: main.slice(1),
    raw: trimmed,
  };

  if (tail !== null) {
    const piped = tokenize(tail);
    if (piped.length > 0) {
      parsed.pipe = { name: piped[0].toLowerCase(), args: piped.slice(1) };
    }
  }

  return parsed;
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === " " || char === "\t") {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current) tokens.push(current);
  return tokens;
}

function splitOnce(input: string, sep: string): [string, string | null] {
  const idx = input.indexOf(sep);
  if (idx === -1) return [input, null];
  return [input.slice(0, idx), input.slice(idx + sep.length)];
}
