import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userSocialApi } from '../api/user-social.api';
import { PublicProfileRes, PostRes } from '../types';
import { COMMUNITY_QUERY_KEYS } from './community.queries';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error';

export const USER_SOCIAL_QUERY_KEYS = {
  all: ['user-social'] as const,
  profile: (username: string) => [...USER_SOCIAL_QUERY_KEYS.all, 'profile', username] as const,
  posts: (username: string, page: number = 1) => [...USER_SOCIAL_QUERY_KEYS.all, 'posts', username, page] as const,
  follows: (username: string, type?: string, q?: string, page: number = 1) =>
    [...USER_SOCIAL_QUERY_KEYS.all, 'follows', username, type, q, page] as const,
};

export const usePublicProfile = (username: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: USER_SOCIAL_QUERY_KEYS.profile(username),
    queryFn: () => userSocialApi.getPublicProfile(username),
    enabled: !!username && enabled,
  });
};

export const useUserPosts = (username: string, page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: USER_SOCIAL_QUERY_KEYS.posts(username, page),
    queryFn: () => userSocialApi.getUserPosts(username, { page, limit: 12 }),
    enabled: !!username && enabled,
  });
};

export const useUserFollows = (
  username: string,
  params?: { type?: 'following' | 'followers'; q?: string; page?: number; limit?: number },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: USER_SOCIAL_QUERY_KEYS.follows(username, params?.type, params?.q, params?.page || 1),
    queryFn: () => userSocialApi.getUserFollows(username, params),
    enabled: !!username && enabled,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, isFollowing }: { username: string; isFollowing: boolean }) =>
      userSocialApi.followUser(username, { isFollowing }),
    onMutate: async ({ username, isFollowing }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: USER_SOCIAL_QUERY_KEYS.profile(username) });

      // Optimistic update for public profile
      const previousProfile = queryClient.getQueryData<PublicProfileRes>(
        USER_SOCIAL_QUERY_KEYS.profile(username)
      );

      if (previousProfile) {
        queryClient.setQueryData<PublicProfileRes>(USER_SOCIAL_QUERY_KEYS.profile(username), {
          ...previousProfile,
          isFollowing,
          stats: {
            ...previousProfile.stats,
            followerCount: isFollowing
              ? previousProfile.stats.followerCount + 1
              : Math.max(0, previousProfile.stats.followerCount - 1),
          },
        });
      }

      // Optimistic update for feed posts by this author
      queryClient.setQueriesData({ queryKey: COMMUNITY_QUERY_KEYS.all }, (oldData: unknown) => {
        const typedOldData = oldData as { pages: { items: PostRes[] }[] } | undefined;
        if (!typedOldData || !typedOldData.pages) return oldData;
        return {
          ...typedOldData,
          pages: typedOldData.pages.map((page) => ({
            ...page,
            items: page.items.map((post) => {
              if (post.user?.username === username) {
                return {
                  ...post,
                  isFollowingAuthor: isFollowing,
                };
              }
              return post;
            }),
          })),
        };
      });

      return { previousProfile };
    },
    onError: (error, variables, context) => {
      handleApiError(error, 'Không thể cập nhật trạng thái theo dõi.');
      if (context?.previousProfile) {
        queryClient.setQueryData(USER_SOCIAL_QUERY_KEYS.profile(variables.username), context.previousProfile);
      }
      queryClient.invalidateQueries({ queryKey: USER_SOCIAL_QUERY_KEYS.profile(variables.username) });
    },
    onSuccess: (_data, variables) => {
      toast.success(variables.isFollowing ? `Đã theo dõi @${variables.username}` : `Đã hủy theo dõi @${variables.username}`);
      queryClient.invalidateQueries({ queryKey: USER_SOCIAL_QUERY_KEYS.profile(variables.username) });
      queryClient.invalidateQueries({ queryKey: USER_SOCIAL_QUERY_KEYS.follows(variables.username) });
      queryClient.invalidateQueries({ queryKey: COMMUNITY_QUERY_KEYS.feed() });
    },
  });
};
