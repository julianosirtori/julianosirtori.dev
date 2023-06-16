interface BlogRootLayoutProps {
  children: React.ReactNode,
}

export default async function BlogRootLayout({ children }: BlogRootLayoutProps) {
  return (
    <>
      {children}
    </>
  )
}
