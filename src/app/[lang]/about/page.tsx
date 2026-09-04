import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { experiences } from "@/data/about";

dayjs.extend(relativeTime);

export interface AboutProps {
  params: Promise<{
    lang: string;
  }>;
}

const bioKeys = [
  "bio.phrase1",
  "bio.phrase2",
  "bio.phrase3",
  "bio.phrase4",
  "bio.phrase5",
  "bio.phrase6",
  "bio.phrase7",
] as const;

export default async function About({ params }: AboutProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("about");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-5 pt-24 pb-20 lg:pt-32">
      <header>
        <h1 className="text-fg mb-3 text-4xl font-medium tracking-tight md:text-5xl">
          {t("title")}
        </h1>
      </header>

      <section className="flex w-full flex-col gap-8 md:flex-row md:items-start">
        <div className="relative h-[320px] w-full shrink-0 md:sticky md:top-28 md:h-[360px] md:w-[40%]">
          <Image
            fill
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAP0lEQVQImQE0AMv/AFBQUJKSkqmpqaOjowCurq7v7+/Jycm5ubkA////jIyMn5+fg4ODADAwMD09PWlpaQAAAApRGnEHblMWAAAAAElFTkSuQmCC"
            priority
            sizes="(min-width: 768px) 300px, calc(100vw - 40px)"
            className="rounded-lg object-cover"
            src="/images/juliano2.jpg"
            alt="Juliano Sirtori"
          />
        </div>

        <div className="text-fg-muted flex flex-col gap-5 leading-relaxed">
          {bioKeys.map((key) => (
            <p key={key}>
              {t.rich(key, {
                important: (chunks) => (
                  <strong className="text-fg font-medium">{chunks}</strong>
                ),
              })}
            </p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-fg mb-6 text-2xl font-medium tracking-tight">
          {t("career")}
        </h2>
        <ul className="flex flex-col gap-8">
          {experiences.map((item) => (
            <li
              key={`${item.company}-${item.startDate}`}
              className="border-border border-l-2 pl-5"
            >
              <h3 className="text-fg text-base font-medium">{item.jobTitle}</h3>
              <p className="text-fg-muted text-sm">
                <a
                  rel="noopener noreferrer"
                  href={item.companyUrl}
                  target="_blank"
                  className="text-fg hover:text-accent border-border hover:border-accent border-b transition-colors"
                >
                  {item.company}
                </a>
                <span className="text-fg-subtle"> · {item.location}</span>
              </p>
              <p className="text-fg-subtle text-sm">
                {dayjs(item.startDate).format("MMM YYYY")}
                <span> – </span>
                {item.endDate
                  ? dayjs(item.endDate).format("MMM YYYY")
                  : "Present"}
                <span> · </span>
                {dayjs(dayjs(item.startDate)).from(dayjs(item.endDate), true)}
              </p>
              <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                {item.skills}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
