/**
 * TypeScript types for Google OAuth2 integration
 * Feature: 002-google-login
 */

export type GoogleAuthErrorCode =
  | 'access_denied'
  | 'email_unverified'
  | 'email_registered'
  | 'account_linked'
  | 'account_disabled'
  | 'exchange_failed'
  | 'server_error';

export interface GoogleCallbackQueryParams {
  /**
   * Error code returned from backend or Google OAuth redirect
   */
  error?: GoogleAuthErrorCode | string;
}

/**
 * Key used to store user's return destination in sessionStorage
 */
export const AUTH_RETURN_URL_KEY = 'closy_auth_return_url';

export interface AuthRedirectContext {
  /**
   * Internal relative path user was attempting to access before auth
   */
  returnUrl?: string;
}
