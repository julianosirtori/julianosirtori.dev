import EmailTemplate from "@/components/TemplateEmail/TemplateEmail";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_CONTEXT = 200;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COLLABORATION_TYPES = [
  "long-term",
  "freelance",
  "mentoring",
  "speaking",
  "other",
] as const;

export interface ContactPayload {
  name: string;
  email: string;
  companyOrProject: string;
  collaborationType: (typeof COLLABORATION_TYPES)[number];
  message: string;
}

export function validateContactPayload(raw: unknown): ContactPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const companyOrProject =
    typeof data.companyOrProject === "string"
      ? data.companyOrProject.trim()
      : "";
  const collaborationType =
    typeof data.collaborationType === "string"
      ? data.collaborationType.trim()
      : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  if (!name || name.length > MAX_NAME) return null;
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) return null;
  if (!companyOrProject || companyOrProject.length > MAX_CONTEXT) return null;
  if (
    !COLLABORATION_TYPES.includes(
      collaborationType as ContactPayload["collaborationType"],
    )
  ) {
    return null;
  }
  if (!message || message.length > MAX_MESSAGE) return null;

  return {
    name,
    email,
    companyOrProject,
    collaborationType: collaborationType as ContactPayload["collaborationType"],
    message,
  };
}

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const payload = validateContactPayload(raw);

  if (!payload) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "julianosirtori.dev <website@julianosirtori.dev>",
      to: "julianosirtori@gmail.com",
      replyTo: payload.email,
      subject: `${payload.name} - via julianosirtori.dev`,
      react: <EmailTemplate {...payload} />,
    });

    return NextResponse.json({ message: "Email sent" });
  } catch (error) {
    console.error("[email] send failed", error);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 },
    );
  }
}
