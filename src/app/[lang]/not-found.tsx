import { getLocale, getTranslations } from "next-intl/server";

import { NotFoundPage } from "@/components/NotFoundPage";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("global.notFound");

  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      linkLabel={t("backHome")}
      href={`/${locale}`}
    />
  );
}
