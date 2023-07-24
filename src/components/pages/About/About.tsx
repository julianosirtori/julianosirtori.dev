import * as Page from "@/components/templates/Page/Page"
import { useTranslations } from "next-intl"

export const About = () => {
  const t = useTranslations('about')
  return (
    <Page.Root title={t('title')} subtitle={t('subTitle')} >
      <div className="w-full  lg:max-w-screen-lg lg:m-auto">
        <div className="w-full flex flex-row">
          <div className="flex flex-col gap-4 w-full max-w-lg">
            <p className="text-gray ">
              {t('aboutMe.phrase1')}
            </p>
            <p className="text-gray ">
              {t('aboutMe.phrase2')}
            </p>
            <p className="text-gray ">
              {t('aboutMe.phrase3')}
            </p>
            <p className="text-gray">
              {t('aboutMe.phrase4')}
            </p>
          </div>
        </div>
      </div>
    </Page.Root>
  )
}