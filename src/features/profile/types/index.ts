import { Gender } from '@/common/enum';

export interface UserBodyMeasurementsRes {
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
}

export interface UserInferredBodyRes {
  bodyShape: string;
  confidenceScore?: number;
}

export interface UserBodyProfileRes {
  heightCm: number;
  weightKg: number;
  bodyShape: string;
  measurements?: UserBodyMeasurementsRes;
  inferredByAi?: UserInferredBodyRes;
  verifiedByUser: boolean;
  lastUpdatedAt?: string;
}

export interface UserSubscriptionRes {
  planSlug?: string;
  planName?: string;
  aiChatDailyQuota?: number;
  aiOutfitDailyQuota?: number;
  maxOutfits?: number;
  maxWardrobeItems?: number;
  expiresAt?: string;
}

export interface UserRes {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  address?: string;
  gender: Gender;
  status: number;
  createdAt: string;
  roleSlug: string;
  bodyProfile?: UserBodyProfileRes;
  subscription?: UserSubscriptionRes;
  
  // UI backwards compatibility fields
  name?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  isPremium?: boolean;
}

export interface UpdateProfileReq {
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  address?: string;
  gender: Gender;
}

export interface ChangePasswordReq {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  logoutAllDevices: boolean;
}
