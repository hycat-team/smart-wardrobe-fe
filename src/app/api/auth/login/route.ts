import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Extract token more robustly
    let token = null;
    let refreshToken = null;

    if (typeof data === 'string') {
      token = data;
    } else if (data && typeof data === 'object') {
      // Find token at root
      token = data.accessToken || data.token || data.access_token || data.jwt || data.jwtToken;
      refreshToken = data.refreshToken || data.refresh_token;

      // Find token in nested objects (like data.data or data.payload)
      if (!token) {
        for (const key in data) {
          if (data[key] && typeof data[key] === 'object') {
            token = data[key].accessToken || data[key].token || data[key].access_token || data[key].jwt || data[key].jwtToken;
            refreshToken = data[key].refreshToken || data[key].refresh_token;
            if (token) break;
          }
        }
      }
    }

    const res = NextResponse.json(data);

    // Forward Set-Cookie headers from backend if they exist
    const setCookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
    if (setCookies && setCookies.length > 0) {
      setCookies.forEach((cookie) => {
        res.headers.append('Set-Cookie', cookie);
      });
    }

    if (token) {
      res.cookies.set('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    if (refreshToken) {
      res.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return res;
  } catch (error) {
    console.error('Login Proxy Error:', error);
    return NextResponse.json({ detail: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}
