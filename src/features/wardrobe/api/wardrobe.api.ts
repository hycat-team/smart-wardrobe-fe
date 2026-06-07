import api from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { APIResponse } from '@/types/api';
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
  getMyWardrobeItems: async (axiosInstance: AxiosInstance = api): Promise<WardrobeItemRes[]> => {
    const res = await axiosInstance.get<APIResponse<WardrobeItemRes[]>>('/me/wardrobe-items');
    return res.data.data!;
  },

  getUploadSignature: async (axiosInstance: AxiosInstance = api): Promise<UploadSignatureResult> => {
    const res = await axiosInstance.get<APIResponse<UploadSignatureResult>>('/wardrobe-items/upload-signature');
    return res.data.data!;
  },

  batchUploadWardrobeItems: async (data: BatchCropWardrobeItemsReq): Promise<WardrobeItemRes[]> => {
    const res = await api.post<APIResponse<WardrobeItemRes[]>>('/wardrobe-items/batch-upload', data);
    return res.data.data!;
  },

  initClosetFromCatalog: async (data: InitClosetFromCatalogReq): Promise<WardrobeItemRes[]> => {
    const res = await api.post<APIResponse<WardrobeItemRes[]>>('/wardrobe-items/catalog-init', data);
    return res.data.data!;
  },

  getWardrobeItemDetail: async (id: string, axiosInstance: AxiosInstance = api): Promise<WardrobeItemRes> => {
    const res = await axiosInstance.get<APIResponse<WardrobeItemRes>>(`/wardrobe-items/${id}`);
    return res.data.data!;
  },

  cloneWardrobeItem: async (id: string, data: CloneWardrobeItemReq): Promise<WardrobeItemRes[]> => {
    const res = await api.post<APIResponse<WardrobeItemRes[]>>(`/wardrobe-items/${id}/clone`, data);
    return res.data.data!;
  },

  updateWardrobeItem: async (id: string, data: UpdateWardrobeItemReq): Promise<WardrobeItemRes> => {
    const res = await api.put<APIResponse<WardrobeItemRes>>(`/wardrobe-items/${id}/manual-classify`, data);
    return res.data.data!;
  },

  deleteWardrobeItem: async (id: string, axiosInstance: AxiosInstance = api): Promise<void> => {
    await axiosInstance.delete<APIResponse<void>>(`/wardrobe-items/${id}`);
  },

  getCategories: async (axiosInstance: AxiosInstance = api): Promise<CategoryRes[]> => {
    const res = await axiosInstance.get<APIResponse<CategoryRes[]>>('/categories');
    return res.data.data!;
  },

  searchWardrobeItems: async (query: string, axiosInstance: AxiosInstance = api): Promise<SearchWardrobeItemRes[]> => {
    const res = await axiosInstance.get<APIResponse<SearchWardrobeItemRes[]>>('/wardrobe-items/search', {
      params: { q: query },
    });
    return res.data.data!;
  },
};
