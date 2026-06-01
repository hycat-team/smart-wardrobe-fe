import { Gender } from '@/common/enum';

export interface UserBodyProfileRes {
  bodyType?: string;
  estimatedBodyShape?: string;
  fitPreference?: string;
  height?: number;
  weight?: number;
  recommendedSize?: string;
  skinTone?: string;
  stylingNotes?: string;
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
  avatar?: string;
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
