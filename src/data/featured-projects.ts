export interface FeaturedProject {
  id: string;
  title: string;
  description: {
    en: string;
    pt: string;
  };
  href: string;
  tags: string[];
  image?: string;
  featured: boolean;
  year: number;
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: "space-invaders",
    title: "Space Invaders",
    description: {
      en: "Classic arcade game rebuilt with vanilla JavaScript. No frameworks, just pure JS magic.",
      pt: "Clássico jogo de arcade reconstruído com JavaScript puro. Sem frameworks, apenas magia JS.",
    },
    href: "https://julianosirtori.github.io/space-invaders-js/",
    tags: ["JavaScript", "Canvas", "Game Dev"],
    featured: true,
    year: 2024,
  },
  {
    id: "life-in-weeks",
    title: "Life in Weeks",
    description: {
      en: "Visualize your life in weeks. A reflection tool inspired by Tim Urban's TED talk.",
      pt: "Visualize sua vida em semanas. Uma ferramenta de reflexão inspirada na palestra TED de Tim Urban.",
    },
    href: "https://life-in-weeks.julianosirtori.dev/",
    tags: ["React", "TypeScript", "Data Viz"],
    featured: true,
    year: 2023,
  },
  {
    id: "cowsay-cli",
    title: "cowsay-pragmatic-programmer",
    description: {
      en: "CLI tool that displays programming wisdom through ASCII art cows. Published on npm.",
      pt: "Ferramenta CLI que exibe sabedoria de programação através de vacas em ASCII. Publicado no npm.",
    },
    href: "https://www.npmjs.com/package/cowsay-pragmatic-programmer",
    tags: ["Node.js", "CLI", "npm"],
    featured: true,
    year: 2024,
  },
  {
    id: "aiqfome-magalu",
    title: "Aiqfome @ Magalu",
    description: {
      en: "Led the frontend integration of aiqfome into Magazine Luiza's super app ecosystem.",
      pt: "Liderei a integração frontend do aiqfome no ecossistema de super app da Magazine Luiza.",
    },
    href: "https://www.youtube.com/watch?v=M9-LPj11ZtU",
    tags: ["React Native", "Super App", "Enterprise"],
    featured: true,
    year: 2021,
  },
];
