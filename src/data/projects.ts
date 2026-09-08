export type ProjectCategory = "personal" | "client" | "company";

export interface Project {
  id: string;
  title: string;
  description: string;
  href: string;
  category: ProjectCategory;
  context: string;
  destination: "website" | "package" | "video" | "product";
}

export type ProjectsByYear = Record<string, Project[]>;

export const projects = {
  en: {
    "2024": [
      {
        id: "cowsay",
        title: "cowsay-pragmatic-programmer",
        description:
          "Tips from The Pragmatic Programmer, right in the terminal.",
        href: "https://www.npmjs.com/package/cowsay-pragmatic-programmer",
        category: "personal",
        context: "CLI",
        destination: "package",
      },
      {
        id: "fisio-milena-aranha",
        title: "Fisio Milena Aranha",
        description: "A landing page for an independent physiotherapist.",
        href: "https://fisiomilenaaranha.com/",
        category: "client",
        context: "Landing page",
        destination: "website",
      },
    ],
    "2023": [
      {
        id: "life-in-weeks",
        title: "Life in Weeks",
        description: "A visualization of a lifetime measured in weeks.",
        href: "https://life-in-weeks.julianosirtori.dev/",
        category: "personal",
        context: "Web",
        destination: "website",
      },
      {
        id: "portfolio",
        title: "julianosirtori.dev",
        description:
          "This website. A home for my work, writing, and experiments.",
        href: "https://julianosirtori.dev/",
        category: "personal",
        context: "Next.js · TypeScript",
        destination: "website",
      },
    ],
    "2022": [
      {
        id: "pick-up-lines",
        title: "Pick-up Lines",
        description: "A small web project dedicated to pick-up lines.",
        href: "https://cantadas.julianosirtori.dev/",
        category: "personal",
        context: "Web",
        destination: "website",
      },
    ],
    "2021": [
      {
        id: "aiqfome-magalu",
        title: "aiqfome in Magalu's super app",
        description:
          "I contributed to bringing aiqfome into the Magazine Luiza ecosystem.",
        href: "https://www.youtube.com/watch?v=M9-LPj11ZtU",
        category: "company",
        context: "aiqfome · Magalu",
        destination: "video",
      },
    ],
    "2020": [
      {
        id: "aiqfome-orders",
        title: "aiqfome order manager",
        description:
          "An order management tool for restaurants that I worked on with the aiqfome team.",
        href: "https://geraldo-restaurantes.aiqfome.com/",
        category: "company",
        context: "aiqfome",
        destination: "product",
      },
    ],
    "2018": [
      {
        id: "supermarket-tasks",
        title: "Task manager for supermarkets",
        description:
          "A supermarket operations product I contributed to at RP Info.",
        href: "https://www.rpinfo.com.br/produto/task/79",
        category: "company",
        context: "RP Info",
        destination: "product",
      },
    ],
  },
  pt: {
    "2024": [
      {
        id: "cowsay",
        title: "cowsay-pragmatic-programmer",
        description:
          "Dicas do livro O Programador Pragmático, direto no terminal.",
        href: "https://www.npmjs.com/package/cowsay-pragmatic-programmer",
        category: "personal",
        context: "CLI",
        destination: "package",
      },
      {
        id: "fisio-milena-aranha",
        title: "Fisio Milena Aranha",
        description:
          "Landing page para apresentar o trabalho de uma fisioterapeuta independente.",
        href: "https://fisiomilenaaranha.com/",
        category: "client",
        context: "Landing page",
        destination: "website",
      },
    ],
    "2023": [
      {
        id: "life-in-weeks",
        title: "Life in Weeks",
        description: "Uma visualização do tempo de vida em semanas.",
        href: "https://life-in-weeks.julianosirtori.dev/",
        category: "personal",
        context: "Web",
        destination: "website",
      },
      {
        id: "portfolio",
        title: "julianosirtori.dev",
        description:
          "Este site. Onde reúno meu trabalho, textos e experimentos.",
        href: "https://julianosirtori.dev/",
        category: "personal",
        context: "Next.js · TypeScript",
        destination: "website",
      },
    ],
    "2022": [
      {
        id: "pick-up-lines",
        title: "Cantadas",
        description: "Um pequeno projeto web dedicado às cantadas.",
        href: "https://cantadas.julianosirtori.dev/",
        category: "personal",
        context: "Web",
        destination: "website",
      },
    ],
    "2021": [
      {
        id: "aiqfome-magalu",
        title: "aiqfome no super app do Magalu",
        description:
          "Participei da integração do aiqfome com o ecossistema do Magazine Luiza.",
        href: "https://www.youtube.com/watch?v=M9-LPj11ZtU",
        category: "company",
        context: "aiqfome · Magalu",
        destination: "video",
      },
    ],
    "2020": [
      {
        id: "aiqfome-orders",
        title: "Gerenciador de pedidos do aiqfome",
        description:
          "Ferramenta de gestão de pedidos para restaurantes, em que atuei junto ao time do aiqfome.",
        href: "https://geraldo-restaurantes.aiqfome.com",
        category: "company",
        context: "aiqfome",
        destination: "product",
      },
    ],
    "2018": [
      {
        id: "supermarket-tasks",
        title: "Gerenciador de tarefas para supermercados",
        description:
          "Produto para a operação de supermercados, desenvolvido com o time da RP Info.",
        href: "https://www.rpinfo.com.br/produto/task/79",
        category: "company",
        context: "RP Info",
        destination: "product",
      },
    ],
  },
} satisfies Record<"en" | "pt", ProjectsByYear>;
