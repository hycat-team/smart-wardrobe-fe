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
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    // Handle global errors here
    if (error.response) {
      // Bắt lỗi 401: Token hết hạn hoặc không hợp lệ (Bao gồm workaround cho lỗi 500 từ backend)
      const isAuthError = 
        error.response.status === 401 || 
        (error.response.status === 500 && 
          (error.response.data?.message === "Vui lòng đăng nhập" || 
           error.response.data?.detail === "Vui lòng đăng nhập" || 
           error.response.data?.Detail === "Vui lòng đăng nhập" ||
           error.response.data?.message === "Đã xảy ra lỗi hệ thống" ||
           error.response.data?.detail === "Đã xảy ra lỗi hệ thống" // Fallback if WrapError swallowed it completely
          )
        );

      if (isAuthError && !error.config?.url?.includes('/auth/login')) {
        // Bỏ qua nếu request là logout (tránh đè câu báo Đăng xuất bằng câu Hết hạn)
        if (error.config?.url?.includes('/auth/logout')) {
          return Promise.reject(error);
        }

        // Vì middleware đã lo refresh token tự động, nếu request nào tới được đây mà bị 401 
        // nghĩa là phiên đăng nhập đã thực sự hết hạn (Refresh Token cũng chết).
        
        const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/auth/login');
        const isMeEndpoint = error.config?.url?.endsWith('/me');

        // Không báo lỗi với /me để tránh spam lúc mới load trang chưa đăng nhập
        // Và không bao giờ hiện toast lỗi hết hạn nếu user đang ở chính trang login
        if (!isLoginPage && !isMeEndpoint) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }

        // Chuyển hướng người dùng về trang đăng nhập
        if (!isLoginPage && !isMeEndpoint) {
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 1000);
        }
        
        return Promise.reject(error);
      } 
      
      // Xử lý các lỗi khác có format ErrorResponse từ server
      const errorData = error.response.data;
      const errorMessage = errorData?.message || errorData?.detail;
      
      if (errorMessage) {
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
