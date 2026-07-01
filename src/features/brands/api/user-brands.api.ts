import api from '@/lib/axios';
import { BrandInfo, Benefit, Conversation, ConversationMessage, BrandItemRes, PaginationResult } from '@/features/brand-portal/types';

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

  // Lấy danh sách phúc lợi (active) của brand
  getBrandBenefits: async (brandId: string) => {
    const res = await api.get<{data: Benefit[]}>(`/brands/${brandId}/benefits`);
    return res.data.data;
  },

  // Lấy danh sách sản phẩm của brand (cho khách hàng xem)
  // Ghi chú: endpoint này là /brands/:brandId/items theo tài liệu backend router
  getBrandItems: async (brandId: string) => {
    const res = await api.get<{data: BrandItemRes[]}>(`/brands/${brandId}/items`);
    return res.data.data || [];
  },

  // Xem chi tiết sản phẩm của brand
  getBrandItemDetail: async (itemId: string) => {
    const res = await api.get<{data: BrandItemRes}>(`/brand-items/${itemId}`);
    return res.data.data;
  },

  // Phản hồi/Đánh giá sản phẩm
  createBrandItemFeedback: async (itemId: string, payload: { content: string, rating: number }) => {
    const res = await api.post<{data: any}>(`/brand-items/${itemId}/feedbacks`, payload);
    return res.data.data;
  },
  
  // Khách hàng nhập mã claim để liên kết tài khoản offline

  claimOfflineAccount: async (claimToken: string) => {
    const res = await api.post<{data: any}>('/brands/claim', { claimToken });
    return res.data.data;
  },

  // Lấy thông tin phòng chat với brand
  getConversation: async (brandId: string) => {
    const res = await api.get<{data: Conversation}>(`/brands/${brandId}/conversation`);
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

