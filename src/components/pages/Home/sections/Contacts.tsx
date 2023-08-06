import { Icon } from "@/components/atoms/Icon";
import { ImageSVG } from "@/components/atoms/ImageSVG";
import { Title } from "@/components/molecules/Title";
import { useFeatureFlag } from "@/utils/featureFlag";
import { useTranslations } from "next-intl";

export const Contacts = () => {
  const t = useTranslations("contacts");
  const showContacts = useFeatureFlag("CONTACTS");

  if (!showContacts) {
    return null;
  }

  return (
    <section className="relative overflow-hidden" id="contact">
      <ImageSVG
        name="dots"
        width="103px"
        height="103px"
        className="absolute left-[-70px] top-12 hidden lg:block"
      />
      <div className="w-full px-4 lg:m-auto lg:max-w-screen-lg">
        <Title level={2} variant="secondary" className="mb-12">
          {t("title")}
        </Title>
        <div className="flex w-full flex-col justify-between lg:flex-row ">
          <p className="text-secondary mb-8 lg:max-w-lg">{t("description")}</p>
          <div className="border-primary border p-4">
            <span className="text-primary font-semibold ">
              {t("messageHere")}
            </span>
            <a
              href="https://discordapp.com/users/juliano_sirtori"
              target="_blank"
              className="mb-2 mt-4 flex gap-1"
            >
              <Icon name="IconDiscord" className="text-highlight" />
              <span className="text-secondary">juliano_sirtori</span>
            </a>
            <a
              href="mailto:julianosirtori@gmail.com"
              target="_blank"
              className="mb-2 flex gap-1"
            >
              <Icon name="IconEmail" className="text-highlight" />
              <span className="text-secondary">julianosirtori@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
