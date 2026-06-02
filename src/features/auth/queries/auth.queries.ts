import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { PROFILE_QUERY_KEY } from '@/features/profile/queries/profile.queries';
import { profileApi } from '@/features/profile/api/profile.api';

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      // Invalidate auth status so it refetches immediately
      queryClient.invalidateQueries({ queryKey: ['authStatus'] });
      
      // Fetch the profile imperatively to populate the cache,
      // which will trigger auth-provider to update the user state.
      queryClient.fetchQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: profileApi.getProfile }).catch(console.error);
      
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ['authStatus'] });
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success('Đăng xuất thành công');
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
