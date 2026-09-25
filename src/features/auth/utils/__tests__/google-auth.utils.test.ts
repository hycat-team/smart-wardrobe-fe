import {
  isValidReturnUrl,
  saveReturnUrl,
  getAndClearReturnUrl,
  mapGoogleAuthError,
  buildGoogleAuthUrl,
  getBackendApiBase,
} from '../google-auth.utils';
import { AUTH_RETURN_URL_KEY } from '../../types/google-auth.types';

describe('google-auth.utils', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('isValidReturnUrl', () => {
    it('accepts valid relative internal paths', () => {
      expect(isValidReturnUrl('/wardrobe')).toBe(true);
      expect(isValidReturnUrl('/brands/123')).toBe(true);
      expect(isValidReturnUrl('/profile?tab=settings')).toBe(true);
      expect(isValidReturnUrl('/admin/dashboard')).toBe(true);
    });

    it('rejects protocol-relative and external URLs (anti Open-Redirect)', () => {
      expect(isValidReturnUrl('//evil.com')).toBe(false);
      expect(isValidReturnUrl('//evil.com/phishing')).toBe(false);
      expect(isValidReturnUrl('https://evil.com')).toBe(false);
      expect(isValidReturnUrl('http://attacker.com')).toBe(false);
      expect(isValidReturnUrl('javascript:alert(1)')).toBe(false);
      expect(isValidReturnUrl('\\evil.com')).toBe(false);
      expect(isValidReturnUrl('/\\evil.com')).toBe(false);
    });

    it('rejects null, undefined, empty and whitespace strings', () => {
      expect(isValidReturnUrl(null)).toBe(false);
      expect(isValidReturnUrl(undefined)).toBe(false);
      expect(isValidReturnUrl('')).toBe(false);
      expect(isValidReturnUrl('   ')).toBe(false);
    });
  });

  describe('saveReturnUrl and getAndClearReturnUrl', () => {
    it('saves a valid returnUrl to sessionStorage', () => {
      saveReturnUrl('/wardrobe');
      expect(sessionStorage.getItem(AUTH_RETURN_URL_KEY)).toBe('/wardrobe');
    });

    it('does not save invalid return URLs', () => {
      saveReturnUrl('//evil.com');
      expect(sessionStorage.getItem(AUTH_RETURN_URL_KEY)).toBeNull();
    });

    it('retrieves and clears the returnUrl from sessionStorage', () => {
      sessionStorage.setItem(AUTH_RETURN_URL_KEY, '/saved-outfit');
      const retrieved = getAndClearReturnUrl();

      expect(retrieved).toBe('/saved-outfit');
      expect(sessionStorage.getItem(AUTH_RETURN_URL_KEY)).toBeNull();
    });

    it('returns null if no returnUrl was saved', () => {
      expect(getAndClearReturnUrl()).toBeNull();
    });
  });

  describe('mapGoogleAuthError', () => {
    it('maps access_denied correctly as info', () => {
      const res = mapGoogleAuthError('access_denied');
      expect(res.type).toBe('info');
      expect(res.message).toBe('Bạn đã huỷ đăng nhập bằng Google.');
    });

    it('maps email_unverified error', () => {
      const res = mapGoogleAuthError('email_unverified');
      expect(res.type).toBe('error');
      expect(res.message).toContain('chưa được xác thực');
    });

    it('maps email_registered error', () => {
      const res = mapGoogleAuthError('email_registered');
      expect(res.type).toBe('error');
      expect(res.message).toContain('đăng nhập bằng mật khẩu');
    });

    it('maps account_linked error', () => {
      const res = mapGoogleAuthError('account_linked');
      expect(res.type).toBe('error');
      expect(res.message).toContain('liên kết với một tài khoản Google khác');
    });

    it('maps account_disabled error', () => {
      const res = mapGoogleAuthError('account_disabled');
      expect(res.type).toBe('error');
      expect(res.message).toContain('vô hiệu hoá');
    });

    it('maps exchange_failed error', () => {
      const res = mapGoogleAuthError('exchange_failed');
      expect(res.type).toBe('error');
      expect(res.message).toContain('hết hạn');
    });

    it('maps server_error', () => {
      const res = mapGoogleAuthError('server_error');
      expect(res.type).toBe('error');
      expect(res.message).toContain('máy chủ');
    });

    it('returns safe fallback error for unknown codes or null', () => {
      expect(mapGoogleAuthError('some_unknown_error').type).toBe('error');
      expect(mapGoogleAuthError(null).type).toBe('error');
    });
  });

  describe('buildGoogleAuthUrl', () => {
    it('constructs correct backend initiation URL', () => {
      const url = buildGoogleAuthUrl();
      expect(url).toContain('/auth/google?redirectUrl=');
      expect(url).toContain(encodeURIComponent('http://localhost/auth/callback'));
    });
  });
});
