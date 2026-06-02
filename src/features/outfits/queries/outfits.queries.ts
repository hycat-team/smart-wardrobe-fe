import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { outfitsApi } from '../api/outfits.api';
import { toast } from 'sonner';

export const OUTFIT_QUERY_KEYS = {
  all: ['outfits'] as const,
  lists: () => [...OUTFIT_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...OUTFIT_QUERY_KEYS.all, 'detail', id] as const,
};

export const useMyOutfits = () => {
  return useQuery({
    queryKey: OUTFIT_QUERY_KEYS.lists(),
    queryFn: () => outfitsApi.getMyOutfits(),
  });
};

export const useOutfitDetail = (id: string) => {
  return useQuery({
    queryKey: OUTFIT_QUERY_KEYS.detail(id),
    queryFn: () => outfitsApi.getOutfitDetail(id),
    enabled: !!id,
  });
};

export const useCreateOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: outfitsApi.createOutfit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OUTFIT_QUERY_KEYS.lists() });
      toast.success('Lưu bộ phối đồ thành công!');
    },
  });
};

export const useUpdateOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => outfitsApi.updateOutfit(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: OUTFIT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: OUTFIT_QUERY_KEYS.detail(variables.id) });
      toast.success('Cập nhật bộ phối đồ thành công!');
    },
  });
};

export const useDeleteOutfit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: outfitsApi.deleteOutfit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OUTFIT_QUERY_KEYS.lists() });
      toast.success('Đã xóa bộ phối đồ!');
    },
  });
};
