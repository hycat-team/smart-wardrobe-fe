import api from '@/lib/axios';
import {
  AddPointsPayload,
  BrandInfo,
  BrandCustomer,
  Conversation,
  ConversationMessage,
  CreateBenefitPayload,
  CreateBrandPayload,
  CreateOfflineCustomerPayload,
  CustomerDetail,
  LoyaltyProgram,
  LoyaltyTier,
  LoyaltyTransaction,
  Benefit,
  BrandStatus,
  PaginationResult,
  BrandMember,
  BrandItemRes,
  CreateBrandItemReq,
  UpdateBrandItemReq,
  UpsertLoyaltyProgramPayload
} from '../types';

export const brandPortalApi = {
  // Brand
  getMyBrands: async () => {
    const res = await api.get<{data: BrandInfo[]}>('/brand-portal/me/brands');
    return res.data.data || [];
  },
  
  getBrandProfile: async (brandId: string) => {
    const res = await api.get<{data: BrandInfo}>(`/brand-portal/brands/${brandId}`);
    return res.data.data;
  },

  createBrand: async (payload: CreateBrandPayload) => {
    const res = await api.post<{data: BrandInfo}>('/brand-portal/brands', payload);
    return res.data.data;
  },

  // CRM
  getCustomers: async (brandId: string, search?: string) => {
    const res = await api.get<{data: BrandCustomer[]}>(`/brand-portal/brands/${brandId}/customers`, {
      params: { search }
    });
    return res.data.data || [];
  },

  getCustomerDetail: async (brandId: string, customerId: string) => {
    const res = await api.get<{data: CustomerDetail}>(`/brand-portal/brands/${brandId}/customers/${customerId}`);
    return res.data.data;
  },

  createOfflineCustomer: async (brandId: string, payload: CreateOfflineCustomerPayload) => {
    const res = await api.post<{data: any}>(`/brand-portal/brands/${brandId}/customers/offline-purchase`, payload);
    return res.data.data;
  },

  generateClaimToken: async (brandId: string, customerId: string) => {
    const res = await api.post<{data: { claimToken: string, expiresAt: string }}>(`/brand-portal/brands/${brandId}/customers/${customerId}/claim-token`);
    return res.data.data;
  },

  revokeClaimToken: async (brandId: string, customerId: string) => {
    const res = await api.post<{data: any}>(`/brand-portal/brands/${brandId}/customers/${customerId}/revoke-claim`);
    return res.data.data;
  },

  addLoyaltyPoints: async (brandId: string, payload: AddPointsPayload) => {
    const res = await api.post<{data: any}>(`/brand-portal/brands/${brandId}/loyalty/points`, payload);
    return res.data.data;
  },

  // Loyalty
  getLoyaltyProgram: async (brandId: string) => {
    const res = await api.get<{data: LoyaltyProgram}>(`/brand-portal/brands/${brandId}/loyalty/program`);
    return res.data.data;
  },

  upsertLoyaltyProgram: async (brandId: string, payload: UpsertLoyaltyProgramPayload) => {
    const res = await api.put<{data: LoyaltyProgram}>(`/brand-portal/brands/${brandId}/loyalty/program`, payload);
    return res.data.data;
  },

  getLoyaltyTiers: async (brandId: string) => {
    const res = await api.get<{data: LoyaltyTier[]}>(`/brand-portal/brands/${brandId}/loyalty/tiers`);
    return res.data.data || [];
  },

  getLoyaltyAccountTransactions: async (brandId: string, accountId: string) => {
    const res = await api.get<{data: LoyaltyTransaction[]}>(`/brand-portal/brands/${brandId}/loyalty/accounts/${accountId}/transactions`);
    return res.data.data || [];
  },

  // Benefits
  getBenefits: async (brandId: string) => {
    const res = await api.get<{data: Benefit[]}>(`/brand-portal/brands/${brandId}/benefits`);
    return res.data.data || [];
  },

  createBenefit: async (brandId: string, payload: CreateBenefitPayload) => {
    const res = await api.post<{data: Benefit}>(`/brand-portal/brands/${brandId}/benefits`, payload);
    return res.data.data;
  },

  updateBenefitStatus: async (brandId: string, benefitId: string, status: string) => {
    const res = await api.patch<{data: Benefit}>(`/brand-portal/brands/${brandId}/benefits/${benefitId}/status`, { status });
    return res.data.data;
  },

  // Chat
  getConversations: async (brandId: string) => {
    const res = await api.get<{data: Conversation[]}>(`/brand-portal/brands/${brandId}/conversations`);
    return res.data.data || [];
  },

  getConversationMessages: async (brandId: string, conversationId: string) => {
    const res = await api.get<{data: ConversationMessage[]}>(`/brand-portal/brands/${brandId}/conversations/${conversationId}/messages`);
    return res.data.data || [];
  },

  sendConversationMessage: async (brandId: string, conversationId: string, message: string) => {
    const res = await api.post<{data: ConversationMessage}>(`/brand-portal/brands/${brandId}/conversations/${conversationId}/messages`, { message });
    return res.data.data;
  },

  // Members
  getBrandMembers: async (brandId: string) => {
    const res = await api.get<{data: BrandMember[]}>(`/brand-portal/brands/${brandId}/members`);
    return res.data.data;
  },

  addBrandMembers: async (brandId: string, members: { emailOrUsername: string; role: string }[]) => {
    const res = await api.post<{data: any}>(`/brand-portal/brands/${brandId}/members`, { members });
    return res.data.data;
  },

  // Brand Items
  getBrandItems: async (brandId: string) => {
    const res = await api.get<{data: BrandItemRes[]}>(`/brand-portal/brands/${brandId}/items`);
    return res.data.data || [];
  },

  createBrandItem: async (brandId: string, payload: CreateBrandItemReq) => {
    const res = await api.post<{data: BrandItemRes}>(`/brand-portal/brands/${brandId}/items`, payload);
    return res.data.data;
  },

  getBrandItemDetail: async (brandId: string, itemId: string) => {
    const res = await api.get<{data: BrandItemRes}>(`/brand-portal/brands/${brandId}/items/${itemId}`);
    return res.data.data;
  },

  updateBrandItem: async (brandId: string, itemId: string, payload: UpdateBrandItemReq) => {
    const res = await api.put<{data: BrandItemRes}>(`/brand-portal/brands/${brandId}/items/${itemId}`, payload);
    return res.data.data;
  },

  updateBrandItemStatus: async (brandId: string, itemId: string, status: string) => {
    const res = await api.patch<{data: BrandItemRes}>(`/brand-portal/brands/${brandId}/items/${itemId}/status`, { status });
    return res.data.data;
  },

  getBrandItemUploadSignature: async (brandId: string) => {
    const res = await api.get<{data: { signature: string, timestamp: number, folder: string, apiKey: string }}>(`/brand-portal/brands/${brandId}/items/upload-signature`);
    return res.data.data;
  },

  getBrandItemFeedbacks: async (brandId: string, itemId: string) => {
    const res = await api.get<{data: any[]}>(`/brand-portal/brands/${brandId}/items/${itemId}/feedbacks`);
    return res.data.data || [];
  },


  // Admin
  getAdminBrands: async (params?: { page?: number; limit?: number; status?: string; q?: string }) => {
    const res = await api.get<{data: PaginationResult<BrandInfo>}>('/admin/brands', { params });
    return res.data.data;
  },

  createBrandAdmin: async (payload: CreateBrandPayload) => {
    const res = await api.post<{data: BrandInfo}>('/admin/brands', payload);
    return res.data.data;
  },

  updateBrandStatusAdmin: async (brandId: string, status: BrandStatus) => {
    const res = await api.patch<{data: BrandInfo}>(`/admin/brands/${brandId}/status`, { status });
    return res.data.data;
  }
};
