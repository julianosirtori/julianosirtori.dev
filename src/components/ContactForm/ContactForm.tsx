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
      await fetch(`/api/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setIsEmailSent(false);
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <form className="flex w-full flex-col gap-4" onSubmit={onSendEmail}>
        <Field
          id="nameContact"
          label={t("labelName")}
          placeholder={t("placeholderName")}
          type="text"
        />
        <Field
          id="email"
          label={t("labelEmail")}
          placeholder={t("placeholderEmail")}
          type="email"
        />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="message"
            className="text-fg-muted text-xs font-medium"
          >
            {t("labelMessage")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="border-border bg-bg text-fg placeholder:text-fg-subtle focus:border-accent rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none"
            placeholder={t("placeholderMessage")}
            required
          />
        </div>
        <button
          disabled={isLoading || isEmailSent}
          type="submit"
          className="bg-fg text-bg hover:bg-fg/90 mt-2 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? t("buttonLoading") : t("button")}
        </button>
      </form>
      <Toast
        title={isEmailSent ? "Email sent" : "Error"}
        description={
          isEmailSent
            ? "Thanks for taking the time to write it."
            : "Something went wrong. Try again later."
        }
        isSuccess={isEmailSent}
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </>
  );
};

function Field({
  id,
  label,
  placeholder,
  type,
}: {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "email";
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-fg-muted text-xs font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required
        className="border-border bg-bg text-fg placeholder:text-fg-subtle focus:border-accent rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none"
      />
    </div>
  );
}
