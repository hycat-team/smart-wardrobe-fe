# Smart Wardrobe API Routes Specification

Tài liệu này tổng hợp và phân tích toàn bộ các API routes từ file `swagger.json` của Backend để hỗ trợ quá trình tích hợp trên Frontend (`smart-wardrobe-fe`).

---

## 1. Tổng quan & Cấu hình chung

- **API Title**: Smart Wardrobe API Document
- **Phiên bản API**: 1.0
- **Base URL**: `/api/v1` (tất cả các endpoint đều bắt đầu bằng tiền tố này)
- **Định dạng dữ liệu**: `application/json` (cho cả Request và Response)

### Định dạng Response chung (Common Response Schema)

Hầu hết các API đều trả về cấu trúc response chuẩn (`APIResponse`):

```json
{
  "message": "Thông báo trạng thái/lỗi từ hệ thống",
  "data": {} // Dữ liệu trả về (tùy thuộc vào từng API)
}
```

---

## 2. Danh sách các API Endpoint theo Nhóm

### Nhóm 1: Xác thực & Tài khoản (Authentication) - `Auth`

Tất cả các API trong nhóm này đều sử dụng phương thức `POST` để thực hiện các thao tác xác thực, đăng ký, đăng nhập và khôi phục mật khẩu.

| Phương thức | Endpoint | Tóm tắt chức năng | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Đăng ký tài khoản | Đăng ký tài khoản mới và gửi mã OTP kích hoạt qua email. |
| `POST` | `/api/v1/auth/register/confirm-otp` | Xác thực OTP đăng ký | Xác nhận OTP gửi qua email để kích hoạt tài khoản thành công. |
| `POST` | `/api/v1/auth/login` | Đăng nhập | Đăng nhập bằng username/email và password. Trả về `accessToken`. |
| `POST` | `/api/v1/auth/logout` | Đăng xuất | Đăng xuất người dùng, vô hiệu hóa token hiện tại và xóa cookies token. |
| `POST` | `/api/v1/auth/refresh-token` | Xoay vòng Refresh Token | Sử dụng refresh token trong cookie để cấp mới access token. |
| `POST` | `/api/v1/auth/forgot-password` | Yêu cầu khôi phục mật khẩu | Gửi mã OTP xác thực khôi phục mật khẩu qua email. |
| `POST` | `/api/v1/auth/forgot-password/confirm-otp` | Xác thực OTP khôi phục mật khẩu | Xác thực OTP và lưu token tạm thời vào cookie để đặt lại mật khẩu. |
| `POST` | `/api/v1/auth/reset-password` | Đặt lại mật khẩu | Sử dụng token tạm thời từ cookie để tiến hành đặt mật khẩu mới. |

---

### Nhóm 2: Thông tin cá nhân (Profile) - `Me`

Nhóm này quản lý thông tin của người dùng hiện tại đang đăng nhập.

| Phương thức | Endpoint | Tóm tắt chức năng | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/me` | Lấy thông tin cá nhân | Lấy chi tiết hồ sơ cá nhân bao gồm: thông tin cơ bản, body profile và gói subscription hiện tại. |
| `PUT` | `/api/v1/me` | Cập nhật thông tin cá nhân | Cập nhật các trường thông tin cơ bản (họ tên, ngày sinh, giới tính, địa chỉ). |
| `PUT` | `/api/v1/me/change-password` | Đổi mật khẩu | Thay đổi mật khẩu mới cho tài khoản hiện tại. |

---

### Nhóm 3: Gói dịch vụ & Hạn ngạch (Subscriptions) - `Subscription`

Quản lý hạn ngạch sử dụng hàng ngày và cấu hình tự động gia hạn gói premium.

| Phương thức | Endpoint | Tóm tắt chức năng | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/subscriptions/me/daily-quota` | Lấy hạn ngạch sử dụng ngày | Xem chi tiết số lượng lượt dùng tính năng AI (Chat, Outfit) còn lại trong ngày. |
| `PATCH` | `/api/v1/subscriptions/me/toggle-auto-renew` | Bật/Tắt tự động gia hạn | Cấu hình bật/tắt tự động gia hạn gói cước qua ví nội bộ khi hết hạn. |

---

### Nhóm 4: Thanh toán & Ví nội bộ (Billing & Wallet) - `Billing`

Quản lý thanh toán gói Premium, nạp tiền vào ví và lịch sử giao dịch.

| Phương thức | Endpoint | Tóm tắt chức năng | Mô tả chi tiết |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/subscriptions/plans` | Lấy các gói Premium | Lấy danh sách các gói cước đăng ký Premium hiện có trên hệ thống. |
| `POST` | `/api/v1/subscriptions/me/purchase` | Đăng ký mua gói cước trực tiếp | Khởi tạo liên kết thanh toán VietQR qua cổng PayOS để mua trực tiếp. |
| `GET` | `/api/v1/subscriptions/me/wallet` | Lấy số dư ví | Lấy số dư khả dụng hiện tại trong ví nội bộ của người dùng. |
| `GET` | `/api/v1/subscriptions/me/wallet/statements` | Lấy lịch sử giao dịch ví | Lấy danh sách lịch sử biến động số dư ví (nạp tiền, mua gói...). |
| `POST` | `/api/v1/subscriptions/me/wallet/topup` | Tạo yêu cầu nạp tiền vào ví | Khởi tạo link thanh toán VietQR qua PayOS để nạp tiền vào ví nội bộ. |
| `POST` | `/api/v1/subscriptions/payos-webhook` | Webhook xử lý thanh toán | Endpoint tiếp nhận và xác thực thông báo IPN từ PayOS (hệ thống tự động). |

---

## 3. Chi tiết các API Endpoint & Payload Schemas

### 3.1. Authentication (`Auth`)

#### Đăng ký tài khoản (`POST /api/v1/auth/register`)
- **Body (`RegisterReq`):**
  ```json
  {
    "username": "string (Required)",
    "email": "string (Required, format email)",
    "password": "string (Required, minLength: 6)",
    "confirmPassword": "string (Required)",
    "firstName": "string (Required)",
    "lastName": "string",
    "dateOfBirth": "string (Required, e.g., 'YYYY-MM-DD')",
    "address": "string (Required)",
    "gender": 0 // Enum: 0 (Unknown), 1 (Male), 2 (Female), 3 (Other)
  }
  ```
- **Response (`200 OK`):** `APIResponse` chuẩn thông báo đã gửi OTP kích hoạt.

#### Xác thực OTP đăng ký (`POST /api/v1/auth/register/confirm-otp`)
- **Body (`ConfirmRegisterOtpReq`):**
  ```json
  {
    "email": "string (Required)",
    "otpCode": "string (Required)"
  }
  ```
- **Response (`200 OK`):** Kích hoạt tài khoản thành công.

#### Đăng nhập (`POST /api/v1/auth/login`)
- **Body (`LoginReq`):**
  ```json
  {
    "loginName": "string (Required, username hoặc email)",
    "password": "string (Required)"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Đăng nhập thành công",
    "data": {
      "accessToken": "ey..." // Token dùng cho Authorization Header
    }
  }
  ```

#### Đăng xuất (`POST /api/v1/auth/logout`)
- **Body:** Không yêu cầu.
- **Response (`200 OK`):** Xóa cookie token thành công.

#### Làm mới Token (`POST /api/v1/auth/refresh-token`)
- **Body:** Không yêu cầu (Sử dụng refresh token đính kèm trong cookie).
- **Response (`200 OK`):**
  ```json
  {
    "message": "Làm mới token thành công",
    "data": {
      "accessToken": "ey..."
    }
  }
  ```

#### Quên mật khẩu (`POST /api/v1/auth/forgot-password`)
- **Body (`SendForgotPasswordOtpReq`):**
  ```json
  {
    "email": "string (Required)"
  }
  ```
- **Response (`200 OK`):** Đã gửi mã OTP khôi phục mật khẩu.

#### Xác thực OTP quên mật khẩu (`POST /api/v1/auth/forgot-password/confirm-otp`)
- **Body (`ConfirmForgotPasswordOtpReq`):**
  ```json
  {
    "email": "string (Required)",
    "otpCode": "string (Required)"
  }
  ```
- **Response (`200 OK`):** Xác thực OTP thành công, lưu token đặt lại tạm thời.

#### Đặt lại mật khẩu (`POST /api/v1/auth/reset-password`)
- **Body (`ResetPasswordReq`):**
  ```json
  {
    "newPassword": "string (Required, minLength: 6)",
    "confirmPassword": "string (Required)",
    "logoutAllDevices": false // Đăng xuất khỏi mọi thiết bị (true/false)
  }
  ```
- **Response (`200 OK`):** Đặt lại mật khẩu thành công.

---

### 3.2. Profile (`Me`)

#### Lấy thông tin cá nhân (`GET /api/v1/me`)
- **Response (`200 OK`):**
  ```json
  {
    "message": "Lấy thông tin thành công",
    "data": {
      "id": "string",
      "username": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "address": "string",
      "gender": 1, // Enum Gender
      "status": 1, // Trạng thái tài khoản
      "createdAt": "ISOString",
      "roleSlug": "user/admin",
      "bodyProfile": {
        "bodyType": "string",
        "estimatedBodyShape": "string",
        "fitPreference": "string",
        "height": 0.0,
        "weight": 0.0,
        "recommendedSize": "string",
        "skinTone": "string",
        "stylingNotes": "string"
      },
      "subscription": {
        "planId": "string",
        "planName": "string",
        "aiChatDailyQuota": 10,
        "aiOutfitDailyQuota": 5,
        "maxOutfits": 50,
        "maxWardrobeItems": 100,
        "expiresAt": "ISOString"
      }
    }
  }
  ```

#### Cập nhật thông tin cá nhân (`PUT /api/v1/me`)
- **Body (`UpdateProfileReq`):**
  ```json
  {
    "firstName": "string (Required)",
    "lastName": "string",
    "dateOfBirth": "string (format YYYY-MM-DD)",
    "address": "string",
    "gender": 1 // Enum Gender
  }
  ```
- **Response (`200 OK`):** Trả về thông tin người dùng cập nhật mới trong trường `data` (giống schema của API `GET /api/v1/me`).

#### Đổi mật khẩu (`PUT /api/v1/me/change-password`)
- **Body (`ChangePasswordReq`):**
  ```json
  {
    "oldPassword": "string (Required)",
    "newPassword": "string (Required, minLength: 6)",
    "confirmPassword": "string (Required)",
    "logoutAllDevices": false
  }
  ```
- **Response (`200 OK`):** Đổi mật khẩu thành công.

---

### 3.3. Subscription & Billing

#### Đăng ký mua gói cước trực tiếp (`POST /api/v1/subscriptions/me/purchase`)
- **Body (`DirectPurchaseReq`):**
  ```json
  {
    "subscriptionPlanID": "string (Required)",
    "returnUrl": "string (URL chuyển hướng khi thanh toán thành công)",
    "cancelUrl": "string (URL chuyển hướng khi người dùng hủy thanh toán)"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Khởi tạo thanh toán thành công",
    "data": {
      "paymentUrl": "https://..." // Link trang thanh toán PayOS/VietQR để frontend redirect người dùng đến
    }
  }
  ```

#### Tạo yêu cầu nạp tiền vào ví (`POST /api/v1/subscriptions/me/wallet/topup`)
- **Body (`WalletTopUpReq`):**
  ```json
  {
    "amount": 50000, // Số tiền nạp (Required)
    "returnUrl": "string",
    "cancelUrl": "string"
  }
  ```
- **Response (`200 OK`):** Trả về liên kết thanh toán `paymentUrl` tương tự API mua gói trực tiếp.

#### Webhook thông báo thanh toán (`POST /api/v1/subscriptions/payos-webhook`)
- **Body (`PayOSWebhookReq`):**
  ```json
  {
    "code": "string",
    "desc": "string",
    "signature": "string",
    "data": {
      "orderCode": 123456,
      "amount": 50000,
      "description": "string",
      "accountNumber": "string",
      "reference": "string",
      "transactionDateTime": "string",
      "paymentLinkId": "string",
      "code": "string",
      "desc": "string"
    }
  }
  ```
- **Response (`200 OK`):** Xác nhận nhận và xử lý webhook thành công.

---

## 4. Định nghĩa các kiểu dữ liệu chung (Enum & Common Subschemas)

### Giới tính (`Gender` Enum)
- `0`: Không xác định (`Unknown`)
- `1`: Nam (`Male`)
- `2`: Nữ (`Female`)
- `3`: Khác (`Other`)

### Body Profile (`UserBodyProfileRes`)
Chi tiết hồ sơ hình thể của người dùng để gợi ý trang phục:
- `bodyType` (string)
- `estimatedBodyShape` (string)
- `fitPreference` (string)
- `height` (number) - Chiều cao (cm)
- `weight` (number) - Cân nặng (kg)
- `recommendedSize` (string) - Size đề xuất
- `skinTone` (string) - Tông màu da
- `stylingNotes` (string) - Ghi chú phong cách cá nhân

### Thông tin đăng ký gói cước (`UserSubscriptionRes`)
Thông tin gói cước người dùng hiện tại đang sở hữu:
- `planId` (string) - ID gói cước
- `planName` (string) - Tên gói cước (ví dụ: Free, Premium)
- `aiChatDailyQuota` (integer) - Hạn ngạch chat AI mỗi ngày
- `aiOutfitDailyQuota` (integer) - Hạn ngạch tạo outfit AI mỗi ngày
- `maxOutfits` (integer) - Số outfit tối đa được lưu
- `maxWardrobeItems` (integer) - Số món đồ tủ đồ tối đa
- `expiresAt` (string, ISO) - Thời gian hết hạn của gói cước
