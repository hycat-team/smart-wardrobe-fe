export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

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
  planId?: string;
  planName?: string;
  planSlug?: string;
  expiresAt?: string;
  isAutoRenewEnabled?: boolean;
  maxWardrobeItems?: number;
  maxOutfits?: number;
  aiOutfitDailyQuota?: number;
  aiChatDailyQuota?: number;
  personalizationEnabled?: boolean;
}

export interface UserRes {
  id: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: number;
  status?: number;
  roleSlug?: string;
  avatarUrl?: string;
  avatarPublicId?: string;
  address?: string;
  dateOfBirth?: string;
  createdAt?: string;
  bodyProfile?: UserBodyProfileRes;
  subscription?: UserSubscriptionRes;
}

export interface AdminUserListRes {
  items: UserRes[];
  metadata: PaginationMetadata;
}

/** Raw subscription row (GET /admin/subscriptions?userId=...). */
export interface AdminUserSubscriptionRecord {
  userId: string;
  planId: string;
  planName: string;
  planSlug: string;
  planKind?: number;
  tierRank?: number;
  startedAt: string;
  expiresAt?: string | null;
  isAutoRenewEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSubscriptionPlan {
  id: string;
  slug: string;
  name: string;
  price: number;
  maxWardrobeItems: number;
  maxOutfits: number;
  aiOutfitDailyQuota: number;
  aiChatDailyQuota: number;
  durationDays?: number | null;
  planKind?: number;
  tierRank?: number;
  isActive: boolean;
  personalizationEnabled?: boolean;
}

export interface AdminGrantBatchItem {
  userIdentifier: string;
  planSlug: string;
}

export interface AdminGrantBatchResult {
  index: number;
  userIdentifier: string;
  resolvedUserId?: string;
  planSlug: string;
  status: 'success' | 'skipped' | 'error';
  planName?: string;
  expiresAt?: string | null;
  reason?: string;
  message?: string;
}

export interface AdminGrantBatchRes {
  total: number;
  succeeded: number;
  skipped: number;
  failed: number;
  results: AdminGrantBatchResult[];
}

export interface UpdateUserStatusReq {
  status: number;
}

export interface CategoryRes {
  id: string;
  name: string;
  slug: string;
}

export interface WardrobeItemRes {
  id: string;
  userId?: string;
  category?: CategoryRes;
  imageUrl?: string;
  imagePublicId?: string;
  color?: string;
  pattern?: string;
  material?: string;
  style?: string;
  seasonality?: string;
  fit?: string;
  price?: number;
  status?: number;
  isLocked?: boolean;
  createdAt?: string;
}

export interface UpdateSystemCatalogItemReq {
  categoryId?: string;
  color?: string;
  fit?: string;
  material?: string;
  pattern?: string;
  price?: number;
  seasonality?: string;
  style?: string;
}

export interface PostItemRes {
  id: string;
  item?: WardrobeItemRes;
  price?: number;
  itemCondition?: number;
  status?: number;
  transferState?: number;
  buyerUserId?: string;
  soldAt?: string;
  declinedAt?: string;
}

export interface AdminPostItemListRes {
  items: PostItemRes[];
  metadata: PaginationMetadata;
}

export interface PostMediaRes {
  id: string;
  mediaType: string;
  mediaUrl: string;
  publicId?: string;
  sortOrder: number;
}

export interface PostRes {
  id: string;
  publicId?: string;
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  postType?: number;
  title?: string;
  content?: string;
  totalPrice?: number;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  sharePath?: string;
  createdAt?: string;
  updatedAt?: string;
  globalHotnessScore?: number;
  finalFeedScore?: number;
  isDeleted?: boolean;
  contactInfo?: string;
  items?: PostItemRes[];
  media?: PostMediaRes[];
}

export interface AdminPostListRes {
  items: PostRes[];
  metadata: PaginationMetadata;
}

export interface CommentRes {
  id: string;
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  content?: string;
  parentCommentId?: string;
  createdAt?: string;
  isDeleted?: boolean;
  status?: string;
}

export * from './dashboard';
export * from './community-admin';
export * from './transactions';
export * from './activity';
export * from './period';
