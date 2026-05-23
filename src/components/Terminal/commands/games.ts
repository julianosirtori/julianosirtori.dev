import { CommandDef } from "../types";
import { dim, line } from "../lines";

export const matrix: CommandDef = {
  name: "matrix",
  description: { en: "enter the matrix", pt: "entre na matrix" },
  run: ({ env, lang }) => {
    env.setOverlay({ kind: "matrix" });
    return [
      dim(
        lang === "pt"
          ? "wake up, neo... (esc pra sair)"
          : "wake up, neo... (esc to exit)",
      ),
    ];
  },
};

export const snake: CommandDef = {
  name: "snake",
  description: { en: "play snake", pt: "jogar snake" },
  run: ({ env, lang }) => {
    env.setOverlay({ kind: "snake" });
    return [
      line(
        lang === "pt"
          ? "snake — wasd/setas pra mover, esc pra sair"
          : "snake — wasd/arrows to move, esc to quit",
      ),
      dim(`high score: ${env.highScore}`),
    ];
  },
};
