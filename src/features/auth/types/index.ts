import { Gender } from '@/common/enum';

export interface LoginReq {
  loginName: string; // username or email
  password: string;
}

export interface RegisterReq {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName?: string;
  dateOfBirth: string; // YYYY-MM-DD
  address: string;
  gender: Gender;
}

export interface ConfirmRegisterOtpReq {
  email: string;
  otpCode: string;
}

export interface ResendOtpReq {
  email: string;
}

export interface SendForgotPasswordOtpReq {
  email: string;
}

export interface ConfirmForgotPasswordOtpReq {
  email: string;
  otpCode: string;
}

export interface ResetPasswordReq {
  newPassword: string;
  confirmPassword: string;
  logoutAllDevices: boolean;
}

export interface AuthTokenRes {
  accessToken: string;
  refreshToken?: string;
}
