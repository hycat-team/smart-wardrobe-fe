import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { authApi } from '@/features/auth/api/auth.api';
import { ErrorResponse } from '@/types/api';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api', // adjust this as needed
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
      // Bắt lỗi 401: Token hết hạn hoặc không hợp lệ
      if (error.response.status === 401 && !originalRequest._retry) {
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

        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          // Có thể import useAuthStore và gọi useAuthStore.getState().logout() ở đây
          return Promise.reject(error);
        }

        try {
          // Gọi API refresh token
          const data = await authApi.refreshToken(refreshToken);
          Cookies.set('accessToken', data.accessToken, { expires: 1 }); // Lưu 1 ngày
          if (data.refreshToken) {
            Cookies.set('refreshToken', data.refreshToken, { expires: 7 }); // Lưu 7 ngày
          }

          processQueue(null, data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          // Force logout redirect có thể dùng window.location.href = '/login'
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } 
      // Xử lý các lỗi khác có format ErrorResponse từ server
      else {
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

