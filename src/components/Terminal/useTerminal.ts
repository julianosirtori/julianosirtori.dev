"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Cwd,
  Lang,
  OutputLine,
  OverlayState,
  TerminalEnv,
  ThemeName,
} from "./types";
import { allCommandKeys, registry } from "./commands";
import { parseInput } from "./parser";
import { applyPipe } from "./pipe";
import { closestMatch } from "./levenshtein";
import { storage } from "./storage";
import { blank, dim, err, line, ok } from "./lines";
import { LOGO } from "./data/ascii";
import { autocomplete as runAutocomplete } from "./autocomplete";
import { useRouter } from "@/locales/navigation";

const MAX_HISTORY = 100;

interface UseTerminalArgs {
  initialLang: Lang;
}

export interface TerminalApi {
  output: OutputLine[];
  input: string;
  setInput: (v: string) => void;
  cwd: Cwd;
  theme: ThemeName;
  lang: Lang;
  overlay: OverlayState;
  highScore: number;
  setHighScore: (n: number) => void;
  closeOverlay: () => void;
  submit: () => Promise<void>;
  navigateHistory: (dir: -1 | 1) => void;
  tab: () => void;
  clear: () => void;
  ready: boolean;
}

export function useTerminal({ initialLang }: UseTerminalArgs): TerminalApi {
  const router = useRouter();
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState<Cwd>("/");
  const [theme, setThemeState] = useState<ThemeName>("dracula");
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [overlay, setOverlay] = useState<OverlayState>({ kind: "none" });
  const [highScore, setHighScoreState] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const draftRef = useRef("");
  const bootRanRef = useRef(false);

  useEffect(() => {
    setThemeState(storage.get("theme", "dracula"));
    setHistory(storage.get<string[]>("history", []));
    setHighScoreState(storage.get("snake-high", 0));
  }, []);

  useEffect(() => {
    if (bootRanRef.current) return;
    bootRanRef.current = true;
    void runBoot(setOutput, lang).then(() => setReady(true));
    // boot runs once; deps intentionally empty (lang captured by closure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    storage.set("theme", t);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
  }, []);

  const setHighScore = useCallback((n: number) => {
    setHighScoreState(n);
    storage.set("snake-high", n);
  }, []);

  const push = useCallback((newLines: OutputLine[]) => {
    setOutput((prev) => [...prev, ...newLines]);
  }, []);

  const clear = useCallback(() => {
    setOutput([]);
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlay({ kind: "none" });
  }, []);

  const env: TerminalEnv = useMemo(
    () => ({
      setCwd,
      setTheme,
      setLang,
      setOverlay,
      clear,
      push,
      theme,
      history,
      router,
      highScore,
      setHighScore,
    }),
    [
      setTheme,
      setLang,
      clear,
      push,
      theme,
      history,
      router,
      highScore,
      setHighScore,
    ],
  );

  const submit = useCallback(async () => {
    const raw = input;
    const prompt = `${promptFor(lang, cwd)}${raw}`;
    setInput("");
    setHint([]);
    setHistoryIdx(null);

    if (!raw.trim()) {
      push([line(prompt, "input")]);
      return;
    }

    setHistory((prev) => {
      const next = [...prev.filter((h) => h !== raw), raw].slice(-MAX_HISTORY);
      storage.set("history", next);
      return next;
    });

    const parsed = parseInput(raw);
    push([line(prompt, "input")]);
    if (!parsed) return;

    const cmd = registry[parsed.name];
    if (!cmd) {
      const suggestion = closestMatch(parsed.name, allCommandKeys);
      const errors: OutputLine[] = [err(`command not found: ${parsed.name}`)];
      if (suggestion) errors.push(dim(`did you mean: ${suggestion}?`));
      push(errors);
      return;
    }

    try {
      const result = await cmd.run({
        args: parsed.args,
        raw: parsed.raw,
        lang,
        cwd,
        env,
      });
      const piped = parsed.pipe ? applyPipe(result, parsed.pipe) : result;
      if (piped.length > 0) push(piped);
    } catch (error) {
      push([err(`error: ${(error as Error).message}`)]);
    }
  }, [input, lang, cwd, push, env]);

  const navigateHistory = useCallback(
    (dir: -1 | 1) => {
      if (history.length === 0) return;

      if (historyIdx === null) {
        if (dir === 1) return;
        draftRef.current = input;
        const next = history.length - 1;
        setHistoryIdx(next);
        setInput(history[next]);
        return;
      }

      const nextIdx = historyIdx + dir;
      if (nextIdx < 0) {
        setHistoryIdx(0);
        setInput(history[0]);
        return;
      }
      if (nextIdx >= history.length) {
        setHistoryIdx(null);
        setInput(draftRef.current);
        return;
      }
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx]);
    },
    [history, historyIdx, input],
  );

  const tab = useCallback(() => {
    const result = runAutocomplete(input, cwd);
    if (result.completed !== input) setInput(result.completed);
    if (result.options.length > 1) {
      push([dim(result.options.join("  "))]);
    }
  }, [input, cwd, push]);

  return {
    output,
    input,
    setInput,
    cwd,
    theme,
    lang,
    overlay,
    highScore,
    setHighScore,
    closeOverlay,
    submit,
    navigateHistory,
    tab,
    clear,
    ready,
  };
}

export function promptFor(lang: Lang, cwd: Cwd): string {
  return `guest@juliano:${cwd} $ `;
}

async function runBoot(
  setOutput: React.Dispatch<React.SetStateAction<OutputLine[]>>,
  lang: Lang,
): Promise<void> {
  const logoLines = LOGO.map((row) => line(row, "success"));
  const welcome =
    lang === "pt"
      ? "bem-vindo ao juliano@portfolio"
      : "welcome to juliano@portfolio";
  const versionText =
    lang === "pt"
      ? "v1.0.0 — feito em react, servido com curiosidade"
      : "v1.0.0 — built with react, served with curiosity";
  const loading = lang === "pt" ? "carregando módulos" : "loading modules";
  const ready = lang === "pt" ? "pronto." : "ready.";
  const hint =
    lang === "pt" ? "digite 'help' pra começar." : "type 'help' to start.";

  setOutput((prev) => [...prev, ...logoLines]);
  await sleep(120);
  setOutput((prev) => [
    ...prev,
    blank(),
    line(welcome),
    dim(versionText),
    blank(),
  ]);
  await sleep(180);

  const dots = ["", ".", "..", "..."];
  for (const d of dots) {
    setOutput((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last?.id?.startsWith("boot-loading")) {
        next.pop();
      }
      next.push({
        id: `boot-loading-${d.length}`,
        kind: "muted",
        content: `${loading}${d}`,
      });
      return next;
    });
    await sleep(150);
  }

  setOutput((prev) => [...prev, ok(ready), dim(hint), blank()]);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
