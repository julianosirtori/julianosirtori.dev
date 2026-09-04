"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Toast } from "../Toast/Toast";

const collaborationTypes = [
  "long-term",
  "freelance",
  "mentoring",
  "speaking",
  "other",
] as const;

export const ContactForm = () => {
  const t = useTranslations("workWithMe.form");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const onSendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      setIsLoading(true);
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          companyOrProject: data.get("companyOrProject"),
          collaborationType: data.get("collaborationType"),
          message: data.get("message"),
        }),
      });

      if (!response.ok)
        throw new Error(`Email request failed: ${response.status}`);

      setIsEmailSent(true);
      form.reset();
    } catch (error) {
      setIsEmailSent(false);
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowToast(true);
    }
  };

  return (
    <>
      <form className="flex w-full flex-col gap-4" onSubmit={onSendEmail}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="name"
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
        </div>
        <Field
          id="companyOrProject"
          label={t("labelCompanyOrProject")}
          placeholder={t("placeholderCompanyOrProject")}
          type="text"
        />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="collaborationType"
            className="text-fg-muted text-xs font-medium"
          >
            {t("labelCollaborationType")}
          </label>
          <select
            id="collaborationType"
            name="collaborationType"
            defaultValue=""
            required
            className="border-border bg-bg text-fg focus:border-accent rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none"
          >
            <option value="" disabled>
              {t("placeholderCollaborationType")}
            </option>
            {collaborationTypes.map((type) => (
              <option key={type} value={type}>
                {t(`collaborationTypes.${type}`)}
              </option>
            ))}
          </select>
        </div>
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
            rows={6}
            className="border-border bg-bg text-fg placeholder:text-fg-subtle focus:border-accent rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none"
            placeholder={t("placeholderMessage")}
            required
          />
        </div>
        <button
          disabled={isLoading}
          type="submit"
          className="bg-fg text-bg hover:bg-fg/90 mt-2 inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? t("buttonLoading") : t("button")}
        </button>
      </form>
      <Toast
        title={isEmailSent ? t("successTitle") : t("errorTitle")}
        description={
          isEmailSent ? t("successDescription") : t("errorDescription")
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
