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
      if (error?.response?.status === 400) return false;
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

