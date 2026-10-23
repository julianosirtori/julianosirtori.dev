import { allPosts } from "contentlayer/generated";
import { getCatalogResult } from "@/lib/skills/catalog";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

export async function GET() {
  const posts = allPosts
    .filter((post) => post.language === "en" && !post.draft)
    .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1))
    .slice(0, 8)
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/en/blog/${post.slug}): ${post.description}`,
    );

  const catalog = await getCatalogResult({ allowRequestOverride: false });
  const skills = catalog.status === "ok" ? catalog.catalog.skills : [];
  const skillLines = skills
    .slice(0, 10)
    .map(
      (skill) =>
        `- [${skill.slug}](${SITE_URL}/en/skills/${skill.slug}): ${skill.description}`,
    );

  const txt = `# Juliano Sirtori

> Full-stack software engineer available for freelance work: web apps, mobile apps, AI agents, and system architecture, end to end. Based in Brazil, working with clients worldwide. Official site: ${SITE_URL}.

Contact: julianosirtori@gmail.com. LinkedIn https://www.linkedin.com/in/juliano-sirtori/. GitHub https://github.com/julianosirtori.

## Hire me
- [Work with me](${SITE_URL}/en/work-with-me): availability, how I work, and how to start a project
- [About](${SITE_URL}/en/about): background and experience
- [Projects](${SITE_URL}/en/projects): shipped work for clients and personal projects

## Agent skills
- [Agent skills catalog](${SITE_URL}/en/skills): skills I use with coding agents, published as reusable SKILL.md files
${skillLines.join("\n")}

## Blog
- [Writing](${SITE_URL}/en/blog): articles on web development, AI agents, and software engineering
${posts.join("\n")}
`;

  return new Response(txt, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
