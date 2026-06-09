import api from '@/lib/axios';
import { AxiosInstance } from 'axios';
import { DailyQuota, SubscriptionPlan, UserSubscription } from '../types';
import { APIResponse } from '@/types/api';

export const subscriptionApi = {
  // Pass serverApi when calling from Server Components
  getSubscriptionPlans: async (axiosInstance: AxiosInstance = api): Promise<SubscriptionPlan[]> => {
    const res = await axiosInstance.get<APIResponse<SubscriptionPlan[]>>('/subscriptions/plans');
    return res.data.data!;
  },

  getMySubscription: async (axiosInstance: AxiosInstance = api): Promise<UserSubscription> => {
    const res = await axiosInstance.get<APIResponse<UserSubscription>>('/subscriptions/me');
    return res.data.data!;
  },

  getDailyQuota: async (axiosInstance: AxiosInstance = api): Promise<DailyQuota> => {
    const res = await axiosInstance.get<APIResponse<DailyQuota>>('/subscriptions/me/daily-quota');
    return res.data.data!;
  },

  toggleAutoRenew: async (autoRenew: boolean): Promise<{ data: boolean; message?: string }> => {
    const res = await api.put<APIResponse<boolean>>('/subscriptions/me/auto-renew', { enabled: autoRenew });
    return { data: res.data.data!, message: res.data.message };
  },
};
