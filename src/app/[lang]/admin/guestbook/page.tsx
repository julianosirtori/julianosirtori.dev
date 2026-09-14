import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { identity } from "@/lib/server/auth";
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
  try {
    await identity(await headers(), true);
  } catch {
    notFound();
  }
  const { lang } = await params;
  return (
    <main className="mx-auto w-full max-w-[760px] flex-1 px-5 py-16">
      <h1 className="mb-8 text-3xl font-semibold">{copyFor(lang).admin}</h1>
      <GuestbookAdmin />
    </main>
  );
}
