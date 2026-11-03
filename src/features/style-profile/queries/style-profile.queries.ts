import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error';
import { styleProfileApi } from '../api/style-profile.api';
import { StyleProfile, UpdateStyleProfileReq } from '../types';

export const STYLE_PROFILE_QUERY_KEY = ['style-profile'] as const;

export const useStyleProfile = (initialData?: StyleProfile | null) => {
  return useQuery({
    queryKey: STYLE_PROFILE_QUERY_KEY,
    queryFn: () => styleProfileApi.getProfile(),
    initialData: initialData ?? undefined,
    retry: 0,
  });
};

export const useStyleSuggestions = (enabled = true) => {
  return useQuery({
    queryKey: [...STYLE_PROFILE_QUERY_KEY, 'suggestions'],
    queryFn: () => styleProfileApi.getSuggestions(),
    enabled,
    retry: 0,
  });
};

export const useUpdateStyleProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStyleProfileReq) => styleProfileApi.updateProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(STYLE_PROFILE_QUERY_KEY, profile);
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Đã cập nhật gu của bạn');
    },
    onError: (error) => handleApiError(error, 'Không lưu được gu của bạn'),
  });
};

export const useDeleteStyleProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => styleProfileApi.deleteProfile(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STYLE_PROFILE_QUERY_KEY });
      toast.success('Đã xoá hồ sơ gu');
    },
    onError: (error) => handleApiError(error, 'Không xoá được hồ sơ gu'),
  });
};
