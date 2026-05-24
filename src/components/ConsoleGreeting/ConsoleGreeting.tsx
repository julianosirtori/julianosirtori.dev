"use client";

import { useEffect } from "react";

const GREETING = `
%c     _       _ _                              _       _   _
%c  __| |_   _| (_) __ _ _ __   ___    ___  ___(_)_ __ | |_(_)
%c / _\` | | | | | |/ _\` | '_ \\ / _ \\  / __|/ __| | '__|| __| |
%c| (_| | |_| | | | (_| | | | | (_) | \\__ \\ (__| | |   | |_| |
%c \\__,_|\\__,_|_|_|\\__,_|_| |_|\\___/  |___/\\___|_|_|    \\__|_|
`;

export function ConsoleGreeting() {
  useEffect(() => {
    const accent = "color: #4f46e5; font-family: monospace; font-size: 12px;";
    const subdued = "color: #737373; font-family: monospace; font-size: 12px;";
    const link = "color: #4f46e5; font-family: monospace; font-size: 12px;";

    console.log(GREETING, accent, accent, accent, accent, accent);
    console.log(
      "%cwelcome, dev.",
      "color: #0a0a0a; font-family: monospace; font-size: 14px; font-weight: bold;",
    );
    console.log(
      "%ctry %c/playground%c for an interactive terminal.",
      subdued,
      link,
      subdued,
    );
    console.log("%chint: ↑↑↓↓←→←→BA anywhere on the site.", subdued);
  }, []);

  return null;
}
