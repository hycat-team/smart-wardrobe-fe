import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscription.api';
import { toast } from 'sonner';

export const useToggleAutoRenewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (autoRenew: boolean) => subscriptionApi.toggleAutoRenew(autoRenew),
    onSuccess: (data) => {
      toast.success(data ? 'Đã bật tự động gia hạn' : 'Đã tắt tự động gia hạn');
      // Invalidate the subscription query to refresh data
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] });
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi thay đổi cài đặt tự động gia hạn');
    },
  });
};
