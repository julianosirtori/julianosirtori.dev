// Trimmed copy of skills/mac-cleanup from github.com/julianosirtori/skills
// (MIT), plus probes the e2e suite uses: a relative link, raw HTML that must be
// sanitized, and safe HTML that must survive.

export const MAC_CLEANUP_SKILL_MD = `---
name: mac-cleanup
description: Analyze and safely free up disk space on macOS. Measures what is using storage (~/Library, Caches, Containers, Group Containers, Application Support, Photos, iCloud Drive, WhatsApp, Homebrew, node_modules, Xcode, Docker, /Library, /usr/local, Applications), cleans only caches that rebuild themselves, finds leftovers of uninstalled apps, and guides the removals that need the user's judgment. Use this whenever the user says their Mac is full or low on storage, asks what they can delete, wants to free space or clear caches, asks why a folder or app is so big, or an uninstaller failed and left files behind, even if they never say "cleanup" (e.g. "meu mac está sem espaço", "o que posso apagar?", "why is ~/Library 60 GB?").
license: MIT
compatibility: macOS 13 or later. Uses the stock bash 3.2, du, df, mdfind, plutil and codesign; optionally brew, npm, pnpm, pip, jq and sqlite3 when present.
allowed-tools: Bash(bash scripts/scan.sh:*) Read Glob
metadata:
  author: julianosirtori
  version: "1.0.0"
---

# Mac Cleanup

Free disk space on a Mac without losing anything the user cares about.

Most of a full disk is usually a handful of things. See [the locations guide](references/locations.md) before advising on a location.

<script>window.__skillXss = true</script>

<p>Raw <a href="javascript:window.__skillXss=true" onclick="window.__skillXss=true">unsafe link</a> stays inert.</p>

<details><summary>Why measure first</summary>Folder names mislead.</details>

## Three tiers

| Tier | What | How to act |
|---|---|---|
| **A. Regenerable** | Caches and build artifacts that tools recreate on demand | Clean with \`scripts/safe-clean.sh --apply\`. |
| **B. User's call** | Documents, downloads, media, chats | Act only on what the user picks. |
| **C. Do not touch** | Inside \`*.photoslibrary\`, the sealed system volume | Explain why it is off-limits. |

## Ground rules, and why

- **Measure first.** Never estimate sizes or guess what a folder is.
- **Reversible by default.** Anything that is not a cache goes to the Trash.

## Workflow

### 1. Baseline

\`\`\`bash
bash <skill-dir>/scripts/scan.sh
\`\`\`

### 2. Quick wins (tier A)

\`\`\`bash
bash <skill-dir>/scripts/safe-clean.sh          # dry run: what would be freed
bash <skill-dir>/scripts/safe-clean.sh --apply  # after the user agrees
\`\`\`

## Automation

If the user wants this to happen on its own, the tier A cleanup can run monthly via \`launchd\`; \`references/automation.md\` has a ready LaunchAgent.
`;

export const MAC_CLEANUP_FILES: Record<string, string> = {
  "references/automation.md": "# Automation\n",
  "references/locations.md": "# Locations\n",
  "references/uninstall.md": "# Uninstall\n",
  "scripts/leftovers.sh": "#!/usr/bin/env bash\necho leftovers\n",
  "scripts/safe-clean.sh": "#!/usr/bin/env bash\necho safe-clean\n",
  "scripts/scan.sh": "#!/usr/bin/env bash\necho scan\n",
};

export const MAC_CLEANUP_PLUGIN = {
  name: "mac-cleanup",
  source: "./",
  strict: false,
  description:
    "Analyze and safely free up disk space on macOS: measures what uses storage, cleans only caches that rebuild themselves, finds leftovers of uninstalled apps and guides the removals that need your judgment.",
  version: "1.0.0",
  license: "MIT",
  keywords: ["macos", "disk-space", "cleanup", "storage", "caches"],
  category: "productivity",
  skills: ["./skills/mac-cleanup"],
};
