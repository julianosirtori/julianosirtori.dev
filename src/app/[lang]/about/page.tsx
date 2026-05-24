import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { experiences, recommendations } from "@/data/about";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

dayjs.extend(relativeTime);

export interface AboutProps {
  params: Promise<{
    lang: string;
  }>;
}

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
        <div className="relative h-[320px] w-full shrink-0 md:h-[360px] md:w-[40%]">
          <Image
            fill
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAP0lEQVQImQE0AMv/AFBQUJKSkqmpqaOjowCurq7v7+/Jycm5ubkA////jIyMn5+fg4ODADAwMD09PWlpaQAAAApRGnEHblMWAAAAAElFTkSuQmCC"
            priority
            className="rounded-lg object-cover"
            src="/images/juliano2.jpg"
            alt="juliano"
          />
        </div>

        <div className="text-fg-muted flex flex-col gap-4 leading-relaxed">
          <p>
            {t.rich("bio.phrase1", {
              important: (chunks) => (
                <strong className="text-fg font-medium">{chunks}</strong>
              ),
            })}
          </p>
          <p>
            {t.rich("bio.phrase2", {
              important: (chunks) => (
                <strong className="text-fg font-medium">{chunks}</strong>
              ),
            })}
          </p>
          <p>
            {t.rich("bio.phrase3", {
              important: (chunks) => (
                <strong className="text-fg font-medium">{chunks}</strong>
              ),
            })}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-fg mb-6 text-2xl font-medium tracking-tight">
          {t("career")}
        </h2>
        <ul className="flex flex-col gap-8">
          {experiences.map((item, index) => (
            <li key={index} className="border-border border-l-2 pl-5">
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

      <section>
        <h2 className="text-fg mb-6 text-2xl font-medium tracking-tight">
          {t("recommendations")}
        </h2>
        <ul className="flex flex-col gap-8">
          {recommendations.map((item, index) => (
            <li key={index} className="border-border border-l-2 pl-5">
              <h3 className="text-fg flex flex-row items-center gap-1 text-base">
                <Link
                  href={item.linkedIn}
                  className="flex flex-row items-center gap-2"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-fg-subtle text-sm">· {item.role}</span>
                  <LinkedInLogoIcon className="text-fg-muted" />
                </Link>
              </h3>
              {item.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-fg-muted mt-2 text-sm leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
