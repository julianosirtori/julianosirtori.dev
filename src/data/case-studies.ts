// Case-study detail content. Placeholder/demo data, replace with real project
// write-ups. Keyed by locale, then by slug. Section labels live in
// `caseStudyLabels`; only case-specific content lives here.

export interface DecisionMedia {
  type: "code" | "quote" | "callout";
  language?: string;
  code?: string;
  text?: string;
  author?: string;
  cite?: string;
  tone?: "info" | "warn" | "tip" | "success";
  title?: string;
}

export interface DecisionCard {
  n: string;
  title: string;
  context: string;
  alternatives: string;
  chose: string;
  tradeoff: string;
  why: string;
  media?: DecisionMedia;
}

export interface CaseStudyLink {
  label: string;
  href: string;
}

export interface CaseStudyRelated {
  title: string;
  year: string;
  href: string;
}

export interface CaseStudy {
  titlePrefix: string;
  titleAccent: string;
  lede: string;
  role: string;
  period: string;
  client: string;
  stack: string[];
  links: CaseStudyLink[];
  problem: { paragraphs: string[]; figureCaption: string };
  decisions: DecisionCard[];
  results: { items: string[]; note: string };
  learnings: string[];
  related: CaseStudyRelated[];
}

export const caseStudyLabels = {
  en: {
    kicker: "Case study",
    back: "Back to projects",
    role: "Role",
    period: "Period",
    client: "Client",
    stack: "Stack",
    fields: {
      context: "Context",
      alternatives: "Alternatives",
      chose: "I chose",
      tradeoff: "Trade-off",
      why: "Why",
    },
    toc: {
      problem: "The problem",
      decisions: "Decisions",
      results: "Results",
      learnings: "Learnings",
    },
    sections: {
      problem: "The problem",
      decisions: "Decisions",
      results: "Results",
      learnings: "What I'd do differently",
      related: "Other projects",
    },
    footer: "Built with Next.js and TypeScript",
  },
  pt: {
    kicker: "Estudo de caso",
    back: "Voltar aos projetos",
    role: "Papel",
    period: "Período",
    client: "Cliente",
    stack: "Stack",
    fields: {
      context: "Contexto",
      alternatives: "Alternativas",
      chose: "Escolhi",
      tradeoff: "Trade-off",
      why: "Por quê",
    },
    toc: {
      problem: "O problema",
      decisions: "Decisões",
      results: "Resultados",
      learnings: "Aprendizados",
    },
    sections: {
      problem: "O problema",
      decisions: "Decisões",
      results: "Resultados",
      learnings: "O que eu faria diferente",
      related: "Outros projetos",
    },
    footer: "Construído com Next.js e TypeScript",
  },
} as const;

const RELATED_EN: CaseStudyRelated[] = [
  {
    title: "Space Invaders in Vanilla JS",
    year: "2024",
    href: "https://julianosirtori.github.io/space-invaders-js/",
  },
  {
    title: "cowsay-pragmatic-programmer",
    year: "2024",
    href: "https://www.npmjs.com/package/cowsay-pragmatic-programmer",
  },
  {
    title: "Life in Weeks",
    year: "2023",
    href: "https://life-in-weeks.julianosirtori.dev/",
  },
];

const RELATED_PT: CaseStudyRelated[] = [
  {
    title: "Space Invaders em JavaScript puro",
    year: "2024",
    href: "https://julianosirtori.github.io/space-invaders-js/",
  },
  {
    title: "cowsay-pragmatic-programmer",
    year: "2024",
    href: "https://www.npmjs.com/package/cowsay-pragmatic-programmer",
  },
  {
    title: "Life in Weeks",
    year: "2023",
    href: "https://life-in-weeks.julianosirtori.dev/",
  },
];

const MONO_TREE_EN = `apps/
  api/      # NestJS · clinic rules
  web/      # React + Vite · agenda, records
packages/
  schema/   # Zod + DTOs, one source of truth`;

const MONO_TREE_PT = `apps/
  api/      # NestJS · regras da clínica
  web/      # React + Vite · agenda, prontuário
packages/
  schema/   # Zod + DTOs, uma fonte de verdade`;

const COLOR_CODE_EN = `const PALETTE = ['#7C3AED','#0EA5E9','#10B981','#F59E0B','#EF4444','#EC4899'];

// stable colour per professional, no hex stored in the DB
export const colorFor = (id) =>
  PALETTE[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];

/* on the agenda, tinted ~9% over the surface */
.event {
  background: color-mix(in oklab, var(--pro) 9%, var(--bg));
  border-inline-start: 3px solid var(--pro);
}`;

const COLOR_CODE_PT = `const PALETTE = ['#7C3AED','#0EA5E9','#10B981','#F59E0B','#EF4444','#EC4899'];

// cor estável por profissional, sem guardar hex no banco
export const colorFor = (id) =>
  PALETTE[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];

/* na agenda, tonalizada ~9% sobre o fundo */
.event {
  background: color-mix(in oklab, var(--pro) 9%, var(--bg));
  border-inline-start: 3px solid var(--pro);
}`;

export const caseStudies: Record<"en" | "pt", Record<string, CaseStudy>> = {
  en: {
    clinicaall: {
      titlePrefix: "Clinica",
      titleAccent: "ALL",
      lede: "How I designed and built, solo, a management SaaS for physiotherapy clinics, from the database to the drag-and-drop agenda, and the decisions that kept the product simple.",
      role: "Product, design & engineering, solo",
      period: "2025 · 4 months",
      client: "Physiotherapy clinic (pilot), Brazil",
      stack: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Zod"],
      links: [
        { label: "Visit the site", href: "#" },
        { label: "Repository", href: "#" },
        { label: "Technical notes", href: "#" },
      ],
      problem: {
        paragraphs: [
          "Small clinics live between WhatsApp, a paper book and three spreadsheets. Moving an appointment meant opening tabs, checking rooms and calling the insurer.",
          "The market incumbent solved this with dense screens and hospital blue. The challenge was the same coverage at a third of the cognitive load, calm, not more features.",
        ],
        figureCaption:
          "The day's agenda, drag to reschedule, colour per professional.",
      },
      decisions: [
        {
          n: "01",
          title: "A monorepo with shared types",
          context:
            "The NestJS API and the React web app had to speak the same language. Duplicated DTOs drift within weeks.",
          alternatives:
            "Two repos with a published npm package, or a monorepo with an internal package.",
          chose: "A monorepo (pnpm) with a shared schema package in Zod.",
          tradeoff:
            "Heavier build and CI, plus the discipline not to couple layers just because the monorepo makes it easy.",
          why: "One source of truth for the contracts: the appointment type is the same from the database to the agenda component. A new field breaks the build, not production.",
          media: { type: "code", language: "bash", code: MONO_TREE_EN },
        },
        {
          n: "02",
          title: "A bespoke agenda, not a library",
          context:
            "The agenda is the heart of the product: drag, resize, detect room and professional conflicts, respect the insurer.",
          alternatives:
            "FullCalendar / react-big-calendar, or a custom component over a grid.",
          chose:
            "A custom component, with optimistic UI and the domain rules built in.",
          tradeoff:
            "More code to maintain, and the accessibility work a library would have given for free.",
          why: "Libraries model generic events, not rooms, insurers and no-shows. Bending them cost more than a grid that speaks the clinic's language.",
          media: {
            type: "quote",
            text: "Every dependency you adopt is a business rule someone wrote without knowing your clinic.",
            author: "Project notebook",
            cite: "ClinicaALL",
          },
        },
        {
          n: "03",
          title: "Colour per professional, derived from the id",
          context:
            "Each professional needs a stable colour on the agenda, without the operator picking it and without storing hex in the DB.",
          alternatives:
            "A colour field on the record, or a colour derived from the id by hash.",
          chose:
            "A colour derived from the id, tinted ~9% over the surface with color-mix(in oklab).",
          tradeoff:
            "A fixed 6-colour palette: large clinics get collisions and need a fallback.",
          why: "Zero configuration, a consistent colour across sessions and devices, and predictable contrast in both light and dark.",
          media: { type: "code", language: "ts", code: COLOR_CODE_EN },
        },
        {
          n: "04",
          title: "LGPD from the data model up",
          context:
            "Image, data and AI-use consent aren't a checkbox, they're proof, with a date, a version and an author.",
          alternatives:
            "Booleans on the patient record, or consents as a first-class entity.",
          chose:
            "Each consent is a versioned, dated record, never overwritten.",
          tradeoff:
            "More tables and joins, and the patient record got one step longer.",
          why: "Real auditability: months later you can answer what was consented, when, and under which text without digging through logs.",
          media: {
            type: "callout",
            tone: "warn",
            title: "LGPD",
            text: "A revoked consent doesn't erase history, it marks the end of validity. Deleting it would lose the proof that consent ever existed.",
          },
        },
      ],
      results: {
        items: [
          "Rescheduling dropped from ~6 clicks and 2 screens to a single drag.",
          "A patient record, with consents, in under 2 minutes.",
          "A new operator runs the agenda with no formal training.",
        ],
        note: "Pilot numbers from one clinic; not yet a controlled study.",
      },
      learnings: [
        "I'd have written the agenda's tests before the drag-and-drop, not after, refactoring conflict detection without a net was expensive.",
        "I underestimated the accessibility work of a bespoke component; it would be in scope from day one.",
      ],
      related: RELATED_EN,
    },
  },
  pt: {
    clinicaall: {
      titlePrefix: "Clinica",
      titleAccent: "ALL",
      lede: "Como desenhei e construí, sozinho, um SaaS de gestão para clínicas de fisioterapia, do banco de dados à agenda drag-and-drop, e as decisões que mantiveram o produto simples.",
      role: "Produto, design e engenharia, sozinho",
      period: "2025 · 4 meses",
      client: "Clínica de fisioterapia (piloto), Brasil",
      stack: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Zod"],
      links: [
        { label: "Ver o site", href: "#" },
        { label: "Repositório", href: "#" },
        { label: "Notas técnicas", href: "#" },
      ],
      problem: {
        paragraphs: [
          "Clínicas pequenas vivem entre o WhatsApp, o caderno e três planilhas. Remarcar um horário significava abrir abas, conferir salas e ligar para o convênio.",
          "O incumbente do mercado resolvia isso com telas densas e azul hospitalar. O desafio era a mesma cobertura com um terço da carga cognitiva, calma, não mais features.",
        ],
        figureCaption:
          "Agenda do dia, arraste para remarcar, cores por profissional.",
      },
      decisions: [
        {
          n: "01",
          title: "Monorepo com tipos compartilhados",
          context:
            "A API em NestJS e a web em React precisavam falar a mesma língua. DTOs duplicados divergem em semanas.",
          alternatives:
            "Dois repositórios com um pacote npm publicado, ou um monorepo com pacote interno.",
          chose:
            "Um monorepo (pnpm) com um pacote schema compartilhado em Zod.",
          tradeoff:
            "Build e CI mais complexos, e disciplina para não acoplar camadas só pela conveniência do monorepo.",
          why: "Uma única fonte de verdade para os contratos: o tipo do agendamento é o mesmo do banco até o componente da agenda. Um campo novo quebra o build, não a produção.",
          media: { type: "code", language: "bash", code: MONO_TREE_PT },
        },
        {
          n: "02",
          title: "Agenda sob medida, não uma biblioteca",
          context:
            "A agenda é o coração do produto: arrastar, redimensionar, detectar conflito de sala e de profissional, respeitar convênio.",
          alternatives:
            "FullCalendar / react-big-calendar, ou um componente próprio sobre um grid.",
          chose:
            "Um componente próprio, com UI otimista e as regras de domínio embutidas.",
          tradeoff:
            "Mais código para manter, e o trabalho de acessibilidade que a lib daria de graça.",
          why: "Bibliotecas modelam eventos genéricos, não salas, convênios e faltas. Forçá-las custava mais do que um grid próprio que fala a língua da clínica.",
          media: {
            type: "quote",
            text: "Toda dependência que você adota é uma regra de negócio que alguém escreveu sem conhecer a sua clínica.",
            author: "Caderno do projeto",
            cite: "ClinicaALL",
          },
        },
        {
          n: "03",
          title: "Cor por profissional, derivada do id",
          context:
            "Cada profissional precisa de uma cor estável na agenda, sem o operador escolher e sem guardar hex no banco.",
          alternatives:
            "Um campo de cor no cadastro, ou cor derivada do id por hash.",
          chose:
            "Cor derivada do id, tonalizada ~9% sobre o fundo com color-mix(in oklab).",
          tradeoff:
            "Paleta fixa de 6 cores: clínicas grandes têm colisões e precisam de um plano B.",
          why: "Zero configuração, cor consistente entre sessões e dispositivos, e contraste previsível no claro e no escuro.",
          media: { type: "code", language: "ts", code: COLOR_CODE_PT },
        },
        {
          n: "04",
          title: "LGPD desde o modelo de dados",
          context:
            "Consentimento de imagem, de dados e de uso de IA não são um checkbox, são prova, com data, versão e autor.",
          alternatives:
            "Booleans no cadastro do paciente, ou consentimentos como entidade própria.",
          chose:
            "Cada consentimento é um registro versionado e datado, nunca sobrescrito.",
          tradeoff:
            "Mais tabelas e joins, e o cadastro do paciente ficou um passo mais longo.",
          why: "Auditabilidade real: dá para responder o que foi consentido, quando e sob qual texto meses depois, sem garimpar log.",
          media: {
            type: "callout",
            tone: "warn",
            title: "LGPD",
            text: "Consentimento revogado não apaga o histórico, marca o fim da validade. Apagar seria perder a prova de que houve consentimento.",
          },
        },
      ],
      results: {
        items: [
          "Remarcação caiu de ~6 cliques e 2 telas para um arraste.",
          "Cadastro de paciente, com consentimentos, em menos de 2 minutos.",
          "Operador novo opera a agenda sem treino formal.",
        ],
        note: "Números do piloto em uma clínica; ainda não é um estudo controlado.",
      },
      learnings: [
        "Teria escrito os testes da agenda antes do drag-and-drop, não depois, refatorar a detecção de conflito sem rede custou caro.",
        "Subestimei o trabalho de acessibilidade de um componente próprio; faria parte do escopo desde o dia um.",
      ],
      related: RELATED_PT,
    },
  },
};
