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

export function middleware(request: NextRequest) {
  // =====================================================================
  // CHẾ ĐỘ MOCK: Cho phép tất cả các route đi qua mà không kiểm tra JWT.
  // Khi kết nối Backend thật (có API login trả JWT cookie), hãy bỏ comment
  // đoạn logic bên dưới và xóa dòng return NextResponse.next() này.
  // =====================================================================
  return NextResponse.next();

  // --- LOGIC GỐC (bật lại khi có Backend) ---
  // const { pathname } = request.nextUrl;
  // const token = request.cookies.get('accessToken')?.value;
  // let role = null;
  //
  // if (token) {
  //   const payload = parseJwt(token);
  //   role = payload?.role; 
  // }
  //
  // // 1. Auth Routes
  // const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  // if (isAuthRoute) {
  //   if (token) {
  //     if (role === 'ADMIN') {
  //       return NextResponse.redirect(new URL('/dashboard', request.url));
  //     }
  //     return NextResponse.redirect(new URL('/wardrobe', request.url));
  //   }
  //   return NextResponse.next();
  // }
  //
  // // 2. Protected Routes
  // const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  // if (isProtectedRoute) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }
  //   return NextResponse.next();
  // }
  //
  // // 3. Admin Routes
  // const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  // if (isAdminRoute) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }
  //   if (role !== 'ADMIN') {
  //     return NextResponse.redirect(new URL('/wardrobe', request.url)); 
  //   }
  //   return NextResponse.next();
  // }
  //
  // return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

