import api from '@/lib/axios';
import { APIResponse } from '@/types/api';
import { DailyQuotaRes, ToggleAutoRenewRes } from '../types';

export const subscriptionApi = {
  getDailyQuota: async (): Promise<DailyQuotaRes> => {
    const res = await api.get<APIResponse<DailyQuotaRes>>('/subscriptions/me/daily-quota');
    return res.data.data!;
  },

  toggleAutoRenew: async (): Promise<ToggleAutoRenewRes> => {
    const res = await api.patch<APIResponse<ToggleAutoRenewRes>>('/subscriptions/me/toggle-auto-renew');
    return res.data.data!;
  },
};
