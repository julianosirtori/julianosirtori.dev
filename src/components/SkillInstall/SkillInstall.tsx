"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

import { textButtonClass } from "@/components/Audience/copy";
import { CommandSnippet } from "@/components/CommandSnippet";
import { CopyButton } from "@/components/CopyButton";
import { Callout } from "@/components/Mdx/Callout";
import { SkillSourceLink } from "@/components/SkillSourceLink";
import {
  SKILL_AGENTS,
  getSkillAgent,
  type SkillAgentId,
} from "@/data/skill-agents";
import { track } from "@/lib/analytics";
import {
  npxInstallCommand,
  npxInstallMethod,
  pluginInstallCommands,
  type InstallMethod,
} from "@/lib/skills/commands";
import { skillFolderUrl } from "@/lib/skills/constants";
import type { SkillPlugin } from "@/lib/skills/types";

import { ManualInstall } from "./ManualInstall";

type TabId = "any" | "claude-code" | "opencode" | "codex" | "other";

const TABS: { id: TabId; label: string }[] = [
  { id: "any", label: "any" },
  { id: "claude-code", label: "claudeCode" },
  { id: "opencode", label: "opencode" },
  { id: "codex", label: "codex" },
  { id: "other", label: "other" },
];

const OTHER_AGENTS = SKILL_AGENTS.filter((agent) => agent.group === "other");

export interface SkillInstallProps {
  slug: string;
  plugin?: SkillPlugin;
  scriptsCount: number;
  className?: string;
}

/** Highlights the only part that changes between agent tabs. */
function AgentCommand({ slug, agent }: { slug: string; agent: SkillAgentId }) {
  return (
    <>
      {npxInstallCommand(slug)}{" "}
      <span className="bg-accent-muted text-fg rounded-[3px]">-a {agent}</span>
    </>
  );
}

export function SkillInstall({
  slug,
  plugin,
  scriptsCount,
  className = "",
}: SkillInstallProps) {
  const t = useTranslations("skills");
  const [tab, setTab] = useState<TabId>("any");
  const [manualAgent, setManualAgent] = useState<SkillAgentId>("claude-code");
  const [announcement, setAnnouncement] = useState("");
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
  const [linkFailed, setLinkFailed] = useState(false);
  const linkRef = useRef<HTMLParagraphElement>(null);
  const githubUrl = skillFolderUrl(slug);

  // Same fallback as the command snippets: when the Clipboard API fails, the
  // link appears as text, already selected, so it can be copied by hand.
  useEffect(() => {
    const node = linkRef.current;
    const selection = window.getSelection();
    if (!linkFailed || !node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }, [linkFailed]);

  const code = (chunks: ReactNode) => (
    <code className="bg-bg-muted text-fg rounded-[3px] px-1 font-mono text-[0.85em]">
      {chunks}
    </code>
  );

  // One live region for the whole section. Clearing first makes screen
  // readers repeat the message on consecutive copies.
  const copied = (
    method: InstallMethod,
    kind: "command" | "link" | "prompt",
  ) => {
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(t(`copy.announce.${kind}`)));
    track("skill_install_copy", {
      location: "skills",
      content_id: slug,
      action_id: method,
    });
  };

  const select = (next: TabId, focus = false) => {
    setTab(next);
    if (next !== "any" && next !== "other") setManualAgent(next);
    const button = tabRefs.current[next];
    if (!button) return;
    if (focus) button.focus();
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    button.scrollIntoView?.({
      block: "nearest",
      inline: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((item) => item.id === tab);
    const targets: Record<string, number> = {
      ArrowRight: (index + 1) % TABS.length,
      ArrowLeft: (index - 1 + TABS.length) % TABS.length,
      Home: 0,
      End: TABS.length - 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    select(TABS[targets[event.key]].id, true);
  };

  const hint = (children: ReactNode, key?: string) => (
    <p key={key} className="text-fg-muted max-w-[64ch] text-sm leading-relaxed">
      {children}
    </p>
  );

  const agentPanel = (agent: SkillAgentId) => {
    const { name } = getSkillAgent(agent);
    return (
      <>
        <CommandSnippet
          label={t("install.context.terminal")}
          text={npxInstallCommand(slug, agent)}
          copyContext={t("copy.context.command", { agent: name })}
          onCopied={() => copied(npxInstallMethod(agent), "command")}
        >
          <AgentCommand slug={slug} agent={agent} />
        </CommandSnippet>
        {hint(
          t.rich("install.hints.agent", { code, agentId: agent, agent: name }),
        )}
      </>
    );
  };

  const panels: Record<TabId, ReactNode> = {
    any: (
      <>
        <CommandSnippet
          label={t("install.context.terminal")}
          text={npxInstallCommand(slug)}
          copyContext={t("copy.context.command", {
            agent: t("copy.context.anyAgent"),
          })}
          onCopied={() => copied("npx", "command")}
        />
        {hint(t.rich("install.hints.any", { code }))}
      </>
    ),
    "claude-code": (
      <>
        {agentPanel("claude-code")}
        {hint(t.rich("install.hints.claudeCode", { code, name: slug }))}
        {plugin && (
          <div className="border-border mt-4 flex flex-col gap-3 border-t pt-5">
            <h3 className="text-fg text-base font-medium">
              {t("install.plugin.title")}
            </h3>
            {hint(
              t.rich("install.plugin.hint", {
                code,
                plugin: plugin.name,
                name: slug,
              }),
            )}
            {pluginInstallCommands(plugin.name, plugin.marketplace).map(
              (command, index) => (
                <CommandSnippet
                  key={command}
                  label={t(
                    index === 0
                      ? "install.plugin.step1"
                      : "install.plugin.step2",
                  )}
                  text={command}
                  copyContext={t("copy.context.pluginStep", {
                    step: index + 1,
                  })}
                  onCopied={() => copied("claude-plugin", "command")}
                />
              ),
            )}
          </div>
        )}
      </>
    ),
    opencode: agentPanel("opencode"),
    codex: (
      <>
        {agentPanel("codex")}
        {hint(t("install.hints.restart"))}
      </>
    ),
    other: (
      <>
        {OTHER_AGENTS.map((agent) => (
          <CommandSnippet
            key={agent.id}
            label={agent.name}
            text={npxInstallCommand(slug, agent.id)}
            copyContext={t("copy.context.command", { agent: agent.name })}
            onCopied={() => copied(npxInstallMethod(agent.id), "command")}
          >
            <AgentCommand slug={slug} agent={agent.id} />
          </CommandSnippet>
        ))}
        {hint(t("install.hints.other"))}
      </>
    ),
  };

  const summaryClass =
    "text-fg hover:text-accent focus-visible:ring-accent flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden";
  const chevron = (
    <ChevronDownIcon
      aria-hidden="true"
      className="text-fg-muted h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
    />
  );

  return (
    <section
      id="install"
      aria-labelledby="install-title"
      className={`min-w-0 scroll-mt-36 sm:scroll-mt-28 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2
          id="install-title"
          className="text-fg text-2xl font-semibold tracking-tight"
        >
          {t("install.title")}
        </h2>
        <CopyButton
          text={githubUrl}
          label={t("install.copyLink")}
          copiedLabel={t("install.linkCopied")}
          icon="link"
          className={textButtonClass}
          onCopied={() => {
            setLinkFailed(false);
            copied("link", "link");
          }}
          onError={() => setLinkFailed(true)}
        />
      </div>
      {linkFailed && (
        <div className="mt-3">
          <p
            ref={linkRef}
            className="bg-bg-muted border-border text-fg rounded-md border px-3 py-2 font-mono text-sm [overflow-wrap:anywhere]"
          >
            {githubUrl}
          </p>
          <p
            role="alert"
            className="text-fg-muted mt-2 flex items-start gap-2 text-sm"
          >
            <ExclamationTriangleIcon
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            {t("copy.failed")}
          </p>
        </div>
      )}

      <div
        role="tablist"
        aria-label={t("install.tabsLabel")}
        onKeyDown={onTabKeyDown}
        className="border-border no-scrollbar -mx-5 mt-5 flex gap-6 overflow-x-auto border-b px-5 sm:mx-0 sm:gap-7 sm:px-0"
      >
        {TABS.map((item) => {
          const active = item.id === tab;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[item.id] = element;
              }}
              type="button"
              role="tab"
              id={`install-tab-${item.id}`}
              aria-selected={active}
              aria-controls={`install-panel-${item.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => select(item.id)}
              className="text-fg-muted hover:text-fg aria-selected:border-accent aria-selected:text-fg focus-visible:ring-accent -mb-px inline-flex min-h-11 shrink-0 cursor-pointer items-center border-b-2 border-transparent px-0.5 text-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset motion-reduce:transition-none"
            >
              {t(`install.tabs.${item.label}`)}
            </button>
          );
        })}
      </div>

      {TABS.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`install-panel-${item.id}`}
          aria-labelledby={`install-tab-${item.id}`}
          hidden={item.id !== tab}
          className="mt-5 flex flex-col gap-3"
        >
          {panels[item.id]}
        </div>
      ))}

      {scriptsCount > 0 && (
        <Callout tone="warn">
          <p>
            {t("detail.scripts.notice", { count: scriptsCount })}{" "}
            <SkillSourceLink
              href={`${skillFolderUrl(slug)}/scripts`}
              slug={slug}
              newTabLabel={t("detail.newTab")}
              className="text-fg decoration-border-strong hover:text-accent focus-visible:ring-accent rounded-sm underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
            >
              {t("detail.scripts.link", { count: scriptsCount })}
            </SkillSourceLink>
          </p>
        </Callout>
      )}

      <div className="mt-8">
        <h3 className="text-fg-muted mb-2 font-mono text-xs tracking-[0.14em] uppercase">
          {t("install.otherWays")}
        </h3>
        <div className="border-border border-t">
          <details className="group border-border border-b">
            <summary className={summaryClass}>
              {t("install.prompt.title")}
              {chevron}
            </summary>
            <div className="flex flex-col gap-3 pb-6">
              {hint(t("install.prompt.hint"))}
              <CommandSnippet
                label={t("install.context.prompt")}
                text={t("install.prompt.text", {
                  url: skillFolderUrl(slug),
                  command: npxInstallCommand(slug),
                })}
                wrap
                copyContext={t("copy.context.prompt")}
                onCopied={() => copied("prompt", "prompt")}
              />
            </div>
          </details>
          <details className="group border-border border-b">
            <summary className={summaryClass}>
              {t("install.manual.title")}
              {chevron}
            </summary>
            <div className="pb-6">
              <ManualInstall
                slug={slug}
                agent={manualAgent}
                onAgentChange={setManualAgent}
                onCopied={() => copied("manual", "command")}
              />
            </div>
          </details>
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </p>
    </section>
  );
}
