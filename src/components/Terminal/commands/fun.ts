import { CommandDef, OutputLine } from "../types";
import { blank, dim, err, line, ok } from "../lines";
import { COFFEE, cowsay as cowsayArt } from "../data/ascii";
import { randomJoke, randomQuote } from "../data/jokes";

export const joke: CommandDef = {
  name: "joke",
  description: { en: "random dev joke", pt: "piada de dev aleatória" },
  run: ({ lang }) => [line(randomJoke(lang))],
};

export const quote: CommandDef = {
  name: "quote",
  description: { en: "wise words", pt: "palavras sábias" },
  run: ({ lang }) => [line(randomQuote(lang))],
};

export const cowsay: CommandDef = {
  name: "cowsay",
  description: { en: "let the cow say it", pt: "deixe a vaca falar" },
  usage: "cowsay <message>",
  run: ({ args, lang }) => {
    const msg = args.join(" ").trim() || (lang === "pt" ? "moo" : "moo");
    return cowsayArt(msg).map((row) => line(row));
  },
};

export const coffee: CommandDef = {
  name: "coffee",
  aliases: ["café"],
  description: { en: "essential dev fuel", pt: "combustível essencial" },
  run: ({ lang }) => [
    ...COFFEE.map((row) => line(row, "muted")),
    blank(),
    line(
      lang === "pt"
        ? "uma xícara fresca. agora podemos seguir."
        : "fresh cup. now we may proceed.",
    ),
  ],
};

export const fortune: CommandDef = {
  name: "fortune",
  description: { en: "predict your future", pt: "prevê seu futuro" },
  run: ({ lang }) => {
    const fortunes = {
      en: [
        "today, you will refactor with confidence.",
        "your next bug will be a missing semicolon.",
        "a PR will get approved without comments. enjoy.",
        "the test suite will be green on first try. believe.",
        "git will ask for a merge. you will answer.",
        "stack overflow will save you again.",
        "you will close 3 tabs and remember why.",
      ],
      pt: [
        "hoje, você refatora com confiança.",
        "seu próximo bug será um ponto-e-vírgula esquecido.",
        "uma PR vai ser aprovada sem comentários. aproveite.",
        "a suíte de testes vai passar na primeira. acredite.",
        "git vai pedir merge. você vai responder.",
        "o stack overflow vai te salvar de novo.",
        "você vai fechar 3 abas e lembrar pra que serviam.",
      ],
    };
    const pool = fortunes[lang];
    return [line(pool[Math.floor(Math.random() * pool.length)])];
  },
};

export const sudo: CommandDef = {
  name: "sudo",
  description: { en: "as if", pt: "com certeza" },
  hidden: true,
  run: ({ lang }) => [
    err(
      lang === "pt"
        ? "Permission denied: nice try."
        : "Permission denied: nice try.",
    ),
    dim(
      lang === "pt"
        ? "Este incidente será reportado."
        : "This incident will be reported.",
    ),
  ],
};

export const vim: CommandDef = {
  name: "vim",
  aliases: ["nano", "emacs"],
  description: { en: "open editor", pt: "abrir editor" },
  hidden: true,
  run: ({ raw }) => {
    const editor = raw.split(" ")[0];
    return [
      err(`${editor}: you can't escape.`),
      line("hint: try ':q!'... oh wait, this is a terminal."),
      dim("press anything. it won't help."),
    ];
  },
};

export const rmrf: CommandDef = {
  name: "rm",
  description: { en: "remove files", pt: "remover arquivos" },
  hidden: true,
  run: ({ args, lang }) => {
    const dashRf = args.includes("-rf") || args.includes("-fr");
    const root = args.includes("/") || args.includes("/*");
    if (dashRf && root) {
      const out: OutputLine[] = [
        line("rm: removing /...", "error"),
        line("rm: removing /bin..."),
        line("rm: removing /etc..."),
        line("rm: removing /home..."),
        line("rm: removing /usr..."),
        blank(),
        ok(
          lang === "pt" ? "ufa! era só simulação." : "phew! just a simulation.",
        ),
        dim(lang === "pt" ? "nada foi removido." : "nothing was deleted."),
      ];
      return out;
    }
    return [err("rm: this isn't a real filesystem.")];
  },
};

export const hireMe: CommandDef = {
  name: "hire-me",
  aliases: ["hire", "contratar"],
  description: { en: "let's talk", pt: "vamos conversar" },
  hidden: true,
  run: ({ env, lang }) => {
    env.router.push("/contact");
    return [
      ok(lang === "pt" ? "boa escolha." : "good choice."),
      line(
        lang === "pt"
          ? "abrindo o formulário. me conta no que tá pensando."
          : "opening the form. tell me what you're thinking.",
      ),
    ];
  },
};

export const source: CommandDef = {
  name: "source",
  aliases: ["src", "github"],
  description: { en: "view source on github", pt: "ver o fonte no github" },
  run: ({ lang }) => {
    if (typeof window !== "undefined") {
      window.open(
        "https://github.com/julianosirtori/julianosirtori.dev",
        "_blank",
        "noopener,noreferrer",
      );
    }
    return [
      line(
        lang === "pt"
          ? "abrindo o repositório no github..."
          : "opening the repo on github...",
      ),
    ];
  },
};

export const neofetch: CommandDef = {
  name: "neofetch",
  description: { en: "system info", pt: "info do sistema" },
  hidden: true,
  run: ({ lang, env }) => [
    line("       .--.        ", "success"),
    line("      |o_o |       juliano@portfolio"),
    line("      |:_/ |       ─────────────────"),
    line("     //   \\ \\      os:      web"),
    line("    (|     | )     host:    julianosirtori.dev"),
    line("   /'\\_   _/`\\     kernel:  react 19"),
    line("   \\___)=(___/     uptime:  since you opened this tab"),
    line("                   shell:   playground v1.0"),
    line(`                   theme:   ${env.theme}`),
    line(`                   lang:    ${lang}`),
  ],
};

export const fortyTwo: CommandDef = {
  name: "42",
  description: { en: "the answer", pt: "a resposta" },
  hidden: true,
  run: () => [
    line("the answer to life, the universe, and everything.", "success"),
    dim("— douglas adams"),
  ],
};

export const xyzzy: CommandDef = {
  name: "xyzzy",
  description: { en: "a magic word", pt: "uma palavra mágica" },
  hidden: true,
  run: () => [line("nothing happens.", "muted")],
};

export const iddqd: CommandDef = {
  name: "iddqd",
  description: { en: "god mode", pt: "modo deus" },
  hidden: true,
  run: ({ lang }) => [
    ok("GOD MODE ENABLED"),
    dim(
      lang === "pt"
        ? "agora você é imune a bugs (até o próximo deploy)."
        : "you're now immune to bugs (until the next deploy).",
    ),
  ],
};

export const time: CommandDef = {
  name: "time",
  description: { en: "time check", pt: "que horas são" },
  run: ({ lang }) => {
    const now = new Date();
    return [line(now.toLocaleTimeString(lang === "pt" ? "pt-BR" : "en-US"))];
  },
};
