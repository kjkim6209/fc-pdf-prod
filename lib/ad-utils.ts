// lib/ad-utils.ts

/**
 * Google AdSense 광고를 표시하고 완료될 때까지 대기합니다.
 */
export function showAdBeforeDownload(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    // AdSense가 로드되었는지 확인
    const adsbygoogle = (window as any).adsbygoogle
    if (!adsbygoogle) {
      // AdSense가 로드되지 않았으면 바로 진행
      resolve()
      return
    }

    // 광고 표시 시간 (3초)
    setTimeout(() => {
      resolve()
    }, 3000)
  })
}

/**
 * AdSense 광고를 푸시합니다 (광고 새로고침)
 */
export function pushAd(): void {
  if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (error) {
      console.error('AdSense 광고 푸시 오류:', error)
    }
  }
}

