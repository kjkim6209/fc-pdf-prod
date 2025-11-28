'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { validateFile } from '@/lib/file-validation'
import { splitPdfIntoPages } from '@/lib/pdf-processor'
import { UploadError, PdfSplitData } from '@/types'

interface UploadAreaProps {
  onPdfProcessed: (data: PdfSplitData) => void
  onProcessStart: () => void
  onProcessProgress: (progress: number) => void
  onProcessError: (error: UploadError) => void
  error?: UploadError | null
}

export default function UploadArea({
  onPdfProcessed,
  onProcessStart,
  onProcessProgress,
  onProcessError,
  error,
}: UploadAreaProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const processPdf = useCallback(async (file: File) => {
    try {
      const result = await splitPdfIntoPages(file, (progressValue) => {
        onProcessProgress(progressValue)
      })

      if (result.success) {
        console.log('PDF 분할 완료:', {
          totalPages: result.totalPages,
          splitPdfCount: result.splitPdfs.length,
        })
        onPdfProcessed({
          originalFileName: file.name,
          totalPages: result.totalPages,
          splitPdfs: result.splitPdfs,
        })
      } else {
        onProcessError({
          type: 'READ_ERROR',
          message: result.error || 'PDF 처리 중 오류가 발생했습니다.',
        })
      }
    } catch (err) {
      onProcessError({
        type: 'UNKNOWN',
        message: '예상치 못한 오류가 발생했습니다.',
      })
    }
  }, [onPdfProcessed, onProcessError, onProcessProgress])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    const validation = validateFile(file)

    if (!validation.valid) {
      onProcessError(validation.error!)
      return
    }

    onProcessProgress(0)
    onProcessStart()
    await new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(null)
        return
      }
      window.requestAnimationFrame(() => resolve(null))
    })
    await processPdf(file)
  }, [onProcessError, onProcessProgress, onProcessStart, processPdf])

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  })

  // 드래그 상태 동기화
  useEffect(() => {
    setIsDragActive(dropzoneActive)
  }, [dropzoneActive])

  return (
    <>
      {/* 보이지 않는 드롭존 - 전체 화면을 덮음 (로봇 위에 바로 드롭 가능) */}
      <div
        {...getRootProps()}
        className="fixed inset-0 z-20"
        style={{
          pointerEvents: 'auto',
          cursor: isDragActive ? 'copy' : 'default',
          opacity: 0,
          background: 'transparent',
        }}
        aria-hidden="true"
      >
        <input {...getInputProps()} aria-label="PDF 파일 업로드" />
      </div>
      
      {/* 에러 메시지만 표시 */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
          <p className="px-6 py-3 rounded-lg bg-red-950/90 backdrop-blur-sm text-red-200 text-sm drop-shadow-lg border border-red-500/50">
            {error.message}
          </p>
        </div>
      )}
    </>
  )
}


