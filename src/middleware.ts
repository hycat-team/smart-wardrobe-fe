import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// Hàm giải mã JWT Token (Base64) ở môi trường Edge Runtime
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.log(e);
    return null;
  }
}

// Kiểm tra xem token còn hạn không (trước 10 giây để an toàn)
function isTokenExpired(token: string) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp <= currentTime + 10; 
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const headersToForward = new Headers(request.headers);
  let backendSetCookies: string[] = [];
  let isRefreshFailed = false;

  // 1. CHẶN VÀ KIỂM TRA HẠN TOKEN
  if (accessToken && isTokenExpired(accessToken) && refreshToken) {
    try {
      // Gọi API refresh token tới Backend
      const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Cookie': `refreshToken=${refreshToken}`
        }
      });

      if (refreshRes.ok) {
        backendSetCookies = refreshRes.headers.getSetCookie();
        
        let newAccessToken = '';
        let newRefreshToken = '';

        // Phân tích Cookie trả về từ Backend
        for (const cookieStr of backendSetCookies) {
          const [nameValue] = cookieStr.split(';');
          const [name, ...valueParts] = nameValue.split('=');
          const value = valueParts.join('=');
          if (name.trim() === 'accessToken') newAccessToken = value.trim();
          if (name.trim() === 'refreshToken') newRefreshToken = value.trim();
        }

        if (newAccessToken) {
          accessToken = newAccessToken; // Cập nhật token hiện tại
          
          // Ghi đè header Cookie để Server Components (page.tsx) đằng sau nhận token mới
          const updatedCookies = request.cookies.getAll().map(c => {
             if (c.name === 'accessToken') return `accessToken=${newAccessToken}`;
             if (c.name === 'refreshToken' && newRefreshToken) return `refreshToken=${newRefreshToken}`;
             return `${c.name}=${c.value}`;
          }).join('; ');
          
          headersToForward.set('cookie', updatedCookies);
        }
      } else {
        // Backend trả về 4011 -> Refresh token cũng đã chết
        isRefreshFailed = true;
      }
    } catch (error) {
      console.error("Middleware refresh token error:", error);
      isRefreshFailed = true;
    }
  }

  // 2. XỬ LÝ NẾU REFRESH THẤT BẠI
  if (isRefreshFailed) {
    // Nếu là API Proxy Request (Client đang gọi)
    if (pathname.startsWith('/api/v1/')) {
      const errorRes = new NextResponse(JSON.stringify({ message: 'Session expired', detail: '4011' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
      errorRes.cookies.delete('accessToken');
      errorRes.cookies.delete('refreshToken');
      return errorRes;
    } 
    // Nếu là Page Request
    else {
      // Không tự động redirect ở middleware để tránh ảnh hưởng các trang public (landing page).
      // Việc bảo vệ route (auth guard) sẽ do các Server/Client Component tự lo.
      const response = NextResponse.next({
        request: { headers: headersToForward }
      });
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }

  // 3. ĐIỀU HƯỚNG REQUEST (PROXY HOẶC NEXT)
  let finalResponse: NextResponse;

  if (pathname.startsWith('/api/v1/')) {
    // Luồng cho Axios gọi tới Next.js API Routes (BFF)
    const remainingPath = pathname.replace('/api/v1', '');
    const backendUrl = new URL(`${BACKEND_URL}${remainingPath}${request.nextUrl.search}`);

    if (accessToken) {
      headersToForward.set('Authorization', `Bearer ${accessToken}`);
    }

    finalResponse = NextResponse.rewrite(backendUrl, {
      request: {
        headers: headersToForward,
      },
    });
  } else {
    // Luồng cho Server Component render trang
    finalResponse = NextResponse.next({
      request: {
        headers: headersToForward,
      }
    });
  }

  // 4. GẮN COOKIE MỚI VÀO RESPONSE (NẾU CÓ REFRESH)
  if (backendSetCookies.length > 0) {
    for (const cookieStr of backendSetCookies) {
      finalResponse.headers.append('Set-Cookie', cookieStr);
    }
  }

  return finalResponse;
}

export const config = {
  matcher: [
    '/api/v1/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
