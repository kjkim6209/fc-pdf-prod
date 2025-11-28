'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PdfSplitData } from '@/types'
import { downloadPdf, getDownloadFileName } from '@/lib/download'
import { downloadAsZip } from '@/lib/zip-download'

interface ResultViewProps {
  pdfData: PdfSplitData
  onReset: () => void
}

export default function ResultView({ pdfData, onReset }: ResultViewProps) {
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)

  const handleDownload = (pageIndex: number) => {
    try {
      if (!pdfData.splitPdfs[pageIndex]) {
        console.error(`페이지 ${pageIndex + 1}의 데이터가 없습니다.`)
        return
      }
      
      const pdfBytes = pdfData.splitPdfs[pageIndex]
      const fileName = getDownloadFileName(
        pdfData.originalFileName,
        pageIndex + 1
      )
      downloadPdf(pdfBytes, fileName)
    } catch (error) {
      console.error('다운로드 중 오류 발생:', error)
      alert('파일 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const handleToggleSelect = (pageIndex: number) => {
    const newSelected = new Set(selectedPages)
    if (newSelected.has(pageIndex)) {
      newSelected.delete(pageIndex)
    } else {
      newSelected.add(pageIndex)
    }
    setSelectedPages(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedPages.size === pdfData.totalPages) {
      setSelectedPages(new Set())
    } else {
      setSelectedPages(new Set(Array.from({ length: pdfData.totalPages }, (_, i) => i)))
    }
  }

  const handleDownloadSelected = async () => {
    if (selectedPages.size === 0) {
      alert('다운로드할 페이지를 선택해주세요.')
      return
    }

    try {
      setIsDownloadingZip(true)
      await downloadAsZip({
        splitPdfs: pdfData.splitPdfs,
        originalFileName: pdfData.originalFileName,
        selectedPages: Array.from(selectedPages),
      })
    } catch (error) {
      console.error('ZIP 다운로드 중 오류 발생:', error)
      alert('ZIP 파일 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsDownloadingZip(false)
    }
  }

  const handleDownloadAll = async () => {
    try {
      setIsDownloadingZip(true)
      await downloadAsZip({
        splitPdfs: pdfData.splitPdfs,
        originalFileName: pdfData.originalFileName,
      })
    } catch (error) {
      console.error('ZIP 다운로드 중 오류 발생:', error)
      alert('ZIP 파일 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsDownloadingZip(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">PDF 분할 완료</CardTitle>
        <CardDescription className="text-center">
          원본 파일: {pdfData.originalFileName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-medium text-blue-800">
            총 {pdfData.totalPages}페이지가 분할되었습니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={handleSelectAll}
            variant="outline"
            size="sm"
          >
            {selectedPages.size === pdfData.totalPages ? '전체 해제' : '전체 선택'}
          </Button>
          <Button
            onClick={handleDownloadSelected}
            variant="outline"
            size="sm"
            disabled={selectedPages.size === 0 || isDownloadingZip}
          >
            {isDownloadingZip ? '다운로드 중...' : `선택한 ${selectedPages.size}개 다운로드 (ZIP)`}
          </Button>
          <Button
            onClick={handleDownloadAll}
            variant="outline"
            size="sm"
            disabled={isDownloadingZip}
          >
            {isDownloadingZip ? '다운로드 중...' : '전체 다운로드 (ZIP)'}
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">분할된 페이지 목록</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: pdfData.totalPages }).map((_, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-200 hover:scale-105 animate-fadeIn"
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPages.has(index)}
                        onChange={() => handleToggleSelect(index)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        aria-label={`페이지 ${index + 1} 선택`}
                      />
                      <div className="text-3xl">📄</div>
                    </div>
                    <div>
                      <p className="font-medium">페이지 {index + 1}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {getDownloadFileName(pdfData.originalFileName, index + 1)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDownload(index)}
                      className="w-full"
                      size="sm"
                      aria-label={`페이지 ${index + 1} 다운로드`}
                    >
                      다운로드
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={onReset}
            variant="outline"
            aria-label="새 파일 업로드"
          >
            새 파일 업로드
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

