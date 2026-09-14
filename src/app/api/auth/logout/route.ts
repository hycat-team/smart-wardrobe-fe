import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clearCookieOptions } from '@/lib/auth-cookies';
import { getBackendBaseUrl } from '@/lib/backend-url';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    // Chuẩn production: revoke refreshToken ở BE (gửi qua Cookie, không phải Bearer access)
    if (refreshToken) {
      const baseUrl = getBackendBaseUrl();
      await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refreshToken=${refreshToken}`,
        },
      }).catch(console.error); // Ignore errors on logout
    }

    const res = NextResponse.json({ success: true, message: 'Đăng xuất thành công' });

    // Xóa phải khớp path/sameSite lúc set thì browser mới xóa được
    res.cookies.set('accessToken', '', clearCookieOptions());
    res.cookies.set('refreshToken', '', clearCookieOptions());

    return res;
  } catch (error) {
    console.error('Logout Proxy Error:', error);
    // Still clear cookies on error
    const res = NextResponse.json({ message: 'Lỗi máy chủ nội bộ' }, { status: 500 });
    res.cookies.set('accessToken', '', clearCookieOptions());
    res.cookies.set('refreshToken', '', clearCookieOptions());
    return res;
  }
}
