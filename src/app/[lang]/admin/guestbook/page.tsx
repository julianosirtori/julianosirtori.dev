import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { identity } from "@/lib/server/auth";
import { HttpError } from "@/lib/server/security";
import { GuestbookAdmin } from "@/components/Audience/Guestbook";
import { copyFor } from "@/components/Audience/copy";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Guestbook admin",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  try {
    await identity(await headers(), true);
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.status === 401) redirect(`/${lang}/guestbook`);
      if (error.status === 403) notFound();
    }
    throw error;
  }
  return (
    <main className="mx-auto w-full max-w-[760px] flex-1 px-5 py-16">
      <h1 className="mb-8 text-3xl font-semibold">{copyFor(lang).admin}</h1>
      <GuestbookAdmin />
    </main>
  );
}
