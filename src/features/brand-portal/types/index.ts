export interface BrandCustomer {
  id: string;
  brandId: string;
  userId?: string | null;
  customerName?: string;
  phoneE164?: string;
  externalCustomerCode?: string;
  joinedSource?: string;
  status?: string;
  joinedAt?: string;
  claimedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerDetail extends BrandCustomer {
}

export interface LoyaltyTransaction {
  id: string;
  transactionType: 'earn' | 'redeem' | 'expire' | 'refund' | 'adjust';
  points: number;
  reason: string;
  createdAt: string;
}

export interface Benefit {
  id: string;
  name: string;
  description: string;
  benefitType: 'POINT_REDEMPTION' | 'TIER_PRIVILEGE' | 'FEATURE_ACCESS';
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  requiredPoints?: number;
  requiredTierId?: string;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  requiredPoints: number;
  multiplier: number;
}

export interface LoyaltyProgram {
  id: string;
  brandId: string;
  name: string;
  amountPerPoint: number;
  pointExpiryDays?: number;
  roundingMode: 'floor' | 'round' | 'ceil';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertLoyaltyProgramPayload {
  name: string;
  amountPerPoint: number;
  pointExpiryDays?: number;
  roundingMode: 'floor' | 'round' | 'ceil';
  isActive?: boolean;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderRole: string; // 'user' or 'staff'
  senderUserId?: string;
  message: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  brandId: string;
  userId: string;
  customerName?: string;
  userDisplayName?: string;
  status: string;
  lastMessageAt?: string;
  userLastReadAt?: string;
  staffLastReadAt?: string;
  userUnreadCount: number;
  staffUnreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export type BrandStatus = 'pending_review' | 'active' | 'suspended' | 'archived' | 'rejected';

export interface BrandMember {
  id: string;
  brandId: string;
  userId: string;
  role: 'owner' | 'staff';
  status: 'active' | 'inactive';
  userEmail?: string;
  userFullName?: string;
  createdAt: string;
}

export interface PaginationMetadata {

  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationResult<T> {
  items: T[];
  metadata: PaginationMetadata;
}

export interface BrandInfo {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  logoPublicId?: string;
  status: BrandStatus;
  createdAt?: string;
}

export interface CreateOfflineCustomerPayload {
  customerName: string;
  phoneE164: string;
  externalCustomerCode?: string;
}

export interface AddPointsPayload {
  userId?: string;
  phone?: string;
  customerName?: string;
  purchaseAmount: number;
  transactionType: 'earn' | 'redeem';
  reason: string;
  idempotencyKey: string;
}

export interface CreateBenefitPayload {
  name: string;
  description: string;
  benefitType: 'POINT_REDEMPTION' | 'TIER_PRIVILEGE' | 'FEATURE_ACCESS';
  requiredPoints?: number;
  requiredTierId?: string;
}

export interface CreateBrandPayload {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  logoPublicId?: string;
}

export interface BrandItemRes {
  id: string;
  brandId: string;
  name: string;
  sku?: string;
  productCode?: string;
  description?: string;
  price: number;
  salePrice?: number;
  currency?: string;
  imageUrl?: string;
  imageUrls?: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'active' | 'archived' | 'draft';
  stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK';
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrandItemReq {
  name: string;
  productCode?: string;
  sku?: string;
  description?: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  imagePublicId: string;
  categoryId?: string;
  tags?: string[];
  itemType: string;
  status?: string;
}

export interface UpdateBrandItemReq extends Partial<CreateBrandItemReq> {}
