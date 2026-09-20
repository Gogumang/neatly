import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // public/ 은 서버리스 함수 번들에 들어가지 않는다.
  // 이미지(OG·썸네일)를 그릴 때 쓰는 폰트는 함께 올려야 한다.
  outputFileTracingIncludes: {
    "/**": ["./public/fonts/og/*.otf", "./public/sample-cover.jpg"],
  },
};

export default nextConfig;
