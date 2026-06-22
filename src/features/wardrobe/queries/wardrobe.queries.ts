import { useQuery, useMutation, useQueryClient, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
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

export const useMyWardrobe = (categorySlug?: string, page: number = 1) => {
  return useQuery({
    queryKey: [...WARDROBE_QUERY_KEYS.lists(), categorySlug, page],
    queryFn: () => wardrobeApi.getMyWardrobeItems({ page, limit: 20, categorySlug: categorySlug }),
    placeholderData: keepPreviousData,
  });
};

export const useSystemCatalogItems = (categorySlug?: string, q?: string, page: number = 1) => {
  return useQuery({
    queryKey: [...WARDROBE_QUERY_KEYS.all, 'system-catalog', categorySlug, q, page],
    queryFn: () => wardrobeApi.getSystemCatalogItems({ page, limit: 20, categorySlug: categorySlug, q }),
    placeholderData: keepPreviousData,
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

export const useBulkDeleteWardrobeItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { ids: string[] }) => wardrobeApi.bulkDeleteWardrobeItems(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: WARDROBE_QUERY_KEYS.lists() });
      toast.success(res?.message || 'Xóa trang phục hàng loạt thành công!');
    },
  });
};

export const useSearchWardrobeItems = (query: string, categorySlug?: string) => {
  return useInfiniteQuery({
    queryKey: [...WARDROBE_QUERY_KEYS.search(query), categorySlug],
    queryFn: ({ pageParam = 1 }) => wardrobeApi.searchWardrobeItems({ q: query, page: pageParam as number, limit: 20, categorySlug: categorySlug }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.metadata.page < lastPage.metadata.totalPages) return lastPage.metadata.page + 1;
      return undefined;
    },
    enabled: query.trim().length > 0,
  });
};
