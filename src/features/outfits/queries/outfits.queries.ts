import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { outfitsApi } from '../api/outfits.api';
import { toast } from 'sonner';

export const OUTFIT_QUERY_KEYS = {
  all: ['outfits'] as const,
  lists: () => [...OUTFIT_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...OUTFIT_QUERY_KEYS.all, 'detail', id] as const,
};

export const useMyOutfits = () => {
  return useInfiniteQuery({
    queryKey: OUTFIT_QUERY_KEYS.lists(),
    queryFn: ({ pageParam = 1 }) => outfitsApi.getMyOutfits({ page: pageParam as number, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return undefined;
    },
  });
};

export const useOutfitDetail = (id: string, initialData?: any) => {
  return useQuery({
    queryKey: OUTFIT_QUERY_KEYS.detail(id),
    queryFn: () => outfitsApi.getOutfitDetail(id),
    enabled: !!id,
    initialData,
  });
};

export const useCreateOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: outfitsApi.createOutfit,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: OUTFIT_QUERY_KEYS.lists() });
      toast.success(res?.message || 'Lưu bộ phối đồ thành công!');
    },
  });
};

export const useUpdateOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => outfitsApi.updateOutfit(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: OUTFIT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: OUTFIT_QUERY_KEYS.detail(variables.id) });
      toast.success(res?.message || 'Cập nhật bộ phối đồ thành công!');
    },
  });
};

export const useDeleteOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: outfitsApi.deleteOutfit,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: OUTFIT_QUERY_KEYS.lists() });
      toast.success(res?.message || 'Đã xóa bộ phối đồ!');
    },
  });
};
