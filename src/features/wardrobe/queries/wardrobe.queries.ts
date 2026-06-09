import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wardrobeApi } from '../api/wardrobe.api';
import { WardrobeItemStatus } from '../types';
import { toast } from 'sonner';

export const WARDROBE_QUERY_KEYS = {
  all: ['wardrobe'] as const,
  lists: () => [...WARDROBE_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...WARDROBE_QUERY_KEYS.all, 'detail', id] as const,
  search: (query: string) => [...WARDROBE_QUERY_KEYS.all, 'search', query] as const,
  categories: () => [...WARDROBE_QUERY_KEYS.all, 'categories'] as const,
};

export const useMyWardrobe = (initialData?: any[]) => {
  return useQuery({
    queryKey: WARDROBE_QUERY_KEYS.lists(),
    queryFn: () => wardrobeApi.getMyWardrobeItems(),
    initialData,
    refetchInterval: (query) => {
      const items = query.state.data;
      if (Array.isArray(items)) {
        const hasProcessing = items.some((item) => item.status === WardrobeItemStatus.Processing);
        if (hasProcessing) {
          return 5000; // Poll every 5s if there is any item processing
        }
      }
      return false;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: WARDROBE_QUERY_KEYS.categories(),
    queryFn: () => wardrobeApi.getCategories(),
  });
};

export const useWardrobeItemDetail = (id: string, initialData?: any) => {
  return useQuery({
    queryKey: WARDROBE_QUERY_KEYS.detail(id),
    queryFn: () => wardrobeApi.getWardrobeItemDetail(id),
    enabled: !!id,
    initialData,
  });
};

export const useBatchUploadWardrobeItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wardrobeApi.batchUploadWardrobeItems,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.lists() });
      toast.success(res?.message || 'Bắt đầu phân tách và số hóa trang phục!');
    },
  });
};

export const useInitClosetFromCatalog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wardrobeApi.initClosetFromCatalog,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.lists() });
      toast.success(res?.message || 'Khởi tạo nhanh tủ đồ cá nhân thành công!');
    },
  });
};

export const useCloneWardrobeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      wardrobeApi.cloneWardrobeItem(id, { quantity }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.lists() });
      toast.success(res?.message || 'Nhân bản trang phục thành công!');
    },
  });
};

export const useUpdateWardrobeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof wardrobeApi.updateWardrobeItem>[1] }) =>
      wardrobeApi.updateWardrobeItem(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.detail(variables.id) });
      toast.success(res?.message || 'Cập nhật trang phục thành công!');
    },
  });
};

export const useDeleteWardrobeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => wardrobeApi.deleteWardrobeItem(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.lists() });
      toast.success(res?.message || 'Xóa trang phục thành công!');
    },
  });
};

export const useSearchWardrobeItems = (query: string) => {
  return useQuery({
    queryKey: WARDROBE_QUERY_KEYS.search(query),
    queryFn: () => wardrobeApi.searchWardrobeItems(query),
    enabled: query.trim().length > 0,
  });
};
