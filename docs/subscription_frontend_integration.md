# Hướng Dẫn Tích Hợp Frontend - Module Subscription & Billing

Tài liệu này cung cấp toàn bộ thông tin nghiệp vụ, chi tiết đặc tả API, và hướng dẫn thiết kế luồng xử lý giao diện (UI/UX) dành cho đội ngũ Phát triển Frontend (FE) khi tích hợp với Module Quản lý Gói cước (Subscription), Ví nội bộ (Wallet) và Hạn ngạch sử dụng hằng ngày (Daily Quotas).

---

## 1. Tổng Quan Nghiệp Vụ (Overview)

Hệ thống quản lý dịch vụ Premium của Smart Wardrobe được xây dựng xung quanh ba trụ cột cốt lõi:
1. **Subscription Plans (Gói dịch vụ)**: Hệ thống định nghĩa các cấp độ dịch vụ (từ gói miễn phí Standard Free cho đến gói Premium nâng cao). Mỗi gói đi kèm thời hạn sử dụng (ví dụ: 30 ngày) và cấu hình giới hạn tính năng riêng biệt.
2. **Wallet Systems (Ví nội bộ)**: Mỗi người dùng sở hữu một ví điện tử nội bộ dùng để tích lũy số dư (VND) thông qua cổng nạp PayOS. Số dư này có thể được sử dụng để tự động gia hạn gói cước định kỳ.
3. **Daily Quotas (Hạn ngạch hằng ngày)**: Kiểm soát số lượng lượt sử dụng các tính năng cao cấp như Gợi ý phối đồ bằng AI, Trò chuyện AI tư vấn thời trang. Hạn ngạch được làm mới tự động hằng ngày.

---

## 2. Đặc Tả Chi Tiết API (API Endpoint Specifications)

> [!IMPORTANT]
> **Phương Thức Xác Thực (Authentication)**: 
> Hệ thống sử dụng cơ chế **HTTP-only Cookie** để tự động xác thực phiên làm việc.
> Access Token được lưu trữ trong Cookie với tên khóa là `accessToken`.
> Do đó, đội ngũ FE **không cần** đính kèm tiêu đề `Authorization: Bearer <token>` thủ công trong header của các request. Chỉ cần cấu hình các thư viện HTTP Client (như Axios, Fetch) ở chế độ `withCredentials: true` (hoặc `credentials: 'include'`) để trình duyệt tự động gửi kèm cookie `accessToken` trong mỗi cuộc gọi API yêu cầu bảo mật.

Tất cả các phản hồi từ hệ thống đều tuân thủ cấu trúc API Response chuẩn:
```json
{
  "code": "SUCCESS",
  "message": "Plain text status explanation",
  "data": {}
}
```

### 2.1. Xem danh sách các gói Premium hiện có (List Subscription Plans)
* **HTTP Method**: `GET`
* **URL Path**: `/api/v1/subscriptions/plans`
* **Authentication**: Không yêu cầu (Public - Không cần gửi kèm Cookie)
* **Response Body (JSON Mock)**:
```json
{
  "code": "SUCCESS",
  "message": "Get subscription plans successfully",
  "data": [
    {
      "id": "e2ba9310-cb6b-4a4f-9efd-a19c6204b77a",
      "name": "Standard Free Plan",
      "price": 0,
      "duration_days": null,
      "max_wardrobe_items": 50,
      "max_outfits": 10,
      "ai_outfit_daily_quota": 3,
      "ai_chat_daily_quota": 5,
      "created_at": "2026-05-28T00:00:00Z"
    },
    {
      "id": "d04325a3-9f42-4508-84e8-95acc259fe8d",
      "name": "Elite Premium Tier",
      "price": 99000,
      "duration_days": 30,
      "max_wardrobe_items": 500,
      "max_outfits": 100,
      "ai_outfit_daily_quota": 50,
      "ai_chat_daily_quota": 100,
      "created_at": "2026-05-28T00:00:00Z"
    }
  ]
}
```

### 2.2. Kiểm tra hạn ngạch sử dụng AI hằng ngày (Get Daily Quotas)
> [!IMPORTANT]
> **Lưu ý cực kỳ quan trọng cho FE**: Endpoint này tự động kích hoạt cơ chế **"Lazy Loading Quota Replenishment"** ở phía Backend. Backend sẽ tự động kiểm tra ngày làm mới cuối cùng. Nếu người dùng sử dụng app vào ngày mới, hệ thống sẽ thực thi reset hạn ngạch ngay lập tức trước khi trả kết quả. FE chỉ cần gọi endpoint này bình thường mỗi khi user truy cập ứng dụng hoặc xem trang Profile mà không cần tính toán logic ngày giờ phức tạp ở client.

* **HTTP Method**: `GET`
* **URL Path**: `/api/v1/subscriptions/me/daily-quota`
* **Authentication**: Yêu cầu xác thực tự động (Cookie: `accessToken`)
* **Response Body (JSON Mock)**:
```json
{
  "code": "SUCCESS",
  "message": "Get daily quota successfully",
  "data": {
    "PlanID": "d04325a3-9f42-4508-84e8-95acc259fe8d",
    "PlanName": "Elite Premium Tier",
    "ExpiresAt": "2026-06-28T23:59:59Z",
    "IsAutoRenewEnabled": true,
    "MaxWardrobeItems": 500,
    "MaxOutfits": 100,
    "AiOutfitDailyQuota": 50,
    "AiChatDailyQuota": 100,
    "OutfitRecommendCount": 12,
    "AiUsageCount": 25,
    "LastResetDate": "2026-05-28T00:00:00Z"
  }
}
```

### 2.3. Nạp tiền vào ví nội bộ qua PayOS (Create Wallet Top-up)
* **HTTP Method**: `POST`
* **URL Path**: `/api/v1/subscriptions/me/wallet/topup`
* **Authentication**: Yêu cầu xác thực tự động (Cookie: `accessToken`)
* **Request Body (JSON)**:
```json
{
  "amount": 100000,
  "returnUrl": "https://smartwardrobe.app/payment/success",
  "cancelUrl": "https://smartwardrobe.app/payment/cancel"
}
```
* **Response Body (JSON Mock)**:
```json
{
  "code": "SUCCESS",
  "message": "Initiate topup transaction successfully",
  "data": {
    "bin": "970415",
    "accountNumber": "11336688",
    "accountName": "SMART WARDROBE CORP",
    "amount": 100000,
    "description": "TOPUP 9988221",
    "orderCode": 100293,
    "paymentLinkId": "payos_link_ab12",
    "status": "PENDING",
    "checkoutUrl": "https://img.vietqr.io/image/ICB-11336688-compact2.png",
    "qrCode": "00020101021238580010A0000007270128000697041501141133668852046011530370454061000005802VN62160812TOPUP-99882216304A1B2"
  }
}
```
> [!NOTE]
> * **checkoutUrl**: URL trang thanh toán do PayOS host. FE có thể chuyển hướng người dùng trực tiếp sang URL này.
> * **qrCode**: Chuỗi mã VietQR thô. FE có thể dùng chuỗi này để tự render mã QR tùy biến ngay trong ứng dụng của mình.
> * **cancelUrl**: Vai trò của URL hủy thanh toán. Nếu người dùng chủ động nhấn nút "Hủy thanh toán" trên trang Checkout của PayOS, hệ thống PayOS sẽ chuyển hướng trình duyệt về `cancelUrl` mà FE đã gửi để thông báo hủy và cho phép người dùng thực hiện lại.

### 2.4. Mua trực tiếp gói Premium qua PayOS (Create Direct Purchase)
* **HTTP Method**: `POST`
* **URL Path**: `/api/v1/subscriptions/me/purchase`
* **Authentication**: Yêu cầu xác thực tự động (Cookie: `accessToken`)
* **Request Body (JSON)**:
```json
{
  "subscriptionPlanID": "d04325a3-9f42-4508-84e8-95acc259fe8d",
  "returnUrl": "https://smartwardrobe.app/subscription/success",
  "cancelUrl": "https://smartwardrobe.app/subscription/cancel"
}
```
* **Response Body (JSON Mock)**:
```json
{
  "code": "SUCCESS",
  "message": "Initiate purchase transaction successfully",
  "data": {
    "bin": "970415",
    "accountNumber": "11336688",
    "accountName": "SMART WARDROBE CORP",
    "amount": 99000,
    "description": "SUB Elite Premium Tier",
    "orderCode": 100294,
    "paymentLinkId": "payos_link_ab13",
    "status": "PENDING",
    "checkoutUrl": "https://checkout.payos.vn/payment/link/ab13",
    "qrCode": "00020101021238580010A0000007270128000697041501141133668852046011530370454060990005802VN62160812SUB-ab136304A1B3"
  }
}
```

### 2.5. Bật/Tắt tự động gia hạn gói cước (Toggle Auto-Renewal)
* **HTTP Method**: `PATCH`
* **URL Path**: `/api/v1/subscriptions/me/toggle-auto-renew`
* **Authentication**: Yêu cầu xác thực tự động (Cookie: `accessToken`)
* **Response Body (JSON Mock)**:
```json
{
  "code": "SUCCESS",
  "message": "Toggle auto renewal status successfully",
  "data": {
    "is_auto_renew_enabled": true
  }
}
```

### 2.6. Xem lịch sử biến động số dư ví (Get Wallet Statements)
* **HTTP Method**: `GET`
* **URL Path**: `/api/v1/subscriptions/me/wallet/statements`
* **Authentication**: Yêu cầu xác thực tự động (Cookie: `accessToken`)
* **Response Body (JSON Mock)**:
```json
{
  "code": "SUCCESS",
  "message": "Get wallet statements successfully",
  "data": [
    {
      "id": "f5127d1a-4712-4211-8be9-eefb127498c1",
      "amount": 100000,
      "transaction_type": "TOPUP",
      "previous_balance": 15000,
      "new_balance": 115000,
      "description": "Nạp tiền vào ví điện tử thành công qua PayOS",
      "created_at": "2026-05-28T09:12:00Z"
    },
    {
      "id": "e4418a22-381a-4122-8212-ccab127918a2",
      "amount": -99000,
      "transaction_type": "SUBSCRIPTION_RENEWAL",
      "previous_balance": 115000,
      "new_balance": 16000,
      "description": "Auto-renewed subscription plan Elite Premium Tier",
      "created_at": "2026-05-28T10:00:00Z"
    }
  ]
}
```

---

## 3. Luồng Xử Lý Giao Diện & Logic Nghiệp Vụ (UI/UX Flows)

### 3.1. Hướng Dẫn Tích Hợp Thanh Toán Cho FE
Đội ngũ Frontend có thể linh hoạt tích hợp luồng thanh toán chuyển hướng hoặc thanh toán tại chỗ theo hai phương án:

#### Phương án 1: Chuyển hướng người dùng (Redirect Payment Link)
1. User nhấn "Nạp tiền" hoặc "Mua gói Premium".
2. FE gọi API tương ứng (`/me/wallet/topup` hoặc `/me/purchase`), gửi kèm hai đường link phản hồi `returnUrl` (Trang hoàn tất) và `cancelUrl` (Trang hủy giao dịch).
3. Backend phản hồi cấu trúc dữ liệu thanh toán. FE lấy giá trị `checkoutUrl` và thực hiện chuyển hướng trình duyệt (hoặc mở Webview/InAppBrowser đối với Mobile) sang trang thanh toán bảo mật của PayOS.
4. Sau khi thanh toán thành công hoặc bị hủy, PayOS tự động chuyển hướng trình duyệt của người dùng quay trở lại `returnUrl` hoặc `cancelUrl` tương ứng.
5. FE tại các trang đó tiến hành kiểm tra và hiển thị màn hình thông báo tương ứng.

#### Phương án 2: Hiển thị VietQR trực tiếp trên Ứng dụng (Custom VietQR Modal)
1. User nhấn "Nạp tiền" hoặc "Mua gói Premium" ngay trên giao diện.
2. FE gọi API khởi tạo. Thay vì chuyển hướng người dùng, FE lấy chuỗi mã VietQR (`qrCode`) hoặc ảnh VietQR (`checkoutUrl` dạng ảnh) để vẽ trực tiếp một Modal hiển thị mã chuyển khoản VietQR kèm thông tin số tài khoản, tên chủ tài khoản và số tiền chính xác ngay trong App.
3. Trong thời gian Modal QR đang mở, FE thực hiện cơ chế Polling (gọi định kỳ API lấy số dư `/me/wallet` hoặc `/me/daily-quota` mỗi 3-5 giây) hoặc lắng nghe kết nối WebSocket từ Server để nhận thông tin thay đổi số dư tức thì khi IPN Webhook gửi tín hiệu thanh toán thành công từ PayOS về Backend.
4. Khi nhận được trạng thái thành công, FE đóng Modal và hiển thị hiệu ứng chúc mừng (Celebration animation) nâng cao trải nghiệm người dùng.

### 3.2. Logic Hạ Cấp Gói Êm Đẹp (Graceful Downgrade)
FE cần hiển thị giao diện nhất quán với cơ chế xử lý hạ cấp tự động của Backend:
* **Gia hạn tự động thất bại**: Nếu người dùng tắt tính năng `is_auto_renew_enabled` hoặc ví nội bộ không có đủ số dư tại thời điểm gia hạn định kỳ lúc 00:00:00, tài khoản sẽ được hệ thống hạ cấp an toàn về gói Free (`Standard Free Plan`).
* **Cập nhật Giao diện tức thì**: Khi tài khoản bị hạ cấp về gói Free:
  * Biểu tượng vương miện VIP/Premium trên avatar người dùng biến mất.
  * Hạn ngạch tối đa lưu trữ tủ đồ và phối đồ giảm về mức chuẩn của gói Free.
  * Hạn ngạch sử dụng AI hằng ngày ngay lập tức bị giới hạn về chỉ số tối đa của Free Plan (`ai_outfit_daily_quota` = 3, `ai_chat_daily_quota` = 5).
  * FE cần có thông báo dạng Banner nhắc nhở người dùng nạp tiền hoặc bật lại tự động gia hạn để tiếp tục nhận đặc quyền Premium.
