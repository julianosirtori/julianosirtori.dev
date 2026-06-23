import { ButtonTapToStart, CommandBar } from "julianosirtori.dev";

// ButtonTapToStart calls useCommandBar(), which throws unless a CommandBar
// provider is above it. CommandBar renders its children inside the context
// (dialog stays closed by default), so wrapping here makes the button render.
export function Default() {
  return (
    <div style={{ padding: 24, display: "inline-flex" }}>
      <CommandBar>
        <ButtonTapToStart />
      </CommandBar>
    </div>
  );
}
