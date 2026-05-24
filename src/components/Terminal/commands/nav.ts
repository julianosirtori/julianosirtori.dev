import { CommandDef } from "../types";
import { dim, err, line } from "../lines";
import { listDir, resolvePath } from "../fs";
import { runFileReader } from "./files";

export const ls: CommandDef = {
  name: "ls",
  aliases: ["dir"],
  description: { en: "list current directory", pt: "lista o diretório atual" },
  run: ({ cwd, args }) => {
    const target = args[0] ? resolvePath(cwd, args[0]) : cwd;
    if (!target) return [err(`ls: ${args[0]}: no such directory`)];

    const entries = listDir(target);
    if (entries.length === 0) return [dim("(empty)")];

    const widest = Math.max(...entries.map((e) => e.name.length));
    const cols = Math.max(1, Math.floor(80 / (widest + 4)));
    const rows: string[] = [];
    for (let i = 0; i < entries.length; i += cols) {
      const slice = entries.slice(i, i + cols);
      rows.push(
        slice
          .map((e) =>
            (e.kind === "dir" ? `${e.name}/` : e.name).padEnd(widest + 4),
          )
          .join(""),
      );
    }
    return rows.map((row) => line(row));
  },
};

export const cd: CommandDef = {
  name: "cd",
  description: { en: "change directory", pt: "muda de diretório" },
  usage: "cd <dir>",
  run: ({ cwd, args, env }) => {
    if (!args[0] || args[0] === "~") {
      env.setCwd("/");
      return [];
    }
    const target = resolvePath(cwd, args[0]);
    if (!target) return [err(`cd: ${args[0]}: no such directory`)];
    env.setCwd(target);
    return [];
  },
};

export const pwd: CommandDef = {
  name: "pwd",
  description: { en: "show current path", pt: "mostra o caminho atual" },
  run: ({ cwd }) => [line(cwd)],
};

export const cat: CommandDef = {
  name: "cat",
  description: { en: "read a file", pt: "lê um arquivo" },
  usage: "cat <file>",
  run: (ctx) => runFileReader(ctx),
};

export const open: CommandDef = {
  name: "open",
  description: {
    en: "open a URL in a new tab",
    pt: "abre uma URL em nova aba",
  },
  usage: "open <url>",
  run: ({ args, lang }) => {
    const target = args[0];
    if (!target) {
      return [err(lang === "pt" ? "uso: open <url>" : "usage: open <url>")];
    }
    let url = target;
    if (!/^https?:\/\//.test(url)) url = `https://${url}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    return [line(`opening ${url}...`)];
  },
};
