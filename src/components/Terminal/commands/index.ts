import { CommandDef, CommandRegistry } from "../types";
import { clear, date, echo, exit, help, lang, theme } from "./system";
import { cat, cd, ls, open, pwd } from "./nav";
import {
  about,
  contact,
  experience,
  posts,
  projects,
  skills,
  social,
  whoami,
} from "./info";
import {
  coffee,
  cowsay,
  fortune,
  fortyTwo,
  hireMe,
  iddqd,
  joke,
  neofetch,
  quote,
  rmrf,
  source,
  sudo,
  time,
  vim,
  xyzzy,
} from "./fun";
import { matrix, snake } from "./games";

const ALL: CommandDef[] = [
  help,
  clear,
  echo,
  date,
  theme,
  lang,
  exit,
  ls,
  cd,
  pwd,
  cat,
  open,
  whoami,
  about,
  skills,
  experience,
  contact,
  social,
  projects,
  posts,
  joke,
  quote,
  cowsay,
  coffee,
  fortune,
  sudo,
  vim,
  rmrf,
  hireMe,
  source,
  neofetch,
  fortyTwo,
  xyzzy,
  iddqd,
  time,
  matrix,
  snake,
];

export const registry: CommandRegistry = (() => {
  const r: CommandRegistry = {};
  for (const cmd of ALL) {
    r[cmd.name] = cmd;
    for (const alias of cmd.aliases ?? []) {
      r[alias] = cmd;
    }
  }
  return r;
})();

export const visibleCommandNames: string[] = ALL.filter((c) => !c.hidden).map(
  (c) => c.name,
);

export const allCommandKeys: string[] = Object.keys(registry);
