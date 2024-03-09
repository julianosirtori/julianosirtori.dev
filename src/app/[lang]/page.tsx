import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

import { ButtonTapToStart } from "@/components/ButtonTapToStart";

export interface HomeProps {
  params: {
    lang: string;
  };
}

export default function Home({ params }: HomeProps) {
  unstable_setRequestLocale(params.lang);

  const t = useTranslations("global");

  return (
    <main className="mx-auto flex flex-1 items-center overflow-hidden px-0 py-nav-height-desktop selection:bg-green selection:text-black lg:w-full lg:max-w-3xl">
      <div className="bg-background p-5 text-base text-secondary">
        <h1 className="mb-5 animate-textclip bg-linear-dracula bg-[length:200%] bg-clip-text px-3 text-5xl font-bold text-transparent md:text-6xl">
          {t("myFullName")}
        </h1>
        <h2 className="mb-0 mt-5 px-3 text-xl font-semibold text-primary lg:text-2xl">
          {t("role")}
        </h2>
        <p className="mb-5 px-3 text-secondary">{t("slogan")}</p>
        <ButtonTapToStart />
      </div>
    </main>
  );
}
