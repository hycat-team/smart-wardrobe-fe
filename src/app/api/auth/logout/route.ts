import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;

    // Optional: Call the backend to invalidate the token if the backend has a stateful logout
    if (accessToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }).catch(console.error); // Ignore errors on logout
    }

    const res = NextResponse.json({ success: true, message: 'Đăng xuất thành công' });

    res.cookies.delete('accessToken');
    res.cookies.delete('refreshToken');

    return res;
  } catch (error) {
    console.error('Logout Proxy Error:', error);
    // Still clear cookies on error
    const res = NextResponse.json({ message: 'Lỗi máy chủ nội bộ' }, { status: 500 });
    res.cookies.delete('accessToken');
    res.cookies.delete('refreshToken');
    return res;
  }
}
