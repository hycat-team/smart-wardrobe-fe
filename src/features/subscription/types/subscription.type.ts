export interface SubscriptionPlan {
  id: string;
  planSlug: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  maxOutfits: number;
  maxScans: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

export interface DailyQuota {
  userId: string;
  date: string;
  outfitsCreated: number;
  scansUsed: number;
  maxOutfits: number;
  maxScans: number;
}
