import { Icon } from "@/components/atoms/Icon";
import * as Page from "@/components/templates/Page/Page";
import { useTranslations } from "next-intl";

export const Contact = () => {
  const t = useTranslations("contacts");
  return (
    <Page.Root title={t("title")}>
      <Page.Section>
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
              <Icon name="IconDiscord" />
              <span className="text-secondary">juliano_sirtori</span>
            </a>
            <a
              href="mailto:julianosirtori@gmail.com"
              target="_blank"
              className="mb-2 flex gap-1"
            >
              <Icon name="IconEmail" />
              <span className="text-secondary">julianosirtori@gmail.com</span>
            </a>
          </div>
        </div>
      </Page.Section>
      <Page.Section title={t("allMedia")}>
        <div className="flex w-full flex-row flex-wrap gap-5">
          <a
            href="https://discordapp.com/users/juliano_sirtori"
            target="_blank"
            className="flex items-center gap-1"
          >
            <Icon name="IconDiscord" />
          </a>
          <a
            href="mailto:julianosirtori@gmail.com"
            target="_blank"
            className="flex items-center gap-1"
          >
            <Icon name="IconEmail" />
          </a>
          <a
            href="mailto:julianosirtori@gmail.com"
            target="_blank"
            className="flex items-center gap-1"
          >
            <Icon name="IconGithub" />
          </a>
          <a
            href="mailto:julianosirtori@gmail.com"
            target="_blank"
            className="flex items-center gap-1"
          >
            <Icon name="IconLinkedin" />
          </a>
          <a
            href="mailto:julianosirtori@gmail.com"
            target="_blank"
            className="flex items-center gap-1"
          >
            <Icon name="IconTwitter" />
          </a>
        </div>
      </Page.Section>
    </Page.Root>
  );
};
