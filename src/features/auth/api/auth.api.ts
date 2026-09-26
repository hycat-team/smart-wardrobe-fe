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
    // Gọi endpoint qua proxy rewrite (/api/v1/auth/login).
    // Backend là nguồn duy nhất Set-Cookie HttpOnly (Domain=.closy.hycat.online), không lộ token ra JS.
    const res = await api.post<APIResponse<AuthTokenRes>>('/auth/login', data);
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
    // Gọi endpoint qua proxy rewrite (/api/v1/auth/logout).
    // Backend tự phát ra Set-Cookie Max-Age=0 kèm Domain để xóa cookie auth sạch sẽ.
    const res = await api.post<APIResponse>('/auth/logout');
    return { message: res.data.message };
  },

  refreshToken: async (): Promise<AuthTokenRes> => {
    // Gọi endpoint qua proxy rewrite (/api/v1/auth/refresh-token).
    // Backend tự động đọc refresh token từ Cookie và trả Set-Cookie xoay vòng token mới.
    const res = await api.post<APIResponse<AuthTokenRes>>('/auth/refresh-token');
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
