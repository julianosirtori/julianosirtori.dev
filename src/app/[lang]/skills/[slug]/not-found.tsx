import { getLocale, getTranslations } from "next-intl/server";

import { NotFoundPage } from "@/components/NotFoundPage";

// Someone with a broken skill link most likely wants the other skills.
export default async function SkillNotFound() {
  const locale = await getLocale();
  const t = await getTranslations("skills.notFound");

  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      linkLabel={t("link")}
      href={`/${locale}/skills`}
    />
  );
}
