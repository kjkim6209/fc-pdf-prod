'use client'

import { useState } from 'react'
import UploadArea from '@/components/upload-area'
import ResultView from '@/components/result-view'
import Loading from '@/components/ui/loading'
import { AppState, PdfSplitData, UploadError } from '@/types'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload')
  const [pdfData, setPdfData] = useState<PdfSplitData | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<UploadError | null>(null)

  const handlePdfProcessed = (data: PdfSplitData) => {
    setPdfData(data)
    setProgress(100)
    setAppState('result')
  }

  const handleReset = () => {
    setPdfData(null)
    setError(null)
    setProgress(0)
    setAppState('upload')
  }

  const handleProcessStart = () => {
    setError(null)
    setProgress(0)
    setAppState('processing')
  }

  const handleProcessError = (uploadError: UploadError) => {
    setError(uploadError)
    setProgress(0)
    setAppState('upload')
  }

  return (
    <main className="min-h-dvh w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-10 text-slate-100">
      <div className="flex min-h-dvh w-full flex-col justify-center space-y-12">
        <section className="space-y-4 text-center">
          <p className="inline-flex items-center justify-center px-4 py-1 rounded-full text-sm font-medium border border-blue-500/40 bg-blue-500/10 text-blue-200">
            3 STEP PDF SPLITTER
          </p>
          <h1 className="text-4xl font-extrabold text-white">
            PDF를 드래그하면 페이지별 다운로드까지 한 번에
          </h1>
          <p className="text-slate-300">
            파일을 올리고, 진행률을 확인하고, 페이지별 썸네일 그리드에서 바로 다운로드하세요.
          </p>
        </section>

        {appState === 'upload' && (
          <UploadArea
            onPdfProcessed={handlePdfProcessed}
            onProcessStart={handleProcessStart}
            onProcessProgress={setProgress}
            onProcessError={handleProcessError}
            error={error}
          />
        )}

        {appState === 'processing' && (
          <div className="flex w-full justify-center">
            <Loading progress={progress} />
          </div>
        )}

        {appState === 'result' && pdfData && (
          <ResultView pdfData={pdfData} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}

