import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/ContactForm";

interface ContactsProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function Contacts({ params }: ContactsProps) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("contacts");

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pt-24 pb-20 lg:pt-32">
      <header className="mb-10">
        <h1 className="text-fg mb-3 text-4xl font-medium tracking-tight md:text-5xl">
          {t("title")}
        </h1>
        <p className="text-fg-muted max-w-prose text-base leading-relaxed">
          {t("description")}
        </p>
      </header>

      <section>
        <h2 className="text-fg mt-6 mb-3 text-lg font-medium">
          {t("email.title")}
        </h2>
        <ContactForm />
      </section>
    </main>
  );
}
