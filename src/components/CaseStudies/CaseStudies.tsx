import { publishedCases } from "@/data/cases";

export interface CaseStudiesProps {
  lang: string;
  title: string;
  intro: string;
  stackLabel: string;
}

/** Cases with published numbers. Renders nothing while none have numbers. */
export function CaseStudies({
  lang,
  title,
  intro,
  stackLabel,
}: CaseStudiesProps) {
  const items = publishedCases(lang);
  if (items.length === 0) return null;

  return (
    <section
      id="cases"
      aria-labelledby="cases-title"
      className="border-border scroll-mt-32 border-b py-14"
    >
      <h2
        id="cases-title"
        className="text-fg mb-4 text-2xl font-semibold tracking-tight"
      >
        {title}
      </h2>
      <p className="text-fg-muted mb-10 max-w-[62ch] text-[15px] leading-relaxed">
        {intro}
      </p>
      <ul className="grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="border-border bg-bg-elevated flex flex-col rounded-lg border p-6"
          >
            <p className="text-accent font-mono text-xs tracking-[0.12em] uppercase">
              {item.company}
            </p>
            <h3 className="text-fg mt-2 text-lg font-semibold tracking-tight">
              {item.title}
            </h3>
            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
              {item.metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col-reverse">
                  <dt className="text-fg-muted text-sm">{metric.label}</dt>
                  <dd className="text-fg text-2xl font-semibold tracking-tight">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-fg-muted mt-5 text-sm leading-relaxed">
              {item.summary}
            </p>
            <p className="text-fg-subtle mt-auto pt-5 font-mono text-xs">
              <span className="sr-only">{stackLabel}: </span>
              {item.stack}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
