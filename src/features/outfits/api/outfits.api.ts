import api from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { APIResponse } from '@/types/api';
import {
  OutfitRes,
  SaveOutfitReq,
} from '../types';

export const outfitsApi = {
  getMyOutfits: async (axiosInstance: AxiosInstance = api): Promise<OutfitRes[]> => {
    const res = await axiosInstance.get<APIResponse<OutfitRes[]>>('/me/outfits');
    return res.data.data!;
  },

  createOutfit: async (data: SaveOutfitReq): Promise<OutfitRes> => {
    const res = await api.post<APIResponse<OutfitRes>>('/outfits', data);
    return res.data.data!;
  },

  getOutfitDetail: async (id: string, axiosInstance: AxiosInstance = api): Promise<OutfitRes> => {
    const res = await axiosInstance.get<APIResponse<OutfitRes>>(`/outfits/${id}`);
    return res.data.data!;
  },

  updateOutfit: async (id: string, data: SaveOutfitReq): Promise<OutfitRes> => {
    const res = await api.put<APIResponse<OutfitRes>>(`/outfits/${id}`, data);
    return res.data.data!;
  },

  deleteOutfit: async (id: string): Promise<void> => {
    await api.delete<APIResponse<void>>(`/outfits/${id}`);
  },
};
