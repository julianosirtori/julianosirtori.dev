import { Icon } from "@/components/atoms/Icon";
import { ImageSVG } from "@/components/atoms/ImageSVG";
import { useTranslations } from "next-intl";

export const Quote = () => {
  const t = useTranslations("home");
  return (
    <section className="relative overflow-hidden pt-4">
      <ImageSVG
        name="rectangle"
        className="absolute right-[-16px] top-4 hidden lg:block"
      />
      <div className="relative mx-4 flex max-w-3xl flex-col items-end lg:m-auto  ">
        <Icon name="IconQuote" className="absolute left-3 top-[-14px]" />
        <div className="border border-gray ">
          <p className="p-8 font-medium text-white lg:text-2xl">{t("quote")}</p>
        </div>
        <Icon name="IconQuote" className="absolute bottom-12 right-3" />
        <div className="max-w-max border-b border-l border-r border-gray p-4">
          <span className="text-xl text-white">- {t("quoteAuthor")}</span>
        </div>
      </div>
    </section>
  );
};
