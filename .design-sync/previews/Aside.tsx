import { Aside } from "julianosirtori.dev";

export function DefaultLabel() {
  return (
    <div style={{ maxWidth: 560 }}>
      <Aside>
        <p>
          The contentlayer build runs in a prebuild hook, so a fresh checkout
          has the generated post data ready before next build or vitest ever
          touches it.
        </p>
      </Aside>
    </div>
  );
}

export function CustomLabel() {
  return (
    <div style={{ maxWidth: 560 }}>
      <Aside label="A note on the terminal">
        <p>
          The playground frame keeps its own dark palette through inline styles,
          so it stays dark even when the rest of the site renders in light mode.
        </p>
        <p>
          Tab completion runs against both the command registry and the virtual
          file system, which is why pressing tab inside a directory expands the
          right entries.
        </p>
      </Aside>
    </div>
  );
}
