/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  reactStrictMode: false,
  // 개발 환경에서 모바일 기기 접속을 허용하기 위한 설정
  experimental: {
    // 서버 액션이 허용할 도메인/IP 목록
    serverActions: {
      bodySizeLimit: "30mb", // 원하는 용량으로 설정
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "192.168.45.232:3000", // PC 내부 IP
      ],
    },
  },
  // 에러 메시지에서 제안한 HMR 허용 설정 (버전에 따라 키 이름이 다를 수 있음)
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uwyskfxfmjmhyoikvdlh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(fonts|images)/:path*", // 폰트나 특정 이미지 폴더
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
};

// 1. 분석기 설정 (ESM 방식)
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer(nextConfig);
