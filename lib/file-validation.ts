import { UploadError } from '@/types'

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_TYPES = ['application/pdf']

export function validateFile(file: File): { valid: boolean; error?: UploadError } {
  // 파일 타입 검증
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: {
        type: 'INVALID_TYPE',
        message: 'PDF 파일만 업로드 가능합니다.',
      },
    }
  }

  // 파일 크기 검증
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: {
        type: 'FILE_TOO_LARGE',
        message: `파일 크기는 ${MAX_FILE_SIZE / 1024 / 1024}MB 이하여야 합니다.`,
      },
    }
  }

  return { valid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

