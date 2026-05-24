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
    id: "fisio-milena-aranha",
    title: "Fisio Milena Aranha",
    description: {
      en: "Landing page for an independent physiotherapist. Conversion-focused, mobile-first, fast.",
      pt: "Landing page para fisioterapeuta independente. Focada em conversão, mobile-first, rápida.",
    },
    href: "https://fisiomilenaaranha.com/",
    tags: ["Next.js", "Tailwind CSS", "Landing Page"],
    featured: true,
    year: 2024,
  },
];
