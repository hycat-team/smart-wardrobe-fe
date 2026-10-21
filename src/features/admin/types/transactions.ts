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
