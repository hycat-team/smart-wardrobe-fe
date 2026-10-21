import { useQuery, useMutation, useQueryClient, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { communityApi } from '../api/community.api';
import { toast } from 'sonner';
import { PostRes, CreatePostReq, UpdatePostReq } from '../types';
import { handleApiError } from '@/lib/api-error';

export const COMMUNITY_QUERY_KEYS = {
  all: ['community'] as const,
  feed: (filters?: Record<string, unknown>) => [...COMMUNITY_QUERY_KEYS.all, 'feed', filters] as const,
  detail: (id: string) => [...COMMUNITY_QUERY_KEYS.all, 'detail', id] as const,
  likes: (id: string, page: number = 1) => [...COMMUNITY_QUERY_KEYS.all, 'likes', id, page] as const,
  comments: (id: string) => [...COMMUNITY_QUERY_KEYS.all, 'comments', id] as const,
  replies: (postId: string, commentId: string) => [...COMMUNITY_QUERY_KEYS.comments(postId), 'replies', commentId] as const,
};

export const useInfiniteCommunity = (filters?: {
  type?: 'explore' | 'following';
  sort?: 'hot' | 'latest';
  postType?: 'outfit' | 'media';
  username?: string;
}) => {
  return useInfiniteQuery({
    queryKey: COMMUNITY_QUERY_KEYS.feed(filters),
    queryFn: ({ pageParam = 1 }) =>
      communityApi.getCommunityPosts({ ...filters, page: pageParam as number, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.metadata.page < lastPage.metadata.totalPages) return lastPage.metadata.page + 1;
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

export const usePostLikes = (postPublicID: string, page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.likes(postPublicID, page),
    queryFn: () => communityApi.getPostLikes(postPublicID, { page, limit: 20 }),
    enabled: !!postPublicID && enabled,
  });
};

export const usePostComments = (postPublicID: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.comments(postPublicID),
    queryFn: () => communityApi.getPostComments(postPublicID),
    enabled: !!postPublicID && enabled,
  });
};

export const useCommentReplies = (postPublicID: string, commentID: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: COMMUNITY_QUERY_KEYS.replies(postPublicID, commentID),
    queryFn: () => communityApi.getCommentReplies(postPublicID, commentID),
    enabled: !!postPublicID && !!commentID && enabled,
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
      const previousDetail = queryClient.getQueryData<PostRes>(COMMUNITY_QUERY_KEYS.detail(postPublicID));
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
    onError: (error, variables, context) => {
      handleApiError(error, 'Không thể cập nhật lượt thích.');
      if (context?.previousDetail) {
        queryClient.setQueryData(COMMUNITY_QUERY_KEYS.detail(variables.postPublicID), context.previousDetail);
      }
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.detail(variables.postPublicID) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed() });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postPublicID,
      content,
      parentCommentId,
    }: {
      postPublicID: string;
      content: string;
      parentCommentId?: string;
    }) => communityApi.addComment(postPublicID, { content, parentCommentId }),
    onSuccess: (res: any, variables) => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.comments(variables.postPublicID) });
      if (variables.parentCommentId) {
        queryClient.invalidateQueries({
          queryKey: COMMUNITY_QUERY_KEYS.replies(variables.postPublicID, variables.parentCommentId),
        });
      }
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.detail(variables.postPublicID) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed() });
      toast.success(res?.message || 'Đã gửi bình luận!');
    },
    onError: (error) => {
      handleApiError(error, 'Có lỗi xảy ra khi gửi bình luận.');
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostReq) => communityApi.createPost(data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success(res?.message || 'Đã tạo bài viết thành công!');
    },
    onError: (error) => {
      handleApiError(error, 'Có lỗi xảy ra khi tạo bài viết.');
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postPublicID, data }: { postPublicID: string; data: UpdatePostReq }) =>
      communityApi.updatePost(postPublicID, data),
    onSuccess: (res: any, variables) => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.detail(variables.postPublicID) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed() });
      toast.success(res?.message || 'Đã cập nhật bài viết!');
    },
    onError: (error) => {
      handleApiError(error, 'Có lỗi xảy ra khi cập nhật bài viết.');
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postPublicID: string) => communityApi.deletePost(postPublicID),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed() });
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success(res?.message || 'Đã xoá bài viết.');
    },
    onError: (error) => {
      handleApiError(error, 'Có lỗi xảy ra khi xoá bài viết.');
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postPublicID, commentID }: { postPublicID: string; commentID: string }) =>
      communityApi.deleteComment(postPublicID, commentID),
    onSuccess: (res: any, variables) => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.comments(variables.postPublicID) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.detail(variables.postPublicID) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed() });
      toast.success(res?.message || 'Đã xoá bình luận.');
    },
    onError: (error) => {
      handleApiError(error, 'Có lỗi xảy ra khi xoá bình luận.');
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postPublicID,
      commentID,
      content,
    }: {
      postPublicID: string;
      commentID: string;
      content: string;
    }) => communityApi.updateComment(postPublicID, commentID, { content }),
    onSuccess: (res: any, variables) => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.comments(variables.postPublicID) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.detail(variables.postPublicID) });
      toast.success(res?.message || 'Đã cập nhật bình luận.');
    },
    onError: (error) => {
      handleApiError(error, 'Có lỗi xảy ra khi cập nhật bình luận.');
    },
  });
};
