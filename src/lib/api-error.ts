import { AxiosError } from 'axios';
import { ErrorResponse } from '@/types/api';
import { toast } from 'sonner';

/**
 * Extracts a user-friendly error message from an API error response.
 * @param error The error object caught in a try/catch or onError block
 * @param fallbackMessage Optional fallback message if no specific message is found
 * @returns A string containing the error message
 */
export const getApiErrorMessage = (error: unknown, fallbackMessage: string = 'Thao tác thất bại. Vui lòng thử lại.'): string => {
  if (isAxiosError(error)) {
    const errorData = error.response?.data as ErrorResponse | undefined;
    if (errorData) {
      return errorData.message || errorData.detail || errorData.title || fallbackMessage;
    }
    if (isNetworkError(error)) {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền.';
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};

/**
 * Gets the HTTP status code from an API error response.
 * @param error The error object
 * @returns The HTTP status code, or undefined if not available
 */
export const getApiErrorStatus = (error: unknown): number | undefined => {
  if (isAxiosError(error)) {
    return error.response?.status;
  }
  return undefined;
};

/**
 * Handles API errors by showing a toast, preventing duplicates with axios global handler.
 * @param error The error object
 * @param fallbackMessage Optional fallback message
 */
export const handleApiError = (error: unknown, fallbackMessage?: string) => {
  const status = getApiErrorStatus(error);
  const isNetwork = isNetworkError(error);
  
  // Axios interceptor handles these globally, so we skip to prevent duplicate toasts
  if (isNetwork || (status && (status >= 500 || status === 403 || status === 429 || status === 401))) {
    return;
  }

  const msg = getApiErrorMessage(error, fallbackMessage);
  if (msg) {
    toast.error(msg);
  }
};

/**
 * Gets the raw error data payload from an API error response.
 * @param error The error object
 * @returns The error response data, or undefined
 */
export const getApiErrorData = (error: unknown): ErrorResponse | undefined => {
  if (isAxiosError(error)) {
    return error.response?.data as ErrorResponse;
  }
  return undefined;
};

/**
 * Checks if the error is a form validation error (status 400, 422, or 409).
 * @param error The error object
 * @returns True if it is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  const status = getApiErrorStatus(error);
  return status === 400 || status === 422 || status === 409;
};

/**
 * Checks if the error is a network error (no response received).
 * @param error The error object
 * @returns True if it is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (isAxiosError(error)) {
    return !error.response && error.request;
  }
  return false;
};

/**
 * Type guard to check if an unknown error is an AxiosError.
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error && (error as AxiosError).isAxiosError === true;
};
