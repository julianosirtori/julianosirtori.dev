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
import { useRouter } from "@/locales/navigation";
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
  ChatBubbleIcon,
  ClockIcon,
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
      name: t("blog"),
      shortcut: ["g", "b"],
      keywords: "go-blog",
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
    {
      id: "guestbook",
      name: t("guestbook"),
      shortcut: ["g", "g"],
      keywords: "go-guestbook",
      section: "Go To",
      perform: () => router.push("/guestbook"),
      icon: <ChatBubbleIcon />,
    },
    {
      id: "now",
      name: t("now"),
      shortcut: ["g", "n"],
      keywords: "go-now",
      section: "Go To",
      perform: () => router.push("/now"),
      icon: <ClockIcon />,
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
        <KBarPositioner className="fixed inset-0 z-20 box-border flex w-full items-start justify-center bg-[#000000cc] px-4 pt-[14vh]">
          <KBarAnimator className="[&>div>div]:no-scrollbar bg-command text-primary w-full max-w-2xl overflow-hidden rounded-lg backdrop-blur-3xl backdrop-saturate-200">
            <KBarSearch
              defaultPlaceholder={t("defaultSearch")}
              className="bg-command text-primary m-0 box-border w-full px-4 py-3 text-base outline-none"
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
          <div className="bg-command text-secondary px-4 py-2 text-[10px] uppercase">
            {item}
          </div>
        ) : (
          <ResultItem action={item} active={active} />
        )
      }
    />
  );
}

interface KBarAction {
  icon?: React.ReactNode;
  name: string;
  shortcut?: string[];
}

const ResultItem = forwardRef(function ResultItem(
  { action, active }: { action: KBarAction; active: boolean },
  ref?: LegacyRef<HTMLDivElement>,
) {
  return (
    <div
      className={clsx({
        "m-0 flex w-full cursor-pointer items-center justify-between px-4 py-3": true,
        "bg-[#1a1c1e)] text-primary": active,
        "bg-command text-secondary": !active,
      })}
      ref={ref}
    >
      <div className="flex items-center gap-4">
        <div className="text-primary">{action.icon && action.icon}</div>

        <div className="flex flex-col">
          <span>{action.name}</span>
        </div>
      </div>
      {action.shortcut && (
        <div className="grid grid-flow-col gap-1">
          {action.shortcut.map((shortcut: string) => (
            <kbd
              className="bg-hover text-secondary rounded-md px-2 py-1 uppercase"
              key={shortcut}
            >
              {shortcut}
            </kbd>
          ))}
        </div>
      )}
    </div>
  );
});
