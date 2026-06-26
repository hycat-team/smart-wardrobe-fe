export interface PaginationMetadata {
  limit: number;
  page: number;
  totalItems: number;
  totalPages: number;
}

export interface PostMediaRes {
  id: string;
  mediaType: string;
  mediaUrl: string;
  publicId: string;
  sortOrder: number;
}

// Temporary inline or imported type to avoid circular/missing dependencies
export interface WardrobeItemRes {
  id: string;
  [key: string]: unknown;
}

export interface PostItemRes {
  buyerUserId?: string;
  declinedAt?: string;
  id: string;
  item: WardrobeItemRes;
  itemCondition?: string;
  price?: number;
  soldAt?: string;
  status?: string;
  transferState?: string;
}

export interface PostRes {
  avatarUrl?: string;
  commentCount: number;
  contactInfo?: string;
  content: string;
  createdAt: string;
  finalFeedScore?: number;
  firstName?: string;
  globalHotnessScore?: number;
  id: string;
  isDeleted: boolean;
  isLiked: boolean;
  items: PostItemRes[];
  lastName?: string;
  likeCount: number;
  media: PostMediaRes[];
  postType: "OUTFIT" | "SALE";
  publicId: string;
  sharePath?: string;
  title: string;
  totalPrice?: number;
  updatedAt: string;
  userId: string;
  username: string;
}

export interface GetFeedRes {
  items: PostRes[];
  metadata: PaginationMetadata;
}

export interface CommentRes {
  avatarUrl?: string;
  content: string;
  createdAt: string;
  firstName?: string;
  id: string;
  lastName?: string;
  parentCommentId?: string;
  userId: string;
  username: string;
}

export interface AddCommentReq {
  content: string;
  parentCommentId?: string;
}

export interface LikePostReq {
  isLiked: boolean;
}

export interface PostItemInputReq {
  itemCondition?: string;
  itemId: string;
  price?: number;
}

export interface PostMediaReq {
  mediaType: string;
  mediaUrl: string;
  publicId: string;
  sortOrder: number;
}

export interface CreatePostReq {
  contactInfo?: string;
  content: string;
  items?: PostItemInputReq[];
  media?: PostMediaReq[];
  postType: "OUTFIT" | "SALE";
  title: string;
}

export interface UploadSignatureResult {
  apiKey: string;
  folder: string;
  publicId?: string;
  signature: string;
  timestamp: number;
}
