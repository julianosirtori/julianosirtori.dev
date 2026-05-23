import { allPosts } from "contentlayer/generated";

import { CommandDef, Lang, OutputLine } from "../types";
import { blank, dim, line } from "../lines";
import { projects as projectsData } from "@/data/projects";
import { experiences } from "@/data/about";

export const whoami: CommandDef = {
  name: "whoami",
  description: { en: "who is this person", pt: "quem é essa pessoa" },
  run: ({ lang }) => [
    line("juliano sirtori", "success"),
    line(
      lang === "pt"
        ? "front-end engineer, curitiba — brasil"
        : "front-end engineer, curitiba — brazil",
    ),
    line(
      lang === "pt"
        ? "construindo interfaces que pessoas usam todo dia"
        : "building interfaces people use every day",
      "muted",
    ),
  ],
};

export const about: CommandDef = {
  name: "about",
  aliases: ["bio"],
  description: { en: "short bio", pt: "bio resumida" },
  run: ({ lang }) => {
    if (lang === "pt") {
      return [
        line("sobre", "success"),
        blank(),
        line(
          "dev front-end há +8 anos. passei por aiqfome, ci&t e avenue code.",
        ),
        line("foco em react, next.js, typescript e qualidade de interface."),
        line("também escrevo no blog — 'posts' lista os artigos recentes."),
        blank(),
        dim("dica: 'cd about && ls' tem mais coisa."),
      ];
    }
    return [
      line("about", "success"),
      blank(),
      line("front-end dev for 8+ years. worked at aiqfome, ci&t, avenue code."),
      line("focus on react, next.js, typescript and interface quality."),
      line("i also write on the blog — try 'posts' to list recent articles."),
      blank(),
      dim("hint: 'cd about && ls' has more."),
    ];
  },
};

export const skills: CommandDef = {
  name: "skills",
  aliases: ["stack"],
  description: { en: "tech stack", pt: "stack de tecnologias" },
  run: () => {
    const items = [
      { tech: "TypeScript", level: "★★★★★" },
      { tech: "React", level: "★★★★★" },
      { tech: "Next.js", level: "★★★★★" },
      { tech: "Node.js", level: "★★★★☆" },
      { tech: "Tailwind", level: "★★★★★" },
      { tech: "GraphQL", level: "★★★★☆" },
      { tech: "Vue.js", level: "★★★★☆" },
      { tech: "Testing", level: "★★★★☆" },
    ];
    const widest = Math.max(...items.map((i) => i.tech.length));
    return [
      line("tech stack", "success"),
      blank(),
      ...items.map((i) => line(`  ${i.tech.padEnd(widest + 2)} ${i.level}`)),
    ];
  },
};

export const experience: CommandDef = {
  name: "experience",
  aliases: ["xp", "career"],
  description: { en: "work history", pt: "histórico profissional" },
  run: ({ lang }) => {
    const out: OutputLine[] = [
      line(lang === "pt" ? "carreira" : "career", "success"),
      blank(),
    ];
    for (const exp of experiences) {
      const start = exp.startDate.slice(0, 4);
      const end = exp.endDate
        ? exp.endDate.slice(0, 4)
        : lang === "pt"
          ? "atual"
          : "now";
      out.push(line(`  ${start}-${end}  ${exp.company}`));
      out.push(dim(`            ${exp.jobTitle} · ${exp.location}`));
    }
    return out;
  },
};

export const contact: CommandDef = {
  name: "contact",
  description: { en: "get in touch", pt: "entre em contato" },
  usage: "contact [--open]",
  run: ({ args, env, lang }) => {
    const out = [line("email: julianosirtori@gmail.com")];
    if (args.includes("--open")) {
      env.router.push("/contact");
      out.push(
        dim(
          lang === "pt"
            ? "abrindo formulário de contato..."
            : "opening contact form...",
        ),
      );
    } else {
      out.push(
        dim(
          lang === "pt"
            ? "tip: 'contact --open' abre o formulário"
            : "tip: 'contact --open' opens the form",
        ),
      );
    }
    return out;
  },
};

export const social: CommandDef = {
  name: "social",
  description: { en: "social links", pt: "links sociais" },
  run: () => [
    line("social", "success"),
    blank(),
    line("  github     github.com/julianosirtori"),
    line("  linkedin   linkedin.com/in/juliano-sirtori"),
    line("  twitter    twitter.com/julianosirtori"),
    line("  discord    juliano_sirtori"),
    blank(),
    dim("tip: 'open <url>' opens in a new tab"),
  ],
};

export const projects: CommandDef = {
  name: "projects",
  aliases: ["work"],
  description: { en: "side projects", pt: "projetos paralelos" },
  run: ({ lang }) => {
    const data = projectsData[lang as Lang] ?? projectsData.en;
    const years = Object.keys(data).sort((a, b) => Number(b) - Number(a));
    const out: OutputLine[] = [
      line(lang === "pt" ? "projetos" : "projects", "success"),
      blank(),
    ];
    for (const year of years) {
      out.push(dim(`  ${year}`));
      for (const project of data[year as keyof typeof data]) {
        out.push(line(`    · ${project.title}`));
        out.push(dim(`        ${project.href}`));
      }
    }
    out.push(blank());
    out.push(dim("tip: 'open <url>' to visit"));
    return out;
  },
};

export const posts: CommandDef = {
  name: "posts",
  aliases: ["blog", "articles"],
  description: { en: "recent blog posts", pt: "posts recentes" },
  usage: "posts [--open]",
  run: ({ args, env, lang }) => {
    const filtered = allPosts
      .filter((p) => p.language === lang && !p.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);

    const out: OutputLine[] = [
      line(lang === "pt" ? "posts recentes" : "recent posts", "success"),
      blank(),
    ];
    for (const post of filtered) {
      const date = new Date(post.date).toISOString().slice(0, 10);
      out.push(line(`  ${date}  ${post.title}`));
    }
    out.push(blank());

    if (args.includes("--open")) {
      env.router.push("/blog");
      out.push(dim(lang === "pt" ? "abrindo /blog..." : "opening /blog..."));
    } else {
      out.push(
        dim(
          lang === "pt"
            ? "tip: 'posts --open' abre a listagem"
            : "tip: 'posts --open' opens the listing",
        ),
      );
    }
    return out;
  },
};
