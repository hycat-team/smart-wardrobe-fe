import { AxiosError } from 'axios';
import { ErrorResponse } from '@/types/api';
import { toast } from 'sonner';

/**
 * Maps standard HTTP status codes to user-friendly Vietnamese messages.
 */
export const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  401: 'Vui lòng đăng nhập để thực hiện thao tác này.',
  403: 'Bạn không có quyền thực hiện thao tác này.',
  404: 'Nội dung yêu cầu không tồn tại hoặc đã bị xóa.',
  409: 'Dữ liệu bị trùng lặp hoặc xung đột.',
  422: 'Dữ liệu gửi lên không đúng định dạng quy định.',
  429: 'Thao tác quá nhanh. Vui lòng thử lại sau giây lát.',
  500: 'Lỗi hệ thống máy chủ. Vui lòng thử lại sau.',
  502: 'Máy chủ phản hồi không đúng. Vui lòng thử lại sau.',
  503: 'Dịch vụ tạm thời quá tải hoặc đang bảo trì.',
};

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
      const serverMessage = errorData.message || errorData.detail || errorData.title;
      if (serverMessage && typeof serverMessage === 'string' && serverMessage.trim()) {
        return serverMessage;
      }
    }

    const status = error.response?.status;
    if (status && HTTP_STATUS_MESSAGES[status]) {
      return HTTP_STATUS_MESSAGES[status];
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
  
  // Axios interceptor handles global session expired / 500, skip only those to prevent duplicate toasts
  if (isNetwork || (status && status >= 500)) {
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
