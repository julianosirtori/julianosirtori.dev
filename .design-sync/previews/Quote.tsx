import { Quote } from "julianosirtori.dev";

export function WithAttribution() {
  return (
    <div style={{ maxWidth: 620 }}>
      <Quote author="Antoine de Saint-Exupery" cite="Airman's Odyssey">
        Perfection is achieved, not when there is nothing more to add, but when
        there is nothing left to take away.
      </Quote>
    </div>
  );
}

export function Plain() {
  return (
    <div style={{ maxWidth: 620 }}>
      <Quote>The best code is the code you don&apos;t write.</Quote>
    </div>
  );
}
