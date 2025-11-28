import JSZip from 'jszip'
import { sanitizeFileName } from './download'

export interface ZipDownloadOptions {
  splitPdfs: Uint8Array[]
  originalFileName: string
  selectedPages?: number[] // 선택된 페이지 인덱스 배열 (없으면 전체)
}

export async function downloadAsZip(options: ZipDownloadOptions): Promise<void> {
  try {
    const { splitPdfs, originalFileName, selectedPages } = options
    
    // ZIP 파일 생성
    const zip = new JSZip()
    const baseName = sanitizeFileName(originalFileName.replace(/\.pdf$/i, ''))
    
    // 다운로드할 페이지 결정
    const pagesToDownload = selectedPages 
      ? selectedPages.filter(index => index >= 0 && index < splitPdfs.length)
      : Array.from({ length: splitPdfs.length }, (_, i) => i)
    
    if (pagesToDownload.length === 0) {
      throw new Error('다운로드할 페이지가 없습니다.')
    }
    
    // 각 페이지를 ZIP에 추가
    for (const pageIndex of pagesToDownload) {
      const pdfBytes = splitPdfs[pageIndex]
      const fileName = `${baseName}-page-${pageIndex + 1}.pdf`
      zip.file(fileName, pdfBytes)
    }
    
    // ZIP 파일 생성
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    // 다운로드
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${baseName}-pages.zip`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    
    // 정리
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error('ZIP 다운로드 오류:', error)
    throw new Error('ZIP 파일 생성 중 오류가 발생했습니다.')
  }
}

