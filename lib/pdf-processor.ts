import { PDFDocument } from 'pdf-lib'

export interface SplitPdfResult {
  success: boolean
  totalPages: number
  splitPdfs: Uint8Array[]
  error?: string
}

export async function splitPdfIntoPages(
  file: File,
  onProgress?: (progress: number) => void
): Promise<SplitPdfResult> {
  try {
    // 파일을 ArrayBuffer로 읽기
    const arrayBuffer = await file.arrayBuffer()
    
    // PDF 로드
    const sourcePdf = await PDFDocument.load(arrayBuffer)
    const totalPages = sourcePdf.getPageCount()

    if (totalPages === 0) {
      return {
        success: false,
        totalPages: 0,
        splitPdfs: [],
        error: 'PDF 파일에 페이지가 없습니다.',
      }
    }

    // 각 페이지를 개별 PDF로 분할
    const splitPdfs: Uint8Array[] = []

    for (let i = 0; i < totalPages; i++) {
      // 새 PDF 문서 생성
      const newPdf = await PDFDocument.create()
      
      // 원본 PDF에서 페이지 복사
      const [copiedPage] = await newPdf.copyPages(sourcePdf, [i])
      
      // 새 PDF에 페이지 추가
      newPdf.addPage(copiedPage)
      
      // PDF를 바이트 배열로 저장
      const pdfBytes = await newPdf.save()
      splitPdfs.push(pdfBytes)

      // 진행률 업데이트
      if (onProgress) {
        const progress = Math.round(((i + 1) / totalPages) * 100)
        onProgress(progress)
      }
    }

    console.log(`${totalPages}페이지 분할 완료`)

    return {
      success: true,
      totalPages,
      splitPdfs,
    }
  } catch (error) {
    console.error('PDF 처리 오류:', error)
    return {
      success: false,
      totalPages: 0,
      splitPdfs: [],
      error: error instanceof Error ? error.message : 'PDF 처리 중 오류가 발생했습니다.',
    }
  }
}

