import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ErrorResponse } from '@/types/api';

declare module 'axios' {
  export interface AxiosRequestConfig {
    silent?: boolean;
    showErrorToast?: boolean;
    errorToastMessage?: string;
  }
}

const api = axios.create({
  // Point to Next.js proxy instead of direct backend
  baseURL: '/api/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];
let hasShownSessionExpiredToast = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as any;
    const silent = originalRequest?.silent === true;
    const showErrorToast = originalRequest?.showErrorToast === true;
    const customErrorMessage = originalRequest?.errorToastMessage;

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      const isAuthError =
        status === 401 ||
        (status === 500 &&
          (errorData?.message === "Vui lòng đăng nhập" ||
            errorData?.detail === "Vui lòng đăng nhập" ||
            errorData?.Detail === "Vui lòng đăng nhập" ||
            errorData?.message === "Đã xảy ra lỗi hệ thống" ||
            errorData?.detail === "Đã xảy ra lỗi hệ thống"
          )
        );

      if (isAuthError && originalRequest && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
        if (originalRequest.url?.includes('/auth/logout') || originalRequest.url?.includes('/auth/refresh-token')) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(() => api(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Gọi API refresh token của BFF
          await axios.post('/api/auth/refresh-token', {}, { baseURL: '' });
          processQueue(null);
          hasShownSessionExpiredToast = false; // Reset if successful
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          if (!hasShownSessionExpiredToast && !silent) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            hasShownSessionExpiredToast = true;
          }
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      // Xử lý thông báo lỗi (nếu không silent)
      if (!silent) {
        if (customErrorMessage) {
          toast.error(customErrorMessage);
        } else if (status >= 500) {
          toast.error('Lỗi hệ thống. Vui lòng thử lại sau.');
        } else if (status === 403 || status === 429) {
          toast.error(errorData?.message || errorData?.detail || errorData?.title || 'Bạn không có quyền thực hiện hoặc thao tác quá nhanh.');
        } else if (showErrorToast) {
          // Ép hiện toast cho 400, 404, 409, 422
          toast.error(errorData?.message || errorData?.detail || errorData?.title || 'Thao tác thất bại. Vui lòng thử lại.');
        }
      }

    } else if (error.request) {
      // Network error or timeout
      if (!silent) {
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
