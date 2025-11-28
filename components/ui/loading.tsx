interface LoadingProps {
  progress?: number
}

export default function Loading({ progress }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <div className="w-full max-w-xs">
        <p className="text-center text-gray-600 mb-2">
          {progress !== undefined ? `처리 중... ${progress}%` : '처리 중...'}
        </p>
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}

