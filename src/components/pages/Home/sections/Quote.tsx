import { Icon } from "@/components/atoms/Icon"
import { ImageSVG } from "@/components/atoms/ImageSVG"
import { useTranslations } from "next-intl"

export const Quote = () => {
  const t = useTranslations('home')
  return (
    <section className="relative pt-4 overflow-hidden">
      <ImageSVG name="rectangle" className="absolute right-[-16px] top-4 hidden lg:block" />
      <div className="flex flex-col items-end mx-4 relative max-w-3xl lg:m-auto  ">
        <Icon name="IconQuote" className="absolute left-3 top-[-14px]" />
        <div className="border border-gray ">
          <p className="text-white font-medium p-8 lg:text-2xl">
            {t('quote')}
          </p>

        </div>
        <Icon name="IconQuote" className="absolute right-3 bottom-12" />
        <div className="max-w-max border-b border-r border-l border-gray p-4">
          <span className="text-white text-xl">
            - {t('quoteAuthor')}
          </span>
        </div>
      </div>
    </section>
  )
}