import EmailTemplate from "@/components/TemplateEmail/TemplateEmail";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();

    await resend.sendEmail({
      from: "julianosirtori.dev <website@julianosirtori.dev>",
      to: "julianosirtori@gmail.com",
      reply_to: data?.email,
      subject: `${data?.name} - via julianosirtori.dev`,
      react: <EmailTemplate {...data} />,
    });

    return NextResponse.json({ message: "Email sent" });
  } catch (e) {
    return new Response(JSON.stringify({ message: e }), {
      status: 500,
    });
  }
}
