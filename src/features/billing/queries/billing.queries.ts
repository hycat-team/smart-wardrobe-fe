import { useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApi } from '../api/billing.api';
import { toast } from 'sonner';
import { DirectPurchaseReq, TopUpReq } from '../types';

export const useTopupMutation = () => {
  return useMutation({
    mutationFn: (data: TopUpReq) => billingApi.topupWallet(data),
    onSuccess: (data) => {
      // Redirect to PayOS
      const targetUrl = data?.paymentUrl || data?.checkoutUrl;
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    },
  });
};

export const usePurchaseDirectMutation = () => {
  return useMutation({
    mutationFn: (data: DirectPurchaseReq) => billingApi.purchasePlanDirect(data),
    onSuccess: (data) => {
      // Redirect to PayOS
      const targetUrl = data?.paymentUrl || data?.checkoutUrl;
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    },
  });
};


export const usePurchaseWithWalletMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DirectPurchaseReq) => billingApi.purchasePlanWithWallet(data),
    onSuccess: (res) => {
      toast.success(res?.message || 'Thanh toán bằng ví nội bộ thành công!');
      // Refresh wallet balance and subscription status
      queryClient.invalidateQueries({ queryKey: ['wallet', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] });
    },
  });
};
