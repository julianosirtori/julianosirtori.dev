import { Button } from "@/components/atoms/Button/Button"
import { ImageSVG } from "@/components/atoms/ImageSVG"
import { Title } from "@/components/molecules/Title"
import { useTranslations } from "next-intl"

export const AboutMe = () => {
  const t = useTranslations('about')
  return (
    <section className="relative overflow-hidden">
      <ImageSVG name="rectangle" width="155px" height="155px" className="absolute left-[-70px] top-12 hidden lg:block" />
      <ImageSVG name="dots" width="103px" height="103px" className="absolute right-[-20px] bottom-12 hidden lg:block" />
      <div className="w-full px-4 lg:max-w-screen-lg lg:m-auto">
        <Title level={2} variant="secondary" className="mb-4" >
          {t('title')}
        </Title>
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
    </section>
  )
}