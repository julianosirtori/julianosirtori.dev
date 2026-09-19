"use client";
import { useEffect, useRef } from "react";
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      ref.current.style.opacity = window.scrollY > 200 ? "1" : "0";
      ref.current.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="bg-accent fixed top-0 right-0 left-0 z-50 h-0.5 origin-left motion-safe:transition-transform"
      style={{ transform: "scaleX(0)", opacity: 0 }}
    />
  );
}
