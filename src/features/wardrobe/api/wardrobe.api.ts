import api from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { APIResponse, PaginationResult } from '@/types/api';
import {
  WardrobeItemRes,
  UploadSignatureResult,
  BatchCropWardrobeItemsReq,
  CloneWardrobeItemReq,
  InitClosetFromCatalogReq,
  SearchWardrobeItemRes,
  UpdateWardrobeItemReq,
  CategoryRes,
} from '../types';

export const wardrobeApi = {
  getMyWardrobeItems: async (params?: { page?: number; limit?: number; category_slug?: string }, axiosInstance: AxiosInstance = api): Promise<PaginationResult<WardrobeItemRes>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<WardrobeItemRes>>>('/me/wardrobe-items', { params });
    return res.data.data!;
  },

  getSystemCatalogItems: async (params?: { page?: number; limit?: number; category_slug?: string, q?: string }, axiosInstance: AxiosInstance = api): Promise<PaginationResult<WardrobeItemRes>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<WardrobeItemRes>>>('/system-catalog/wardrobe-items', { params });
    return res.data.data!;
  },


  getUploadSignature: async (axiosInstance: AxiosInstance = api): Promise<UploadSignatureResult> => {
    const res = await axiosInstance.get<APIResponse<UploadSignatureResult>>('/wardrobe-items/upload-signature');
    return res.data.data!;
  },

  batchUploadWardrobeItems: async (data: BatchCropWardrobeItemsReq): Promise<WardrobeItemRes[] & { message?: string }> => {
    const res = await api.post<APIResponse<WardrobeItemRes[]>>('/wardrobe-items/batch-upload', data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  initClosetFromCatalog: async (data: InitClosetFromCatalogReq): Promise<WardrobeItemRes[] & { message?: string }> => {
    const res = await api.post<APIResponse<WardrobeItemRes[]>>('/wardrobe-items/catalog-init', data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  getWardrobeItemDetail: async (id: string, axiosInstance: AxiosInstance = api): Promise<WardrobeItemRes> => {
    const res = await axiosInstance.get<APIResponse<WardrobeItemRes>>(`/wardrobe-items/${id}`);
    return res.data.data!;
  },

  cloneWardrobeItem: async (id: string, data: CloneWardrobeItemReq): Promise<WardrobeItemRes[] & { message?: string }> => {
    const res = await api.post<APIResponse<WardrobeItemRes[]>>(`/wardrobe-items/${id}/clone`, data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  updateWardrobeItem: async (id: string, data: UpdateWardrobeItemReq): Promise<WardrobeItemRes & { message?: string }> => {
    const res = await api.put<APIResponse<WardrobeItemRes>>(`/wardrobe-items/${id}/manual-classify`, data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  deleteWardrobeItem: async (id: string, axiosInstance: AxiosInstance = api): Promise<{ message?: string }> => {
    const res = await axiosInstance.delete<APIResponse<void>>(`/wardrobe-items/${id}`);
    return { message: res.data.message };
  },

  bulkDeleteWardrobeItems: async (data: { ids: string[] }): Promise<{ message?: string }> => {
    const res = await api.delete<APIResponse<void>>(`/wardrobe-items/bulk`, { data });
    return { message: res.data.message };
  },

  getCategories: async (axiosInstance: AxiosInstance = api): Promise<CategoryRes[]> => {
    const res = await axiosInstance.get<APIResponse<CategoryRes[]>>('/categories');
    return res.data.data!;
  },

  searchWardrobeItems: async (params?: { q?: string; page?: number; limit?: number; category_slug?: string }, axiosInstance: AxiosInstance = api): Promise<PaginationResult<SearchWardrobeItemRes>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<SearchWardrobeItemRes>>>('/wardrobe-items/search', {
      params,
    });
    return res.data.data!;
  },
};
