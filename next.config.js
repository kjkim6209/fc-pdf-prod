/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Spline 라이브러리 관련 설정
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  // 외부 이미지 도메인 허용
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod.spline.design',
      },
    ],
  },
}

module.exports = nextConfig

