import { CommandBar, Header } from "julianosirtori.dev";

// Header's cmdk trigger reads CommandBar context, so it renders inside <CommandBar>.
// The card viewport is widened via cfg.overrides.Header so the full nav row shows.
export function Default() {
  return (
    <CommandBar>
      <Header />
    </CommandBar>
  );
}
