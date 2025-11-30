import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PDF 페이지 분할 서비스',
  description: 'PDF 페이지 분할 서비스',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  )
}

