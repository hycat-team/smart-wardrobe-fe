import api from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { APIResponse } from '@/types/api';
import { SearchRes } from '../types';

export const searchApi = {
  /**
   * Tìm kiếm tập trung: người dùng (Account) và bài viết thời trang 30 ngày gần nhất
   */
  searchCommunity: async (
    params: {
      q: string;
      type?: 'all' | 'users' | 'posts';
      postType?: 'outfit' | 'media';
      page?: number;
      limit?: number;
    },
    axiosInstance: AxiosInstance = api
  ): Promise<SearchRes> => {
    const res = await axiosInstance.get<APIResponse<SearchRes>>('/search', { params });
    return res.data.data || {
      users: { items: [], metadata: { page: 1, limit: 20, totalItems: 0, totalPages: 0 } },
      posts: { items: [], metadata: { page: 1, limit: 20, totalItems: 0, totalPages: 0 } },
    };
  },
};
