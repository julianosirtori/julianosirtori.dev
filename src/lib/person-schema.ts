import { PORTFOLIO_URL, SITE_URL } from "@/lib/site";

export const GITHUB_PROFILE_URL = "https://github.com/julianosirtori";

/** Topics the site shows evidence for: the stack, the experience and the posts. */
export const knowsAbout = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Vue.js",
  "React Native",
  "Android",
  "NestJS",
  "PostgreSQL",
  "Microfrontends",
  "Front-end architecture",
  "Full-stack web development",
  "LLM integration",
  "AI agents",
  "Retrieval-augmented generation (RAG)",
  "Model Context Protocol (MCP)",
] as const;

/** Mirrors the "Where I can contribute" list on /work-with-me. */
export const serviceKeys = [
  "fullStack",
  "mobile",
  "ai",
  "consulting",
  "mentoring",
] as const;

export type ServiceKey = (typeof serviceKeys)[number];

export interface PersonSchemaMessages {
  global: {
    myFullName: string;
    role: string;
    slogan: string;
    email: string;
    social: { linkedin: string; bluesky: string };
  };
  workWithMe: {
    services: Record<ServiceKey, { name: string; description: string }>;
  };
}

export function personAndWebsiteGraph(
  locale: string,
  messages: PersonSchemaMessages,
) {
  const personId = `${SITE_URL}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: messages.global.myFullName,
        url: `${SITE_URL}/${locale}/about`,
        jobTitle: messages.global.role,
        description: messages.global.slogan,
        email: `mailto:${messages.global.email}`,
        knowsAbout,
        sameAs: [
          messages.global.social.linkedin,
          GITHUB_PROFILE_URL,
          messages.global.social.bluesky,
          PORTFOLIO_URL,
        ],
        makesOffer: serviceKeys.map((key) => ({
          "@type": "Offer",
          url: `${SITE_URL}/${locale}/work-with-me`,
          itemOffered: {
            "@type": "Service",
            name: messages.workWithMe.services[key].name,
            description: messages.workWithMe.services[key].description,
            provider: { "@id": personId },
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: messages.global.myFullName,
        inLanguage: locale,
        publisher: { "@id": personId },
      },
    ],
  };
}
