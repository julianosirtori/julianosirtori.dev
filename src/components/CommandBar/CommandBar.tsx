"use client";
import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import { CommandBarContext } from "./useCommandBar";
import { TCommandBarProps } from "./CommandBar.types";
import { track } from "@/lib/analytics";
const CommandBarDialog = dynamic(() => import("./CommandBarDialog"), {
  ssr: false,
});
export function CommandBar({ children }: TCommandBarProps) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  useEffect(() => {
    if (open) track("command_palette_open", { location: "command" });
  }, [open]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [toggle]);
  return (
    <CommandBarContext.Provider value={{ open, setOpen, toggle }}>
      {children}
      {open && <CommandBarDialog open={open} setOpen={setOpen} />}
    </CommandBarContext.Provider>
  );
}
