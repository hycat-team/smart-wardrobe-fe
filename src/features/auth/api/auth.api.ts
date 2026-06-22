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
  ResendOtpReq,
} from '../types';

export const authApi = {
  login: async (data: LoginReq): Promise<AuthTokenRes & { message?: string }> => {
    // Gọi thẳng Next.js API route (BFF) để set HttpOnly Cookie
    const res = await api.post<APIResponse<AuthTokenRes>>('/api/auth/login', data, {
      baseURL: '', // Bỏ qua /api/v1 baseURL mặc định
    });
    console.log('Login response:', res.data);
    const responseData = res.data as any;
    const resultData = responseData.data || responseData;
    return { ...resultData, message: responseData.message };
  },

  register: async (data: RegisterReq): Promise<{ message?: string }> => {
    const res = await api.post<APIResponse>('/auth/register', data);
    return { message: res.data.message };
  },

  confirmRegisterOtp: async (data: ConfirmRegisterOtpReq): Promise<{ message?: string }> => {
    const res = await api.post<APIResponse>('/auth/register/confirm-otp', data);
    return { message: res.data.message };
  },

  resendRegisterOtp: async (data: ResendOtpReq): Promise<{ message?: string }> => {
    const res = await api.post<APIResponse>('/auth/register/resend-otp', data);
    return { message: res.data.message };
  },

  logout: async (): Promise<{ message?: string }> => {
    // Next.js API route to clear cookies
    const res = await api.post<APIResponse>('/api/auth/logout', {}, { baseURL: '' });
    return { message: res.data.message };
  },

  refreshToken: async (): Promise<AuthTokenRes> => {
    // Next.js API route to refresh and set new HttpOnly cookies
    const res = await api.post<APIResponse<AuthTokenRes>>('/api/auth/refresh-token', {}, { baseURL: '' });
    return res.data.data || (res.data as any);
  },

  forgotPassword: async (data: SendForgotPasswordOtpReq): Promise<{ message?: string }> => {
    const res = await api.post<APIResponse>('/auth/forgot-password', data);
    return { message: res.data.message };
  },

  confirmForgotPasswordOtp: async (data: ConfirmForgotPasswordOtpReq): Promise<{ message?: string }> => {
    const res = await api.post<APIResponse>('/auth/forgot-password/confirm-otp', data);
    return { message: res.data.message };
  },

  resetPassword: async (data: ResetPasswordReq): Promise<{ message?: string }> => {
    const res = await api.post<APIResponse>('/auth/reset-password', data);
    return { message: res.data.message };
  },
};
