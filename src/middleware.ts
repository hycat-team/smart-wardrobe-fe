import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware trong Next.js App Router:
 * - Đọc cookie phiên và chuyển tiếp headers cho Server Components (page.tsx / layout.tsx).
 * - TUYỆT ĐỐI KHÔNG tự ý set hoặc delete cookie auth (accessToken, refreshToken, forgotPasswordToken)
 *   tại đây để tránh phát sinh cookie host-only gây xung đột "4 token / 2 domain".
 * - Cơ chế xoay vòng token (refresh token) được quản lý tập trung và an toàn bởi Axios Response Interceptor
 *   trên Client kết hợp cùng Next.js rewrite proxy tới Backend.
 */
export async function middleware(request: NextRequest) {
  const headersToForward = new Headers(request.headers);

  // Chuyển tiếp request với headers đầy đủ cho downstream handlers / Server Components
  return NextResponse.next({
    request: { headers: headersToForward },
  });
}

export const config = {
  matcher: [
    '/api/v1/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
