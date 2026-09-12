// Cookie attributes chuẩn production cho BFF same-origin (proxy qua /api/v1).
// - Token không bao giờ vào JS: chỉ đi qua HttpOnly cookie.
// - secure=true ở production (bắt buộc HTTPS), false ở dev để không bị Chrome flag trên http://localhost.

const isProd = process.env.NODE_ENV === 'production';

export const ACCESS_COOKIE = 'accessToken';
export const REFRESH_COOKIE = 'refreshToken';

// Fallback khi không parse được exp từ JWT (đồng bộ với BE nếu có thể)
export const ACCESS_MAX_AGE_FALLBACK = 15 * 60; // 15 phút
export const REFRESH_MAX_AGE_FALLBACK = 7 * 24 * 60 * 60; // 7 ngày

function maxAgeFromJwt(token: string | null, fallback: number): number {
  if (!token) return fallback;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'),
    );
    if (payload?.exp) {
      const ttl = payload.exp - Math.floor(Date.now() / 1000);
      // Trừ hao 30s, chặn giá trị dị thường (<=0 hoặc > fallback của refresh)
      if (ttl > 30) return Math.min(ttl - 30, REFRESH_MAX_AGE_FALLBACK);
    }
  } catch {
    // bỏ qua, dùng fallback
  }
  return fallback;
}

export function accessCookieOptions(token: string | null) {
  return {
    httpOnly: true as const,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeFromJwt(token, ACCESS_MAX_AGE_FALLBACK),
  };
}

export function refreshCookieOptions(token: string | null) {
  return {
    httpOnly: true as const,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeFromJwt(token, REFRESH_MAX_AGE_FALLBACK),
  };
}

// Options dùng khi XÓA cookie — phải khớp path/sameSite lúc set thì browser mới xóa được
export function clearCookieOptions() {
  return {
    httpOnly: true as const,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}

// Loại token ra khỏi body trả về client — nguồn duy nhất của token là HttpOnly cookie
export function stripTokens<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  const clone: Record<string, unknown> =
    Array.isArray(obj) ? [...(obj as unknown[])] as unknown as Record<string, unknown>
    : { ...(obj as Record<string, unknown>) };
  for (const key of [
    'accessToken', 'access_token', 'refreshToken', 'refresh_token', 'jwt', 'jwtToken',
  ]) {
    delete clone[key];
  }
  // Strip nested `data` object (BE hay bọc trong data)
  if (clone.data && typeof clone.data === 'object') {
    clone.data = stripTokens(clone.data);
  }
  return clone as T;
}
