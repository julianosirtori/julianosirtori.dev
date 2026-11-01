import { portfolioLink } from "@/lib/site";

export type ProjectCategory = "personal" | "client" | "company";

export interface Project {
  id: string;
  title: string;
  description: string;
  href: string;
  category: ProjectCategory;
  context: string;
  destination: "website" | "package" | "video" | "product" | "code" | "case";
}

export type ProjectsByYear = Record<string, Project[]>;

// Team cases with no public URL point to the commercial portfolio.
const casesHref = portfolioLink("projects-list", "/cases/");

export const projects = {
  en: {
    "2026": [
      {
        id: "biomoov",
        title: "BioMoov",
        description:
          "The website for a physiotherapy and Pilates clinic in Maringá: symptom-based triage, an interactive body map, WhatsApp booking, and a course school for physiotherapists.",
        href: "https://biomoovclinica.com.br/",
        category: "client",
        context: "Next.js · Tailwind v4",
        destination: "website",
      },
      {
        id: "morning-paper",
        title: "Morning Paper",
        description:
          "A macOS app that turns RSS feeds into a personal A4 newspaper and prints it every day at 06:01.",
        href: "https://morning-paper-app.julianosirtori.dev/",
        category: "personal",
        context: "Tauri · React · Rust · AI",
        destination: "product",
      },
      {
        id: "vault-mcp",
        title: "Vault MCP",
        description:
          "A self-hosted remote MCP server for an Obsidian vault on Cloudflare Workers, with OAuth 2.1, input sanitization, atomic writes, and sync.",
        href: "https://github.com/julianosirtori/vault-mcp",
        category: "personal",
        context: "Cloudflare Workers · MCP · OAuth 2.1",
        destination: "code",
      },
      {
        id: "claude-semaforo",
        title: "Claude Semáforo",
        description:
          "An always-on-top widget that rolls the status of every Claude Code session into one pill and answers permission prompts, including sessions running in containers.",
        href: "https://github.com/julianosirtori/claude-semaforo",
        category: "personal",
        context: "Rust · TypeScript",
        destination: "code",
      },
      {
        id: "minha-capy",
        title: "Minha Capy",
        description:
          "A self-care app for iPhone. Small daily goals feed a capybara that grows, goes on adventures, and comes back with gifts.",
        href: "https://minhacapy.com/",
        category: "personal",
        context: "iOS · Gamification",
        destination: "product",
      },
    ],
    "2025": [
      {
        id: "fisio-rotina",
        title: "Fisio Rotina",
        description:
          "A SaaS for independent physiotherapists: schedule, patient records, postural assessment, and finances in one app, with appointment confirmation over WhatsApp.",
        href: "https://fisiorotina.com.br/",
        category: "personal",
        context: "Next.js · React · TypeScript",
        destination: "product",
      },
    ],
    "2024": [
      {
        id: "fisio-milena-aranha",
        title: "Fisio Milena Aranha",
        description:
          "One domain with two paths: patients find the clinic, physiotherapists find evidence-based courses.",
        href: "https://fisiomilenaaranha.com/",
        category: "client",
        context: "Next.js · Tailwind v4",
        destination: "website",
      },
      {
        id: "stellantis-b2b",
        title: "Stellantis (Fiat, Ram) and a global B2B platform",
        description:
          "Microfrontends in Vue and React, built with the teams at Avenue Code for Stellantis and at CI&T for a B2B SaaS used in 18+ countries.",
        href: casesHref,
        category: "company",
        context: "Vue · React · Microfrontends",
        destination: "case",
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
          "This website. A home for my work, writing in MDX, and experiments.",
        href: "https://www.julianosirtori.dev/",
        category: "personal",
        context: "Next.js · React · MDX",
        destination: "website",
      },
    ],
    "2021": [
      {
        id: "aiqfome-magalu",
        title: "aiqfome in Magalu's super app",
        description:
          "Tech lead on aiqfome's React and Next.js front end while the delivery app joined the Magazine Luiza super app.",
        href: "https://www.youtube.com/watch?v=M9-LPj11ZtU",
        category: "company",
        context: "React · Next.js · aiqfome",
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
        id: "superpao-hr",
        title: "HR system at Grupo Superpão",
        description:
          "An HR system for 10k+ employee profiles, with QlikView dashboards and an Android app. Resolution time dropped from 3 days to under an hour.",
        href: casesHref,
        category: "company",
        context: "PostgreSQL · Android · QlikView",
        destination: "case",
      },
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
    "2026": [
      {
        id: "biomoov",
        title: "BioMoov",
        description:
          "Site de uma clínica de fisioterapia e Pilates em Maringá, com triagem por sintoma, mapa corporal interativo, agendamento pelo WhatsApp e escola de cursos para fisioterapeutas.",
        href: "https://biomoovclinica.com.br/",
        category: "client",
        context: "Next.js · Tailwind v4",
        destination: "website",
      },
      {
        id: "morning-paper",
        title: "Morning Paper",
        description:
          "App para macOS que transforma feeds RSS em um jornal A4 só seu e imprime todo dia às 06:01.",
        href: "https://morning-paper-app.julianosirtori.dev/",
        category: "personal",
        context: "Tauri · React · Rust · IA",
        destination: "product",
      },
      {
        id: "vault-mcp",
        title: "Vault MCP",
        description:
          "Servidor MCP remoto para um vault do Obsidian, hospedado por mim em Cloudflare Workers, com OAuth 2.1, sanitização de entrada, escrita atômica e sync.",
        href: "https://github.com/julianosirtori/vault-mcp",
        category: "personal",
        context: "Cloudflare Workers · MCP · OAuth 2.1",
        destination: "code",
      },
      {
        id: "claude-semaforo",
        title: "Claude Semáforo",
        description:
          "Widget sempre visível que junta o status de todas as sessões do Claude Code em uma pílula e responde pedidos de permissão, inclusive de sessões rodando em containers.",
        href: "https://github.com/julianosirtori/claude-semaforo",
        category: "personal",
        context: "Rust · TypeScript",
        destination: "code",
      },
      {
        id: "minha-capy",
        title: "Minha Capy",
        description:
          "App de autocuidado para iPhone. Pequenas metas diárias alimentam uma capivara que cresce, sai em aventuras e volta com presentes.",
        href: "https://minhacapy.com/",
        category: "personal",
        context: "iOS · Gamificação",
        destination: "product",
      },
    ],
    "2025": [
      {
        id: "fisio-rotina",
        title: "Fisio Rotina",
        description:
          "SaaS para fisioterapeuta autônomo: agenda, ficha do paciente, avaliação postural e financeiro no mesmo app, com confirmação de consulta pelo WhatsApp.",
        href: "https://fisiorotina.com.br/",
        category: "personal",
        context: "Next.js · React · TypeScript",
        destination: "product",
      },
    ],
    "2024": [
      {
        id: "fisio-milena-aranha",
        title: "Fisio Milena Aranha",
        description:
          "Um domínio, duas jornadas: pacientes chegam à clínica e fisioterapeutas encontram formações com base científica.",
        href: "https://fisiomilenaaranha.com/",
        category: "client",
        context: "Next.js · Tailwind v4",
        destination: "website",
      },
      {
        id: "stellantis-b2b",
        title: "Stellantis (Fiat, Ram) e plataforma B2B global",
        description:
          "Microfrontends em Vue e React, feitos em equipe na Avenue Code para a Stellantis e na CI&T para um SaaS B2B usado em mais de 18 países.",
        href: casesHref,
        category: "company",
        context: "Vue · React · Microfrontends",
        destination: "case",
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
          "Este site. Onde reúno meu trabalho, textos em MDX e experimentos.",
        href: "https://www.julianosirtori.dev/",
        category: "personal",
        context: "Next.js · React · MDX",
        destination: "website",
      },
    ],
    "2021": [
      {
        id: "aiqfome-magalu",
        title: "aiqfome no super app do Magalu",
        description:
          "Liderei tecnicamente o front-end em React e Next.js do aiqfome na entrada do delivery no super app do Magazine Luiza.",
        href: "https://www.youtube.com/watch?v=M9-LPj11ZtU",
        category: "company",
        context: "React · Next.js · aiqfome",
        destination: "video",
      },
    ],
    "2020": [
      {
        id: "aiqfome-orders",
        title: "Gerenciador de pedidos do aiqfome",
        description:
          "Ferramenta de gestão de pedidos para restaurantes, em que atuei junto ao time do aiqfome.",
        href: "https://geraldo-restaurantes.aiqfome.com/",
        category: "company",
        context: "aiqfome",
        destination: "product",
      },
    ],
    "2018": [
      {
        id: "superpao-hr",
        title: "Sistema de RH do Grupo Superpão",
        description:
          "Sistema de RH para mais de 10 mil perfis de colaboradores, com painéis em QlikView e app Android. O tempo de resolução caiu de 3 dias para menos de 1 hora.",
        href: casesHref,
        category: "company",
        context: "PostgreSQL · Android · QlikView",
        destination: "case",
      },
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
