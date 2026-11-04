import api from '@/lib/axios';
import { APIResponse, PaginationResult } from '@/types/api';
import {
  AdminUserListRes,
  UpdateUserStatusReq,
  AdminPostListRes,
  AdminPostItemListRes,
  UserRes,
  AdminUserSubscriptionRecord,
  AdminSubscriptionPlan,
  AdminGrantBatchItem,
  AdminGrantBatchRes,
} from '../types';

export const adminApi = {
  // Users
  getUsers: async (params?: Record<string, any>): Promise<AdminUserListRes> => {
    const res = await api.get<APIResponse<AdminUserListRes>>('/admin/users', { params });
    return res.data.data as AdminUserListRes;
  },
  getUserDetail: async (id: string): Promise<UserRes> => {
    const res = await api.get<APIResponse<UserRes>>(`/admin/users/${id}`);
    return res.data.data as UserRes;
  },
  updateUserStatus: async ({ id, data }: { id: string; data: UpdateUserStatusReq }): Promise<any> => {
    const res = await api.patch<APIResponse>(`/admin/users/${id}/status`, data);
    return res.data;
  },

  // Subscriptions of a single account
  getUserSubscription: async (userId: string): Promise<AdminUserSubscriptionRecord | null> => {
    const res = await api.get<APIResponse<PaginationResult<AdminUserSubscriptionRecord>>>(
      '/admin/subscriptions',
      { params: { userId, page: 1, limit: 1 } }
    );
    return res.data.data?.items?.[0] ?? null;
  },
  getSubscriptionPlans: async (): Promise<AdminSubscriptionPlan[]> => {
    const res = await api.get<APIResponse<AdminSubscriptionPlan[]>>('/admin/subscriptions/plans');
    return res.data.data ?? [];
  },
  grantSubscription: async ({
    items,
    idempotencyKey,
  }: {
    items: AdminGrantBatchItem[];
    idempotencyKey: string;
  }): Promise<AdminGrantBatchRes> => {
    const res = await api.post<APIResponse<AdminGrantBatchRes>>(
      '/admin/subscription-grants',
      { items },
      { headers: { 'Idempotency-Key': idempotencyKey } }
    );
    return res.data.data as AdminGrantBatchRes;
  },
  cancelUserSubscription: async (userId: string): Promise<void> => {
    await api.post<APIResponse>(`/admin/subscriptions/${userId}/cancel`);
  },

  // Posts
  getPosts: async (params?: Record<string, any>): Promise<AdminPostListRes> => {
    const res = await api.get<APIResponse<AdminPostListRes>>('/admin/posts', { params });
    return res.data.data as AdminPostListRes;
  },
  deletePost: async (id: string): Promise<any> => {
    const res = await api.delete<APIResponse>(`/admin/posts/${id}`);
    return res.data;
  },
  restorePost: async (id: string): Promise<any> => {
    const res = await api.patch<APIResponse>(`/admin/posts/${id}/restore`);
    return res.data;
  },

  // Post Items (Listings)
  getPostItems: async (params?: Record<string, any>): Promise<AdminPostItemListRes> => {
    const res = await api.get<APIResponse<AdminPostItemListRes>>('/admin/post-items', { params });
    return res.data.data as AdminPostItemListRes;
  },
  getPostComments: async (postPublicID: string): Promise<any[]> => {
    const res = await api.get<APIResponse<any[]>>(`/posts/${postPublicID}/comments`);
    return res.data.data || [];
  },
  deletePostItem: async (id: string): Promise<any> => {
    const res = await api.delete<APIResponse>(`/admin/post-items/${id}`);
    return res.data;
  },
  hidePostItem: async (id: string): Promise<any> => {
    const res = await api.patch<APIResponse>(`/admin/post-items/${id}/hide`);
    return res.data;
  },

  // Comments
  deleteComment: async (id: string): Promise<any> => {
    const res = await api.delete<APIResponse>(`/admin/comments/${id}`);
    return res.data;
  },
  restoreComment: async (id: string): Promise<any> => {
    const res = await api.patch<APIResponse>(`/admin/comments/${id}/restore`);
    return res.data;
  },

  // Category
  getCategories: async (): Promise<any[]> => {
    const res = await api.get<APIResponse<any[]>>('/admin/categories');
    return res.data.data || [];
  },

  getUserCategories: async (): Promise<any[]> => {
    const res = await api.get<APIResponse<any[]>>('/categories');
    return res.data.data || [];
  },

  createCategory: async (data: { name: string; slug: string }): Promise<any> => {
    const res = await api.post<APIResponse>('/admin/categories', data);
    return res.data.data;
  },
  updateCategory: async ({ id, data }: { id: string; data: { name: string; slug: string } }): Promise<any> => {
    const res = await api.put<APIResponse>(`/admin/categories/${id}`, data);
    return res.data.data;
  },
  deleteCategory: async (id: string): Promise<any> => {
    const res = await api.delete<APIResponse>(`/admin/categories/${id}`);
    return res.data.data;
  },

  // Catalog
  getUploadSignature: async (): Promise<any> => {
    const res = await api.get<APIResponse<any>>('/admin/wardrobe-items/upload-signature');
    return res.data.data;
  },
  getSystemWardrobeItems: async (params?: Record<string, any>): Promise<PaginationResult<any>> => {
    const res = await api.get<APIResponse<PaginationResult<any>>>('/admin/wardrobe-items', { params });
    return res.data.data!;
  },
  batchUploadSystemWardrobeItems: async (data: { items: { categoryId: string; imagePublicId: string; imageUrl: string }[] }): Promise<any> => {
    const res = await api.post<APIResponse>('/admin/wardrobe-items/batch-upload', data);
    return res.data;
  },
  updateSystemWardrobeItem: async ({ id, data }: { id: string; data: any }): Promise<any> => {
    const res = await api.put<APIResponse>(`/admin/wardrobe-items/${id}`, data);
    return res.data;
  },
  deleteSystemWardrobeItem: async (id: string): Promise<any> => {
    const res = await api.delete<APIResponse>(`/admin/wardrobe-items/${id}`);
    return res.data;
  },
};
