import { CommandDef, OutputLine } from "../types";
import { blank, dim, err, line, ok } from "../lines";
import { THEME_NAMES } from "../themes";
import { registry } from "./index";

const GROUPS: Record<string, string[]> = {
  info: ["whoami", "about", "skills", "experience", "social", "contact"],
  content: ["projects", "posts", "cat"],
  nav: ["ls", "cd", "pwd", "open"],
  system: ["help", "clear", "echo", "date", "theme", "lang", "exit"],
  fun: ["joke", "quote", "cowsay", "coffee", "fortune"],
  apps: ["matrix", "snake"],
};

export const help: CommandDef = {
  name: "help",
  aliases: ["?", "h"],
  description: { en: "list available commands", pt: "lista os comandos" },
  run: ({ lang, env }) => {
    const out: OutputLine[] = [
      line("juliano@portfolio — commands", "success"),
      blank(),
    ];

    for (const [groupName, names] of Object.entries(GROUPS)) {
      out.push(line(`  ${groupName}`, "muted"));
      for (const name of names) {
        const desc = registry[name]?.description[lang] ?? "";
        out.push(line(`    ${name.padEnd(14)} ${desc}`));
      }
      out.push(blank());
    }

    out.push(
      dim(
        lang === "pt"
          ? `tema atual: ${env.theme} · 'theme <nome>' troca · esconde-esconde por aí`
          : `current theme: ${env.theme} · 'theme <name>' switches · easter eggs hidden around`,
      ),
    );
    return out;
  },
};

export const clear: CommandDef = {
  name: "clear",
  aliases: ["cls"],
  description: { en: "clear the screen", pt: "limpa a tela" },
  run: ({ env }) => {
    env.clear();
    return [];
  },
};

export const echo: CommandDef = {
  name: "echo",
  description: { en: "print arguments", pt: "imprime argumentos" },
  run: ({ args }) => [line(args.join(" "))],
};

export const date: CommandDef = {
  name: "date",
  description: { en: "show current date/time", pt: "mostra data e hora" },
  run: ({ lang }) => {
    const now = new Date();
    const formatted = now.toLocaleString(lang === "pt" ? "pt-BR" : "en-US", {
      dateStyle: "full",
      timeStyle: "medium",
    });
    return [line(formatted)];
  },
};

export const theme: CommandDef = {
  name: "theme",
  description: {
    en: "switch terminal theme",
    pt: "troca o tema do terminal",
  },
  usage: "theme <dracula|matrix|mono|solar>",
  run: ({ args, env, lang }) => {
    if (!args[0]) {
      return [
        line(
          lang === "pt"
            ? `tema atual: ${env.theme}`
            : `current theme: ${env.theme}`,
        ),
        line(`available: ${THEME_NAMES.join(", ")}`, "muted"),
      ];
    }
    const target = args[0].toLowerCase();
    if (!THEME_NAMES.includes(target as (typeof THEME_NAMES)[number])) {
      return [
        err(`unknown theme: ${target}`),
        line(`available: ${THEME_NAMES.join(", ")}`, "muted"),
      ];
    }
    env.setTheme(target as (typeof THEME_NAMES)[number]);
    return [ok(`theme set to ${target}`)];
  },
};

export const lang: CommandDef = {
  name: "lang",
  description: { en: "switch language", pt: "troca o idioma" },
  usage: "lang <en|pt>",
  run: ({ args, env, lang }) => {
    if (!args[0]) {
      return [
        line(lang === "pt" ? `idioma atual: ${lang}` : `current lang: ${lang}`),
      ];
    }
    const target = args[0].toLowerCase();
    if (target !== "en" && target !== "pt") {
      return [err("unknown lang. try: en, pt")];
    }
    env.setLang(target);
    return [ok(`lang set to ${target}`)];
  },
};

export const exit: CommandDef = {
  name: "exit",
  aliases: ["quit", "logout"],
  description: { en: "back to home", pt: "volta pra home" },
  run: ({ env, lang }) => {
    env.router.push("/");
    return [dim(lang === "pt" ? "saindo..." : "exiting...")];
  },
};
