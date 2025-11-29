'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#080D17] to-slate-900">
          <div className="text-center bg-slate-900/60 border border-slate-800 rounded-2xl px-8 py-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-slate-100">
            <h2 className="text-2xl font-bold mb-4 text-white">심각한 오류가 발생했습니다</h2>
            <p className="text-slate-300 mb-6">{error.message}</p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

