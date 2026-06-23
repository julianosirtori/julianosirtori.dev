import { TechStack } from "julianosirtori.dev";

export function Default() {
  return (
    <div style={{ maxWidth: 720, width: "100%" }}>
      <TechStack title="Tech Stack" />
    </div>
  );
}

export function CustomTitle() {
  return (
    <div style={{ maxWidth: 720, width: "100%" }}>
      <TechStack title="Tools I reach for" />
    </div>
  );
}
