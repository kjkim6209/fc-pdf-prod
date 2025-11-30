// components/ad-modal.tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { pushAd } from '@/lib/ad-utils'

interface AdModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  publisherId?: string
  adSlotId?: string
}

export default function AdModal({ 
  isOpen, 
  onClose, 
  onContinue, 
  publisherId = 'ca-pub-YOUR_PUBLISHER_ID',
  adSlotId = 'YOUR_AD_SLOT_ID'
}: AdModalProps) {
  const [countdown, setCountdown] = useState(5)
  const [adLoaded, setAdLoaded] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5)
      setAdLoaded(false)
      return
    }

    // AdSense 광고 푸시
    pushAd()

    // 광고 로드 대기 (1초 후 광고가 로드된 것으로 간주)
    const loadTimer = setTimeout(() => {
      setAdLoaded(true)
    }, 1000)

    // 카운트다운 시작
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      clearTimeout(loadTimer)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h3 className="mb-4 text-xl font-bold text-white">광고를 시청해주세요</h3>
        
        {/* AdSense 광고 영역 */}
        <div className="mb-4 min-h-[250px] rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
          {adLoaded ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '250px' }}
              data-ad-client={publisherId}
              data-ad-slot={adSlotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          ) : (
            <p className="text-slate-400">광고 로딩 중...</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            건너뛰기
          </Button>
          <Button 
            onClick={onContinue} 
            disabled={countdown > 0}
            className="min-w-[150px]"
          >
            {countdown > 0 ? `다운로드 계속 (${countdown}초)` : '다운로드 계속'}
          </Button>
        </div>
      </div>
    </div>
  )
}

