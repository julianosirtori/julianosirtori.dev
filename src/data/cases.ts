export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  company: string;
  title: string;
  summary: string;
  stack: string;
  /** Only numbers already published on the site (about page, home bio). */
  metrics: CaseMetric[];
}

/**
 * Cases shown on /work-with-me. A case without metrics is kept here as a
 * placeholder and never rendered: the client results for BioMoov and Fisio
 * Milena Aranha have not been published yet, so they stay empty until real
 * numbers exist. Never fill them with estimates.
 */
export const cases = {
  en: [
    {
      id: "ciandt",
      company: "CI&T",
      title: "Front-end for a global B2B platform",
      summary:
        "I worked on the front-end of a B2B SaaS used across many countries and built internal tools that made difficult debugging workflows easier.",
      stack: "React · Next.js · TypeScript · Microfrontends · i18n",
      metrics: [
        { value: "2.7M+", label: "monthly active users" },
        { value: "18+", label: "countries" },
      ],
    },
    {
      id: "avenue-code",
      company: "Avenue Code · Stellantis",
      title: "Brand websites for Fiat and Ram",
      summary:
        "I built and reviewed front-end code for Stellantis brand websites, with Vue.js microfrontends integrated into AEM.",
      stack: "Vue.js · Microfrontends · AEM · TypeScript",
      metrics: [{ value: "Millions", label: "of visits every month" }],
    },
    {
      id: "aiqfome",
      company: "aiqfome · Magalu",
      title: "Delivery platform and the Magalu integration",
      summary:
        "I started on the front-end, worked on the backend too and became tech lead. After the acquisition I helped bring aiqfome into the Magazine Luiza ecosystem.",
      stack: "React · Next.js · TypeScript · PostgreSQL · AWS",
      metrics: [{ value: "Millions", label: "of orders handled" }],
    },
    {
      id: "superpao",
      company: "Grupo Superpão",
      title: "Internal HR platform and BI",
      summary:
        "I built internal systems for a supermarket chain, including an HR platform, and took care of the BI reports in QlikView.",
      stack: "React · Laravel · PostgreSQL · QlikView",
      metrics: [
        { value: "10,000+", label: "candidate profiles managed" },
        { value: "3 days → <1 h", label: "to resolve some issues" },
      ],
    },
    {
      id: "biomoov",
      company: "BioMoov",
      title: "Website for a physiotherapy and Pilates clinic",
      summary:
        "Treatment pages, a blog and courses for physiotherapists, built with Next.js.",
      stack: "Next.js",
      metrics: [],
    },
    {
      id: "fisio-milena-aranha",
      company: "Fisio Milena Aranha",
      title: "Landing page for an independent physiotherapist",
      summary: "A landing page that presents her work and services.",
      stack: "Landing page",
      metrics: [],
    },
  ],
  pt: [
    {
      id: "ciandt",
      company: "CI&T",
      title: "Front-end de uma plataforma B2B global",
      summary:
        "Atuei no front-end de um SaaS B2B usado em vários países e criei ferramentas internas que facilitaram processos de debug mais difíceis.",
      stack: "React · Next.js · TypeScript · Microfrontends · i18n",
      metrics: [
        { value: "2,7 mi+", label: "usuários ativos por mês" },
        { value: "18+", label: "países" },
      ],
    },
    {
      id: "avenue-code",
      company: "Avenue Code · Stellantis",
      title: "Sites das marcas Fiat e Ram",
      summary:
        "Construí e revisei código front-end dos sites de marcas da Stellantis, com microfrontends em Vue.js integrados ao AEM.",
      stack: "Vue.js · Microfrontends · AEM · TypeScript",
      metrics: [{ value: "Milhões", label: "de visitas por mês" }],
    },
    {
      id: "aiqfome",
      company: "aiqfome · Magalu",
      title: "Plataforma de delivery e a integração com o Magalu",
      summary:
        "Entrei no front-end, passei pelo back-end e virei tech lead. Depois da aquisição, ajudei a levar o aiqfome para dentro do ecossistema do Magazine Luiza.",
      stack: "React · Next.js · TypeScript · PostgreSQL · AWS",
      metrics: [{ value: "Milhões", label: "de pedidos processados" }],
    },
    {
      id: "superpao",
      company: "Grupo Superpão",
      title: "Sistema de RH interno e BI",
      summary:
        "Construí sistemas internos para uma rede de supermercados, entre eles um sistema de RH, e cuidei dos relatórios de BI em QlikView.",
      stack: "React · Laravel · PostgreSQL · QlikView",
      metrics: [
        { value: "10 mil+", label: "perfis de candidatos gerenciados" },
        { value: "3 dias → <1 h", label: "para resolver alguns problemas" },
      ],
    },
    {
      id: "biomoov",
      company: "BioMoov",
      title: "Site de uma clínica de fisioterapia e Pilates",
      summary:
        "Páginas de tratamento, blog e cursos para fisioterapeutas, feitos com Next.js.",
      stack: "Next.js",
      metrics: [],
    },
    {
      id: "fisio-milena-aranha",
      company: "Fisio Milena Aranha",
      title: "Landing page de uma fisioterapeuta independente",
      summary: "Uma landing page que apresenta o trabalho e os atendimentos.",
      stack: "Landing page",
      metrics: [],
    },
  ],
} satisfies Record<"en" | "pt", CaseStudy[]>;

/** Cases that have at least one published number. */
export function publishedCases(lang: string): CaseStudy[] {
  return cases[lang === "pt" ? "pt" : "en"].filter(
    (item) => item.metrics.length > 0,
  );
}
