import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityAdminApi } from '../api/community-admin.api';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error';
import { COMMUNITY_QUERY_KEYS } from '@/features/community/queries/community.queries';

export const ADMIN_COMMUNITY_QUERY_KEYS = {
  all: ['admin-community'] as const,
  posts: (params?: Record<string, any>) => [...ADMIN_COMMUNITY_QUERY_KEYS.all, 'posts', params] as const,
  comments: (params?: Record<string, any>) => [...ADMIN_COMMUNITY_QUERY_KEYS.all, 'comments', params] as const,
};

export const useAdminPosts = (params?: {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ADMIN_COMMUNITY_QUERY_KEYS.posts(params),
    queryFn: () => communityAdminApi.getAdminPosts(params),
  });
};

export const useAdminComments = (params?: {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ADMIN_COMMUNITY_QUERY_KEYS.comments(params),
    queryFn: () => communityAdminApi.getAdminComments(params),
  });
};

export const useAdminHidePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityAdminApi.hidePost(id),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
      toast.success(res?.message || 'Đã ẩn bài viết thành công.');
    },
    onError: (error) => {
      handleApiError(error, 'Không thể ẩn bài viết.');
    },
  });
};

export const useAdminRestorePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityAdminApi.restorePost(id),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
      toast.success(res?.message || 'Đã khôi phục bài viết thành công.');
    },
    onError: (error) => {
      handleApiError(error, 'Không thể khôi phục bài viết.');
    },
  });
};

export const useAdminDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityAdminApi.deletePost(id),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
      toast.success(res?.message || 'Đã xóa bài viết thành công.');
    },
    onError: (error) => {
      handleApiError(error, 'Không thể xóa bài viết.');
    },
  });
};

export const useAdminHideComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityAdminApi.hideComment(id),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
      toast.success(res?.message || 'Đã ẩn bình luận thành công.');
    },
    onError: (error) => {
      handleApiError(error, 'Không thể ẩn bình luận.');
    },
  });
};

export const useAdminRestoreComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityAdminApi.restoreComment(id),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
      toast.success(res?.message || 'Đã khôi phục bình luận thành công.');
    },
    onError: (error) => {
      handleApiError(error, 'Không thể khôi phục bình luận.');
    },
  });
};

export const useAdminDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityAdminApi.deleteComment(id),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
      toast.success(res?.message || 'Đã xóa bình luận thành công.');
    },
    onError: (error) => {
      handleApiError(error, 'Không thể xóa bình luận.');
    },
  });
};
