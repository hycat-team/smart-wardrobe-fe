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
    const res = await api.post<APIResponse<AuthTokenRes>>('/auth/login', data);
    return res.data.data!;
  },

  register: async (data: RegisterReq): Promise<void> => {
    await api.post<APIResponse>('/auth/register', data);
  },

  confirmRegisterOtp: async (data: ConfirmRegisterOtpReq): Promise<void> => {
    await api.post<APIResponse>('/auth/register/confirm-otp', data);
  },

  logout: async (): Promise<void> => {
    await api.post<APIResponse>('/auth/logout');
  },

  refreshToken: async (): Promise<AuthTokenRes> => {
    const res = await api.post<APIResponse<AuthTokenRes>>('/auth/refresh-token');
    return res.data.data!;
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
