import type { PaginationResult } from '@/types/api';

export type TransactionStatus =
  | 'pending'
  | 'success'
  | 'failed_legacy'
  | 'creating'
  | 'reconciliation_required'
  | 'reconciling'
  | 'creation_failed'
  | 'cancelled'
  | 'expired'
  | 'investigation_required'
  | 'refunded'
  | 'unknown';

export type TransactionType = 'direct_purchase' | 'wallet_topup';

// Buyer label carried by the DETAIL endpoint only (the list answers `user: null`).
// Mirrors the backend `TransactionUserBriefRes`, which is deliberately narrower
// than the identity contract: no roleSlug/isDeleted/gender/status/createdAt.
export interface TransactionUserBrief {
  id: string;
  username: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}

// Target plan label carried by the DETAIL endpoint only (the list answers
// `targetPlan: null`). Mirrors backend `SubscriptionPlanBriefRes`.
export interface TransactionTargetPlanBrief {
  id: string;
  slug: string;
  name: string;
  price: number;
  durationDays?: number | null;
  planKind: number;
  tierRank: number;
  maxWardrobeItems?: number;
  maxOutfits?: number;
  aiOutfitDailyQuota?: number;
  aiChatDailyQuota?: number;
}

export interface DepositTransaction {
  id: string;
  userId: string;
  orderCode: number;
  amount: number;
  currency: string;
  status: TransactionStatus;
  transactionType: TransactionType;
  targetPlanId?: string | null;
  paymentUrl?: string | null;
  reference?: string | null;
  paymentLinkId?: string | null;
  failureReason?: string | null;
  cancelledAt?: string | null;
  nextReconciliationAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // Detail-only enrichment: present in `GET /transactions/{id}`, always null in
  // the list. Optional so a list item stays a valid `DepositTransaction`.
  user?: TransactionUserBrief | null;
  targetPlan?: TransactionTargetPlanBrief | null;
}

export interface TransactionQuery {
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export type TransactionList = PaginationResult<DepositTransaction>;

export interface ResolvePaidRequest {
  reason: string;
  reference: string;
  paymentLinkId: string;
}

export interface ResolveActionRequest {
  reason: string;
}
