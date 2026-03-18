// Root layout — Next.js 15.5+ requires html/body here; lang is set by LangSetter in locale layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
