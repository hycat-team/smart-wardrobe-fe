import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandPortalApi } from '../api/brand-portal.api';
import { toast } from 'sonner';
import { BrandStatus, UpsertLoyaltyProgramPayload } from '../types';

const BRAND_PORTAL_KEYS = {
  all: ['brand-portal'] as const,
  myBrands: () => [...BRAND_PORTAL_KEYS.all, 'my-brands'] as const,
  profile: (brandId: string) => [...BRAND_PORTAL_KEYS.all, brandId, 'profile'] as const,
  customers: (brandId: string) => [...BRAND_PORTAL_KEYS.all, brandId, 'customers'] as const,
  customerDetail: (brandId: string, customerId: string) => [...BRAND_PORTAL_KEYS.customers(brandId), customerId] as const,
  loyaltyProgram: (brandId: string) => [...BRAND_PORTAL_KEYS.all, brandId, 'loyalty-program'] as const,
  loyaltyTiers: (brandId: string) => [...BRAND_PORTAL_KEYS.all, brandId, 'loyalty-tiers'] as const,
  loyaltyTransactions: (brandId: string, accountId: string) => [...BRAND_PORTAL_KEYS.all, brandId, 'loyalty-transactions', accountId] as const,
  benefits: (brandId: string) => [...BRAND_PORTAL_KEYS.all, brandId, 'benefits'] as const,
  conversations: (brandId: string) => [...BRAND_PORTAL_KEYS.all, brandId, 'conversations'] as const,
  conversationMessages: (brandId: string, conversationId: string) => [...BRAND_PORTAL_KEYS.conversations(brandId), conversationId, 'messages'] as const,
  members: (brandId: string) => [...BRAND_PORTAL_KEYS.all, brandId, 'members'] as const,
  adminBrands: () => [...BRAND_PORTAL_KEYS.all, 'admin-brands'] as const,
};

// Brand
export const useGetMyBrands = () => {
  return useQuery({
    queryKey: BRAND_PORTAL_KEYS.myBrands(),
    queryFn: brandPortalApi.getMyBrands,
  });
};

export const useGetBrandProfile = (brandId: string) => {
  return useQuery({
    queryKey: BRAND_PORTAL_KEYS.profile(brandId),
    queryFn: () => brandPortalApi.getBrandProfile(brandId),
    enabled: !!brandId,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => brandPortalApi.createBrand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.myBrands() });
      toast.success('Đã gửi yêu cầu đăng ký thương hiệu thành công!');
    },
  });
};

// CRM
export const useGetCustomers = (brandId: string, search?: string) => {
  return useQuery({
    queryKey: [...BRAND_PORTAL_KEYS.customers(brandId), { search }],
    queryFn: () => brandPortalApi.getCustomers(brandId, search),
    enabled: !!brandId,
  });
};

export const useGetCustomerDetail = (brandId: string, customerId: string) => {
  return useQuery({
    queryKey: BRAND_PORTAL_KEYS.customerDetail(brandId, customerId),
    queryFn: () => brandPortalApi.getCustomerDetail(brandId, customerId),
    enabled: !!brandId && !!customerId,
  });
};

export const useCreateOfflinePurchase = (brandId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => brandPortalApi.createOfflineCustomer(brandId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.customers(brandId) });
      toast.success('Thêm khách hàng thành công');
    },
  });
};

export const useAddLoyaltyPoints = (brandId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => brandPortalApi.addLoyaltyPoints(brandId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.customers(brandId) });
      toast.success('Cộng điểm thành công');
    },
  });
};

export const useGenerateClaimToken = (brandId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId: string) => brandPortalApi.generateClaimToken(brandId, customerId),
    onSuccess: (_, customerId) => {
      toast.success('Tạo mã Claim thành công');
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.customerDetail(brandId, customerId) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể tạo mã Claim');
    }
  });
};

export const useRevokeClaimToken = (brandId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId: string) => brandPortalApi.revokeClaimToken(brandId, customerId),
    onSuccess: (_, customerId) => {
      toast.success('Thu hồi mã Claim thành công');
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.customerDetail(brandId, customerId) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể thu hồi mã Claim');
    }
  });
};

// Loyalty
export const useGetLoyaltyProgram = (brandId: string) => {
  return useQuery({
    queryKey: BRAND_PORTAL_KEYS.loyaltyProgram(brandId),
    queryFn: () => brandPortalApi.getLoyaltyProgram(brandId),
    enabled: !!brandId,
  });
};

export const useGetLoyaltyTiers = (brandId: string) => {
  return useQuery({
    queryKey: BRAND_PORTAL_KEYS.loyaltyTiers(brandId),
    queryFn: () => brandPortalApi.getLoyaltyTiers(brandId),
    enabled: !!brandId,
  });
};

export const useUpsertLoyaltyProgram = (brandId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertLoyaltyProgramPayload) => 
      brandPortalApi.upsertLoyaltyProgram(brandId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.loyaltyProgram(brandId) });
      toast.success('Cập nhật chương trình thành công');
    },
  });
};

export const useGetLoyaltyAccountTransactions = (brandId: string, accountId?: string) => {
  return useQuery({
    queryKey: BRAND_PORTAL_KEYS.loyaltyTransactions(brandId, accountId || ''),
    queryFn: () => brandPortalApi.getLoyaltyAccountTransactions(brandId, accountId!),
    enabled: !!brandId && !!accountId,
  });
};

// Benefits
export const useGetBenefits = (brandId: string) => {
  return useQuery({
    queryKey: BRAND_PORTAL_KEYS.benefits(brandId),
    queryFn: () => brandPortalApi.getBenefits(brandId),
    enabled: !!brandId,
  });
};

export const useCreateBenefit = (brandId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => brandPortalApi.createBenefit(brandId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.benefits(brandId) });
      toast.success('Tạo phúc lợi thành công');
    },
  });
};

export const useUpdateBenefitStatus = (brandId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ benefitId, status }: { benefitId: string; status: string }) => 
      brandPortalApi.updateBenefitStatus(brandId, benefitId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.benefits(brandId) });
      toast.success('Cập nhật trạng thái thành công');
    },
  });
};

// Chat
export const useGetConversations = (brandId: string) => {
  return useQuery({
    queryKey: BRAND_PORTAL_KEYS.conversations(brandId),
    queryFn: () => brandPortalApi.getConversations(brandId),
    enabled: !!brandId,
    refetchInterval: 5000, // MVP polling
  });
};

export const useGetConversationMessages = (brandId: string, conversationId: string | null) => {
  return useQuery({
    queryKey: BRAND_PORTAL_KEYS.conversationMessages(brandId, conversationId || ''),
    queryFn: () => brandPortalApi.getConversationMessages(brandId, conversationId!),
    enabled: !!brandId && !!conversationId,
    refetchInterval: 5000, // MVP polling
  });
};

export const useSendConversationMessage = (brandId: string, conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => brandPortalApi.sendConversationMessage(brandId, conversationId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.conversationMessages(brandId, conversationId) });
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.conversations(brandId) });
    },
  });
};

// Members
export const useGetBrandMembers = (brandId: string) => {
  return useQuery({
    queryKey: BRAND_PORTAL_KEYS.members(brandId),
    queryFn: () => brandPortalApi.getBrandMembers(brandId),
    enabled: !!brandId,
  });
};

export const useAddBrandMembers = (brandId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (members: { emailOrUsername: string; role: string }[]) => brandPortalApi.addBrandMembers(brandId, members),
    onSuccess: () => {
      toast.success('Đã thêm thành viên thành công');
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.members(brandId) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Không thể thêm thành viên');
    }
  });
};

// Admin
export const useGetAdminBrands = (params?: { page?: number; limit?: number; status?: string; q?: string }) => {

  return useQuery({
    queryKey: [...BRAND_PORTAL_KEYS.adminBrands(), params],
    queryFn: () => brandPortalApi.getAdminBrands(params),
  });
};

export const useUpdateBrandStatusAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ brandId, status }: { brandId: string; status: BrandStatus }) => 
      brandPortalApi.updateBrandStatusAdmin(brandId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.adminBrands() });
      toast.success('Cập nhật trạng thái thành công');
    },
    onError: () => {
      toast.error('Cập nhật trạng thái thất bại');
    }
  });
};

export const useCreateBrandAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => brandPortalApi.createBrandAdmin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_PORTAL_KEYS.adminBrands() });
      toast.success('Tạo thương hiệu thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tạo thương hiệu thất bại');
    }
  });
};
