import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  accessCookieOptions,
  clearCookieOptions,
  refreshCookieOptions,
  stripTokens,
} from '@/lib/auth-cookies';
import { backendHostForLog, getBackendBaseUrl } from '@/lib/backend-url';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: 'Không có refresh token' }, { status: 401 });
    }

    const baseUrl = getBackendBaseUrl();
    const response = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const res = NextResponse.json(stripTokens(data), { status: response.status });
      // If refresh fails, clear cookies (path/sameSite phải khớp lúc set)
      res.cookies.set('accessToken', '', clearCookieOptions());
      res.cookies.set('refreshToken', '', clearCookieOptions());
      return res;
    }

    // Extract token more robustly
    let token = null;
    let newRefreshToken = null;

    if (typeof data === 'string') {
      token = data;
    } else if (data && typeof data === 'object') {
      // Find token at root
      token = data.accessToken || data.token || data.access_token || data.jwt || data.jwtToken;
      newRefreshToken = data.refreshToken || data.refresh_token;

      // Find token in nested objects
      if (!token) {
        for (const key in data) {
          if (data[key] && typeof data[key] === 'object') {
            token = data[key].accessToken || data[key].token || data[key].access_token || data[key].jwt || data[key].jwtToken;
            newRefreshToken = data[key].refreshToken || data[key].refresh_token;
            if (token) break;
          }
        }
      }
    }

    // Chuẩn production: KHÔNG forward raw Set-Cookie từ backend (sai Domain),
    // cũng KHÔNG trả token về JS — tự set lại cookie trên domain của FE.
    const res = NextResponse.json(stripTokens(data));

    if (token) {
      res.cookies.set('accessToken', token, accessCookieOptions(token));
    }

    if (newRefreshToken) {
      res.cookies.set('refreshToken', newRefreshToken, refreshCookieOptions(newRefreshToken));
    }

    return res;
  } catch (error) {
    const unreachable = error instanceof TypeError;
    console.error(`Refresh Token Proxy Error (backend=${backendHostForLog()}):`, error);
    const res = NextResponse.json(
      { message: unreachable ? 'Không thể kết nối máy chủ. Vui lòng thử lại sau.' : 'Lỗi máy chủ nội bộ' },
      { status: unreachable ? 503 : 500 }
    );
    res.cookies.set('accessToken', '', clearCookieOptions());
    res.cookies.set('refreshToken', '', clearCookieOptions());
    return res;
  }
}
