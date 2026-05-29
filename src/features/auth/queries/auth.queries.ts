import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      Cookies.set('accessToken', data.accessToken, { expires: 1 });
      if (data.refreshToken) {
        Cookies.set('refreshToken', data.refreshToken, { expires: 7 });
      }
      toast.success('Đăng nhập thành công');
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Đăng ký thành công. Vui lòng kiểm tra email để nhận mã OTP.');
    },
  });
};

export const useConfirmRegisterOtp = () => {
  return useMutation({
    mutationFn: authApi.confirmRegisterOtp,
    onSuccess: () => {
      toast.success('Xác thực tài khoản thành công. Bạn có thể đăng nhập ngay.');
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      toast.success('Đã đăng xuất');
      window.location.href = '/login';
    },
    onError: () => {
      // Dù lỗi ở phía server thì client vẫn nên xoá token
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      window.location.href = '/login';
    }
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success('Đã gửi mã OTP khôi phục đến email của bạn.');
    },
  });
};

export const useConfirmForgotPasswordOtp = () => {
  return useMutation({
    mutationFn: authApi.confirmForgotPasswordOtp,
    onSuccess: () => {
      toast.success('Xác thực OTP thành công. Vui lòng đặt mật khẩu mới.');
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
    },
  });
};
