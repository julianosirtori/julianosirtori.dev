"use client";

import { createContext, useContext } from "react";

interface CommandBarApi {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const CommandBarContext = createContext<CommandBarApi | null>(null);

export function useCommandBar(): CommandBarApi {
  const ctx = useContext(CommandBarContext);
  if (!ctx) {
    throw new Error("useCommandBar must be used within <CommandBar>");
  }
  return ctx;
}
