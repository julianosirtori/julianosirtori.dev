export interface WorkItem {
  title: string;
  year: string;
  tag: string;
  summary: string;
  techs: string[];
  href: string;
}

// The first entry (ClinicaALL) is placeholder/demo copy for the case-study layout.
// Replace the summary and wire `href` to a real case-study page when it exists.
export const selectedWork: Record<"en" | "pt", WorkItem[]> = {
  en: [
    {
      title: "ClinicaALL",
      year: "2025",
      tag: "Real client",
      summary:
        "Management SaaS for physiotherapy clinics. Drag-and-drop agenda, LGPD-aware records and a reactivation CRM, from the database to the interface, solo.",
      techs: ["Next.js", "NestJS", "PostgreSQL"],
      href: "/projects/clinicaall",
    },
    {
      title: "Space Invaders in Vanilla JS",
      year: "2024",
      tag: "Experiment",
      summary:
        "Rebuilt the classic with no framework, just canvas and a game loop. An exercise in understanding what frameworks hide from us.",
      techs: ["Canvas", "Vanilla JS"],
      href: "https://julianosirtori.github.io/space-invaders-js/",
    },
    {
      title: "cowsay-pragmatic-programmer",
      year: "2024",
      tag: "Open source",
      summary:
        "A Node CLI that prints a Pragmatic Programmer lesson in a cow's mouth. Small, published on npm, used by people I've never met.",
      techs: ["Node.js", "CLI", "npm"],
      href: "https://www.npmjs.com/package/cowsay-pragmatic-programmer",
    },
  ],
  pt: [
    {
      title: "ClinicaALL",
      year: "2025",
      tag: "Cliente real",
      summary:
        "SaaS de gestão para clínicas de fisioterapia. Agenda drag-and-drop, prontuário com LGPD e CRM de reativação, do banco à interface, sozinho.",
      techs: ["Next.js", "NestJS", "PostgreSQL"],
      href: "/projects/clinicaall",
    },
    {
      title: "Space Invaders em JavaScript puro",
      year: "2024",
      tag: "Experimento",
      summary:
        "Recriei o clássico sem framework, só canvas e game loop. Um exercício de entender o que os frameworks escondem da gente.",
      techs: ["Canvas", "Vanilla JS"],
      href: "https://julianosirtori.github.io/space-invaders-js/",
    },
    {
      title: "cowsay-pragmatic-programmer",
      year: "2024",
      tag: "Open source",
      summary:
        "CLI em Node que imprime uma lição do Pragmatic Programmer na boca de uma vaca. Pequeno, publicado no npm, usado por gente que não conheço.",
      techs: ["Node.js", "CLI", "npm"],
      href: "https://www.npmjs.com/package/cowsay-pragmatic-programmer",
    },
  ],
};
