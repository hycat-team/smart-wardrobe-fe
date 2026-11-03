import api from '@/lib/axios';
import { APIResponse } from '@/types/api';
import { StyleProfile, StyleSuggestion, UpdateStyleProfileReq } from '../types';

export const styleProfileApi = {
  getProfile: async (): Promise<StyleProfile> => {
    const res = await api.get<APIResponse<StyleProfile>>('/me/style-profile');
    return res.data.data!;
  },

  updateProfile: async (data: UpdateStyleProfileReq): Promise<StyleProfile> => {
    const res = await api.put<APIResponse<StyleProfile>>('/me/style-profile', data);
    return res.data.data!;
  },

  deleteProfile: async (): Promise<void> => {
    // The envelope omits `data` for DELETE, so only `message` is read.
    await api.delete<APIResponse<never>>('/me/style-profile');
  },

  getSuggestions: async (): Promise<StyleSuggestion> => {
    const res = await api.get<APIResponse<StyleSuggestion>>('/me/style-profile/suggestions');
    return res.data.data!;
  },
};
