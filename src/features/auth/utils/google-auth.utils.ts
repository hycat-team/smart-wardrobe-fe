import { AUTH_RETURN_URL_KEY, GoogleAuthErrorCode } from '../types/google-auth.types';

/**
 * Normalizes backend base URL to ensure it has /api/v1 suffix without trailing slash
 */
export function getBackendApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
  const cleaned = raw.replace(/^['"]|['"]$/g, '').trim().replace(/\/+$/, '');
  if (cleaned.endsWith('/api/v1')) return cleaned;
  if (cleaned.endsWith('/api')) return `${cleaned}/v1`;
  return `${cleaned}/api/v1`;
}

/**
 * Builds the Frontend callback return URL
 */
export function getFrontendCallbackUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/auth/callback`;
}

/**
 * Constructs the full Google OAuth initiation URL pointing to backend
 */
export function buildGoogleAuthUrl(): string {
  const callbackUrl = getFrontendCallbackUrl();
  const apiBase = getBackendApiBase();
  return `${apiBase}/auth/google?redirectUrl=${encodeURIComponent(callbackUrl)}`;
}

/**
 * Validates that a return URL is a safe internal relative path
 * Prevents Open Redirect vulnerabilities (e.g. //evil.com or javascript:)
 */
export function isValidReturnUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  // Must start with a single slash
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return false;
  // Must not contain protocol schemes or backslashes
  if (trimmed.includes('\\') || trimmed.includes(':')) return false;
  return true;
}

/**
 * Saves a return destination URL to sessionStorage before redirecting to Google
 */
export function saveReturnUrl(url: string | null | undefined): void {
  if (typeof window === 'undefined') return;
  if (isValidReturnUrl(url)) {
    try {
      sessionStorage.setItem(AUTH_RETURN_URL_KEY, url!.trim());
    } catch {
      // Storage unavailable or disabled
    }
  }
}

/**
 * Retrieves and clears the return destination URL from sessionStorage
 */
export function getAndClearReturnUrl(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = sessionStorage.getItem(AUTH_RETURN_URL_KEY);
    sessionStorage.removeItem(AUTH_RETURN_URL_KEY);
    if (isValidReturnUrl(saved)) {
      return saved!.trim();
    }
  } catch {
    // Storage unavailable or disabled
  }
  return null;
}

export interface MappedGoogleAuthError {
  message: string;
  type: 'info' | 'error';
}

/**
 * Maps standard backend/OAuth error codes to user-friendly Vietnamese notifications
 */
export function mapGoogleAuthError(errorCode: string | null | undefined): MappedGoogleAuthError {
  if (!errorCode) {
    return {
      message: 'Đăng nhập Google không thành công. Vui lòng thử lại.',
      type: 'error',
    };
  }

  const code = errorCode.toLowerCase() as GoogleAuthErrorCode;

  switch (code) {
    case 'access_denied':
      return {
        message: 'Bạn đã huỷ đăng nhập bằng Google.',
        type: 'info',
      };
    case 'email_unverified':
      return {
        message: 'Email tài khoản Google chưa được xác thực. Vui lòng xác thực email với Google.',
        type: 'error',
      };
    case 'email_registered':
      return {
        message: 'Email này đã được đăng ký trong hệ thống. Vui lòng đăng nhập bằng mật khẩu.',
        type: 'error',
      };
    case 'account_linked':
      return {
        message: 'Email đã được liên kết với một tài khoản Google khác.',
        type: 'error',
      };
    case 'account_disabled':
      return {
        message: 'Tài khoản của bạn đã bị vô hiệu hoá. Vui lòng liên hệ CSKH Closy để được hỗ trợ.',
        type: 'error',
      };
    case 'exchange_failed':
      return {
        message: 'Xác thực tài khoản Google thất bại hoặc phiên đã hết hạn. Vui lòng thử lại.',
        type: 'error',
      };
    case 'server_error':
      return {
        message: 'Có lỗi xảy ra từ hệ thống máy chủ. Vui lòng thử lại sau giây lát.',
        type: 'error',
      };
    default:
      return {
        message: 'Đăng nhập Google không thành công. Vui lòng thử lại.',
        type: 'error',
      };
  }
}
