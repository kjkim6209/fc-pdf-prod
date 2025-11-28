export interface FileInfo {
  name: string
  size: number
  type: string
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export interface UploadError {
  type: 'INVALID_TYPE' | 'FILE_TOO_LARGE' | 'READ_ERROR' | 'UNKNOWN'
  message: string
}

export type AppState = 'upload' | 'processing' | 'result' | 'error'

export interface PdfSplitData {
  originalFileName: string
  totalPages: number
  splitPdfs: Uint8Array[]
}

