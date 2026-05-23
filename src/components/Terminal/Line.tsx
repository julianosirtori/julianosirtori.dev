"use client";

import { CSSProperties, memo } from "react";

import { OutputLine, ThemePalette } from "./types";

interface LineProps {
  line: OutputLine;
  palette: ThemePalette;
}

function styleFor(
  kind: OutputLine["kind"],
  palette: ThemePalette,
): CSSProperties {
  switch (kind) {
    case "input":
      return { color: palette.fg };
    case "error":
      return { color: palette.error };
    case "success":
      return { color: palette.success };
    case "muted":
      return { color: palette.muted };
    default:
      return { color: palette.fg };
  }
}

export const Line = memo(function Line({ line, palette }: LineProps) {
  return (
    <div
      style={styleFor(line.kind, palette)}
      className="font-mono text-sm leading-relaxed break-words whitespace-pre-wrap"
    >
      {typeof line.content === "string" ? line.content || " " : line.content}
    </div>
  );
});
