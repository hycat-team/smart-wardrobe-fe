import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityAdminApi } from '../api/community-admin.api';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error';
import { COMMUNITY_QUERY_KEYS } from '@/features/community/queries/community.queries';

export const ADMIN_COMMUNITY_QUERY_KEYS = {
  all: ['admin-community'] as const,
  posts: (params?: Record<string, any>) => [...ADMIN_COMMUNITY_QUERY_KEYS.all, 'posts', params] as const,
  comments: (params?: Record<string, any>) => [...ADMIN_COMMUNITY_QUERY_KEYS.all, 'comments', params] as const,
  metrics: () => [...ADMIN_COMMUNITY_QUERY_KEYS.all, 'metrics'] as const,
  postComments: (postPublicID: string | null) => [...ADMIN_COMMUNITY_QUERY_KEYS.all, 'post-comments', postPublicID] as const,
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

export const useAdminPostComments = (postPublicID: string | null) => {
  return useQuery({
    queryKey: ADMIN_COMMUNITY_QUERY_KEYS.postComments(postPublicID),
    queryFn: () => (postPublicID ? communityAdminApi.getPostComments(postPublicID) : Promise.resolve([])),
    enabled: !!postPublicID,
  });
};

export const useAdminCommunityMetrics = () => {
  return useQuery({
    queryKey: ADMIN_COMMUNITY_QUERY_KEYS.metrics(),
    queryFn: async () => {
      const [allPostsRes, hiddenPostsRes, allCommentsRes, activeCommentsRes] = await Promise.all([
        communityAdminApi.getAdminPosts({ limit: 1 }).catch(() => null),
        communityAdminApi.getAdminPosts({ status: 'hidden', limit: 1 }).catch(() => null),
        communityAdminApi.getAdminComments({ limit: 1 }).catch(() => null),
        communityAdminApi.getAdminComments({ status: 'active', limit: 1 }).catch(() => null),
      ]);

      return {
        totalPosts: allPostsRes?.metadata?.totalItems ?? 0,
        hiddenPosts: hiddenPostsRes?.metadata?.totalItems ?? 0,
        totalComments: allCommentsRes?.metadata?.totalItems ?? 0,
        activeComments: activeCommentsRes?.metadata?.totalItems ?? 0,
      };
    },
    staleTime: 30_000,
  });
};

export const useAdminHidePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => communityAdminApi.hidePost(id),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_COMMUNITY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
      toast.success(res?.message || 'Đã ẩn bài viết khỏi bảng tin cộng đồng.');
    },
    onError: (error) => {
      handleApiError(error, 'Không thể ẩn bài viết, vui lòng thử lại.');
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
      toast.success(res?.message || 'Đã khôi phục bài viết về trạng thái công khai.');
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
