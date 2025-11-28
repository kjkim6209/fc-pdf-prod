'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { validateFile, formatFileSize } from '@/lib/file-validation'
import { splitPdfIntoPages } from '@/lib/pdf-processor'
import { FileInfo, UploadError, PdfSplitData } from '@/types'
import Loading from '@/components/ui/loading'
import ErrorMessage from '@/components/error-message'

interface UploadAreaProps {
  onPdfProcessed: (data: PdfSplitData) => void
}

export default function UploadArea({ onPdfProcessed }: UploadAreaProps) {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [error, setError] = useState<UploadError | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const processPdf = useCallback(async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)

    try {
      const result = await splitPdfIntoPages(file, (progressValue) => {
        setProgress(progressValue)
      })

      if (result.success) {
        console.log('PDF 분할 완료:', {
          totalPages: result.totalPages,
          splitPdfCount: result.splitPdfs.length,
        })
        // 부모 컴포넌트에 결과 전달
        onPdfProcessed({
          originalFileName: file.name,
          totalPages: result.totalPages,
          splitPdfs: result.splitPdfs,
        })
      } else {
        setError({
          type: 'READ_ERROR',
          message: result.error || 'PDF 처리 중 오류가 발생했습니다.',
        })
      }
    } catch (err) {
      setError({
        type: 'UNKNOWN',
        message: '예상치 못한 오류가 발생했습니다.',
      })
    } finally {
      setIsProcessing(false)
    }
  }, [onPdfProcessed])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null)
    
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    const validation = validateFile(file)

    if (!validation.valid) {
      setError(validation.error!)
      setFileInfo(null)
      return
    }

    // 파일 정보 저장
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // PDF 처리 시작
    await processPdf(file)
  }, [processPdf])

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    disabled: isProcessing,
  })

  // 드래그 상태 동기화
  useEffect(() => {
    setIsDragActive(dropzoneActive)
  }, [dropzoneActive])

  const handleFileSelect = () => {
    if (isProcessing) return
    
    setError(null)
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const validation = validateFile(file)
        if (validation.valid) {
          setFileInfo({
            name: file.name,
            size: file.size,
            type: file.type,
          })
          await processPdf(file)
        } else {
          setError(validation.error!)
        }
      }
    }
    input.click()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">PDF 파일 업로드</CardTitle>
        <CardDescription className="text-center">
          PDF 파일을 드래그하거나 클릭하여 업로드하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing ? (
          <Loading progress={progress} />
        ) : (
          <>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : error
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="text-4xl">📄</div>
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive
                      ? '파일을 여기에 놓으세요'
                      : 'PDF 파일을 여기에 드래그하세요'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">또는</p>
                </div>
                <Button
                  onClick={handleFileSelect}
                  disabled={isProcessing}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      if (!isProcessing) {
                        handleFileSelect()
                      }
                    }
                  }}
                  aria-label="PDF 파일 선택"
                >
                  파일 선택
                </Button>
              </div>
            </div>

            {fileInfo && !isProcessing && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-800">파일 업로드 완료</p>
                <p className="text-sm text-green-600 mt-1">
                  {fileInfo.name} ({formatFileSize(fileInfo.size)})
                </p>
              </div>
            )}

            {error && (
              <ErrorMessage
                error={error}
                onRetry={() => {
                  setError(null)
                  setFileInfo(null)
                }}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}


