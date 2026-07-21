import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error';


import { UserRes } from '../types';

export const PROFILE_QUERY_KEY = ['me'];

export const useProfile = (initialData?: UserRes, enabled: boolean = true) => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileApi.getProfile,
    retry: 0, // Do not retry if unauthorized
    initialData,
    enabled,
    staleTime: 5 * 60 * 1000, // Cập nhật thêm dòng này: Coi data là "mới" trong 5 phút. Trong 5 phút này nếu chuyển tab hay component render lại, nó sẽ KHÔNG gọi API /me nữa.
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (res) => {
      // Cập nhật cache ngay lập tức
      queryClient.setQueryData(PROFILE_QUERY_KEY, res);
      toast.success(res?.message || 'Cập nhật thông cá nhân thành công');
    },
    onError: (error) => {
      handleApiError(error, 'Cập nhật thông tin thất bại.');
    }
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: (res) => {
      toast.success(res?.message || 'Đổi mật khẩu thành công');
    },
    onError: (error) => {
      handleApiError(error, 'Đổi mật khẩu thất bại.');
    }
  });
};
