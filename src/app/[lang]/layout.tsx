import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

interface BlogRootLayoutProps {
  children: React.ReactNode,
}

export default async function BlogRootLayout({ children }: BlogRootLayoutProps) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
}
