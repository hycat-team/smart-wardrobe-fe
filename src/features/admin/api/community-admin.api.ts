import api from '@/lib/axios';
import { APIResponse, PaginationResult } from '@/types/api';
import { PostRes, CommentRes } from '@/features/community/types';

export const communityAdminApi = {
  // Posts Moderation
  getAdminPosts: async (params?: {
    q?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginationResult<PostRes>> => {
    const res = await api.get<APIResponse<PaginationResult<PostRes>>>('/admin/posts', { params });
    return res.data.data as PaginationResult<PostRes>;
  },

  hidePost: async (id: string): Promise<any> => {
    const res = await api.patch<APIResponse>(`/admin/posts/${id}/hide`);
    return res.data;
  },

  restorePost: async (id: string): Promise<any> => {
    const res = await api.patch<APIResponse>(`/admin/posts/${id}/restore`);
    return res.data;
  },

  deletePost: async (id: string): Promise<any> => {
    const res = await api.delete<APIResponse>(`/admin/posts/${id}`);
    return res.data;
  },

  // Comments Moderation
  getAdminComments: async (params?: {
    q?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginationResult<CommentRes>> => {
    const res = await api.get<APIResponse<PaginationResult<CommentRes>>>('/admin/comments', { params });
    return res.data.data as PaginationResult<CommentRes>;
  },

  hideComment: async (id: string): Promise<any> => {
    const res = await api.patch<APIResponse>(`/admin/comments/${id}/hide`);
    return res.data;
  },

  restoreComment: async (id: string): Promise<any> => {
    const res = await api.patch<APIResponse>(`/admin/comments/${id}/restore`);
    return res.data;
  },

  deleteComment: async (id: string): Promise<any> => {
    const res = await api.delete<APIResponse>(`/admin/comments/${id}`);
    return res.data;
  },
};
