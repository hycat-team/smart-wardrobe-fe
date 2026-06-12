import api from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { APIResponse, PaginationResult } from '@/types/api';
import {
  OutfitRes,
  SaveOutfitReq,
} from '../types';

export const outfitsApi = {
  getMyOutfits: async (params?: { page?: number; limit?: number }, axiosInstance: AxiosInstance = api): Promise<PaginationResult<OutfitRes>> => {
    const res = await axiosInstance.get<APIResponse<PaginationResult<OutfitRes>>>('/me/outfits', { params });
    return res.data.data!;
  },

  createOutfit: async (data: SaveOutfitReq): Promise<OutfitRes & { message?: string }> => {
    const res = await api.post<APIResponse<OutfitRes>>('/outfits', data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  getOutfitDetail: async (id: string, axiosInstance: AxiosInstance = api): Promise<OutfitRes> => {
    const res = await axiosInstance.get<APIResponse<OutfitRes>>(`/outfits/${id}`);
    return res.data.data!;
  },

  updateOutfit: async (id: string, data: SaveOutfitReq): Promise<OutfitRes & { message?: string }> => {
    const res = await api.put<APIResponse<OutfitRes>>(`/outfits/${id}`, data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  deleteOutfit: async (id: string): Promise<{ message?: string }> => {
    const res = await api.delete<APIResponse<void>>(`/outfits/${id}`);
    return { message: res.data?.message };
  },
};
