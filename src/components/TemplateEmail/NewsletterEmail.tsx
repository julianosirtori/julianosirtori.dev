import { Html } from "@react-email/html";

export type NewsletterEmailProps = {
  template: "confirmation" | "welcome";
  language: "pt" | "en";
  actionUrl: string;
  unsubscribeUrl?: string;
};

const copy = {
  pt: {
    brand: "NOTAS DO JULIANO",
    confirmation: {
      preview: "Confirme sua inscrição nas Notas do Juliano",
      eyebrow: "SÓ FALTA UM PASSO",
      title: "Confirme seu e-mail",
      body: "Você pediu para receber minhas notas quinzenais em português. Confirme abaixo para eu saber que este endereço é realmente seu.",
      button: "Confirmar inscrição",
      note: "Este link é válido por 24 horas. Se não foi você, pode ignorar este e-mail.",
    },
    welcome: {
      preview: "Boas-vindas às Notas do Juliano",
      eyebrow: "INSCRIÇÃO CONFIRMADA",
      title: "Que bom ter você por aqui.",
      body: "A cada duas semanas, vou compartilhar o que estiver me interessando: aplicativos, ferramentas, projetos, memes ou qualquer outra coisa que eu queira dividir com você.",
      button: "Conhecer as Notas",
      note: "Sem algoritmo e sem excesso de e-mails — apenas uma nota nova a cada duas semanas.",
    },
    fallback:
      "Se o botão não funcionar, copie e cole este endereço no navegador:",
    unsubscribe: "Cancelar inscrição",
    footer: "Enviado por Juliano Sirtori · julianosirtori.dev",
  },
  en: {
    brand: "NOTAS DO JULIANO",
    confirmation: {
      preview: "Confirm your subscription to Notas do Juliano",
      eyebrow: "ONE LAST STEP",
      title: "Confirm your email",
      body: "You asked to receive my biweekly notes in English. Confirm below so I know this address really belongs to you.",
      button: "Confirm subscription",
      note: "This link is valid for 24 hours. If this wasn't you, you can ignore this email.",
    },
    welcome: {
      preview: "Welcome to Notas do Juliano",
      eyebrow: "SUBSCRIPTION CONFIRMED",
      title: "Glad to have you here.",
      body: "Every two weeks, I'll share whatever has caught my interest: apps, tools, projects, memes, or anything else that feels worth passing along.",
      button: "Explore the notes",
      note: "No algorithm and no inbox overload — just one new note every two weeks.",
    },
    fallback:
      "If the button doesn't work, copy and paste this address into your browser:",
    unsubscribe: "Unsubscribe",
    footer: "Sent by Juliano Sirtori · julianosirtori.dev",
  },
} as const;

export default function NewsletterEmail({
  template,
  language,
  actionUrl,
  unsubscribeUrl,
}: NewsletterEmailProps) {
  const t = copy[language];
  const content = t[template];

  return (
    <Html lang={language}>
      <body style={styles.body}>
        <div style={styles.preview}>{content.preview}</div>
        <table role="presentation" width="100%" style={styles.outerTable}>
          <tbody>
            <tr>
              <td align="center" style={styles.outerCell}>
                <table role="presentation" width="100%" style={styles.card}>
                  <tbody>
                    <tr>
                      <td style={styles.accent} />
                    </tr>
                    <tr>
                      <td style={styles.content}>
                        <p style={styles.brand}>{t.brand}</p>
                        <p style={styles.eyebrow}>{content.eyebrow}</p>
                        <h1 style={styles.heading}>{content.title}</h1>
                        <p style={styles.paragraph}>{content.body}</p>
                        <a href={actionUrl} style={styles.button}>
                          {content.button} &nbsp;→
                        </a>
                        <p style={styles.note}>{content.note}</p>
                        {template === "confirmation" && (
                          <div style={styles.fallbackBox}>
                            <p style={styles.fallbackLabel}>{t.fallback}</p>
                            <a href={actionUrl} style={styles.fallbackLink}>
                              {actionUrl}
                            </a>
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.footer}>
                        <p style={styles.footerText}>{t.footer}</p>
                        {unsubscribeUrl && (
                          <a href={unsubscribeUrl} style={styles.unsubscribe}>
                            {t.unsubscribe}
                          </a>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </Html>
  );
}

const styles = {
  body: {
    margin: "0",
    padding: "0",
    backgroundColor: "#f5f5f5",
    color: "#171717",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  preview: {
    display: "none",
    maxHeight: "0",
    overflow: "hidden",
    opacity: "0",
    color: "transparent",
  },
  outerTable: { width: "100%", backgroundColor: "#f5f5f5" },
  outerCell: { padding: "40px 16px" },
  card: {
    width: "100%",
    maxWidth: "600px",
    overflow: "hidden",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 28px rgba(10, 10, 10, 0.06)",
  },
  accent: {
    height: "5px",
    backgroundColor: "#4f46e5",
    fontSize: "0",
    lineHeight: "0",
  },
  content: { padding: "42px 42px 38px" },
  brand: {
    margin: "0 0 52px",
    color: "#171717",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    lineHeight: "18px",
  },
  eyebrow: {
    margin: "0 0 12px",
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.3px",
    lineHeight: "16px",
  },
  heading: {
    margin: "0 0 18px",
    color: "#0a0a0a",
    fontSize: "32px",
    fontWeight: "650",
    letterSpacing: "-0.9px",
    lineHeight: "38px",
  },
  paragraph: {
    margin: "0 0 28px",
    color: "#525252",
    fontSize: "16px",
    lineHeight: "26px",
  },
  button: {
    display: "inline-block",
    padding: "12px 19px",
    borderRadius: "7px",
    backgroundColor: "#171717",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "20px",
    textDecoration: "none",
  },
  note: {
    margin: "24px 0 0",
    color: "#737373",
    fontSize: "13px",
    lineHeight: "20px",
  },
  fallbackBox: {
    marginTop: "28px",
    padding: "14px 16px",
    borderLeft: "3px solid #c7d2fe",
    backgroundColor: "#fafafa",
  },
  fallbackLabel: {
    margin: "0 0 5px",
    color: "#737373",
    fontSize: "11px",
    lineHeight: "17px",
  },
  fallbackLink: {
    color: "#4338ca",
    fontSize: "11px",
    lineHeight: "17px",
    overflowWrap: "anywhere",
  },
  footer: {
    padding: "22px 42px",
    borderTop: "1px solid #e5e5e5",
    backgroundColor: "#fafafa",
  },
  footerText: {
    margin: "0",
    color: "#a3a3a3",
    fontSize: "11px",
    lineHeight: "17px",
  },
  unsubscribe: {
    display: "inline-block",
    marginTop: "5px",
    color: "#737373",
    fontSize: "11px",
    lineHeight: "17px",
  },
} as const;
