import { Cwd } from "./types";

export interface FsEntry {
  name: string;
  kind: "dir" | "file";
  path?: Cwd;
}

export const FS: Record<Cwd, FsEntry[]> = {
  "/": [
    { name: "about", kind: "dir", path: "/about" },
    { name: "projects", kind: "dir", path: "/projects" },
    { name: "blog", kind: "dir", path: "/blog" },
    { name: "skills", kind: "dir", path: "/skills" },
    { name: "experience", kind: "dir", path: "/experience" },
    { name: "contact", kind: "dir", path: "/contact" },
    { name: "README.md", kind: "file" },
    { name: ".secrets", kind: "file" },
  ],
  "/about": [
    { name: "me.md", kind: "file" },
    { name: "now.md", kind: "file" },
  ],
  "/projects": [
    { name: "list.txt", kind: "file" },
    { name: "featured.md", kind: "file" },
  ],
  "/blog": [{ name: "recent.md", kind: "file" }],
  "/skills": [{ name: "stack.txt", kind: "file" }],
  "/experience": [{ name: "career.md", kind: "file" }],
  "/contact": [
    { name: "email.txt", kind: "file" },
    { name: "social.md", kind: "file" },
  ],
};

export function resolvePath(cwd: Cwd, target: string): Cwd | null {
  if (!target || target === "." || target === "./") return cwd;
  if (target === "/" || target === "~") return "/";
  if (target === "..") return cwd === "/" ? "/" : "/";

  const normalized = target.startsWith("/")
    ? target
    : cwd === "/"
      ? `/${target}`
      : `${cwd}/${target}`;
  const cleaned =
    ("/" + normalized.replace(/^\/+/, "")).replace(/\/+$/, "") || "/";

  if (cleaned in FS) return cleaned as Cwd;
  return null;
}

export function listDir(cwd: Cwd): FsEntry[] {
  return FS[cwd] ?? [];
}
