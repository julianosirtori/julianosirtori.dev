"use client";

import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export const HeaderDarkMode = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const htmlElement = document.querySelector("html");
    htmlElement?.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <button
      aria-label="change dark mode"
      className="text-primary px-4 py-2"
      onClick={() => setDarkMode((darkMode) => !darkMode)}
    >
      {darkMode ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
