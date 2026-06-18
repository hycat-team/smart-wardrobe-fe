import api from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { APIResponse, PaginationResult } from '@/types/api';
import {
  PostRes,
  CommentRes,
  AddCommentReq,
  LikePostReq,
  CreatePostReq,
  UploadSignatureResult,
} from '../types';

export const communityApi = {
  getCommunityPosts: async (
    params?: { sort?: string; page?: number; limit?: number; username?: string; postType?: string },
    axiosInstance: AxiosInstance = api
  ): Promise<PaginationResult<PostRes>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<PostRes>>>('/posts', { params });
    return res.data.data!;
  },

  getPostDetails: async (
    postPublicID: string,
    axiosInstance: AxiosInstance = api
  ): Promise<PostRes> => {
    const res = await axiosInstance.get<APIResponse<PostRes>>(`/posts/${postPublicID}`);
    return res.data.data!;
  },

  getPostComments: async (
    postPublicID: string,
    axiosInstance: AxiosInstance = api
  ): Promise<CommentRes[]> => {
    const res = await axiosInstance.get<APIResponse<CommentRes[]>>(`/posts/${postPublicID}/comments`);
    return res.data.data!;
  },

  getCommentReplies: async (
    postPublicID: string,
    commentID: string,
    axiosInstance: AxiosInstance = api
  ): Promise<CommentRes[]> => {
    const res = await axiosInstance.get<APIResponse<CommentRes[]>>(`/posts/${postPublicID}/comments/${commentID}/replies`);
    return res.data.data!;
  },

  likePost: async (
    postPublicID: string,
    data: LikePostReq
  ): Promise<{ message?: string }> => {
    const res = await api.put<APIResponse<void>>(`/posts/${postPublicID}/like`, data);
    return { message: res.data.message };
  },

  addComment: async (
    postPublicID: string,
    data: AddCommentReq
  ): Promise<CommentRes> => {
    const res = await api.post<APIResponse<CommentRes>>(`/posts/${postPublicID}/comments`, data);
    return res.data.data!;
  },

  createPost: async (data: CreatePostReq): Promise<PostRes> => {
    const res = await api.post<APIResponse<PostRes>>('/posts', data);
    return res.data.data!;
  },

  deletePost: async (postPublicID: string): Promise<void> => {
    await api.delete(`/posts/${postPublicID}`);
  },

  deleteComment: async (postPublicID: string, commentID: string): Promise<void> => {
    await api.delete(`/posts/${postPublicID}/comments/${commentID}`);
  },

  updateComment: async (postPublicID: string, commentID: string, data: { content: string }): Promise<CommentRes> => {
    const res = await api.put<APIResponse<CommentRes>>(`/posts/${postPublicID}/comments/${commentID}`, data);
    return res.data.data!;
  },

  getPostUploadSignature: async (): Promise<UploadSignatureResult> => {
    const res = await api.get<APIResponse<UploadSignatureResult>>('/posts/upload-signature');
    return res.data.data!;
  },
};
