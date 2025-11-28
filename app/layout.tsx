import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PDF 페이지 분할 서비스',
  description: 'PDF 파일을 각 페이지로 분할하여 다운로드하세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

