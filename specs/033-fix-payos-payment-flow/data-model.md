# Data Model & Type Definitions: 033 Fix PayOS Payment Flow

## 1. Dữ liệu Yêu cầu Khởi tạo Thanh toán (Billing Request Models)

### `DirectPurchaseReq` (src/features/billing/types/index.ts)
```typescript
export interface DirectPurchaseReq {
  planSlug: string;
  returnUrl?: string;
  cancelUrl?: string;
}
```

### `TopUpReq` (src/features/billing/types/index.ts)
```typescript
export interface TopUpReq {
  amount: number;
  returnUrl?: string;
  cancelUrl?: string;
}
```

### `PaymentLinkRes` (src/features/billing/types/index.ts)
```typescript
export interface PaymentLinkRes {
  checkoutUrl?: string;
  paymentUrl?: string;
  paymentLinkId?: string;
  orderCode?: number;
}
```

---

## 2. Tham số Truy vấn Trang Kết quả (URL Query Parameters)

Các tham số được PayOS và ứng dụng truyền về tại đường dẫn `/payment/result`:

| Tên tham số | Kiểu dữ liệu | Nguồn | Ý nghĩa |
|---|---|---|---|
| `code` | `string` | PayOS | Mã kết quả giao dịch (`'00'` là thành công). |
| `cancel` | `string` | PayOS | Cờ đánh dấu người dùng bấm hủy trên cổng thanh toán (`'true'`). |
| `status` | `string` | PayOS | Trạng thái giao dịch văn bản (ví dụ: `'PAID'`, `'CANCELLED'`, `'PENDING'`). |
| `orderCode` | `string` | PayOS | Mã đơn hàng số duy nhất từ PayOS. |
| `flow` | `'topup' \| 'purchase'` | Ứng dụng | Phân biệt luồng nghiệp vụ nạp ví hay mua gói dịch vụ. |
| `next` | `string` | Ứng dụng | Đường dẫn điều hướng quay lại sau khi người dùng bấm Tiếp tục. |

---

## 3. Trạng thái Giao diện Kết quả Thanh toán (UI State Model)

```typescript
export type PaymentStatusType = 'SUCCESS' | 'CANCELLED' | 'PROCESSING' | 'ERROR';

export interface PaymentResultState {
  status: PaymentStatusType;
  title: string;
  message: string;
  orderCode?: string;
  flow: 'topup' | 'purchase';
  nextUrl: string;
  isUpdating: boolean;
}
```

### Logic xác định trạng thái:
```typescript
const isSuccess = code === '00' && cancel !== 'true';
const isCancelled = cancel === 'true' || status === 'CANCELLED';
```
- Khi `isSuccess`: Trạng thái `SUCCESS`.
- Khi `isCancelled`: Trạng thái `CANCELLED`.
- Khi không có `code` hoặc `status` khác: Trạng thái `ERROR` hoặc `PROCESSING`.
