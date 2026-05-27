import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// --- CẤU HÌNH CÁC ĐƯỜNG DẪN ---
const authRoutes = ['/login', '/register']; 
const protectedRoutes = ['/wardrobe', '/profile']; // Trang cho mọi user đăng nhập
const adminRoutes = ['/dashboard']; // Trang chỉ dành cho ADMIN

// Hàm giải mã JWT Token (Base64) ở môi trường Edge Runtime
function parseJwt(token: string) {
  try {
    // JWT có format: header.payload.signature -> Lấy phần payload (index 1)
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload); // Trả về object payload (chứa role)
  } catch (e) {
    return null; // Token sai định dạng
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Lấy token từ cookies
  const token = request.cookies.get('accessToken')?.value;
  let role = null;

  // Nếu có token, tiến hành giải mã để lấy quyền (role)
  if (token) {
    const payload = parseJwt(token);
    // Lưu ý: Key 'role' này phải khớp với cách Backend thiết lập trong JWT
    // Ví dụ payload backend trả ra: { userId: 1, role: "ADMIN" }
    role = payload?.role; 
  }

  // 1. Kiểm tra Auth Routes (Vào /login khi đã đăng nhập)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute) {
    if (token) {
      // Đã đăng nhập -> Đẩy về đúng trang tùy theo Role
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/wardrobe', request.url));
    }
    // Chưa đăng nhập -> Cho phép vào /login
    return NextResponse.next();
  }

  // 2. Kiểm tra Protected Routes (User thường)
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 3. Kiểm tra Admin Routes (Chỉ Admin)
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!token) {
      // Chưa đăng nhập
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (role !== 'ADMIN') {
      // Có token nhưng không phải ADMIN -> Đẩy về trang của User thường (VD: /wardrobe)
      // Nếu không có trang fallback, có thể đổi thành / (trang chủ)
      return NextResponse.redirect(new URL('/wardrobe', request.url)); 
    }
    return NextResponse.next();
  }

  // Các trang công khai (public) khác -> Cho phép đi qua
  return NextResponse.next();
}

// Chỉ định Middleware chạy trên các đường dẫn nào (bỏ qua file tĩnh, api)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
