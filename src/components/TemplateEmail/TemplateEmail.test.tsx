// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EmailTemplate, { contactEmailText } from "./TemplateEmail";
import NewsletterEmail from "./NewsletterEmail";

describe("transactional email templates", () => {
  it("renders the contact details and keeps a plain-text fallback", () => {
    const props = {
      name: "Ana & João",
      email: "ana@example.com",
      companyOrProject: "Studio <novo>",
      collaborationType: "freelance",
      message: "Olá!\nPodemos conversar?",
    };
    const html = renderToStaticMarkup(<EmailTemplate {...props} />);

    expect(html).toContain("New contact request");
    expect(html).toContain("Ana &amp; João");
    expect(html).toContain("Studio &lt;novo&gt;");
    expect(html).toContain("mailto:ana@example.com");
    expect(contactEmailText(props)).toContain("Olá!\nPodemos conversar?");
  });

  it.each([
    ["pt", "confirmation", "Confirmar inscrição"],
    ["en", "welcome", "Explore the notes"],
  ] as const)("renders the %s %s email", (language, template, button) => {
    const html = renderToStaticMarkup(
      <NewsletterEmail
        language={language}
        template={template}
        actionUrl="https://example.com/action?token=secret"
        unsubscribeUrl="https://example.com/unsubscribe"
      />,
    );

    expect(html).toContain(button);
    expect(html).toContain("https://example.com/action?token=secret");
    expect(html).toContain("Notas do Juliano");
  });
});
