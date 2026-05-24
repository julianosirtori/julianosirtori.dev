import { CommandContext, OutputLine } from "../types";
import { blank, dim, err, line } from "../lines";
import { resolvePath } from "../fs";

const FILES: Record<string, (lang: "en" | "pt") => OutputLine[]> = {
  "/README.md": (lang) =>
    lang === "pt"
      ? [
          line("# README"),
          blank(),
          line("você está em juliano@portfolio:~$"),
          line("digite 'help' pra começar."),
          line("a maioria dos comandos é segura. uns ali são easter eggs."),
        ]
      : [
          line("# README"),
          blank(),
          line("you're at juliano@portfolio:~$"),
          line("type 'help' to start."),
          line("most commands are safe. a few are easter eggs."),
        ],
  "/.secrets": (lang) => [
    err(lang === "pt" ? "permissão negada" : "permission denied"),
    dim(lang === "pt" ? "tente outra coisa." : "try something else."),
  ],
  "/about/me.md": (lang) =>
    lang === "pt"
      ? [
          line("# me"),
          blank(),
          line("nome:    juliano sirtori"),
          line("local:   curitiba, pr"),
          line("foco:    front-end, dx, design de interface"),
          line("anos:    8+ na indústria"),
          line("hoje:    avenue code"),
        ]
      : [
          line("# me"),
          blank(),
          line("name:    juliano sirtori"),
          line("from:    curitiba, brazil"),
          line("focus:   front-end, dx, interface design"),
          line("years:   8+ in the industry"),
          line("now:     avenue code"),
        ],
  "/about/now.md": (lang) => [
    line(lang === "pt" ? "# agora" : "# now"),
    blank(),
    line(
      lang === "pt"
        ? "leia /now no menu — atualizado direto."
        : "read /now in the menu — kept up to date.",
    ),
  ],
  "/projects/list.txt": (lang) => [
    line(
      lang === "pt"
        ? "use 'projects' pra ver a lista organizada por ano."
        : "use 'projects' to view the year-organized list.",
    ),
  ],
  "/projects/featured.md": () => [
    line("featured projects:"),
    blank(),
    line("  · julianosirtori.dev"),
    line("  · life-in-weeks"),
    line("  · cowsay-pragmatic-programmer (cli)"),
    line("  · space-invaders in vanilla js"),
  ],
  "/blog/recent.md": (lang) => [
    line(lang === "pt" ? "use 'posts' pra listar." : "use 'posts' to list."),
  ],
  "/skills/stack.txt": (lang) => [
    line(
      lang === "pt"
        ? "use 'skills' pra ver detalhes."
        : "use 'skills' for details.",
    ),
  ],
  "/experience/career.md": (lang) => [
    line(
      lang === "pt"
        ? "use 'experience' pra ver o histórico."
        : "use 'experience' for the timeline.",
    ),
  ],
  "/contact/email.txt": () => [line("julianosirtori@gmail.com")],
  "/contact/social.md": (lang) => [
    line(lang === "pt" ? "use 'social' pra listar." : "use 'social' to list."),
  ],
};

export function runFileReader(ctx: CommandContext): OutputLine[] {
  const target = ctx.args[0];
  if (!target) {
    return [
      err(ctx.lang === "pt" ? "uso: cat <arquivo>" : "usage: cat <file>"),
    ];
  }

  if (target.includes("/")) {
    const parts = target.split("/");
    const fileName = parts.pop()!;
    const dirPart = parts.join("/") || "/";
    const dir = resolvePath(ctx.cwd, dirPart);
    if (!dir) return [err(`cat: ${target}: no such file`)];
    const full = dir === "/" ? `/${fileName}` : `${dir}/${fileName}`;
    const reader = FILES[full];
    if (!reader) return [err(`cat: ${target}: no such file`)];
    return reader(ctx.lang);
  }

  const full = ctx.cwd === "/" ? `/${target}` : `${ctx.cwd}/${target}`;
  const reader = FILES[full];
  if (!reader) return [err(`cat: ${target}: no such file`)];
  return reader(ctx.lang);
}
