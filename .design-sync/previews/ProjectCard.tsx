import { ProjectCard } from "julianosirtori.dev";

export function Default() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 480,
      }}
    >
      <ProjectCard
        title="Life in Weeks"
        href="https://life-in-weeks.julianosirtori.dev/"
        year="2023"
        index={0}
      />
    </div>
  );
}

export function List() {
  const projects = [
    { title: "Space Invaders in Vanilla JS", year: "2024" },
    { title: "CLI: cowsay-pragmatic-programmer", year: "2024" },
    { title: "Life in Weeks", year: "2023" },
    { title: "Pick-up Lines", year: "2022" },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 480,
      }}
    >
      {projects.map((p, i) => (
        <ProjectCard
          key={p.title}
          title={p.title}
          href="https://julianosirtori.dev/"
          year={p.year}
          index={i}
        />
      ))}
    </div>
  );
}
