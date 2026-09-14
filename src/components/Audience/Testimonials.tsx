import Image from "next/image";
import { recommendations } from "@/data/testimonials";
import { copyFor } from "./copy";
export function TestimonialWall({ lang }: { lang: string }) {
  const t = copyFor(lang);
  return (
    <section id="recommendations" className="scroll-mt-32 py-14">
      <h2 className="mb-8 text-2xl font-semibold tracking-tight">
        {t.recommendations}
      </h2>
      <div className="space-y-5">
        {recommendations.map((item) => (
          <figure
            key={item.name}
            className="border-border bg-bg-elevated rounded-lg border p-6 sm:p-8"
          >
            <figcaption className="mb-5 flex items-center gap-3">
              {item.photo && item.photoAuthorized ? (
                <Image
                  src={item.photo}
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="bg-accent-muted text-accent flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                >
                  {item.name
                    .split(" ")
                    .filter((_, i, all) => i === 0 || i === all.length - 1)
                    .map((s) => s[0])
                    .join("")}
                </span>
              )}
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-fg-muted mt-1 text-sm">{item.role}</p>
              </div>
            </figcaption>
            <blockquote
              lang={item.originalLanguage}
              className="text-fg-muted space-y-3 text-[15px] leading-relaxed"
            >
              {item.content.map((text, index) => (
                <p key={index}>{text}</p>
              ))}
            </blockquote>
            <p className="text-fg-muted mt-5 text-xs">
              {t.original} ·{" "}
              {item.originalLanguage === "pt" ? "Português" : "English"}
            </p>
            <a
              className="text-accent mt-1 inline-flex min-h-11 items-center text-sm"
              href={item.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.source}
            </a>
          </figure>
        ))}
      </div>
    </section>
  );
}
