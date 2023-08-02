import { Icon } from "@/components/atoms/Icon";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("global");
  return (
    <footer className="border-primary bg-primary text-primary flex w-full justify-center border-t">
      <div className="flex w-full max-w-5xl flex-col items-start gap-8 p-3 lg:px-8 lg:py-8">
        <div className="flex w-full flex-col items-start gap-8 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row">
              <span className="mr-6 font-medium">{t("myName")}</span>
              <span className="text-secondary">{t("email")}</span>
            </div>
            <span>{t("role")}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-medium">{t("media")}</span>
            <div className="flex flex-row gap-2">
              <a
                href="https://github.com/julianosirtori/julianosirtori.dev"
                target="_blank"
              >
                <Icon name="IconGithub" />
              </a>
              <a
                href="https://discordapp.com/users/juliano_sirtori"
                target="_blank"
              >
                <Icon name="IconDiscord" />
              </a>
              <a
                href="https://www.linkedin.com/in/juliano-sirtori/"
                target="_blank"
              >
                <Icon name="IconLinkedin" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex w-full lg:justify-center">
          <span className="text-secondary">{t("footer.copyright")}</span>
        </div>
      </div>
    </footer>
  );
};
