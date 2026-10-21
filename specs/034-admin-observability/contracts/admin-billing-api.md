# Contract: Admin PayOS Transactions & Reconciliation API

## 1. `GET /api/v1/admin/subscriptions/transactions`

Lấy danh sách giao dịch payOS (cả mua gói `direct_purchase` và nạp ví `wallet_topup`).

### Request
- **Method**: `GET`
- **Query Parameters**:
  - `status`: string (1 trong 11 giá trị: `pending`, `success`, `failed_legacy`, `creating`, `reconciliation_required`, `reconciling`, `creation_failed`, `cancelled`, `expired`, `investigation_required`, `refunded`)
  - `fromDate`, `toDate`: `YYYY-MM-DD` (ngày lịch VN)
  - `page`: int
  - `limit`: int (tối đa 100)

### Response 200 OK
```json
{
  "message": "Lấy danh sách giao dịch thành công",
  "data": {
    "items": [
      {
        "id": "9f0b6a3e-4c5d-4e6f-8a9b-0c1d2e3f4a5b",
        "userId": "1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
        "orderCode": 1792027862456,
        "amount": 250000,
        "currency": "VND",
        "status": "reconciliation_required",
        "transactionType": "direct_purchase",
        "targetPlanId": "7a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d",
        "paymentUrl": "https://pay.payos.vn/web/abc123",
        "reference": "REF-20261015-0001",
        "paymentLinkId": "pay_link_abc123",
        "failureReason": "gateway_timeout",
        "cancelledAt": null,
        "nextReconciliationAt": "2026-10-15T11:00:00+07:00",
        "createdAt": "2026-10-15T08:00:00+07:00",
        "updatedAt": "2026-10-15T09:00:00+07:00"
      }
    ],
    "metadata": { "page": 1, "limit": 20, "totalItems": 1, "totalPages": 1 }
  }
}
```

---

## 2. `GET /api/v1/admin/subscriptions/transactions/{id}`

Lấy chi tiết giao dịch theo UUID.

### Response 200 OK
Trả về object cùng bộ trường với item trong danh sách (DTO camelCase).

### Response 404 Not Found
```json
{
  "status": 404,
  "message": "Không tìm thấy giao dịch."
}
```

---

## 3. Các hành động đối soát thủ công (Reconciliation Actions)

### 3.1. `POST /api/v1/admin/subscriptions/transactions/{orderCode}/resolve-paid`
Xác nhận đã thanh toán.
- **Request Body**:
  ```json
  {
    "reason": "Khách hàng đã chuyển khoản thành công",
    "reference": "123456789",
    "paymentLinkId": "pay_xxx"
  }
  ```
- **Response 200 OK**:
  ```json
  { "message": "Xác nhận giao dịch đã thanh toán thành công" }
  ```
  *(Lưu ý: Không có trường `data`)*

### 3.2. `POST /api/v1/admin/subscriptions/transactions/{orderCode}/resolve-cancelled`
Xác nhận đã huỷ.
- **Request Body**: `{ "reason": "Khách hàng yêu cầu huỷ đơn" }`
- **Response 200 OK**: `{ "message": "Xác nhận giao dịch đã huỷ thành công" }`

### 3.3. `POST /api/v1/admin/subscriptions/transactions/{orderCode}/resolve-creation-failed`
Đánh dấu tạo link thanh toán thất bại.
- **Request Body**: `{ "reason": "Lỗi kết nối cổng thanh toán" }`
- **Response 200 OK**: `{ "message": "Đánh dấu tạo link thất bại thành công" }`

### 3.4. `POST /api/v1/admin/subscriptions/transactions/{orderCode}/retry-investigation`
Gửi lại yêu cầu đối soát tự động.
- **Request Body**: `{ "reason": "Cần kiểm tra lại trạng thái ngân hàng" }`
- **Response 200 OK**: `{ "message": "Đã gửi lại yêu cầu đối soát giao dịch" }`
