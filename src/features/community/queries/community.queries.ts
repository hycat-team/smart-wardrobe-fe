import { useQuery, useMutation, useQueryClient, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { communityApi } from '../api/community.api';
import { toast } from 'sonner';
import { PostRes, CreatePostReq } from '../types';

export const COMMUNITY_QUERY_KEYS = {
  all: ['community'] as const,
  feed: (filters?: Record<string, unknown>) => [...COMMUNITY_QUERY_KEYS.all, 'feed', filters] as const,
  detail: (id: string) => [...COMMUNITY_QUERY_KEYS.all, 'detail', id] as const,
  comments: (id: string) => [...COMMUNITY_QUERY_KEYS.all, 'comments', id] as const,
};

export const useInfiniteCommunity = (filters?: { sort?: string; username?: string; postType?: string }) => {
  return useInfiniteQuery({
    queryKey: COMMUNITY_QUERY_KEYS.feed(filters),
    queryFn: ({ pageParam = 1 }) => communityApi.getCommunityPosts({ ...filters, page: pageParam as number, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
      return undefined;
    },
    placeholderData: keepPreviousData,
  });
};

export const usePostDetail = (postPublicID: string, initialData?: PostRes) => {
  return useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.detail(postPublicID),
    queryFn: () => communityApi.getPostDetails(postPublicID),
    enabled: !!postPublicID,
    initialData,
  });
};

export const usePostComments = (postPublicID: string) => {
  return useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.comments(postPublicID),
    queryFn: () => communityApi.getPostComments(postPublicID),
    enabled: !!postPublicID,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postPublicID, isLiked }: { postPublicID: string; isLiked: boolean }) =>
      communityApi.likePost(postPublicID, { isLiked }),
    onMutate: async ({ postPublicID, isLiked }) => {
      // Optimistic update for feed list
      await queryClient.cancelQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });

      // Update in feed lists
      queryClient.setQueriesData({ queryKey: COMMUNITY_QUERY_KEYS.all }, (oldData: unknown) => {
        const typedOldData = oldData as { pages: { items: PostRes[] }[] } | undefined;
        if (!typedOldData || !typedOldData.pages) return oldData;
        return {
          ...typedOldData,
          pages: typedOldData.pages.map((page) => ({
            ...page,
            items: page.items.map((post) => {
              if (post.publicId === postPublicID) {
                return {
                  ...post,
                  isLiked: isLiked,
                  likeCount: isLiked ? post.likeCount + 1 : Math.max(0, post.likeCount - 1),
                };
              }
              return post;
            }),
          })),
        };
      });

      // Update in detail
      const previousDetail = queryClient.getQueryData(COMMUNITY_QUERY_KEYS.detail(postPublicID));
      if (previousDetail) {
        queryClient.setQueryData(COMMUNITY_QUERY_KEYS.detail(postPublicID), (old: unknown) => {
          const typedOld = old as PostRes;
          return {
            ...typedOld,
            isLiked: isLiked,
            likeCount: isLiked ? typedOld.likeCount + 1 : Math.max(0, typedOld.likeCount - 1),
          };
        });
      }

      return { previousDetail };
    },
    onError: (_err, _variables, _context: unknown) => {
      toast.error('Có lỗi xảy ra khi cập nhật lượt thích.');
      // Revert if error
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
    },
    onSettled: (data, error, variables) => {
      // Invalidate to make sure we have true data
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.detail(variables.postPublicID) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed() });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postPublicID, content }: { postPublicID: string; content: string }) =>
      communityApi.addComment(postPublicID, { content }),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.comments(variables.postPublicID) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.detail(variables.postPublicID) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed() });
      toast.success('Đã gửi bình luận!');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi gửi bình luận.');
    }
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostReq) => communityApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success('Đã tạo bài viết thành công!');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tạo bài viết.');
    }
  });
};
