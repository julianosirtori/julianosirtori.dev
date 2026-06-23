import { useEffect } from "react";
import { CommandBar, useCommandBar } from "julianosirtori.dev";

// Opens the palette from inside the CommandBar context so the dialog (input +
// action list) renders in the card. cfg.overrides.CommandBar sizes the viewport.
function OpenOnMount() {
  const { setOpen } = useCommandBar();
  useEffect(() => {
    setOpen(true);
  }, [setOpen]);
  return null;
}

export function Open() {
  return (
    <CommandBar>
      <OpenOnMount />
    </CommandBar>
  );
}
