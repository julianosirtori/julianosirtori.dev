import "server-only";
import { createElement } from "react";
import { Resend } from "resend";
import NewsletterEmail from "@/components/TemplateEmail/NewsletterEmail";
import { assertNewsletterRecipient } from "./newsletter-policy";
export function resendClient() {
  if (!process.env.RESEND_API_KEY) throw new Error("Email unavailable");
  return new Resend(process.env.RESEND_API_KEY);
}
export interface MailPayload {
  to: string;
  subject: string;
  text: string;
  template?: "confirmation" | "welcome";
  language?: "pt" | "en";
  actionUrl?: string;
  unsubscribeUrl?: string;
}
export const newsletterProvider = {
  async send(payload: MailPayload, key: string) {
    assertNewsletterRecipient(payload.to);
    const { template, language, actionUrl, unsubscribeUrl, ...mail } = payload;
    const react =
      template && language && actionUrl
        ? createElement(NewsletterEmail, {
            template,
            language,
            actionUrl,
            unsubscribeUrl,
          })
        : undefined;
    const result = await resendClient().emails.send(
      {
        ...mail,
        ...(react ? { react } : {}),
        from:
          process.env.NEWSLETTER_FROM ||
          "Notas do Juliano <website@julianosirtori.dev>",
      },
      { idempotencyKey: key },
    );
    if (result.error || !result.data) throw new Error("provider_send");
    return result.data.id;
  },
  async activate(email: string, language: "pt" | "en") {
    assertNewsletterRecipient(email);
    const resend = resendClient();
    const segmentId =
      language === "pt"
        ? process.env.RESEND_SEGMENT_PT
        : process.env.RESEND_SEGMENT_EN;
    const otherSegment =
      language === "pt"
        ? process.env.RESEND_SEGMENT_EN
        : process.env.RESEND_SEGMENT_PT;
    if (!segmentId || !otherSegment || segmentId === otherSegment)
      throw new Error("segments_missing");
    const existing = await resend.contacts.get({ email });
    if (existing.error && existing.error.name !== "not_found")
      throw new Error("provider_contact");
    const result = existing.data
      ? await resend.contacts.update({ email, unsubscribed: false })
      : await resend.contacts.create({ email, unsubscribed: false });
    if (result.error) throw new Error("provider_contact");
    const add = await resend.contacts.segments.add({ email, segmentId });
    if (add.error) throw new Error("provider_segment");
    const remove = await resend.contacts.segments.remove({
      email,
      segmentId: otherSegment,
    });
    if (remove.error && remove.error.name !== "not_found")
      throw new Error("provider_segment");
    return result.data?.id || existing.data?.id || email;
  },
  async unsubscribe(email: string) {
    assertNewsletterRecipient(email);
    const result = await resendClient().contacts.update({
      email,
      unsubscribed: true,
    });
    if (result.error && result.error.name !== "not_found")
      throw new Error("provider_contact");
  },
};
