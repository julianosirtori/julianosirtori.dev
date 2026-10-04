"use client";

import { useTranslations } from "next-intl";

import { CommandSnippet } from "@/components/CommandSnippet";
import { SKILL_AGENTS, type SkillAgentId } from "@/data/skill-agents";
import { manualInstallCommands } from "@/lib/skills/commands";

export interface ManualInstallProps {
  slug: string;
  agent: SkillAgentId;
  onAgentChange: (agent: SkillAgentId) => void;
  onCopied: () => void;
}

/** "Install by hand": clone, link into the chosen agent's folder, folder table. */
export function ManualInstall({
  slug,
  agent,
  onAgentChange,
  onCopied,
}: ManualInstallProps) {
  const t = useTranslations("skills");
  const [clone, link] = manualInstallCommands(slug, agent);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-fg-muted max-w-[64ch] text-sm leading-relaxed">
        {t("install.manual.text")}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="manual-install-agent" className="text-fg-muted text-sm">
          {t("install.manual.agentLabel")}
        </label>
        <select
          id="manual-install-agent"
          value={agent}
          onChange={(event) =>
            onAgentChange(event.target.value as SkillAgentId)
          }
          className="border-border bg-bg-elevated text-fg focus:border-accent focus:ring-accent h-11 rounded-md border px-3 text-sm focus:ring-1 focus:outline-none"
        >
          {SKILL_AGENTS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <CommandSnippet
        label={t("install.manual.step1")}
        text={clone}
        copyContext={t("copy.context.manualStep", { step: 1 })}
        onCopied={onCopied}
      />
      <CommandSnippet
        label={t("install.manual.step2")}
        text={link}
        copyContext={t("copy.context.manualStep", { step: 2 })}
        onCopied={onCopied}
      />
      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-left">
          <caption className="sr-only">
            {t("install.manual.tableCaption")}
          </caption>
          <thead>
            <tr className="border-border border-b">
              {(["colAgent", "colUser", "colProject"] as const).map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="text-fg-muted py-2 pr-4 text-xs font-medium whitespace-nowrap"
                >
                  {t(`install.manual.${key}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SKILL_AGENTS.map((item) => (
              <tr
                key={item.id}
                className={`border-border border-b ${item.id === agent ? "bg-bg-muted" : ""}`}
              >
                <th
                  scope="row"
                  className="text-fg py-2 pr-4 font-mono text-xs font-normal whitespace-nowrap"
                >
                  {item.name}
                </th>
                <td className="text-fg-muted py-2 pr-4 font-mono text-xs">
                  {item.userDirs.map((dir) => (
                    <span key={dir} className="block whitespace-nowrap">
                      {dir}
                    </span>
                  ))}
                </td>
                <td className="text-fg-muted py-2 pr-4 font-mono text-xs whitespace-nowrap">
                  {item.projectDir}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-fg-muted max-w-[64ch] text-sm leading-relaxed">
        {t("install.manual.projectHint")}
      </p>
    </div>
  );
}
