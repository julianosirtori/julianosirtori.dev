import EmailTemplate from "@/components/TemplateEmail/TemplateEmail";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await req.json();

    await resend.emails.send({
      from: "julianosirtori.dev <website@julianosirtori.dev>",
      to: "julianosirtori@gmail.com",
      replyTo: data?.email,
      subject: `${data?.name} - via julianosirtori.dev`,
      react: <EmailTemplate {...data} />,
    });

    return NextResponse.json({ message: "Email sent" });
  } catch (e) {
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}
