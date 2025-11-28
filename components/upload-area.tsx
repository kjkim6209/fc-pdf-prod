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
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-300 bg-slate-900/70 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.35)] cursor-pointer ${
          isDragActive
            ? 'border-blue-400 bg-blue-950/40 scale-[1.01]'
            : error
            ? 'border-red-500/60 bg-red-950/30'
            : 'border-slate-700 hover:border-slate-500'
        }`}
      >
        <input {...getInputProps()} aria-label="PDF 파일 업로드" />
        <div className="space-y-4">
          <p className="text-5xl">📄</p>
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-slate-50">
              {isDragActive ? '여기에 파일을 놓으세요' : 'PDF를 드래그하거나 클릭해서 업로드'}
            </p>
            <p className="text-sm text-slate-400">최대 100MB, 한 번에 하나의 파일만 지원합니다.</p>
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-6 text-center text-sm text-red-400">{error.message}</p>
      )}
    </div>
  )
}


