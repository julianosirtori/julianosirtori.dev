"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SnakeGameProps {
  onClose: () => void;
  highScore: number;
  onScore: (n: number) => void;
}

const GRID = 20;
const TICK_MS = 110;

type Vec = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const START_SNAKE: Vec[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export function SnakeGame({ onClose, highScore, onScore }: SnakeGameProps) {
  const [snake, setSnake] = useState<Vec[]>(START_SNAKE);
  const [food, setFood] = useState<Vec>({ x: 15, y: 10 });
  const [dir, setDir] = useState<Dir>("right");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const dirRef = useRef(dir);
  const tickRef = useRef(0);

  const reset = useCallback(() => {
    setSnake(START_SNAKE);
    setFood({ x: 15, y: 10 });
    setDir("right");
    dirRef.current = "right";
    setScore(0);
    setGameOver(false);
    setPaused(false);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === " " || e.key === "p") {
        e.preventDefault();
        if (gameOver) {
          reset();
        } else {
          setPaused((p) => !p);
        }
        return;
      }

      const key = e.key.toLowerCase();
      const next: Record<string, Dir> = {
        arrowup: "up",
        arrowdown: "down",
        arrowleft: "left",
        arrowright: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };
      const requested = next[key];
      if (!requested) return;

      const current = dirRef.current;
      if (
        (current === "up" && requested === "down") ||
        (current === "down" && requested === "up") ||
        (current === "left" && requested === "right") ||
        (current === "right" && requested === "left")
      ) {
        return;
      }
      dirRef.current = requested;
      setDir(requested);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, gameOver, reset]);

  useEffect(() => {
    if (gameOver || paused) return;
    tickRef.current = window.setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const deltas: Record<Dir, Vec> = {
          up: { x: 0, y: -1 },
          down: { x: 0, y: 1 },
          left: { x: -1, y: 0 },
          right: { x: 1, y: 0 },
        };
        const d = deltas[dirRef.current];
        const nextHead: Vec = { x: head.x + d.x, y: head.y + d.y };

        if (
          nextHead.x < 0 ||
          nextHead.x >= GRID ||
          nextHead.y < 0 ||
          nextHead.y >= GRID
        ) {
          setGameOver(true);
          return prev;
        }
        if (prev.some((s) => s.x === nextHead.x && s.y === nextHead.y)) {
          setGameOver(true);
          return prev;
        }

        const ate = nextHead.x === food.x && nextHead.y === food.y;
        const newSnake = [nextHead, ...prev];
        if (!ate) newSnake.pop();

        if (ate) {
          setScore((s) => {
            const next = s + 1;
            if (next > highScore) onScore(next);
            return next;
          });
          setFood(spawnFood(newSnake));
        }

        return newSnake;
      });
    }, TICK_MS);
    return () => clearInterval(tickRef.current);
  }, [gameOver, paused, food, highScore, onScore]);

  const cellSize = 18;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur"
      role="dialog"
      aria-label="snake game"
    >
      <div className="flex flex-col items-center gap-3 font-mono">
        <div className="flex w-full justify-between text-sm">
          <span className="text-[#8aff80]">score: {score}</span>
          <span className="text-[#8f9ba8]">
            high: {Math.max(highScore, score)}
          </span>
        </div>
        <div
          className="relative border-2 border-[#8aff80]/30"
          style={{ width: GRID * cellSize, height: GRID * cellSize }}
        >
          {snake.map((s, i) => (
            <div
              key={`s-${i}`}
              className={i === 0 ? "bg-[#8aff80]" : "bg-[#8aff80]/70"}
              style={{
                position: "absolute",
                left: s.x * cellSize,
                top: s.y * cellSize,
                width: cellSize - 1,
                height: cellSize - 1,
              }}
            />
          ))}
          <div
            className="bg-[#ff80bf]"
            style={{
              position: "absolute",
              left: food.x * cellSize,
              top: food.y * cellSize,
              width: cellSize - 1,
              height: cellSize - 1,
            }}
          />
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <p className="text-lg text-[#ff80bf]">game over</p>
              <p className="mt-1 text-xs text-[#8f9ba8]">
                space to restart · esc to exit
              </p>
            </div>
          )}
          {paused && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <p className="text-sm text-[#8f9ba8]">paused — space to resume</p>
            </div>
          )}
        </div>
        <p className="text-xs text-[#8f9ba8]">
          wasd/arrows · space pause · esc exit
        </p>
      </div>
    </div>
  );
}

function spawnFood(snake: Vec[]): Vec {
  let pos: Vec;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}
