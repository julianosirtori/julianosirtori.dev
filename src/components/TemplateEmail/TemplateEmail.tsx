import { Html } from "@react-email/html";

export type EmailTemplateProps = {
  name: string;
  email: string;
  companyOrProject: string;
  collaborationType: string;
  message: string;
};

const collaborationLabels: Record<string, string> = {
  "long-term": "Long-term opportunity",
  freelance: "Freelance project",
  mentoring: "Mentoring",
  speaking: "Speaking",
  other: "Other",
};

export function contactEmailText({
  name,
  email,
  companyOrProject,
  collaborationType,
  message,
}: EmailTemplateProps) {
  return [
    "New message from julianosirtori.dev",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company or project: ${companyOrProject}`,
    `Collaboration type: ${collaborationLabels[collaborationType] ?? collaborationType}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

export default function EmailTemplate({
  name,
  email,
  companyOrProject,
  collaborationType,
  message,
}: EmailTemplateProps) {
  const collaborationLabel =
    collaborationLabels[collaborationType] ?? collaborationType;

  return (
    <Html lang="en">
      <body style={styles.body}>
        <div style={styles.preview}>
          New {collaborationLabel.toLowerCase()} message from {name}
        </div>
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
                      <td style={styles.header}>
                        <p style={styles.eyebrow}>JULIANOSIRTORI.DEV</p>
                        <h1 style={styles.heading}>New contact request</h1>
                        <p style={styles.intro}>
                          Someone filled out the collaboration form on your
                          website.
                        </p>
                        <span style={styles.badge}>{collaborationLabel}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.content}>
                        <table
                          role="presentation"
                          width="100%"
                          style={styles.details}
                        >
                          <tbody>
                            <DetailRow label="Name" value={name} />
                            <DetailRow
                              label="Email"
                              value={
                                <a href={`mailto:${email}`} style={styles.link}>
                                  {email}
                                </a>
                              }
                            />
                            <DetailRow
                              label="Company / project"
                              value={companyOrProject}
                              last
                            />
                          </tbody>
                        </table>
                        <p style={styles.messageLabel}>MESSAGE</p>
                        <div style={styles.message}>{message}</div>
                        <a href={`mailto:${email}`} style={styles.button}>
                          Reply to {name}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.footer}>
                        Sent securely from the contact form at
                        julianosirtori.dev
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

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) {
  return (
    <tr>
      <td
        style={{
          ...styles.detailCell,
          ...(last ? styles.detailCellLast : {}),
        }}
      >
        <span style={styles.detailLabel}>{label}</span>
        <span style={styles.detailValue}>{value}</span>
      </td>
    </tr>
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
    maxWidth: "620px",
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
  header: {
    padding: "32px 36px 28px",
    borderBottom: "1px solid #e5e5e5",
  },
  eyebrow: {
    margin: "0 0 10px",
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.4px",
    lineHeight: "16px",
  },
  heading: {
    margin: "0",
    color: "#0a0a0a",
    fontSize: "26px",
    fontWeight: "650",
    letterSpacing: "-0.6px",
    lineHeight: "32px",
  },
  intro: {
    margin: "8px 0 16px",
    color: "#737373",
    fontSize: "14px",
    lineHeight: "21px",
  },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    fontSize: "11px",
    fontWeight: "600",
    lineHeight: "16px",
  },
  content: { padding: "32px 36px 36px" },
  details: {
    width: "100%",
    marginBottom: "28px",
    border: "1px solid #e5e5e5",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
  },
  detailCell: {
    padding: "13px 16px",
    borderBottom: "1px solid #e5e5e5",
    fontSize: "14px",
    lineHeight: "20px",
  },
  detailCellLast: { borderBottom: "none" },
  detailLabel: {
    display: "inline-block",
    width: "140px",
    color: "#737373",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailValue: { color: "#171717", fontWeight: "500" },
  link: { color: "#4338ca", textDecoration: "none" },
  messageLabel: {
    margin: "0 0 8px",
    color: "#737373",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    lineHeight: "16px",
  },
  message: {
    marginBottom: "28px",
    padding: "18px 20px",
    borderLeft: "3px solid #4f46e5",
    borderRadius: "0 8px 8px 0",
    backgroundColor: "#fafafa",
    color: "#262626",
    fontSize: "15px",
    lineHeight: "24px",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },
  button: {
    display: "inline-block",
    padding: "11px 18px",
    borderRadius: "7px",
    backgroundColor: "#171717",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "20px",
    textDecoration: "none",
  },
  footer: {
    padding: "20px 36px",
    borderTop: "1px solid #e5e5e5",
    backgroundColor: "#fafafa",
    color: "#a3a3a3",
    fontSize: "11px",
    lineHeight: "17px",
    textAlign: "center",
  },
} as const;
