"use client";
import React, { useCallback, useMemo } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { languages } from "@/locales/languages";

export const HeaderSelectLang = () => {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = useLocale();

  const langs = useMemo(() => {
    return Object.keys(languages);
  }, []);

  const handleSelect = (locale: string) => {
    router.push(pathname, { locale });
  };

  return (
    <Select.Root onValueChange={handleSelect} defaultValue={currentLocale}>
      <Select.Trigger className="flex flex-row items-center gap-1 p-1 font-semibold text-gray">
        <Select.Value placeholder={currentLocale.toUpperCase()} />
        <Select.Icon>
          <ChevronDownIcon width={16} height={16} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.SelectContent>
          <Select.SelectViewport className="flex flex-col gap-2 border border-gray bg-background p-1 px-2">
            {langs.map((lang) => (
              <Select.Item
                key={lang}
                value={lang}
                className="flex flex-row gap-1 p-1 text-gray hover:cursor-pointer"
              >
                <Select.ItemText>{lang.toUpperCase()}</Select.ItemText>
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.SelectViewport>
        </Select.SelectContent>
      </Select.Portal>
    </Select.Root>
  );
};
