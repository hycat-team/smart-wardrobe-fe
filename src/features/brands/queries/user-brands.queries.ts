import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userBrandsApi } from '../api/user-brands.api';
import { toast } from 'sonner';

export const USER_BRANDS_KEYS = {
  all: ['user-brands'] as const,
  lists: () => [...USER_BRANDS_KEYS.all, 'list'] as const,
  detail: (brandId: string) => [...USER_BRANDS_KEYS.all, 'detail', brandId] as const,
  benefits: (brandId: string) => [...USER_BRANDS_KEYS.all, 'benefits', brandId] as const,
  items: (brandId: string) => [...USER_BRANDS_KEYS.all, 'items', brandId] as const,
  itemDetail: (itemId: string) => [...USER_BRANDS_KEYS.all, 'itemDetail', itemId] as const,
  conversation: (brandId: string) => [...USER_BRANDS_KEYS.all, 'conversation', brandId] as const,
  myLoyalties: () => [...USER_BRANDS_KEYS.all, 'myLoyalties'] as const,
  myLoyaltyAtBrand: (brandId: string) => [...USER_BRANDS_KEYS.all, 'myLoyaltyAtBrand', brandId] as const,
  myLoyaltyLots: (brandId: string) => [...USER_BRANDS_KEYS.all, 'myLoyaltyLots', brandId] as const,
  myLoyaltyTransactions: (brandId: string) => [...USER_BRANDS_KEYS.all, 'myLoyaltyTransactions', brandId] as const,
  benefitDetail: (benefitId: string) => [...USER_BRANDS_KEYS.all, 'benefitDetail', benefitId] as const,
  myBenefitRedemptions: () => [...USER_BRANDS_KEYS.all, 'myBenefitRedemptions'] as const,
  samples: (brandId: string) => [...USER_BRANDS_KEYS.all, 'samples', brandId] as const,
};


export const useGetActiveBrands = () => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.lists(),
    queryFn: () => userBrandsApi.getActiveBrands(),
  });
};

export const useGetActiveBrandDetail = (brandId: string) => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.detail(brandId),
    queryFn: () => userBrandsApi.getBrandDetail(brandId),
    enabled: !!brandId,
  });
};

export const useGetBrandItemDetail = (itemId: string) => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.itemDetail(itemId),
    queryFn: () => userBrandsApi.getBrandItemDetail(itemId),
    enabled: !!itemId,
  });
};

export const useJoinLoyalty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (brandId: string) => userBrandsApi.joinLoyalty(brandId),
    onSuccess: (_, brandId) => {
      toast.success('Đăng ký Loyalty thành công!');
      queryClient.invalidateQueries({ queryKey: USER_BRANDS_KEYS.detail(brandId) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể đăng ký Loyalty. Vui lòng thử lại sau.');
    }
  });
};

export const useGetBrandBenefits = (brandId: string) => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.benefits(brandId),
    queryFn: () => userBrandsApi.getBrandBenefits(brandId),
    enabled: !!brandId,
  });
};

export const useGetBenefitDetail = (benefitId: string) => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.benefitDetail(benefitId),
    queryFn: () => userBrandsApi.getBenefitDetail(benefitId),
    enabled: !!benefitId,
  });
};

export const useRedeemBenefit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (benefitId: string) => userBrandsApi.redeemBenefit(benefitId),
    onSuccess: (_, benefitId) => {
      toast.success('Đổi ưu đãi thành công!');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: USER_BRANDS_KEYS.myBenefitRedemptions() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể đổi ưu đãi. Vui lòng thử lại sau.');
    }
  });
};

export const useGetMyBenefitRedemptions = (brandId?: string) => {
  return useQuery({
    queryKey: brandId ? [...USER_BRANDS_KEYS.myBenefitRedemptions(), brandId] : USER_BRANDS_KEYS.myBenefitRedemptions(),
    queryFn: () => userBrandsApi.getMyBenefitRedemptions(brandId),
  });
};

export const useGetMyLoyalties = () => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.myLoyalties(),
    queryFn: () => userBrandsApi.getMyLoyalties(),
  });
};

export const useGetMyLoyaltyAtBrand = (brandId: string) => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.myLoyaltyAtBrand(brandId),
    queryFn: () => userBrandsApi.getMyLoyaltyAtBrand(brandId),
    enabled: !!brandId,
    retry: false,
  });
};

export const useGetMyLoyaltyLots = (brandId: string) => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.myLoyaltyLots(brandId),
    queryFn: () => userBrandsApi.getMyLoyaltyLots(brandId),
    enabled: !!brandId,
  });
};

export const useGetMyLoyaltyTransactions = (brandId: string) => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.myLoyaltyTransactions(brandId),
    queryFn: () => userBrandsApi.getMyLoyaltyTransactions(brandId),
    enabled: !!brandId,
  });
};

export const useGetBrandItems = (brandId: string) => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.items(brandId),
    queryFn: () => userBrandsApi.getBrandItems(brandId),
    enabled: !!brandId,
  });
};


export const useClaimOfflineAccount = () => {
  return useMutation({
    mutationFn: (claimToken: string) => userBrandsApi.claimOfflineAccount(claimToken),
    onSuccess: () => {
      toast.success('Liên kết tài khoản thành công!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Mã liên kết không hợp lệ hoặc đã hết hạn.');
    }
  });
};

export const useGetConversation = (brandId: string) => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.conversation(brandId),
    queryFn: () => userBrandsApi.getConversation(brandId),
    enabled: !!brandId,
    refetchInterval: 10000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 400 || error?.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

export const useSendConversationMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ brandId, message }: { brandId: string; message: string }) => 
      userBrandsApi.sendConversationMessage(brandId, message),
    onSuccess: (_, { brandId }) => {
      queryClient.invalidateQueries({ queryKey: USER_BRANDS_KEYS.conversation(brandId) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể gửi tin nhắn.');
    }
  });
};

export const useMarkConversationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (brandId: string) => userBrandsApi.markConversationRead(brandId),
    onSuccess: (_, brandId) => {
      queryClient.invalidateQueries({ queryKey: USER_BRANDS_KEYS.conversation(brandId) });
    }
  });
};

export const useGetBrandSamples = (brandId: string) => {
  return useQuery({
    queryKey: USER_BRANDS_KEYS.samples(brandId),
    queryFn: () => userBrandsApi.getBrandSamples(brandId),
    enabled: !!brandId,
    retry: false, // Don't retry on 403
  });
};

import { SampleFeedbackPayload } from '@/features/brand-portal/types';

export const useCreateSampleFeedback = () => {
  return useMutation({
    mutationFn: ({ itemId, payload }: { itemId: string, payload: SampleFeedbackPayload }) => 
      userBrandsApi.createBrandItemFeedback(itemId, payload),
    onSuccess: () => {
      toast.success('Phản hồi của bạn đã được ghi nhận. Cảm ơn bạn!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể gửi phản hồi. Vui lòng thử lại.');
    }
  });
};

