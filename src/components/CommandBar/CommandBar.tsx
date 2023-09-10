"use client";

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
} from "kbar";
import { TCommandBarProps } from "./CommandBar.types";
import { useRouter } from "next/navigation";
import { LegacyRef, forwardRef } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import {
  BackpackIcon,
  CodeIcon,
  EnvelopeClosedIcon,
  FileTextIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

export function CommandBar({ children }: TCommandBarProps) {
  const router = useRouter();
  const t = useTranslations("global.kbar");

  const actions = [
    {
      id: "email",
      name: t("email"),
      shortcut: ["e"],
      keywords: "send-email",
      section: "General",
      perform: () => router.push("/contact"),
      icon: <EnvelopeClosedIcon />,
    },
    {
      id: "source",
      name: t("source"),
      shortcut: ["s"],
      keywords: "view-source",
      section: "General",
      perform: () =>
        window.open(
          "https://github.com/julianosirtori/julianosirtori.dev",
          "_blank",
        ),
      icon: <CodeIcon />,
    },
    {
      id: "home",
      name: t("home"),
      shortcut: ["g", "h"],
      keywords: "go-home",
      section: "Go To",
      perform: () => router.push("/"),
      icon: <HomeIcon />,
    },
    {
      id: "about",
      name: t("about"),
      shortcut: ["g", "a"],
      keywords: "go-about",
      section: "Go To",
      perform: () => router.push("/about"),
      icon: <PersonIcon />,
    },
    {
      id: "articles",
      name: t("articles"),
      shortcut: ["g", "b"],
      keywords: "go-articles",
      section: "Go To",
      perform: () => router.push("/blog"),
      icon: <FileTextIcon />,
    },
    {
      id: "projects",
      name: t("project"),
      shortcut: ["g", "p"],
      keywords: "go-projects",
      section: "Go To",
      perform: () => router.push("/projects"),
      icon: <BackpackIcon />,
    },
  ];

  return (
    <KBarProvider
      actions={actions}
      options={{
        disableScrollbarManagement: true,
      }}
    >
      <KBarPortal>
        <KBarPositioner className="bg-[rgba(255, 255, 255, .1)] fixed inset-0 z-20 box-border flex w-full items-start justify-center px-4 pt-[14vh]">
          <KBarAnimator className="backdrop-saturate-500 [&>div>div]:no-scrollbar w-full max-w-2xl overflow-hidden rounded-lg bg-command text-primary backdrop-blur-2xl">
            <KBarSearch
              defaultPlaceholder={t("defaultSearch")}
              className="m-0 box-border w-full bg-command px-4 py-3 text-base text-primary outline-none"
            />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      maxHeight={300}
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="bg-command px-4 py-2 text-[10px] uppercase text-secondary">
            {item}
          </div>
        ) : (
          <ResultItem action={item} active={active} />
        )
      }
    />
  );
}

const ResultItem = forwardRef(function ResultItem(
  { action, active }: { action: any; active: boolean },
  ref?: LegacyRef<HTMLDivElement>,
) {
  return (
    <div
      className={clsx({
        "m-0 flex w-full cursor-pointer items-center justify-between px-4 py-3":
          true,
        "bg-[rgba(255, 255, 255, 0.1)] text-primary": active,
        "bg-command text-secondary": !active,
      })}
      ref={ref}
    >
      <div className="flex items-center gap-4">
        {action.icon && action.icon}
        <div className="flex flex-col">
          <span>{action.name}</span>
        </div>
      </div>
      <div className="grid grid-flow-col gap-1">
        {action.shortcut.map((shortcut: string) => (
          <kbd
            className="bg-black px-2 py-1 uppercase text-secondary"
            key={shortcut}
          >
            {shortcut}
          </kbd>
        ))}
      </div>
    </div>
  );
});
