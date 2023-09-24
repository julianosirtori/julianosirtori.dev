import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { experiences, recommendations } from "@/data/about";
import { useTranslations } from "next-intl";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

dayjs.extend(relativeTime);

export default function About() {
  const t = useTranslations("about");

  return (
    <main className="mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col	 px-5 py-nav-height-mobile text-base  leading-8 text-secondary selection:bg-pink selection:text-black lg:py-nav-height-desktop">
      <h1 className="mb-5 text-5xl font-bold text-primary">
        <span className="bg-gradient-to-r from-pink to-purple bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h1>
      <section className="flex w-full flex-col gap-4 md:flex-row md:justify-start">
        <div className="relative h-[400px] w-full lg:w-[40%]">
          <Image
            fill
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAP0lEQVQImQE0AMv/AFBQUJKSkqmpqaOjowCurq7v7+/Jycm5ubkA////jIyMn5+fg4ODADAwMD09PWlpaQAAAApRGnEHblMWAAAAAElFTkSuQmCC"
            priority
            className="rounded-lg object-cover"
            src="/images/juliano.jpeg"
            alt="juliano"
          />
        </div>

        <div className="w-full lg:w-[50%]">
          <p className="m-4">
            {t.rich("bio.phrase1", {
              important: (chunks) => (
                <strong className="text-primary">{chunks}</strong>
              ),
            })}
          </p>
          <p className="m-4">
            {t.rich("bio.phrase2", {
              important: (chunks) => (
                <strong className="text-primary">{chunks}</strong>
              ),
            })}
          </p>
          <p className="m-4">{t("bio.phrase3")}</p>
        </div>
      </section>
      <section className="flex flex-col">
        <h2 className="mt-14 text-2xl font-semibold text-primary">
          {t("recommendations")}
        </h2>
        <ul>
          {recommendations.map((item, index) => (
            <li key={index} className="mb-10">
              <h3 className="mt-5 flex flex-row items-center gap-1 text-lg text-primary">
                <Link
                  href={item.linkedIn}
                  className="flex flex-row items-center justify-center gap-2 lg:justify-start"
                >
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                    <span className="font-semibold">{item.name}</span>
                    <span className="hidden lg:block">-</span>
                    <span className="text-base font-medium">{item.role}</span>
                  </div>

                  <LinkedInLogoIcon />
                </Link>
              </h3>
              {item.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="m-0 text-base leading-8 text-secondary"
                >
                  {paragraph}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col">
        <h2 className="mt-10 text-2xl font-semibold text-primary">
          {t("career")}
        </h2>
        <ul>
          {experiences.map((item, index) => (
            <li key={index} className="mb-10">
              <h3 className="mt-5 text-lg text-primary">{item.jobTitle}</h3>
              <p className="m-0 text-base leading-8 text-secondary">
                <a
                  href={item.companyUrl}
                  target="_blank"
                  className="border-b border-secondary text-primary "
                >
                  {item.company}
                </a>
                <span> • {item.location}</span>
              </p>
              <p className="m-0 text-base leading-8 text-secondary">
                <span>{dayjs(item.startDate).format("MMM YYYY")}</span>
                <span> – </span>
                <span>
                  {item.endDate
                    ? dayjs(item.endDate).format("MMM YYYY")
                    : "Present"}
                </span>
                <span> • </span>
                <span>
                  {dayjs(dayjs(item.startDate)).from(dayjs(item.endDate), true)}
                </span>
              </p>
              <p className="m-0 text-base leading-8 text-secondary">
                <span className="font-semibold text-primary">Skills: </span>
                {item.skills}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
