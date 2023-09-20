"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Toast } from "../Toast/Toast";

export const ContactForm = () => {
  const t = useTranslations("contacts.email");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const onSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const target = e.currentTarget;
      await fetch(`${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: `${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}`,
        },
        body: JSON.stringify({
          name: target.nameContact.value,
          email: target.email.value,
          message: target.message.value,
        }),
      });
      setShowToast(true);
      setIsEmailSent(true);
    } catch (error) {
      setShowToast(true);
      setIsEmailSent(true);
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <>
      <form className="w-full max-w-md" onSubmit={onSendEmail}>
        <div className="mb-2 flex flex-col">
          <label
            htmlFor="nameContact"
            className="text-[12px] uppercase leading-8 text-secondary"
          >
            {t("labelName")}
          </label>
          <input
            id="nameContact"
            name="nameContact"
            className="rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary focus:border-cyan focus:outline-none "
            type="text"
            placeholder={t("placeholderName")}
            required
          />
        </div>
        <div className="mb-2 flex flex-col">
          <label
            htmlFor="email"
            className="text-[12px] uppercase leading-8 text-secondary"
          >
            {t("labelEmail")}
          </label>
          <input
            id="email"
            name="email"
            className="rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary focus:border-cyan focus:outline-none "
            type="email"
            placeholder={t("placeholderEmail")}
            required
          />
        </div>
        <div className="mb-2 flex flex-col">
          <label
            htmlFor="message"
            className="text-[12px] uppercase leading-8 text-secondary"
          >
            {t("labelMessage")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="rounded-lg border border-secondary bg-background px-3 py-2 text-sm text-primary focus:border-cyan focus:outline-none"
            placeholder={t("placeholderMessage")}
            required
          />
        </div>
        <button
          disabled={isLoading || isEmailSent}
          type="submit"
          className="focus:text-cyan-500  mt-4 w-full cursor-pointer rounded-lg border bg-primary bg-white p-1 text-[12px] text-background outline-none duration-200 ease-in-out hover:border-cyan hover:bg-transparent hover:text-cyan focus:border-cyan focus:bg-transparent disabled:cursor-auto disabled:opacity-50"
        >
          {isLoading ? t("buttonLoading") : t("button")}
        </button>
      </form>
      <Toast
        title={isEmailSent ? "Email sent :D" : "Error :("}
        description={
          isEmailSent
            ? "Thanks for taking the time to write it."
            : "Something wrong happened. Try again later."
        }
        isSuccess={isEmailSent}
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </>
  );
};
