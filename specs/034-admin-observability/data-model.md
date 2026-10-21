# Data Model: Admin Observability (034)

**Feature**: `034-admin-observability`
**Date**: 2026-10-16
**Status**: Completed

## 1. User Activity Event (Nhật ký hoạt động người dùng)

Biểu diễn sự kiện đăng nhập hoặc làm mới phiên truy cập của tài khoản.

```ts
export type ActivityEventType = 'login' | 'refresh';

export interface ActivityEvent {
  id: string; // UUID
  userId: string; // UUID
  activityType: ActivityEventType | string;
  occurredAt: string; // ISO 8601 UTC/Offset
  createdAt: string; // ISO 8601
  userEmail: string;
  userFirstName?: string | null;
  userLastName?: string | null;
}

export interface ActivityEventQuery {
  userId?: string;
  activityType?: ActivityEventType;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  page?: number;
  limit?: number; // max 100
}

export interface ActivityEventList {
  items: ActivityEvent[];
  metadata: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
```

### Validation Rules
- `userId`: Chuỗi định dạng UUID hợp lệ (regex: `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`). Nếu rỗng hoặc không khớp, không gửi lên backend.
- `activityType`: Chỉ nhận `login` hoặc `refresh`. Nếu chọn "Tất cả", bỏ tham số này.
- `fromDate` & `toDate`: Định dạng `YYYY-MM-DD`, ngày lịch Việt Nam (+07:00). `fromDate <= toDate`.

---

## 2. PayOS Deposit Transaction (Giao dịch nạp tiền / thanh toán payOS)

Biểu diễn giao dịch thanh toán qua cổng payOS của admin (DTO camelCase chuẩn).

```ts
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
  id: string; // UUID
  userId: string; // UUID
  orderCode: number; // int64
  amount: number; // VND
  currency: string; // "VND"
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
  status?: TransactionStatus;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string; // YYYY-MM-DD
  page?: number;
  limit?: number; // max 100
}

export interface TransactionList {
  items: DepositTransaction[];
  metadata: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
```

### Reconciliation Action Requests
```ts
export interface ResolvePaidRequest {
  reason: string;
  reference: string; // Bắt buộc
  paymentLinkId: string; // Bắt buộc
}

export interface ResolveActionRequest {
  reason: string;
}
```

---

## 3. PayOS Reconciliation Summary (Tổng hợp đối soát PayOS theo kỳ)

```ts
export interface PayOSReconciliation {
  totalTransactions: number;
  successCount: number;
  failedCount: number;
  pendingCount?: number;
  voidedCount?: number;
  totalSuccessValue: number; // Tổng SUM(amount) của giao dịch success cả hai loại trong kỳ
}
```

### Business Meaning
- `totalTransactions`: Tổng số giao dịch trong kỳ (cả mua gói và nạp ví).
- `successCount`: Số giao dịch thành công.
- `failedCount`: Số giao dịch thất bại thật (`failed_legacy` + `creation_failed` + `investigation_required`).
- `pendingCount`: Số giao dịch đang xử lý (`pending` + `creating` + `reconciliation_required` + `reconciling`).
- `voidedCount`: Số giao dịch đã hủy/hết hạn (`cancelled` + `expired` + `refunded`).
- `totalSuccessValue`: Doanh số giao dịch thực nhận thành công.

---

## 4. AI Error Breakdown (Phân tích lỗi AI cùng kỳ)

```ts
export interface AIErrorBreakdownItem {
  errorCode: string;
  provider: string;
  model: string;
  errorCount: number;
}

export interface AIErrorBreakdown {
  totalErrors: number;
  totalRequests: number;
  errorRate: number; // 0..100%, 0 khi totalRequests = 0
  breakdown: AIErrorBreakdownItem[];
}
```

---

## 5. Dashboard Filters & Presets State

```ts
export type DashboardPreset = 'today' | 'this_month' | 'last_30_days' | 'custom';

export interface DashboardFilters {
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
  aiStatus: string;
  aiPage: number;
  insightTab: 'subscriptions' | 'ai';
  preset?: DashboardPreset;
}
```
