// Every install command on the site is generated here from the skill data.
// Only flags documented in the skills CLI README are used: --skill, -g, -a.

import { getSkillAgent, type SkillAgentId } from "@/data/skill-agents";
import { SKILLS_REPO, SKILLS_REPO_URL } from "./constants";

export type InstallMethod =
  | "npx"
  | `npx-${SkillAgentId}`
  | "claude-plugin"
  | "manual"
  | "prompt"
  | "link";

export const MANUAL_CLONE_DIR = "~/Developer/skills";

export function npxInstallCommand(name: string, agent?: SkillAgentId): string {
  const base = `npx skills add ${SKILLS_REPO} --skill ${name} -g`;
  return agent ? `${base} -a ${agent}` : base;
}

export function npxInstallMethod(agent?: SkillAgentId): InstallMethod {
  return agent ? `npx-${agent}` : "npx";
}

export function pluginInstallCommands(
  plugin: string,
  marketplace: string,
): [string, string] {
  return [
    `/plugin marketplace add ${SKILLS_REPO}`,
    `/plugin install ${plugin}@${marketplace}`,
  ];
}

export function manualInstallCommands(
  name: string,
  agent: SkillAgentId,
): [string, string] {
  const target = getSkillAgent(agent).userDirs[0];
  return [
    `git clone ${SKILLS_REPO_URL}.git ${MANUAL_CLONE_DIR}`,
    `ln -s ${MANUAL_CLONE_DIR}/skills/${name} ${target}${name}`,
  ];
}
