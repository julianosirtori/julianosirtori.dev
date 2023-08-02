import { Icon } from "@/components/atoms/Icon";
import { useTranslations } from "next-intl";

export const Quote = () => {
  const t = useTranslations("home");
  return (
    <section className="relative overflow-hidden pt-4">
      <div className="text-primary relative mx-4 flex max-w-3xl flex-col items-end lg:m-auto ">
        <Icon name="IconQuote" className="absolute left-3 top-[-14px]" />
        <div className="border-primary border ">
          <p className="text-primary p-8 font-medium lg:text-2xl">
            {t("quote")}
          </p>
        </div>
        <Icon
          name="IconQuote"
          className="text-primary absolute bottom-12 right-3"
        />
        <div className="border-primary max-w-max border-b border-l border-r p-4">
          <span className="text-primary text-xl">- {t("quoteAuthor")}</span>
        </div>
      </div>
    </section>
  );
};
