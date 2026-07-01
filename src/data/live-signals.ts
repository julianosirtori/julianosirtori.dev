export interface Signal {
  label: string;
  value: string;
  meta?: string;
}

// Static "live signals" cards shown on the home page. Placeholder/demo values,
// edit them by hand. The "last article" card is rendered separately from real
// Contentlayer data in the home page.
export const liveSignals: Record<"en" | "pt", Signal[]> = {
  en: [
    {
      label: "Last commit",
      value: "feat: newsletter opt-in",
      meta: "2 days ago",
    },
    {
      label: "Reading",
      value: "Designing Data-Intensive Applications",
      meta: "M. Kleppmann",
    },
    { label: "Studying", value: "RAG and evals", meta: "LLM apps" },
  ],
  pt: [
    {
      label: "Último commit",
      value: "feat: newsletter opt-in",
      meta: "há 2 dias",
    },
    {
      label: "Lendo",
      value: "Designing Data-Intensive Applications",
      meta: "M. Kleppmann",
    },
    { label: "Estudando", value: "RAG e evals", meta: "apps com LLM" },
  ],
};
