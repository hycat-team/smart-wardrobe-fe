import api from '@/lib/axios';
import { BrandInfo, Benefit, Conversation, ConversationMessage, BrandItemRes, PaginationResult, SampleFeedbackPayload, DigitalSampleResponseRes } from '@/features/brand-portal/types';
import { mockBrands } from '@/lib/mock-data/b2b';

export const userBrandsApi = {
  // Lấy danh sách brand đang hoạt động
  getActiveBrands: async () => {
    const res = await api.get<{data: PaginationResult<BrandInfo>}>('/brands');
    return res.data.data.items;
  },

  // Lấy chi tiết brand (public)
  getBrandDetail: async (brandId: string) => {
    if (brandId.startsWith('brand_')) {
      const mockBrand = mockBrands.find(b => b.id === brandId);
      if (mockBrand) {
        return mockBrand as unknown as BrandInfo;
      }
    }
    const res = await api.get<{data: BrandInfo}>(`/brands/${brandId}`);
    return res.data.data;
  },

  // Khách hàng tham gia loyalty
  joinLoyalty: async (brandId: string) => {
    const res = await api.post<{data: any}>(`/brands/${brandId}/join-loyalty`);
    return res.data.data;
  },

  // Lấy danh sách phúc lợi (active) của brand
  getBrandBenefits: async (brandId: string) => {
    const res = await api.get<{data: Benefit[]}>(`/brands/${brandId}/benefits`);
    return res.data.data;
  },

  // Lấy chi tiết phúc lợi
  getBenefitDetail: async (benefitId: string) => {
    const res = await api.get<{data: Benefit}>(`/brand-benefits/${benefitId}`);
    return res.data.data;
  },

  // Đổi ưu đãi
  redeemBenefit: async (benefitId: string) => {
    const res = await api.post<{data: any}>(`/brand-benefits/${benefitId}/redeem`);
    return res.data.data;
  },

  // Lấy danh sách ưu đãi đã đổi của user
  getMyBenefitRedemptions: async (brandId?: string) => {
    // Tạm thời mock api theo yêu cầu: dùng API lấy benefits của brand
    if (brandId) {
      const res = await api.get<{data: any[]}>(`/brands/${brandId}/benefits`);
      return res.data.data;
    }
    return [];
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
    if (itemId.startsWith('product_')) {
      const idx = parseInt(itemId.split('_')[1]) || 1;
      const images = [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400",
        "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=400",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
      ];
      const imageUrl = images[idx % images.length];
      const names = [
        "Áo Blazer Cao Cấp",
        "Đầm Lụa Dáng Dài",
        "Áo Hoodie Midnight",
        "Quần Shorts Casual",
        "Linen Crop Top",
        "Tech Cargo Pants",
        "Váy Midi Hoa Cúc",
        "Áo Thun Cotton Organic",
        "Quần Jean Vintage",
        "Áo Khoác Parka Đi Tuyết",
        "Đầm Dạ Hội Velvet",
        "Balo Du Lịch Đa Năng"
      ];
      const name = names[idx % names.length] + ` #${idx}`;

      return {
        id: itemId,
        brandId: `brand_00${(idx % 5) + 1}`,
        name,
        price: 500000,
        status: "ACTIVE",
        fashionItem: {
          id: `fashion_${idx}`,
          categoryId: "cat_mock",
          categoryName: "Thời trang",
          imageUrl,
          color: "Đen",
          colorHex: "#000000",
          colorHue: 0,
          colorSaturation: 0,
          colorLightness: 0
        }
      } as BrandItemRes;
    }
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
  }
};

