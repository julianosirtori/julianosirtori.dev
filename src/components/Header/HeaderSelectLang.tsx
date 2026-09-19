"use client";
import React, { useMemo } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/locales/navigation";
import { languages } from "@/locales/languages";

import { track } from "@/lib/analytics";

export const HeaderSelectLang = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const langs = useMemo(() => Object.keys(languages), []);

  const handleSelect = (locale: string) => {
    track("language_change", {
      location: "header",
      target_language: locale as "pt" | "en",
    });
    const query = new URLSearchParams();
    if (/^\/newsletter\/(confirm|unsubscribe)$/.test(pathname)) {
      const current = new URLSearchParams(window.location.search);
      const keys = pathname.endsWith("/confirm")
        ? ["token"]
        : ["id", "signature"];
      for (const key of keys) {
        const value = current.get(key);
        if (value) query.set(key, value);
      }
    }
    router.push(`${pathname}${query.size ? `?${query}` : ""}`, { locale });
  };

  return (
    <Select.Root onValueChange={handleSelect} defaultValue={currentLocale}>
      <Select.Trigger
        aria-label="change language"
        className="text-fg-muted hover:text-fg hover:bg-bg-muted focus-visible:ring-accent inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <Select.Value>{currentLocale.toUpperCase()}</Select.Value>
        <Select.Icon>
          <ChevronDownIcon className="h-3 w-3" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.SelectContent className="z-20">
          <Select.SelectViewport className="border-border bg-bg-elevated mt-1 flex flex-col rounded-md border p-1 shadow-lg">
            {langs.map((lang) => (
              <Select.Item
                key={lang}
                value={lang}
                aria-label={lang}
                className="text-fg-muted hover:bg-bg-muted hover:text-fg flex cursor-pointer flex-row items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
              >
                <Select.ItemText>{lang.toUpperCase()}</Select.ItemText>
                <Select.ItemIndicator>
                  <CheckIcon className="h-3 w-3" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.SelectViewport>
        </Select.SelectContent>
      </Select.Portal>
    </Select.Root>
  );
};
