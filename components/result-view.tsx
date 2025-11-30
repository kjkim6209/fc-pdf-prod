'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PdfSplitData } from '@/types'
import { downloadPdf, getDownloadFileName } from '@/lib/download'
import { downloadAsZip } from '@/lib/zip-download'
import AdModal from '@/components/ad-modal'

interface ResultViewProps {
  pdfData: PdfSplitData
  onReset: () => void
}

export default function ResultView({ pdfData, onReset }: ResultViewProps) {
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)
  const [showAdModal, setShowAdModal] = useState(false)
  const [pendingDownload, setPendingDownload] = useState<{
    type: 'single' | 'all'
    pageIndex?: number
  } | null>(null)

  const previewUrls = useMemo(() => {
    return pdfData.splitPdfs.map((bytes) => {
      const cloned = bytes.slice()
      return URL.createObjectURL(new Blob([cloned.buffer], { type: 'application/pdf' }))
    })
  }, [pdfData])

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const handleDownload = (pageIndex: number) => {
    setPendingDownload({ type: 'single', pageIndex })
    setShowAdModal(true)
  }

  const handleDownloadAll = () => {
    setPendingDownload({ type: 'all' })
    setShowAdModal(true)
  }

  const proceedWithDownload = async () => {
    setShowAdModal(false)
    
    if (!pendingDownload) return

    try {
      if (pendingDownload.type === 'single' && pendingDownload.pageIndex !== undefined) {
        const pdfBytes = pdfData.splitPdfs[pendingDownload.pageIndex]
        const fileName = getDownloadFileName(pdfData.originalFileName, pendingDownload.pageIndex + 1)
        downloadPdf(pdfBytes, fileName)
      } else if (pendingDownload.type === 'all') {
        setIsDownloadingZip(true)
        await downloadAsZip({
          splitPdfs: pdfData.splitPdfs,
          originalFileName: pdfData.originalFileName,
        })
      }
    } catch (error) {
      console.error('다운로드 중 오류 발생:', error)
      alert('파일 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setPendingDownload(null)
      setIsDownloadingZip(false)
    }
  }

  const handleAdSkip = () => {
    setShowAdModal(false)
    setPendingDownload(null)
  }

  return (
    <>
      <AdModal
        isOpen={showAdModal}
        onClose={handleAdSkip}
        onContinue={proceedWithDownload}
        publisherId="ca-pub-YOUR_PUBLISHER_ID"
        adSlotId="YOUR_AD_SLOT_ID"
      />

      <section className="space-y-10 text-slate-100">
      <div className="text-center space-y-3">
        <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">분할 완료</p>
        <h2 className="text-3xl font-bold text-white">{pdfData.originalFileName}</h2>
        <p className="text-slate-300">총 {pdfData.totalPages}개의 페이지를 개별 PDF로 다운로드할 수 있습니다.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button onClick={handleDownloadAll} disabled={isDownloadingZip}>
            {isDownloadingZip ? 'ZIP 생성 중...' : '전체 ZIP 다운로드'}
          </Button>
          <Button variant="ghost" onClick={onReset}>
            새 파일 업로드
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pdfData.splitPdfs.map((_, index) => (
          <article
            key={index}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 text-slate-100 shadow-[0_15px_35px_rgba(0,0,0,0.4)] transition-shadow hover:shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
          >
            <div className="h-48 rounded-2xl border border-slate-800 bg-[#080D17]/40 overflow-hidden">
              {previewUrls[index] ? (
                <iframe
                  src={`${previewUrls[index]}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="h-full w-full pointer-events-none"
                  title={`페이지 ${index + 1} 미리보기`}
                  aria-hidden="true"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl">📄</div>
              )}
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-100">페이지 {index + 1}</p>
                <p className="text-xs text-slate-400">
                  {getDownloadFileName(pdfData.originalFileName, index + 1)}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => handleDownload(index)}
                aria-label={`페이지 ${index + 1} 다운로드`}
              >
                다운로드
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
    </>
  )
}

