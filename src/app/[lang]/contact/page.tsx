import { ContactForm } from "@/components/ContactForm";
import { useTranslations } from "next-intl";

export default function Contacts() {
  const t = useTranslations("contacts");
  return (
    <main className="mx-auto my-5 flex w-full max-w-4xl flex-1 flex-col	 px-5 py-nav-height-mobile text-base  leading-8 text-secondary selection:bg-green selection:text-black lg:py-nav-height-desktop">
      <h1 className="mb-4 text-5xl font-bold text-primary">
        <span className="bg-gradient-to-r from-cyan to-green bg-clip-text text-transparent">
          {t("title")}
        </span>
      </h1>
      <p className="text-base leading-8 text-secondary ">{t("description")}</p>
      <section>
        <h2 className="mb-2 mt-12 text-2xl text-primary">{t("email.title")}</h2>
        <ContactForm />
      </section>
    </main>
  );
}
