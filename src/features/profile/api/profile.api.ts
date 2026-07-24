import api from '@/lib/axios';
import { APIResponse } from '@/types/api';
import { UserRes, UpdateProfileReq, ChangePasswordReq, UpdateAvatarReq } from '../types';

export const profileApi = {
  getProfile: async (): Promise<UserRes> => {
    const res = await api.get<APIResponse<UserRes>>('/me');
    const responseData = res.data as any;
    if (responseData && responseData.data) {
      return responseData.data;
    }
    return responseData as UserRes;
  },

  updateProfile: async (data: UpdateProfileReq): Promise<UserRes & { message?: string }> => {
    const res = await api.put<APIResponse<UserRes>>('/me', data);
    const result = res.data.data as any;
    if (result) result.message = res.data.message;
    return result;
  },

  changePassword: async (data: ChangePasswordReq): Promise<{ message?: string }> => {
    const res = await api.put<APIResponse>('/me/change-password', data);
    return { message: res.data.message };
  },

  getAvatarSignature: async (): Promise<{ signature: string; timestamp: number; folder: string; apiKey: string }> => {
    const res = await api.get<{ data: { signature: string; timestamp: number; folder: string; apiKey: string } }>('/me/avatar-signature');
    return res.data.data;
  },

  updateAvatar: async (data: UpdateAvatarReq): Promise<UserRes> => {
    const res = await api.put<APIResponse<UserRes>>('/me/avatar', data);
    return res.data.data!;
  }
};
