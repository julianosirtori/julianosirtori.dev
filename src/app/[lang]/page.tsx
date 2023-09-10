import { ButtonTapToStart } from "@/components/ButtonTapToStart";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("global");

  return (
    <main className="mx-auto flex flex-1 items-center overflow-hidden px-0 py-nav-height-desktop lg:w-full lg:max-w-3xl">
      <div className="bg-background p-5 text-base text-secondary">
        <h1 className="mb-5 px-3 text-5xl font-bold text-primary">
          {t("myFullName")}
        </h1>
        <p className="my-5 px-3 text-secondary">
          <span className="text-primary">{t("role")}</span>
          <br />
          {t("slogan")}
        </p>
        <ButtonTapToStart />
      </div>
    </main>
  );
}
