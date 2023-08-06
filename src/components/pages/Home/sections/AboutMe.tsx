import { Button } from "@/components/atoms/Button/Button";
import { ImageSVG } from "@/components/atoms/ImageSVG";
import { Title } from "@/components/molecules/Title";
import { useFeatureFlag } from "@/utils/featureFlag";
import { useTranslations } from "next-intl";

export const AboutMe = () => {
  const t = useTranslations("about");
  const showAbout = useFeatureFlag("ABOUT");

  if (!showAbout) {
    return null;
  }
  return (
    <section className="relative overflow-hidden" id="about">
      <ImageSVG
        name="rectangle"
        width="155px"
        height="155px"
        className="text-primary absolute left-[-70px] top-12 hidden lg:block"
      />
      <ImageSVG
        name="dots"
        width="103px"
        height="103px"
        className="absolute bottom-12 right-[-20px] hidden text-highlight lg:block"
      />
      <div className="w-full px-4 lg:m-auto lg:max-w-screen-lg">
        <Title level={2} variant="secondary" className="mb-4">
          {t("title")}
        </Title>
        <div className="flex w-full flex-row">
          <div className="flex w-full max-w-lg flex-col gap-4">
            <p className="text-secondary ">{t("aboutMe.phrase1")}</p>
            <p className="text-secondary ">{t("aboutMe.phrase2")}</p>
            <p className="text-secondary ">{t("aboutMe.phrase3")}</p>
            <p className="text-secondary">{t("aboutMe.phrase4")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
