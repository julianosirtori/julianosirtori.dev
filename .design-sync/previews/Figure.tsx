import { Figure } from "julianosirtori.dev";

export function WithCaption() {
  return (
    <div style={{ maxWidth: 560 }}>
      <Figure
        src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800"
        alt="A laptop screen filled with code, lit by ambient blue light"
        caption="Late-night refactor of the command palette, two days before the rebrand shipped."
      />
    </div>
  );
}

export function WithoutCaption() {
  return (
    <div style={{ maxWidth: 560 }}>
      <Figure
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
        alt="A developer workstation with a mechanical keyboard and a second display"
      />
    </div>
  );
}
