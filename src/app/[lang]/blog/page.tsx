import { allPosts } from "contentlayer/generated";
import { useTranslations } from "next-intl";

export default function Blog() {
  const t = useTranslations("blog");

  return (
    <main className="mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col	 px-5 py-nav-height-mobile text-base  leading-8 text-secondary lg:py-nav-height-desktop">
      <h1 className="mb-4 text-5xl font-bold text-primary">
        <span className="bg-gradient-to-r from-yellow to-pink bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h1>
      <p className="text-base leading-8 text-secondary ">{t("description")}</p>
    </main>
  );
}
