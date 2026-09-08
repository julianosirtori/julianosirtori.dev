import {
  ArrowDownIcon,
  ArrowTopRightIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { experiences } from "@/data/about";
import { Link } from "@/locales/navigation";

export interface AboutProps {
  params: Promise<{
    lang: string;
  }>;
}

const notes = ["beginnings", "teamwork", "learning"] as const;

export default async function About({ params }: AboutProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("about");
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(date));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-5 pt-12 pb-20 lg:gap-20 lg:pt-24">
      <header className="grid grid-cols-[minmax(0,1fr)_88px] items-start gap-x-5 gap-y-7 sm:grid-cols-[minmax(0,1fr)_120px] md:grid-cols-[minmax(0,1fr)_200px] md:gap-x-12 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-x-16">
        <h1 className="text-fg max-w-[18ch] text-3xl leading-tight font-medium tracking-tight sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <div className="col-span-2 md:col-span-1 md:col-start-1">
          <p className="text-fg max-w-[65ch] text-lg leading-relaxed">
            {t.rich("intro.lead", {
              important: (chunks) => (
                <strong className="font-medium">{chunks}</strong>
              ),
            })}
          </p>
          <p className="text-fg-muted mt-5 max-w-[65ch] text-base leading-7">
            {t("intro.context")}
          </p>
          <nav
            aria-label={t("navigation.label")}
            className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm"
          >
            <a
              href="#experience"
              className="text-fg hover:text-accent focus-visible:ring-accent inline-flex items-center gap-2 rounded-sm py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {t("career")}
              <ArrowDownIcon aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
            <a
              href="#more-about"
              className="text-fg-muted hover:text-fg focus-visible:ring-accent inline-flex items-center gap-2 rounded-sm py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {t("notes.title")}
              <ArrowDownIcon aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
        <div className="relative col-start-2 row-start-1 aspect-[4/5] w-full overflow-hidden rounded-lg md:[grid-row:1/span_2] md:mt-2">
          <Image
            fill
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAP0lEQVQImQE0AMv/AFBQUJKSkqmpqaOjowCurq7v7+/Jycm5ubkA////jIyMn5+fg4ODADAwMD09PWlpaQAAAApRGnEHblMWAAAAAElFTkSuQmCC"
            priority
            sizes="(min-width: 1024px) 240px, (min-width: 768px) 200px, (min-width: 640px) 120px, 88px"
            className="object-cover"
            src="/images/juliano2.jpg"
            alt="Juliano Sirtori"
          />
        </div>
      </header>

      <section
        id="experience"
        aria-labelledby="experience-title"
        className="scroll-mt-36"
      >
        <div className="mb-7">
          <h2
            id="experience-title"
            className="text-fg text-2xl font-medium tracking-tight"
          >
            {t("career")}
          </h2>
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            {t("experienceHint")}
          </p>
        </div>
        <div className="border-border border-t">
          {experiences.map((item, index) => (
            <details
              key={item.id}
              id={`experience-${item.id}`}
              className="group border-border scroll-mt-36 border-b"
              open={index === 0}
            >
              <summary className="focus-visible:ring-accent flex cursor-pointer list-none items-start gap-4 rounded-sm py-5 focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <span className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <span className="min-w-0">
                    <span className="text-fg group-hover:text-accent block text-lg font-medium transition-colors">
                      {item.company}
                    </span>
                    <span className="text-fg-muted mt-1 block text-sm leading-relaxed">
                      {t(`experience.${item.id}.role`)}
                    </span>
                  </span>
                  <span className="text-fg-muted shrink-0 font-mono text-xs leading-7">
                    {item.startDate.slice(0, 4)} —{" "}
                    {item.endDate ? item.endDate.slice(0, 4) : t("present")}
                  </span>
                </span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="text-fg-muted mt-1.5 h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>

              <div className="pb-7">
                <p className="text-fg-muted mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span>
                    <time dateTime={item.startDate}>
                      {formatDate(item.startDate)}
                    </time>
                    {" — "}
                    {item.endDate ? (
                      <time dateTime={item.endDate}>
                        {formatDate(item.endDate)}
                      </time>
                    ) : (
                      t("present")
                    )}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t(`experience.${item.id}.location`)}</span>
                </p>
                <div className="text-fg-muted flex max-w-[72ch] flex-col gap-4 text-base leading-7">
                  <p>{t(`experience.${item.id}.context`)}</p>
                  <p>{t(`experience.${item.id}.contribution`)}</p>
                </div>
                <div className="mt-5 max-w-[72ch]">
                  <p className="text-fg mb-2 text-xs font-medium">
                    {t("technologies")}
                  </p>
                  <ul className="text-fg-muted flex flex-wrap gap-x-4 gap-y-1 text-xs leading-relaxed">
                    {item.skills.split(" · ").map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <a
                  href={item.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted hover:text-accent focus-visible:ring-accent mt-5 inline-flex items-center gap-1.5 rounded-sm py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {t("companyWebsite", { company: item.company })}
                  <ArrowTopRightIcon
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                  />
                </a>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section
        id="more-about"
        aria-labelledby="more-about-title"
        className="scroll-mt-36"
      >
        <h2
          id="more-about-title"
          className="text-fg mb-7 text-2xl font-medium tracking-tight"
        >
          {t("notes.title")}
        </h2>
        <div className="border-border border-t">
          {notes.map((note) => (
            <details
              key={note}
              id={`about-${note}`}
              className="group border-border scroll-mt-36 border-b"
            >
              <summary className="focus-visible:ring-accent flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-5 focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <span className="text-fg group-hover:text-accent text-base font-medium transition-colors">
                  {t(`notes.${note}.title`)}
                </span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="text-fg-muted h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <div className="text-fg-muted flex max-w-[72ch] flex-col gap-4 pb-7 text-base leading-7">
                <p>{t(`notes.${note}.p1`)}</p>
                <p>{t(`notes.${note}.p2`)}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <p className="text-fg-muted text-base leading-relaxed">
        {t("contact.prompt")}{" "}
        <Link
          href="/work-with-me"
          className="text-fg border-border hover:border-accent hover:text-accent focus-visible:ring-accent rounded-sm border-b pb-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {t("contact.cta")}
        </Link>
      </p>
    </main>
  );
}
