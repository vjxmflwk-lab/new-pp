/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 환경에서 모바일 기기 접속을 허용하기 위한 설정
  experimental: {
    // 서버 액션이 허용할 도메인/IP 목록입니다.
    serverActions: {
      allowedOrigins: [
        // "localhost:3000",
        // "127.0.0.1:3000",
        // "192.168.45.232:3000", // PC 내부 IP
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
};

export default nextConfig;
