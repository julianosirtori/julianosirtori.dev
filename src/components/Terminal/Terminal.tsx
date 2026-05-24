"use client";

import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useTerminal, promptFor } from "./useTerminal";
import { THEMES } from "./themes";
import { Line } from "./Line";
import { MobileKeys } from "./MobileKeys";
import { MatrixOverlay } from "./MatrixOverlay";
import { SnakeGame } from "./SnakeGame";
import { Lang } from "./types";

interface TerminalProps {
  lang: string;
}

export function Terminal({ lang }: TerminalProps) {
  const initialLang: Lang = lang === "pt" ? "pt" : "en";
  const term = useTerminal({ initialLang });
  const palette = THEMES[term.theme];

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [term.output.length]);

  useEffect(() => {
    if (term.overlay.kind === "none") focus();
  }, [term.overlay, focus]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => term.setInput(e.target.value),
    [term],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        void term.submit();
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        term.tab();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        term.navigateHistory(-1);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        term.navigateHistory(1);
        return;
      }
      if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        term.clear();
        return;
      }
      if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        term.setInput("");
      }
    },
    [term],
  );

  const promptText = useMemo(
    () => promptFor(term.lang, term.cwd),
    [term.lang, term.cwd],
  );

  return (
    <>
      <div
        className="rounded-lg border shadow-xl"
        style={{
          backgroundColor: palette.bg,
          borderColor: palette.border,
        }}
        onClick={focus}
        role="presentation"
      >
        <div
          className="flex items-center gap-2 border-b px-3 py-2"
          style={{ borderColor: palette.border }}
        >
          <span className="inline-block h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="inline-block h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="inline-block h-3 w-3 rounded-full bg-[#27c93f]" />
          <span
            className="ml-2 font-mono text-xs"
            style={{ color: palette.muted }}
          >
            {`zsh — ${term.cwd} — ${term.theme}`}
          </span>
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar h-[60vh] max-h-[600px] min-h-[400px] overflow-y-auto p-4"
        >
          {term.output.map((l) => (
            <Line key={l.id} line={l} palette={palette} />
          ))}

          {term.ready && (
            <div
              className="flex items-center font-mono text-sm leading-relaxed"
              style={{ color: palette.fg }}
            >
              <span style={{ color: palette.prompt }}>{promptText}</span>
              <span className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={term.input}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="w-full bg-transparent font-mono outline-none"
                  style={{ color: palette.fg, caretColor: palette.prompt }}
                  aria-label="terminal input"
                />
              </span>
            </div>
          )}
        </div>
      </div>

      <MobileKeys
        palette={palette}
        onKey={(k) => term.setInput(term.input + k)}
        onTab={term.tab}
        onHistory={term.navigateHistory}
        onClear={() => {
          term.setInput("");
        }}
      />

      {term.overlay.kind === "matrix" && (
        <MatrixOverlay onClose={term.closeOverlay} />
      )}
      {term.overlay.kind === "snake" && (
        <SnakeGame
          onClose={term.closeOverlay}
          highScore={term.highScore}
          onScore={term.setHighScore}
        />
      )}
    </>
  );
}
