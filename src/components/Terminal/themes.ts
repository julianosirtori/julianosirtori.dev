import { ThemeName, ThemePalette } from "./types";

export const THEMES: Record<ThemeName, ThemePalette> = {
  dracula: {
    name: "dracula",
    bg: "#0b0a0e",
    fg: "#f2f2f2",
    muted: "#8f9ba8",
    accent: "#9580ff",
    error: "#ff9580",
    success: "#8aff80",
    prompt: "#80ffea",
    border: "#212024",
  },
  matrix: {
    name: "matrix",
    bg: "#000000",
    fg: "#00ff66",
    muted: "#006633",
    accent: "#00ff66",
    error: "#ff3333",
    success: "#00ff66",
    prompt: "#00ff66",
    border: "#003322",
  },
  mono: {
    name: "mono",
    bg: "#0a0a0a",
    fg: "#e5e5e5",
    muted: "#737373",
    accent: "#fafafa",
    error: "#fafafa",
    success: "#fafafa",
    prompt: "#fafafa",
    border: "#262626",
  },
  solar: {
    name: "solar",
    bg: "#002b36",
    fg: "#eee8d5",
    muted: "#839496",
    accent: "#268bd2",
    error: "#dc322f",
    success: "#859900",
    prompt: "#b58900",
    border: "#073642",
  },
};

export const THEME_NAMES: ThemeName[] = ["dracula", "matrix", "mono", "solar"];
