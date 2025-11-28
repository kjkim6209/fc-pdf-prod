'use client'

import { UploadError } from '@/types'

interface ErrorMessageProps {
  error: UploadError
  onRetry?: () => void
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const getErrorMessage = (error: UploadError): string => {
    switch (error.type) {
      case 'INVALID_TYPE':
        return 'PDF 파일만 업로드할 수 있습니다. 다른 형식의 파일은 지원하지 않습니다.'
      case 'FILE_TOO_LARGE':
        return '파일 크기가 너무 큽니다. 100MB 이하의 파일만 업로드할 수 있습니다.'
      case 'READ_ERROR':
        return 'PDF 파일을 읽는 중 오류가 발생했습니다. 파일이 손상되었을 수 있습니다.'
      case 'UNKNOWN':
        return '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.'
      default:
        return error.message
    }
  }

  return (
    <div className="p-4 bg-red-950/40 border border-red-700/50 rounded-lg text-red-100">
      <div className="flex items-start">
        <svg
          className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <p className="font-medium text-red-200">오류 발생</p>
          <p className="text-sm text-red-300 mt-1">{getErrorMessage(error)}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm text-red-300 hover:text-red-200 underline"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

