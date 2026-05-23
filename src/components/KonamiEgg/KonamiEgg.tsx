"use client";

import { useEffect, useState } from "react";

import { useRouter } from "@/locales/navigation";

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
      const expected = SEQUENCE[progress];
      const pressed = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (pressed === expected.toLowerCase()) {
        progress += 1;
        if (progress === SEQUENCE.length) {
          progress = 0;
          setTriggered(true);
        }
      } else {
        progress = pressed === SEQUENCE[0].toLowerCase() ? 1 : 0;
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
      <div className="text-center font-mono">
        <p className="text-5xl text-[#00ff66] [text-shadow:0_0_20px_rgba(0,255,102,0.7)]">
          ↑↑↓↓←→←→BA
        </p>
        <p className="mt-3 text-sm text-[#00ff66]/70">cheat code accepted</p>
        <p className="mt-1 text-xs text-[#00ff66]/50">opening playground...</p>
      </div>
    </div>
  );
}
