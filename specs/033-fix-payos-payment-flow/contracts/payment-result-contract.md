# Contract: Payment Result & Callback Navigation

## 1. Hợp đồng Khởi tạo Thanh toán

### Yêu cầu Nạp ví (Top-up)
- **Endpoint**: `POST /api/v1/wallet/topup` hoặc `POST /api/v1/billing/topup`
- **Payload**:
  ```json
  {
    "amount": 50000,
    "returnUrl": "{origin}/payment/result?flow=topup&next=%2Fprofile%3Ftab%3Dwallet",
    "cancelUrl": "{origin}/payment/result?flow=topup&next=%2Fprofile%3Ftab%3Dwallet"
  }
  ```
- **Response**:
  ```json
  {
    "paymentUrl": "https://pay.payos.vn/web/...",
    "orderCode": 123456
  }
  ```

### Yêu cầu Mua gói Trực tiếp (Direct Purchase)
- **Endpoint**: `POST /api/v1/billing/purchase/direct`
- **Payload**:
  ```json
  {
    "planSlug": "pro_monthly",
    "returnUrl": "{origin}/payment/result?flow=purchase&next=%2Fpricing",
    "cancelUrl": "{origin}/payment/result?flow=purchase&next=%2Fpricing"
  }
  ```
- **Response**:
  ```json
  {
    "paymentUrl": "https://pay.payos.vn/web/...",
    "orderCode": 123456
  }
  ```

---

## 2. Hợp đồng Chuyển hướng Phản hồi (PayOS Callback Contract)

Khi người dùng thao tác xong trên PayOS, PayOS sẽ điều hướng trình duyệt qua phương thức GET tới `returnUrl` hoặc `cancelUrl`:

### Kịch bản Thành công
- **URL**: `/payment/result?code=00&id=...&cancel=false&status=PAID&orderCode=123456&flow=topup&next=%2Fprofile%3Ftab%3Dwallet`
- **Đánh giá**:
  - `code === '00'`
  - `cancel !== 'true'`
  - Trạng thái hiển thị: Thành công (Success)

### Kịch bản Hủy giao dịch
- **URL**: `/payment/result?code=...&id=...&cancel=true&status=CANCELLED&orderCode=123456&flow=purchase&next=%2Fpricing`
- **Đánh giá**:
  - `cancel === 'true' || status === 'CANCELLED'`
  - Trạng thái hiển thị: Đã hủy (Cancelled)

---

## 3. Quy tắc Điều hướng Tiếp tục (Next Target Validation)

- **Đầu vào**: Giá trị tham số query `next`.
- **Quy tắc kiểm tra**:
  1. Giá trị `next` phải bắt đầu bằng `/`.
  2. Giá trị `next` KHÔNG ĐƯỢC bắt đầu bằng `//`.
- **Hành vi khi không hợp lệ**: Tự động chuyển hướng về đường dẫn an toàn mặc định `/profile?tab=wallet`.
