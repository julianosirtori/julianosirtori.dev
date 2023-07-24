import { Icon } from "@/components/atoms/Icon"
import * as Page from "@/components/templates/Page/Page"
import { useTranslations } from "next-intl"

export const Contact = () => {
  const t = useTranslations('contacts')
  return (
    <Page.Root title={t('title')} >
      <Page.Section>
        <div className="flex flex-col lg:flex-row w-full justify-between ">
          <p className="text-gray mb-8 lg:max-w-lg">
            {t('description')}
          </p>
          <div className="border border-gray p-4">
            <span className="text-white font-semibold ">
              {t('messageHere')}
            </span>
            <a href="https://discordapp.com/users/juliano_sirtori" target="_blank" className="flex gap-1 mb-2 mt-4">
              <Icon name="IconDiscord" />
              <span className="text-gray">juliano_sirtori</span>
            </a>
            <a href="mailto:julianosirtori@gmail.com" target="_blank" className="flex gap-1 mb-2">
              <Icon name="IconEmail" />
              <span className="text-gray">julianosirtori@gmail.com</span>
            </a>
          </div>
        </div>
      </Page.Section>
      <Page.Section title={t('allMedia')}>
        <div className="flex flex-row gap-5 w-full flex-wrap">
          <a href="https://discordapp.com/users/juliano_sirtori" target="_blank" className="flex gap-1 items-center">
            <Icon name="IconDiscord" />
          </a>
          <a href="mailto:julianosirtori@gmail.com" target="_blank" className="flex gap-1 items-center">
            <Icon name="IconEmail" />
          </a>
          <a href="mailto:julianosirtori@gmail.com" target="_blank" className="flex gap-1 items-center">
            <Icon name="IconGithub" />
          </a>
          <a href="mailto:julianosirtori@gmail.com" target="_blank" className="flex gap-1 items-center">
            <Icon name="IconLinkedin" />
          </a>
          <a href="mailto:julianosirtori@gmail.com" target="_blank" className="flex gap-1 items-center">
            <Icon name="IconTwitter" />
          </a>
        </div>
      </Page.Section>
    </Page.Root>

  )
}