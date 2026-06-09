export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface UserBodyProfileRes {
  height?: number;
  weight?: number;
  bust?: number;
  waist?: number;
  hips?: number;
}

export interface UserSubscriptionRes {
  planId?: string;
  planName?: string;
  planSlug?: string;
  maxWardrobeItems?: number;
  maxOutfits?: number;
  aiOutfitDailyQuota?: number;
  aiChatDailyQuota?: number;
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
  mediaUrl: string;
  mediaPublicId: string;
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
