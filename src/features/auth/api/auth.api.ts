import api from '@/lib/axios';
import { AuthResponse, LoginPayload, User } from '../types';

export const authApi = {
  // POST: Đăng nhập
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  // POST: Làm mới token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> => {
    const { data } = await api.post('/auth/refresh-token', { refreshToken });
    return data;
  },

  // POST: Đăng xuất
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // GET: Lấy thông tin user hiện tại (Me)
  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  // PUT: Cập nhật thông tin user
  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const { data } = await api.put('/auth/me', payload);
    return data;
  },
};
