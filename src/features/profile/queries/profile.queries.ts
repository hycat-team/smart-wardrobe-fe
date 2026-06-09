import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { toast } from 'sonner';


import { UserRes } from '../types';

export const PROFILE_QUERY_KEY = ['me'];

export const useProfile = (initialData?: UserRes) => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileApi.getProfile,
    retry: 0, // Do not retry if unauthorized
    initialData,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (res) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(PROFILE_QUERY_KEY, res);
      toast.success(res?.message || 'Cập nhật thông tin cá nhân thành công');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: (res) => {
      toast.success(res?.message || 'Đổi mật khẩu thành công');
    },
  });
};
