import { PostRes, CommentRes, CommunityUserRes } from '@/features/community/types';

export type PostModerationStatus = 'published' | 'hidden' | 'deleted';
export type CommentModerationStatus = 'active' | 'hidden' | 'deleted';

export interface CommunityDashboardMetrics {
  totalPosts: number;
  publishedPosts: number;
  hiddenPosts: number;
  deletedPosts: number;
  totalComments: number;
  activeComments: number;
  hiddenComments: number;
  deletedComments: number;
}

export interface PostFilterState {
  searchQuery: string;
  status: 'all' | PostModerationStatus;
  page: number;
  limit: number;
}

export interface CommentFilterState {
  searchQuery: string;
  status: 'all' | CommentModerationStatus;
  page: number;
  limit: number;
}

export type { PostRes, CommentRes, CommunityUserRes };
