/**
 * @deprecated Backend là nguồn DUY NHẤT quản lý (Set-Cookie / Clear-Cookie) các cookie auth:
 * accessToken, refreshToken, forgotPasswordToken (kèm Domain, HttpOnly, SameSite).
 * Frontend/BFF tuyệt đối KHÔNG tự ý set hoặc clear các cookie này để tránh lỗi "4 token / 2 domain".
 * File này được giữ lại cho mục đích tương thích ngược và tiện ích xử lý dữ liệu (stripTokens).
 */

export const ACCESS_COOKIE = 'accessToken';
export const REFRESH_COOKIE = 'refreshToken';

export const ACCESS_MAX_AGE_FALLBACK = 15 * 60; // 15 phút
export const REFRESH_MAX_AGE_FALLBACK = 7 * 24 * 60 * 60; // 7 ngày

/**
 * @deprecated Không sử dụng để set cookie auth trên FE/BFF nữa.
 */
export function accessCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}

/**
 * @deprecated Không sử dụng để set cookie auth trên FE/BFF nữa.
 */
export function refreshCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}

/**
 * @deprecated Không sử dụng để clear cookie auth trên FE/BFF nữa (Backend logout tự clear cookie domain).
 */
export function clearCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
}

/**
 * Loại token ra khỏi body trả về client nếu có (phòng thủ chiều sâu).
 */
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
  if (clone.data && typeof clone.data === 'object') {
    clone.data = stripTokens(clone.data);
  }
  return clone as T;
}
