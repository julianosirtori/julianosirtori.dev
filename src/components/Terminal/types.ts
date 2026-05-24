import { ReactNode } from "react";

export type Lang = "en" | "pt";

export type LineKind = "input" | "text" | "error" | "success" | "muted" | "jsx";

export interface OutputLine {
  id: string;
  kind: LineKind;
  content: string | ReactNode;
}

export type Cwd =
  | "/"
  | "/projects"
  | "/blog"
  | "/about"
  | "/skills"
  | "/experience"
  | "/contact";

export type ThemeName = "dracula" | "matrix" | "mono" | "solar";

export interface ThemePalette {
  name: ThemeName;
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  error: string;
  success: string;
  prompt: string;
  border: string;
}

export interface CommandContext {
  args: string[];
  raw: string;
  lang: Lang;
  cwd: Cwd;
  env: TerminalEnv;
}

export interface TerminalEnv {
  setCwd: (cwd: Cwd) => void;
  setTheme: (theme: ThemeName) => void;
  setLang: (lang: Lang) => void;
  setOverlay: (overlay: OverlayState) => void;
  clear: () => void;
  push: (lines: OutputLine[]) => void;
  theme: ThemeName;
  history: string[];
  router: { push: (path: string) => void };
  highScore: number;
  setHighScore: (n: number) => void;
}

export type OverlayState =
  | { kind: "none" }
  | { kind: "matrix" }
  | { kind: "snake" };

export interface CommandDef {
  name: string;
  aliases?: string[];
  description: { en: string; pt: string };
  usage?: string;
  hidden?: boolean;
  run: (ctx: CommandContext) => OutputLine[] | Promise<OutputLine[]>;
}

export type CommandRegistry = Record<string, CommandDef>;
