/**
 * Tiện ích dọn dẹp cookie và dữ liệu phiên cục bộ phiên bản cũ (Legacy host-only cleanup).
 * Đảm bảo trình duyệt người dùng không còn lưu tàn dư token host-only hay token trong storage.
 */

const CLEANUP_KEY = 'closy_auth_legacy_cleanup_v1';

export function cleanLegacyHostCookies(): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Dọn dẹp cookie non-HttpOnly dạng host-only trên đường dẫn root
    const cookieNames = ['accessToken', 'refreshToken', 'forgotPasswordToken', 'token'];
    for (const name of cookieNames) {
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0;`;
    }

    // 2. Dọn dẹp token legacy có thể còn sót trong localStorage từ các phiên bản rất cũ
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');

    // Đánh dấu đã dọn dẹp cho phiên hiện tại
    sessionStorage.setItem(CLEANUP_KEY, 'done');
  } catch (error) {
    console.warn('[auth-cleanup] Error cleaning legacy tokens:', error);
  }
}
