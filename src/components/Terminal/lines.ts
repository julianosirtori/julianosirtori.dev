import { LineKind, OutputLine } from "./types";

let counter = 0;
function nextId(): string {
  counter += 1;
  return `line-${Date.now()}-${counter}`;
}

export function line(content: string, kind: LineKind = "text"): OutputLine {
  return { id: nextId(), kind, content };
}

export function lines(rows: string[], kind: LineKind = "text"): OutputLine[] {
  return rows.map((row) => line(row, kind));
}

export function blank(): OutputLine {
  return line("", "text");
}

export function err(content: string): OutputLine {
  return line(content, "error");
}

export function ok(content: string): OutputLine {
  return line(content, "success");
}

export function dim(content: string): OutputLine {
  return line(content, "muted");
}
