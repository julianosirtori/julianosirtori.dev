"use client";

import { useEffect, useState } from "react";

import { useRouter } from "@/locales/navigation";
import { THEMES } from "@/components/Terminal/themes";

const MATRIX = THEMES.matrix.fg;

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiEgg() {
  const router = useRouter();
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      const pressed = e.key.toLowerCase();
      const expected = SEQUENCE[progress].toLowerCase();
      const first = SEQUENCE[0].toLowerCase();
      if (pressed === expected) {
        progress += 1;
        if (progress === SEQUENCE.length) {
          progress = 0;
          setTriggered(true);
        }
      } else {
        progress = pressed === first ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!triggered) return;
    const timeout = setTimeout(() => {
      router.push("/playground");
      setTriggered(false);
    }, 1800);
    return () => clearTimeout(timeout);
  }, [triggered, router]);

  if (!triggered) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
      <div className="text-center font-mono" style={{ color: MATRIX }}>
        <p className="text-5xl" style={{ textShadow: `0 0 20px ${MATRIX}b3` }}>
          ↑↑↓↓←→←→BA
        </p>
        <p className="mt-3 text-sm opacity-70">cheat code accepted</p>
        <p className="mt-1 text-xs opacity-50">opening playground...</p>
      </div>
    </div>
  );
}
