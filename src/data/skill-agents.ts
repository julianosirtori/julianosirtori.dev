// Agents the install block knows about. Ids are the `-a, --agent` values of the
// skills CLI (github.com/vercel-labs/skills). Folders are copied from the README
// of github.com/julianosirtori/skills; update both together. Codex was checked
// against the official Codex docs, which also read skills from ~/.agents/skills.

export type SkillAgentId =
  | "claude-code"
  | "opencode"
  | "codex"
  | "cursor"
  | "gemini-cli"
  | "github-copilot";

export interface SkillAgent {
  id: SkillAgentId;
  name: string;
  group: "featured" | "other";
  /** User-level folders. The first one is the target of the manual `ln -s`. */
  userDirs: string[];
  projectDir: string;
}

export const SKILL_AGENTS: SkillAgent[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    group: "featured",
    userDirs: ["~/.claude/skills/"],
    projectDir: ".claude/skills/",
  },
  {
    id: "opencode",
    name: "OpenCode",
    group: "featured",
    userDirs: [
      "~/.config/opencode/skills/",
      "~/.claude/skills/",
      "~/.agents/skills/",
    ],
    projectDir: ".opencode/skills/",
  },
  {
    id: "codex",
    name: "Codex",
    group: "featured",
    userDirs: ["~/.agents/skills/"],
    projectDir: ".agents/skills/",
  },
  {
    id: "cursor",
    name: "Cursor",
    group: "other",
    userDirs: ["~/.cursor/skills/", "~/.agents/skills/"],
    projectDir: ".cursor/skills/",
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    group: "other",
    userDirs: ["~/.gemini/skills/", "~/.agents/skills/"],
    projectDir: ".gemini/skills/",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    group: "other",
    userDirs: ["~/.copilot/skills/", "~/.agents/skills/"],
    projectDir: ".github/skills/",
  },
];

export function getSkillAgent(id: SkillAgentId): SkillAgent {
  const agent = SKILL_AGENTS.find((item) => item.id === id);
  if (!agent) throw new Error(`Unknown agent ${id}`);
  return agent;
}
