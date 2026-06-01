import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// --- CẤU HÌNH CÁC ĐƯỜNG DẪN ---
// THAM KHẢO: Cấu hình gốc cho khi kết nối Backend thật
// const authRoutes = ['/login', '/register']; 
// const protectedRoutes = ['/wardrobe', '/profile'];
// const adminRoutes = ['/dashboard'];

// Hàm giải mã JWT Token (Base64) ở môi trường Edge Runtime
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept API calls intended for the backend
  if (pathname.startsWith('/api/v1/')) {
    const token = request.cookies.get('accessToken')?.value;
    
    // Create a new URL pointing to the backend
    // Remove the /api/v1 prefix from the frontend request since BACKEND_URL already includes it
    // Wait, if BACKEND_URL is http://localhost:8080/api/v1, and request is /api/v1/me
    // We should append the remaining path.
    const remainingPath = pathname.replace('/api/v1', '');
    const backendUrl = new URL(`${BACKEND_URL}${remainingPath}${request.nextUrl.search}`);

    // Clone request headers to modify them
    const requestHeaders = new Headers(request.headers);
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    // Forward the request to the backend with the modified headers
    return NextResponse.rewrite(backendUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // =====================================================================
  // CHẾ ĐỘ MOCK: Cho phép tất cả các route đi qua mà không kiểm tra JWT.
  // Khi kết nối Backend thật (có API login trả JWT cookie), hãy bỏ comment
  // đoạn logic bên dưới và xóa dòng return NextResponse.next() này.
  // =====================================================================
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Bắt thêm cả API routes
    '/api/v1/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

