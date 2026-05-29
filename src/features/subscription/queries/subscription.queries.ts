import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscription.api';
import { toast } from 'sonner';

export const SUBSCRIPTION_QUOTA_KEY = ['daily-quota'];

export const useDailyQuota = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_QUOTA_KEY,
    queryFn: subscriptionApi.getDailyQuota,
  });
};

export const useToggleAutoRenew = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.toggleAutoRenew,
    onSuccess: () => {
      toast.success('Cập nhật trạng thái tự động gia hạn thành công');
      // Invalidate query to refresh data if necessary
      queryClient.invalidateQueries({ queryKey: ['me'] }); // Profile API also returns subscription
    },
  });
};
