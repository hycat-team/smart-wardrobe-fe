import api from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { APIResponse, PaginationResult } from '@/types/api';
import {
  PostRes,
  FollowReq,
  FollowUserRes,
  PublicProfileRes,
} from '../types';

export const userSocialApi = {
  /**
   * Theo dõi hoặc bỏ theo dõi một người dùng
   */
  followUser: async (
    username: string,
    data: FollowReq
  ): Promise<{ message?: string }> => {
    const res = await api.put<APIResponse<void>>(`/users/${username}/follow`, data);
    return { message: res.data.message };
  },

  /**
   * Lấy thông tin hồ sơ công khai của người dùng
   */
  getPublicProfile: async (
    username: string,
    axiosInstance: AxiosInstance = api
  ): Promise<PublicProfileRes> => {
    const res = await axiosInstance.get<APIResponse<PublicProfileRes>>(`/users/${username}`);
    return res.data.data!;
  },

  /**
   * Lấy danh sách bài viết của người dùng
   */
  getUserPosts: async (
    username: string,
    params?: { page?: number; limit?: number },
    axiosInstance: AxiosInstance = api
  ): Promise<PaginationResult<PostRes>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<PostRes>>>(
      `/users/${username}/posts`,
      { params }
    );
    return res.data.data!;
  },

  /**
   * Lấy danh sách người theo dõi hoặc đang theo dõi của người dùng
   */
  getUserFollows: async (
    username: string,
    params?: {
      type?: 'following' | 'followers';
      q?: string;
      page?: number;
      limit?: number;
    },
    axiosInstance: AxiosInstance = api
  ): Promise<PaginationResult<FollowUserRes>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<FollowUserRes>>>(
      `/users/${username}/follows`,
      { params }
    );
    return res.data.data!;
  },
};
