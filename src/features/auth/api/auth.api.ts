import api from '@/lib/axios';
import { APIResponse } from '@/types/api';
import {
  LoginReq,
  RegisterReq,
  ConfirmRegisterOtpReq,
  SendForgotPasswordOtpReq,
  ConfirmForgotPasswordOtpReq,
  ResetPasswordReq,
  AuthTokenRes,
} from '../types';

export const authApi = {
  login: async (data: LoginReq): Promise<AuthTokenRes> => {
    // Gọi thẳng Next.js API route (BFF) để set HttpOnly Cookie
    const res = await api.post<APIResponse<AuthTokenRes>>('/api/auth/login', data, {
      baseURL: '', // Bỏ qua /api/v1 baseURL mặc định
    });
    console.log('Login response:', res.data);
    const responseData = res.data as any;
    if (responseData && responseData.data) {
      return responseData.data;
    }
    return responseData as AuthTokenRes;
  },

  register: async (data: RegisterReq): Promise<void> => {
    await api.post<APIResponse>('/auth/register', data);
  },

  confirmRegisterOtp: async (data: ConfirmRegisterOtpReq): Promise<void> => {
    await api.post<APIResponse>('/auth/register/confirm-otp', data);
  },

  logout: async (): Promise<void> => {
    // Next.js API route to clear cookies
    await api.post<APIResponse>('/api/auth/logout', {}, { baseURL: '' });
  },

  refreshToken: async (): Promise<AuthTokenRes> => {
    // Next.js API route to refresh and set new HttpOnly cookies
    const res = await api.post<APIResponse<AuthTokenRes>>('/api/auth/refresh-token', {}, { baseURL: '' });
    return res.data.data || (res.data as any);
  },

  forgotPassword: async (data: SendForgotPasswordOtpReq): Promise<void> => {
    await api.post<APIResponse>('/auth/forgot-password', data);
  },

  confirmForgotPasswordOtp: async (data: ConfirmForgotPasswordOtpReq): Promise<void> => {
    await api.post<APIResponse>('/auth/forgot-password/confirm-otp', data);
  },

  resetPassword: async (data: ResetPasswordReq): Promise<void> => {
    await api.post<APIResponse>('/auth/reset-password', data);
  },
};
