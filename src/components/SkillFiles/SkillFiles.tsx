import { ArrowTopRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";

import { SkillSourceLink } from "@/components/SkillSourceLink";
import { SKILLS_DIR, repoBlobUrl } from "@/lib/skills/constants";
import { formatFileSize } from "@/lib/skills/format";
import type { SkillFile } from "@/lib/skills/types";

export interface SkillFilesProps {
  slug: string;
  sha: string;
  files: SkillFile[];
  locale: string;
}

const COLLAPSE_AFTER = 20;

interface FileGroup {
  folder: string | null;
  files: SkillFile[];
}

/** SKILL.md first, then other root files, then each folder alphabetically. */
export function groupSkillFiles(files: SkillFile[]): FileGroup[] {
  const root = files
    .filter((file) => !file.path.includes("/"))
    .sort((a, b) =>
      a.path === "SKILL.md"
        ? -1
        : b.path === "SKILL.md"
          ? 1
          : a.path.localeCompare(b.path),
    );
  const folders = new Map<string, SkillFile[]>();
  for (const file of files) {
    const slash = file.path.indexOf("/");
    if (slash === -1) continue;
    const folder = file.path.slice(0, slash);
    folders.set(folder, [...(folders.get(folder) ?? []), file]);
  }
  return [
    ...(root.length ? [{ folder: null, files: root }] : []),
    ...[...folders.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([folder, items]) => ({
        folder,
        files: items.sort((a, b) => a.path.localeCompare(b.path)),
      })),
  ];
}

export async function SkillFiles({
  slug,
  sha,
  files,
  locale,
}: SkillFilesProps) {
  const t = await getTranslations("skills.detail");

  const fileLink = (file: SkillFile, name: string) => (
    <SkillSourceLink
      href={repoBlobUrl(sha, `${SKILLS_DIR}/${slug}/${file.path}`)}
      slug={slug}
      newTabLabel={t("newTab")}
      className="group text-fg hover:text-accent focus-visible:ring-accent flex min-h-9 items-center justify-between gap-4 rounded-sm font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
    >
      <span className="min-w-0 [overflow-wrap:anywhere]">{name}</span>
      <span className="text-fg-muted flex shrink-0 items-center gap-2 text-xs tabular-nums">
        {formatFileSize(file.size, locale)}
        <ArrowTopRightIcon aria-hidden="true" className="h-3 w-3" />
      </span>
    </SkillSourceLink>
  );

  const list = (
    <div className="flex flex-col gap-2">
      {groupSkillFiles(files).map((group) =>
        group.folder === null ? (
          <ul key="root">
            {group.files.map((file) => (
              <li key={file.path}>{fileLink(file, file.path)}</li>
            ))}
          </ul>
        ) : (
          <div key={group.folder}>
            <p className="text-fg-muted font-mono text-xs">{group.folder}/</p>
            <ul className="border-border mt-1 ml-1 border-l pl-4">
              {group.files.map((file) => (
                <li key={file.path}>
                  {fileLink(file, file.path.slice(group.folder!.length + 1))}
                </li>
              ))}
            </ul>
          </div>
        ),
      )}
    </div>
  );

  if (files.length <= COLLAPSE_AFTER) return list;

  return (
    <details className="group">
      <summary className="text-fg hover:text-accent focus-visible:ring-accent flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-sm text-sm font-medium focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        {t("details.showAllFiles", { count: files.length })}
        <ChevronDownIcon
          aria-hidden="true"
          className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="pt-2">{list}</div>
    </details>
  );
}
