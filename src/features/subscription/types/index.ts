export interface SubscriptionPlan {
  id?: string; ID?: string;
  slug?: string; Slug?: string;
  name?: string; Name?: string;
  description?: string; Description?: string;
  price?: number; Price?: number;
  durationDays?: number; DurationDays?: number;
  maxWardrobeItems?: number; MaxWardrobeItems?: number;
  maxOutfits?: number; MaxOutfits?: number;
  aiOutfitDailyQuota?: number; AiOutfitDailyQuota?: number;
  aiChatDailyQuota?: number; AiChatDailyQuota?: number;
  features?: string[];
  isActive?: boolean; IsActive?: boolean;
}

export interface UserSubscription {
  planId?: string; PlanID?: string;
  planName?: string; PlanName?: string;
  planSlug?: string; PlanSlug?: string;
  expiresAt?: string; ExpiresAt?: string;
  isAutoRenewEnabled?: boolean; IsAutoRenewEnabled?: boolean;
  maxWardrobeItems?: number; MaxWardrobeItems?: number;
  maxOutfits?: number; MaxOutfits?: number;
  aiOutfitDailyQuota?: number; AiOutfitDailyQuota?: number;
  aiChatDailyQuota?: number; AiChatDailyQuota?: number;
  status?: string;
}

export interface DailyQuota {
  outfitRecommendCount?: number; OutfitRecommendCount?: number;
  aiUsageCount?: number; AiUsageCount?: number;
  lastResetDate?: string; LastResetDate?: string;
  maxWardrobeItems?: number; MaxWardrobeItems?: number;
  maxOutfits?: number; MaxOutfits?: number;
  aiOutfitDailyQuota?: number; AiOutfitDailyQuota?: number;
  aiChatDailyQuota?: number; AiChatDailyQuota?: number;
}
