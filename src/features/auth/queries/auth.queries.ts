import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';
import { PROFILE_QUERY_KEY } from '@/features/profile/queries/profile.queries';
import { profileApi } from '@/features/profile/api/profile.api';
import { handleApiError } from '@/lib/api-error';

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ['authStatus'] });
      
      let isAdmin = false;
      try {
        const profile = await queryClient.fetchQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: profileApi.getProfile });
        if (profile?.roleSlug === 'admin' || profile?.roleSlug === 'ADMIN') {
          isAdmin = true;
        }
      } catch (error) {
        console.error('Failed to fetch profile during login', error);
      }
      
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success(res?.message || 'Đăng nhập thành công');
      
      if (res) {
        (res as any).isAdmin = isAdmin;
      }
    },
    onError: (error) => {
      handleApiError(error, 'Email hoặc mật khẩu không chính xác.');
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      toast.success(res?.message || 'Đăng ký thành công. Vui lòng kiểm tra email để nhận mã OTP.');
    },
    onError: (error) => {
      handleApiError(error, 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  });
};

export const useConfirmRegisterOtp = () => {
  return useMutation({
    mutationFn: authApi.confirmRegisterOtp,
    onSuccess: (res) => {
      toast.success(res?.message || 'Xác thực tài khoản thành công. Bạn có thể đăng nhập ngay.');
    },
    onError: (error) => {
      handleApiError(error, 'Mã xác thực không hợp lệ.');
    }
  });
};

export const useResendRegisterOtp = () => {
  return useMutation({
    mutationFn: authApi.resendRegisterOtp,
    onSuccess: (res) => {
      toast.success(res?.message || 'Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.');
    },
    onError: (error) => {
      handleApiError(error, 'Không thể gửi lại mã OTP.');
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: (res) => {
      // queryClient.invalidateQueries({ queryKey: ['authStatus'] });
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success(res?.message || 'Đăng xuất thành công');
      window.location.href = '/auth/login';
    },
    onError: () => {
      window.location.href = '/auth/login';
    }
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (res) => {
      toast.success(res?.message || 'Đã gửi mã OTP khôi phục đến email của bạn.');
    },
    onError: (error) => {
      handleApiError(error, 'Không thể gửi mã khôi phục.');
    }
  });
};

export const useConfirmForgotPasswordOtp = () => {
  return useMutation({
    mutationFn: authApi.confirmForgotPasswordOtp,
    onSuccess: (res) => {
      toast.success(res?.message || 'Xác thực OTP thành công. Vui lòng đặt mật khẩu mới.');
    },
    onError: (error) => {
      handleApiError(error, 'Mã xác thực không hợp lệ.');
    }
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (res) => {
      toast.success(res?.message || 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
    },
    onError: (error) => {
      handleApiError(error, 'Đặt lại mật khẩu thất bại.');
    }
  });
};
