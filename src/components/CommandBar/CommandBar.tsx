"use client";

import { Command } from "cmdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  BackpackIcon,
  ChatBubbleIcon,
  ClockIcon,
  CodeIcon,
  CommitIcon,
  EnvelopeClosedIcon,
  FileTextIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { useRouter } from "@/locales/navigation";
import { CommandBarContext } from "./useCommandBar";
import { TCommandBarProps } from "./CommandBar.types";

interface Action {
  id: string;
  label: string;
  section: "general" | "navigate";
  keywords: string;
  perform: () => void;
  icon: React.ReactNode;
  shortcut?: string;
}

export function CommandBar({ children }: TCommandBarProps) {
  const router = useRouter();
  const t = useTranslations("global.kbar");
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle]);

  const actions: Action[] = useMemo(
    () => [
      {
        id: "email",
        label: t("email"),
        section: "general",
        keywords: "email contact send mail",
        perform: () => router.push("/contact"),
        icon: <EnvelopeClosedIcon />,
      },
      {
        id: "source",
        label: t("source"),
        section: "general",
        keywords: "github source repo code",
        perform: () =>
          window.open(
            "https://github.com/julianosirtori/julianosirtori.dev",
            "_blank",
            "noopener,noreferrer",
          ),
        icon: <CodeIcon />,
      },
      {
        id: "home",
        label: t("home"),
        section: "navigate",
        keywords: "home start",
        perform: () => router.push("/"),
        icon: <HomeIcon />,
      },
      {
        id: "about",
        label: t("about"),
        section: "navigate",
        keywords: "about bio",
        perform: () => router.push("/about"),
        icon: <PersonIcon />,
      },
      {
        id: "blog",
        label: t("blog"),
        section: "navigate",
        keywords: "blog articles posts writing",
        perform: () => router.push("/blog"),
        icon: <FileTextIcon />,
      },
      {
        id: "projects",
        label: t("project"),
        section: "navigate",
        keywords: "projects work portfolio",
        perform: () => router.push("/projects"),
        icon: <BackpackIcon />,
      },
      {
        id: "guestbook",
        label: t("guestbook"),
        section: "navigate",
        keywords: "guestbook visitors comments",
        perform: () => router.push("/guestbook"),
        icon: <ChatBubbleIcon />,
      },
      {
        id: "now",
        label: t("now"),
        section: "navigate",
        keywords: "now current status",
        perform: () => router.push("/now"),
        icon: <ClockIcon />,
      },
      {
        id: "playground",
        label: t("playground"),
        section: "navigate",
        keywords: "playground terminal shell konami",
        perform: () => router.push("/playground"),
        icon: <CommitIcon />,
      },
    ],
    [router, t],
  );

  const runAction = useCallback(
    (action: Action) => {
      action.perform();
      close();
    },
    [close],
  );

  const general = actions.filter((a) => a.section === "general");
  const navigate = actions.filter((a) => a.section === "navigate");

  return (
    <CommandBarContext.Provider value={{ open, setOpen, toggle }}>
      {children}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label={t("defaultSearch")}
        className="fixed inset-0 z-50 grid place-items-start justify-center bg-black/40 px-4 pt-[14vh] backdrop-blur-sm"
        overlayClassName="hidden"
        contentClassName="border-border bg-bg-elevated w-full max-w-xl overflow-hidden rounded-xl border shadow-2xl"
      >
        <Command shouldFilter className="flex flex-col">
          <Command.Input
            placeholder={t("defaultSearch")}
            className="placeholder:text-fg-subtle text-fg border-border w-full border-b bg-transparent px-4 py-3.5 text-sm outline-none"
          />
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="text-fg-muted px-3 py-6 text-center text-sm">
              No results.
            </Command.Empty>

            {general.length > 0 && (
              <Command.Group heading={sectionLabel("general")}>
                {general.map((action) => (
                  <CommandRow
                    key={action.id}
                    action={action}
                    onRun={runAction}
                  />
                ))}
              </Command.Group>
            )}

            {navigate.length > 0 && (
              <Command.Group heading={sectionLabel("navigate")}>
                {navigate.map((action) => (
                  <CommandRow
                    key={action.id}
                    action={action}
                    onRun={runAction}
                  />
                ))}
              </Command.Group>
            )}
          </Command.List>
          <div className="border-border text-fg-subtle flex items-center justify-between border-t px-3 py-2 text-xs">
            <span>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span className="ml-2">navigate</span>
            </span>
            <span>
              <Kbd>↵</Kbd>
              <span className="ml-1">open</span>
              <span className="mx-2">·</span>
              <Kbd>esc</Kbd>
              <span className="ml-1">close</span>
            </span>
          </div>
        </Command>
      </Command.Dialog>
    </CommandBarContext.Provider>
  );
}

function CommandRow({
  action,
  onRun,
}: {
  action: Action;
  onRun: (a: Action) => void;
}) {
  return (
    <Command.Item
      value={`${action.label} ${action.keywords}`}
      onSelect={() => onRun(action)}
      className="text-fg-muted data-[selected=true]:bg-bg-muted data-[selected=true]:text-fg flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm"
    >
      <span className="text-fg-subtle flex h-4 w-4 items-center justify-center">
        {action.icon}
      </span>
      <span>{action.label}</span>
    </Command.Item>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="border-border bg-bg text-fg-muted ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded border px-1.5 font-mono text-[10px]">
      {children}
    </kbd>
  );
}

function sectionLabel(section: Action["section"]): string {
  return section;
}
