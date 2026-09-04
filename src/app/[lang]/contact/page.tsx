import { permanentRedirect } from "next/navigation";

interface ContactProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function Contact({ params }: ContactProps) {
  const { lang } = await params;
  permanentRedirect(`/${lang}/work-with-me`);
}
