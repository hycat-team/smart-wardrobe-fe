# Hướng Dẫn Tích Hợp Đăng Nhập Google (Frontend Web)

Tài liệu hướng dẫn kỹ thuật cho các kỹ sư phát triển tính năng Đăng nhập Google trên ứng dụng Frontend Web Closy (`smart-wardrobe-fe`).

---

## 1. Tổng quan Kiến Trúc

- **Cơ chế**: Web Authorization Code + Redirect (chuẩn OAuth 2.0).
- **Nguyên tắc bảo mật**: Không nhúng Google Client Secret hay SDK của bên thứ ba vào client; Token truy cập và làm mới được quản lý độc quyền qua Cookie `HttpOnly` (`SameSite=Strict`, `Path=/`).
- **Endpoint Khởi tạo**:
  ```text
  GET {NEXT_PUBLIC_API_URL}/auth/google?redirectUrl={encodeURIComponent(CALLBACK_URL)}
  ```
- **Callback URL**: `https://<DOMAIN>/auth/callback` (hoặc `http://localhost:3000/auth/callback` ở local).

---

## 2. Các Thành Phần Mã Nguồn (Components & Utils)

### `src/features/auth/components/GoogleLoginButton.tsx`
- Component nút bấm với biểu tượng Google SVG đa sắc chính thức.
- Tự động kiểm tra và lưu lại `returnUrl` (nếu có trên query param `?returnUrl=...`) vào `sessionStorage` trước khi redirect.
- Trạng thái loading ngăn chặn click trùng lặp.
- Được nhúng tại:
  - `src/app/(guest)/auth/login/components/LoginClient.tsx`
  - `src/app/(guest)/auth/register/components/RegisterClient.tsx`

### `src/app/(guest)/auth/callback/page.tsx` & `CallbackClient.tsx`
- Trang tiếp nhận callback từ backend sau khi Google cấp phép.
- Hiển thị `CallbackLoadingCard` với logo Closy và animation mượt mà.
- **Xử lý lỗi**: Nếu có query `?error=<code>`, ánh xạ sang tiếng Việt qua `mapGoogleAuthError`, kích hoạt thông báo qua Sonner toast và chuyển về `/auth/login`.
- **Xử lý thành công**: Gọi `profileApi.getProfile()` (tự động kèm cookie HttpOnly), cập nhật cache React Query, đọc `returnUrl` từ `sessionStorage` (nếu có) hoặc điều hướng mặc định (`/admin/dashboard` cho Admin, `/brands` cho User).

### `src/features/auth/utils/google-auth.utils.ts`
- `buildGoogleAuthUrl()`: Tạo URL điều hướng tới backend OAuth.
- `mapGoogleAuthError(errorCode)`: Ánh xạ 7 mã lỗi chuẩn backend sang tiếng Việt.
- `isValidReturnUrl(url)`: Ngăn chặn tấn công Open-Redirect bằng cách xác thực đường dẫn tương đối bắt đầu bằng `/`.
- `saveReturnUrl()`, `getAndClearReturnUrl()`: Đọc/ghi `sessionStorage` an toàn.

---

## 3. Bảng Ánh Xạ Mã Lỗi (`?error=`)

| Mã lỗi | Loại Toast | Thông báo hiển thị |
|---|---|---|
| `access_denied` | `info` | Bạn đã huỷ đăng nhập bằng Google. |
| `email_unverified` | `error` | Email tài khoản Google chưa được xác thực. Vui lòng xác thực email với Google. |
| `email_registered` | `error` | Email này đã được đăng ký trong hệ thống. Vui lòng đăng nhập bằng mật khẩu. |
| `account_linked` | `error` | Email đã được liên kết với một tài khoản Google khác. |
| `account_disabled` | `error` | Tài khoản của bạn đã bị vô hiệu hoá. Vui lòng liên hệ CSKH Closy để được hỗ trợ. |
| `exchange_failed` | `error` | Xác thực tài khoản Google thất bại hoặc phiên đã hết hạn. Vui lòng thử lại. |
| `server_error` | `error` | Có lỗi xảy ra từ hệ thống máy chủ. Vui lòng thử lại sau giây lát. |
