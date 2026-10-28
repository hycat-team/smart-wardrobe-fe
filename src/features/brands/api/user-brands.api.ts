import api from '@/lib/axios';
import { BrandInfo, Benefit, Conversation, ConversationMessage, BrandItemRes, PaginationResult, SampleFeedbackPayload, DigitalSampleResponseRes, MyBenefitsResult, LoyaltyTierRes } from '@/features/brand-portal/types';

export const userBrandsApi = {
  // Lấy danh sách brand đang hoạt động
  getActiveBrands: async () => {
    const res = await api.get<{data: PaginationResult<BrandInfo>}>('/brands');
    return res.data.data.items;
  },

  // Lấy chi tiết brand (public)
  getBrandDetail: async (brandId: string) => {
    const res = await api.get<{data: BrandInfo}>(`/brands/${brandId}`);
    return res.data.data;
  },

  // Khách hàng tham gia loyalty
  joinLoyalty: async (brandId: string) => {
    const res = await api.post<{data: any}>(`/brands/${brandId}/join-loyalty`);
    return res.data.data;
  },

  // Lấy danh sách quyền lợi/voucher (active) của brand
  getBrandBenefits: async (brandId: string, params?: { page?: number; limit?: number; unlockType?: string; benefitType?: string }) => {
    const res = await api.get<{data: PaginationResult<Benefit>}>(`/brands/${brandId}/benefits`, { params });
    return res.data.data;
  },

  // Lấy chi tiết quyền lợi/voucher
  getBenefitDetail: async (benefitId: string) => {
    const res = await api.get<{data: Benefit}>(`/brand-benefits/${benefitId}`);
    return res.data.data;
  },

  // Quyền lợi của tôi: toàn bộ quyền lợi active + trạng thái mở khoá + lượt đổi gần nhất
  getMyBenefits: async (brandId: string, params?: { page?: number; limit?: number; unlockType?: string; benefitType?: string }) => {
    const res = await api.get<{data: MyBenefitsResult}>(`/me/brand-loyalties/${brandId}/benefits`, { params });
    return res.data.data;
  },

  // Đổi ưu đãi
  redeemBenefit: async (benefitId: string) => {
    const res = await api.post<{data: any}>(`/brand-benefits/${benefitId}/redeem`);
    return res.data.data;
  },

  // Lấy danh sách ưu đãi đã đổi của user
  getMyBenefitRedemptions: async (brandId?: string) => {
    const params = brandId ? { brandId } : undefined;
    const res = await api.get<{data: PaginationResult<any>}>(`/me/benefit-redemptions`, { params });
    return res.data.data.items || [];
  },

  // Xem thẻ thành viên của user
  getMyLoyalties: async () => {
    const res = await api.get<{data: any[]}>(`/me/brand-loyalties`);
    return res.data.data;
  },

  // Xem chi tiết thẻ thành viên tại 1 brand
  getMyLoyaltyAtBrand: async (brandId: string) => {
    try {
      const res = await api.get<{data: any}>(`/me/brand-loyalties/${brandId}`);
      return res.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Xem lịch sử lô điểm
  getMyLoyaltyLots: async (brandId: string) => {
    const res = await api.get<{data: any[]}>(`/me/brand-loyalties/${brandId}/lots`);
    return res.data.data;
  },

  // Xem lịch sử tích/tiêu điểm
  getMyLoyaltyTransactions: async (brandId: string) => {
    const res = await api.get<{data: any[]}>(`/me/brand-loyalties/${brandId}/transactions`);
    return res.data.data;
  },

  // Xem chi tiết hạng thành viên
  getLoyaltyTierDetails: async (brandId: string, tierId: string) => {
    const res = await api.get<{data: any}>(`/brands/${brandId}/loyalty/tiers/${tierId}`);
    return res.data.data;
  },

  // Lấy toàn bộ hạng thành viên + quyền lợi cộng dồn (public)
  getPublicLoyaltyTiers: async (brandId: string) => {
    const res = await api.get<{data: LoyaltyTierRes[]}>(`/brands/${brandId}/loyalty/tiers`);
    return res.data.data || [];
  },

  // Lấy danh sách sản phẩm của brand (cho khách hàng xem)
  // Ghi chú: endpoint này là /brands/:brandId/items theo tài liệu backend router
  getBrandItems: async (brandId: string) => {
    const res = await api.get<{data: any}>(`/brands/${brandId}/items`);
    if (res.data.data && Array.isArray(res.data.data.items)) {
      return res.data.data.items as BrandItemRes[];
    }
    if (Array.isArray(res.data.data)) {
      return res.data.data as BrandItemRes[];
    }
    return [];
  },

  // Xem chi tiết sản phẩm của brand
  getBrandItemDetail: async (itemId: string) => {
    const res = await api.get<{data: BrandItemRes}>(`/brand-items/${itemId}`);
    return res.data.data;
  },

  getBrandSamples: async (brandId: string, page = 1, limit = 20) => {
    const res = await api.get<{data: PaginationResult<BrandItemRes>}>(`/brands/${brandId}/items/samples`, { params: { page, limit } });
    return res.data.data;
  },

  // Phản hồi/Đánh giá sản phẩm
  createBrandItemFeedback: async (itemId: string, payload: SampleFeedbackPayload) => {
    const res = await api.post<{data: DigitalSampleResponseRes}>(`/brand-items/${itemId}/feedbacks`, payload);
    return res.data.data;
  },
  
  // Khách hàng nhập mã claim để liên kết tài khoản offline

  claimOfflineAccount: async (claimToken: string) => {
    const res = await api.post<{data: any}>('/brands/claim', { claimToken });
    return res.data.data;
  },

  // Lấy thông tin phòng chat với brand
  getConversation: async (brandId: string) => {
    const res = await api.get<{data: Conversation}>(`/brands/${brandId}/conversation`, { silent: true } as any);
    return res.data.data;
  },

  // Khách hàng gửi tin nhắn cho brand
  sendConversationMessage: async (brandId: string, message: string) => {
    const res = await api.post<{data: ConversationMessage}>(`/brands/${brandId}/conversation/messages`, { message });
    return res.data.data;
  },

  // Đánh dấu đã đọc
  markConversationRead: async (brandId: string) => {
    const res = await api.post<{data: any}>(`/brands/${brandId}/conversation/read`);
    return res.data.data;
  },

  getBrandPortalItem: async (brandId: string, itemType?: 'product' | 'sample') => {
    const res = await api.get<{data: any}>(`/brand-portal/brands/${brandId}/items`, { params: itemType ? { itemType } : undefined });
    if (res.data.data && Array.isArray(res.data.data.items)) {
      return res.data.data.items as BrandItemRes[];
    }
    if (Array.isArray(res.data.data)) {
      return res.data.data as BrandItemRes[];
    }
    return [];
  },
};

