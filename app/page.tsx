'use client'

import { useState } from 'react'
import UploadArea from '@/components/upload-area'
import ResultView from '@/components/result-view'
import { AppState, PdfSplitData } from '@/types'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload')
  const [pdfData, setPdfData] = useState<PdfSplitData | null>(null)

  const handlePdfProcessed = (data: PdfSplitData) => {
    setPdfData(data)
    setAppState('result')
  }

  const handleReset = () => {
    setPdfData(null)
    setAppState('upload')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            PDF 페이지 분할 서비스
          </h1>
          <p className="text-gray-600">
            PDF 파일의 각 페이지를 독립적인 파일로 분할하세요
          </p>
        </div>

        {appState === 'upload' && (
          <UploadArea onPdfProcessed={handlePdfProcessed} />
        )}

        {appState === 'result' && pdfData && (
          <ResultView pdfData={pdfData} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}

