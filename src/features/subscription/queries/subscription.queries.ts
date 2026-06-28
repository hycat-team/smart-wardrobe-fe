import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscription.api';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-error';

export const useDailyQuota = () => {
  return useQuery({
    queryKey: ['subscription', 'daily-quota'],
    queryFn: () => subscriptionApi.getDailyQuota(),
  });
};

export const useMySubscription = () => {
  return useQuery({
    queryKey: ['subscription', 'me'],
    queryFn: () => subscriptionApi.getMySubscription(),
  });
};

export const useToggleAutoRenew = () => {
  const queryClient = useQueryClient();
  const { data: sub } = useMySubscription();

  return useMutation({
    mutationFn: (newValue?: boolean) => {
      if (newValue !== undefined) {
        return subscriptionApi.toggleAutoRenew(newValue);
      }
      // Toggle to the opposite status, defaulting to false if not loaded
      const currentStatus = sub?.isAutoRenewEnabled || sub?.IsAutoRenewEnabled || false;
      return subscriptionApi.toggleAutoRenew(!currentStatus);
    },
    onSuccess: (res) => {
      toast.success(res?.message || (res?.data ? 'Đã bật tự động gia hạn' : 'Đã tắt tự động gia hạn'));
      // Invalidate the subscription query to refresh data
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] });
    },
    onError: (error) => {
      handleApiError(error, 'Cập nhật trạng thái gia hạn thất bại.');
    }
  });
};
export const useToggleAutoRenewMutation = useToggleAutoRenew; // alias for backwards compatibility
