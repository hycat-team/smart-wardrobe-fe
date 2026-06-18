import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ErrorResponse } from '@/types/api';

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

    if (error.response) {
      const isAuthError =
        error.response.status === 401 ||
        (error.response.status === 500 &&
          (error.response.data?.message === "Vui lòng đăng nhập" ||
            error.response.data?.detail === "Vui lòng đăng nhập" ||
            error.response.data?.Detail === "Vui lòng đăng nhập" ||
            error.response.data?.message === "Đã xảy ra lỗi hệ thống" ||
            error.response.data?.detail === "Đã xảy ra lỗi hệ thống"
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
            .then(() => {
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Gọi API refresh token của BFF
          await axios.post('/api/auth/refresh-token', {}, { baseURL: '' });
          processQueue(null);
          // Gọi lại request bị fail
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/auth/login');
          const isMeEndpoint = originalRequest.url?.endsWith('/me');

          if (!isLoginPage && !isMeEndpoint) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            setTimeout(() => {
              window.location.href = '/auth/login';
            }, 1000);
          }
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      // Xử lý các lỗi khác có format ErrorResponse từ server
      const errorData = error.response.data;
      const errorMessage = errorData?.message || errorData?.detail;
      const errorTitle = errorData?.title;

      if (errorTitle && errorMessage) {
        toast.error(errorTitle, { description: errorMessage });
      } else if (errorTitle) {
        toast.error(errorTitle);
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else if (error.response.status >= 500) {
        toast.error('Lỗi máy chủ! Vui lòng thử lại sau.');
      } else {
        toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }

    } else {
      // Network error or timeout
      toast.error('Không thể kết nối đến máy chủ.');
    }
    return Promise.reject(error);
  }
);

export default api;
