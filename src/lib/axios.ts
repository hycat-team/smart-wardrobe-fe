import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { authApi } from '@/features/auth/api/auth.api';
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

// Remove request interceptor that adds Bearer token.
// The middleware.ts will read HttpOnly cookie and attach the token.

// Tránh tình trạng gọi refresh token nhiều lần cùng lúc
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: string | null) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle global errors here
    if (error.response) {
      // Bắt lỗi 401: Token hết hạn hoặc không hợp lệ (Bao gồm workaround cho lỗi 500 từ backend)
      const isAuthError = 
        error.response.status === 401 || 
        (error.response.status === 500 && 
          ((error.response.data as any)?.detail === "Vui lòng đăng nhập" || 
           (error.response.data as any)?.Detail === "Vui lòng đăng nhập" ||
           (error.response.data as any)?.detail === "Đã xảy ra lỗi hệ thống" // Fallback if WrapError swallowed it completely
          )
        );

      if (
        isAuthError && 
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh-token') &&
        !originalRequest.url?.includes('/auth/login')
      ) {
        if (isRefreshing) {
          // Nếu đang refresh, đưa request hiện tại vào hàng đợi
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        // Since we cannot read refreshToken from HttpOnly cookie on the client,
        // we just blindly call the refresh endpoint. If it fails, the server didn't have a valid refresh token.
        try {
          // Gọi API refresh token (Next.js route)
          const data = await authApi.refreshToken();
          // The Next.js API route will automatically set the new HttpOnly cookies

          processQueue(null, data.accessToken);
          // Retry original request (middleware will attach new token)
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          // Only show error if they are on a protected route or explicitly trying to do something
          // toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          // window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } 
      // Xử lý các lỗi khác có format ErrorResponse từ server
      else {
        // Tắt thông báo lỗi cho API refresh-token để tránh hiện toast khi người dùng chưa đăng nhập
        if (originalRequest.url?.includes('/auth/refresh-token')) {
          return Promise.reject(error);
        }

        const errorData = error.response.data;
        if (errorData && errorData.detail) {
          toast.error(errorData.detail);
        } else if (error.response.status >= 500) {
          toast.error('Lỗi máy chủ! Vui lòng thử lại sau.');
        } else {
          toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
      }
    } else {
      // Network error or timeout
      toast.error('Không thể kết nối đến máy chủ.');
    }
    return Promise.reject(error);
  }
);

export default api;

