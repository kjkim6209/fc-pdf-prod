export function downloadPdf(
  pdfBytes: Uint8Array,
  fileName: string
): void {
  try {
    // Blob 생성
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    
    // Blob URL 생성
    const url = URL.createObjectURL(blob)
    
    // 다운로드 링크 생성
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    
    // 다운로드 트리거
    link.click()
    
    // 정리 (약간의 지연 후 정리하여 다운로드가 완료되도록 함)
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }
      URL.revokeObjectURL(url)
    }, 100)
  } catch (error) {
    console.error('다운로드 오류:', error)
    throw new Error('파일 다운로드 중 오류가 발생했습니다.')
  }
}

export function getDownloadFileName(
  originalFileName: string,
  pageNumber: number
): string {
  // 파일 확장자 제거
  const nameWithoutExt = originalFileName.replace(/\.pdf$/i, '')
  
  // 파일명에서 특수문자 정리 (파일 시스템 호환성을 위해)
  // Windows에서 허용되지 않는 문자: < > : " / \ | ? *
  const sanitizedName = nameWithoutExt
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 200) // 파일명 길이 제한
  
  // 새 파일명 생성
  return `${sanitizedName}-page-${pageNumber}.pdf`
}

export function sanitizeFileName(fileName: string): string {
  // 파일명에서 특수문자 정리
  return fileName
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 200)
}

