'use client'

import { useState } from 'react'
import UploadArea from '@/components/upload-area'
import ResultView from '@/components/result-view'
import Loading from '@/components/ui/loading'
import { InteractiveRobotSpline } from '@/components/ui/interactive-3d-robot'
import { AppState, PdfSplitData, UploadError } from '@/types'

const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

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

  const isResult = appState === 'result'

  return (
    <main className={`relative min-h-dvh w-full overflow-hidden ${isResult ? 'bg-[#080D17]' : ''}`}>
      {!isResult && (
        <>
          {/* 3D 로봇 배경 */}
          <div className="fixed inset-0 z-0 flex items-center justify-center">
            <div className="w-[60vw] max-w-[700px] h-[60vh] max-h-[600px]">
              <InteractiveRobotSpline
                scene={ROBOT_SCENE_URL}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* 로봇 위에 표시되는 제목 */}
          <div className="fixed top-6 left-0 right-0 z-[5] flex justify-center pointer-events-none px-4">
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-[#080D17]/70 px-8 py-4 backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.45)]">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-2xl text-center">
                PDF 페이지 분할 서비스
              </h1>
              <h5 className="text-base md:text-lg lg:text-xl font-medium text-white/90 drop-shadow-lg text-center">
                3D 로봇 위에 PDF를 드래그하여 페이지별로 분할하세요
              </h5>
            </div>
          </div>
        </>
      )}

      {/* 컨텐츠 오버레이 */}
      <div className="relative z-10 min-h-dvh w-full px-6 py-10 text-slate-100">
        <div className="flex min-h-dvh w-full flex-col justify-center space-y-12">
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
            <div className="relative z-30">
              <ResultView pdfData={pdfData} onReset={handleReset} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

