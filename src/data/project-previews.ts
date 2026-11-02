// Card previews in public/images/projects, 960x600 (16:10), opaque. Projects
// without one (team cases, offline links) get a drawn cover instead. Kept out
// of projects.ts so the client card doesn't bundle the whole dataset.
export const projectPreviews: Partial<Record<string, string>> = {
  biomoov: "/images/projects/biomoov.webp",
  "morning-paper": "/images/projects/morning-paper.webp",
  "vault-mcp": "/images/projects/vault-mcp.webp",
  "claude-semaforo": "/images/projects/claude-semaforo.webp",
  "minha-capy": "/images/projects/minha-capy.webp",
  "fisio-rotina": "/images/projects/fisio-rotina.webp",
  "fisio-milena-aranha": "/images/projects/fisio-milena-aranha.webp",
  portfolio: "/images/projects/portfolio.webp",
  "aiqfome-magalu": "/images/projects/aiqfome-magalu.webp",
  "aiqfome-orders": "/images/projects/aiqfome-orders.webp",
};
