interface TechStackProps {
  title: string;
  studyingLabel: string;
  studyingDescription: string;
}

const groups = [
  {
    name: "Front",
    technologies: [
      "Vue",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Vite",
    ],
  },
  {
    name: "Back",
    technologies: ["Node.js", "NestJS", "PostgreSQL", "AWS"],
  },
  {
    name: "Mobile",
    technologies: ["React Native", "Expo", "Android nativo"],
  },
  { name: "Desktop", technologies: ["Tauri", "Rust"] },
  {
    name: "Cloud & Tooling",
    technologies: [
      "Cloudflare Workers",
      "Workers KV",
      "Cloudflare Tunnel",
      "Model Context Protocol (MCP)",
      "OAuth 2.1 + PKCE",
      "GitHub Actions",
      "Vitest",
      "Playwright",
    ],
  },
];

const studying = ["LLM apps", "RAG", "Agents"];

export function TechStack({
  title,
  studyingLabel,
  studyingDescription,
}: TechStackProps) {
  return (
    <div>
      <h2 className="text-fg mb-8 text-2xl font-semibold tracking-tight">
        {title}
      </h2>

      <div className="divide-border border-border divide-y border-y">
        {groups.map((group) => (
          <div
            key={group.name}
            className="grid gap-3 py-5 sm:grid-cols-[140px_1fr] sm:gap-6"
          >
            <h3 className="text-fg text-sm font-semibold">{group.name}</h3>
            <ul className="text-fg-muted flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {group.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-accent mt-7 border-l-2 pl-5">
        <h3 className="text-fg text-sm font-semibold">{studyingLabel}</h3>
        <p className="text-fg-subtle mt-1 text-sm leading-relaxed">
          {studyingDescription}
        </p>
        <ul className="text-accent mt-3 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs">
          {studying.map((subject) => (
            <li key={subject}>{subject}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
