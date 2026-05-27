import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/useAuthStore';

// 1. Quản lý chung toàn bộ Query Keys của module Auth
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// 2. Custom Hooks: Bọc các API lại bằng useQuery / useMutation
export const useAuthProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const data = await authApi.getProfile();
      setUser(data); // Cập nhật store Zustand
      return data;
    },
    // Không refetch lại thông tin user quá thường xuyên
    staleTime: 5 * 60 * 1000, 
  });
};

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      toast.success('Đăng nhập thành công!');
      
      // Lưu token vào Cookies (Secure, dễ dùng SSR)
      Cookies.set('accessToken', data.accessToken, { expires: 1 }); // Lưu 1 ngày
      Cookies.set('refreshToken', data.refreshToken, { expires: 7 }); // Lưu 7 ngày
      
      // Lưu thông tin user vào store Zustand
      setUser(data.user);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác!';
      toast.error(message);
    }
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      toast.success('Đăng xuất thành công!');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      logout(); // Xoá store
    },
    onError: () => {
      // Dù API logout lỗi thì vẫn nên xóa token ở client
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      logout();
    }
  });
};

export const useUpdateProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      toast.success('Cập nhật hồ sơ thành công!');
      setUser(updatedUser); // Cập nhật store Zustand mới nhất
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Cập nhật thất bại!';
      toast.error(message);
    }
  });
};
