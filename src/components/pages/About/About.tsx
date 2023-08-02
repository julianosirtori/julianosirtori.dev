import * as Page from "@/components/templates/Page/Page";
import { useTranslations } from "next-intl";

export const About = () => {
  const t = useTranslations("about");
  return (
    <Page.Root title={t("title")} subtitle={t("subTitle")}>
      <div className="w-full  lg:m-auto lg:max-w-screen-lg">
        <div className="flex w-full flex-row">
          <div className="flex w-full max-w-lg flex-col gap-4">
            <p className="text-secondary ">{t("aboutMe.phrase1")}</p>
            <p className="text-secondary ">{t("aboutMe.phrase2")}</p>
            <p className="text-secondary ">{t("aboutMe.phrase3")}</p>
            <p className="text-secondary">{t("aboutMe.phrase4")}</p>
          </div>
        </div>
      </div>
    </Page.Root>
  );
};
