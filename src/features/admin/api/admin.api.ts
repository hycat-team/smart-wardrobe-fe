import api from "@/lib/axios";
import { APIResponse, PaginationResult } from "@/types/api";
import {
  AdminUserListRes,
  UpdateUserStatusReq,
  AdminPostListRes,
  AdminPostItemListRes,
} from "../types";

export const adminApi = {
  // Users
  getUsers: async (params?: Record<string, any>): Promise<AdminUserListRes> => {
    const res = await api.get<APIResponse<AdminUserListRes>>("/admin/users", { params });
    return res.data.data as AdminUserListRes;
  },
  updateUserStatus: async ({
    id,
    data,
  }: {
    id: string;
    data: UpdateUserStatusReq;
  }): Promise<any> => {
    const res = await api.patch<APIResponse>(`/admin/users/${id}/status`, data);
    return res.data;
  },

  // Posts
  getPosts: async (params?: Record<string, any>): Promise<AdminPostListRes> => {
    const res = await api.get<APIResponse<AdminPostListRes>>("/admin/posts", { params });
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
    const res = await api.get<APIResponse<AdminPostItemListRes>>("/admin/post-items", { params });
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
    const res = await api.get<APIResponse<any[]>>("/admin/categories");
    return res.data.data || [];
  },
  createCategory: async (data: { name: string; slug: string }): Promise<any> => {
    const res = await api.post<APIResponse>("/admin/categories", data);
    return res.data.data;
  },
  updateCategory: async ({
    id,
    data,
  }: {
    id: string;
    data: { name: string; slug: string };
  }): Promise<any> => {
    const res = await api.put<APIResponse>(`/admin/categories/${id}`, data);
    return res.data.data;
  },
  deleteCategory: async (id: string): Promise<any> => {
    const res = await api.delete<APIResponse>(`/admin/categories/${id}`);
    return res.data.data;
  },

  // Catalog
  getUploadSignature: async (): Promise<any> => {
    const res = await api.get<APIResponse<any>>("/admin/wardrobe-items/upload-signature");
    return res.data.data;
  },
  getSystemWardrobeItems: async (params?: Record<string, any>): Promise<PaginationResult<any>> => {
    const res = await api.get<APIResponse<PaginationResult<any>>>("/admin/wardrobe-items", {
      params,
    });
    return res.data.data!;
  },
  batchUploadSystemWardrobeItems: async (data: {
    items: { categoryId: string; imagePublicId: string; imageUrl: string }[];
  }): Promise<any> => {
    const res = await api.post<APIResponse>("/admin/wardrobe-items/batch-upload", data);
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
