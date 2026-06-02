import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { toast } from 'sonner';


export const PROFILE_QUERY_KEY = ['me'];

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileApi.getProfile,
    retry: 0, // Do not retry if unauthorized
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
      toast.success('Cập nhật thông tin cá nhân thành công');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công');
    },
  });
};
