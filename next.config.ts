import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'cdn.hstatic.net',
      }
    ],
  },
  async rewrites() {
    // Chuẩn hóa backend base để luôn là .../api/v1:
    // - env `.../api` (thiếu v1) -> thêm `/v1`
    // - env `.../api/v1` -> giữ nguyên (tránh double /api/v1/api/v1)
    const raw =
      process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api/v1';
    const cleaned = raw
      .replace(/^['"]|['"]$/g, '')
      .trim()
      .replace(/\/+$/, '');
    const backendBase = cleaned.endsWith('/api/v1')
      ? cleaned
      : cleaned.endsWith('/api')
        ? `${cleaned}/v1`
        : `${cleaned}/api/v1`;
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
