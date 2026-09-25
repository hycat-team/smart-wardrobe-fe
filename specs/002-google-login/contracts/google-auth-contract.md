# Interface Contract: Đăng Nhập Google (Frontend ↔ Backend)

**Feature**: `002-google-login`  
**Date**: 2026-09-25  
**Spec**: [spec.md](../spec.md)

Tài liệu này xác định giao ước giao tiếp (contract) giữa Frontend Web và Backend API cho tính năng Đăng nhập Google.

---

## 1. Khởi Tạo Đăng Nhập Google (Frontend → Backend)

### Request
- **Method**: `GET`
- **Path**: `/api/v1/auth/google`
- **URL Parameter**:
  - `redirectUrl` (string, required, URL-encoded): URL trên frontend mà backend sẽ chuyển hướng về sau khi xử lý xong OAuth với Google.
  - **Ràng buộc backend**: Host của `redirectUrl` phải khớp chính xác với một trong các `front_end_origins` đã cấu hình ở backend (ví dụ: `https://closy.hycat.online/auth/callback` hoặc `http://localhost:3000/auth/callback` trong môi trường dev).

### Ví dụ Client Trigger
```typescript
const returnUrl = `${window.location.origin}/auth/callback`;
const googleAuthUrl = `${API_BASE}/api/v1/auth/google?redirectUrl=${encodeURIComponent(returnUrl)}`;
window.location.href = googleAuthUrl;
```

### Response từ Backend
- **Thành công (200 / 302)**: Backend tạo `state` bảo mật (lưu server-side kèm `redirectUrl`), tạo authorization URL của Google và trả về mã chuyển hướng `302 Found` tới Google Accounts.
- **Thất bại (400 Bad Request)**: Khi `redirectUrl` không hợp lệ hoặc sai origin, backend trả về JSON lỗi `400` trực tiếp (không redirect).

---

## 2. Tiếp Nhận Kết Quả Tại Frontend (Backend → Frontend Callback)

Sau khi trao đổi code với Google thành công hoặc gặp lỗi, Backend điều hướng trình duyệt về `redirectUrl` đã chỉ định.

### 2.1. Luồng Thành Công (Success Callback)
- **URL**: `https://<FE_ORIGIN>/auth/callback`
- **Headers từ Backend**:
  - `Set-Cookie`: `accessToken=...; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=...`
  - `Set-Cookie`: `refreshToken=...; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=...`
- **Query Parameters**: Không có query `error`.

### 2.2. Luồng Thất Bại (Error Callback)
- **URL**: `https://<FE_ORIGIN>/auth/callback?error=<ERROR_CODE>`
- **Các giá trị `ERROR_CODE`**:

| `error` | Nguyên nhân | Xử lý tại Frontend |
|---|---|---|
| `access_denied` | Người dùng đóng hoặc hủy ủy quyền tại màn hình Google | `toast.info("Bạn đã huỷ đăng nhập bằng Google.")` |
| `email_unverified` | Email Google chưa được xác thực | `toast.error("Email tài khoản Google chưa được xác thực. Vui lòng xác thực với Google.")` |
| `email_registered` | Trùng email với tài khoản do admin tạo chưa kích hoạt | `toast.error("Email đã được đăng ký. Vui lòng đăng nhập bằng mật khẩu.")` |
| `account_linked` | Email đã liên kết với tài khoản Google khác | `toast.error("Email đã được liên kết với một tài khoản Google khác.")` |
| `account_disabled` | Tài khoản trong hệ thống Closy đang bị khóa | `toast.error("Tài khoản của bạn đã bị vô hiệu hoá. Vui lòng liên hệ CSKH.")` |
| `exchange_failed` | Mã code Google hết hạn hoặc backend đổi token thất bại | `toast.error("Không hoàn tất được đăng nhập, vui lòng thử lại.")` |
| `server_error` | Lỗi nội bộ backend | `toast.error("Có lỗi xảy ra, vui lòng thử lại sau.")` |

---

## 3. Xác Nhận Phiên Sau Khi Tiếp Nhận Callback (Frontend → Backend)

Ngay sau khi vào `/auth/callback` và không có lỗi, Frontend gửi request xác nhận phiên:

- **Method**: `GET`
- **Path**: `/api/v1/me`
- **Credentials**: `include` (bắt buộc gửi kèm HttpOnly cookie vừa nhận từ backend)

### Response Mẫu Thành Công (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "usr_98a7sd9f87as",
    "email": "user@example.com",
    "fullName": "Nguyen Van A",
    "avatarUrl": null,
    "roleSlug": "user",
    "status": "active"
  },
  "message": "Lấy thông tin người dùng thành công"
}
```

### Response Mẫu Thất Bại (401 Unauthorized)
```json
{
  "success": false,
  "message": "Phiên đăng nhập không hợp lệ hoặc đã hết hạn"
}
```
Frontend bắt lỗi 401, thông báo thất bại và chuyển về `/auth/login`.
