# Research & Architecture Decisions: Đăng nhập Google (Frontend Web)

**Feature**: `002-google-login`  
**Date**: 2026-09-25  
**Spec**: [spec.md](./spec.md)

## Overview

Tài liệu này tổng hợp các nghiên cứu kiến trúc, phân tích kỹ thuật và quyết định thiết kế cho tính năng Đăng nhập Google trên Frontend Web (`smart-wardrobe-fe`), tuân thủ hợp đồng tích hợp tại [`google-login-frontend-guide.md`](file:///C:/FPT/Project/smart-wardrobe/smart-wardrobe-be/docs/api/identity/google-login-frontend-guide.md) của backend.

---

## 1. Cơ chế xác thực OAuth 2.0 Web: Redirect Flow vs Client-Side GIS

### Quyết định (Decision)
Sử dụng luồng **Web Authorization Code + Redirect** (§1 theo tài liệu hướng dẫn backend).
- Nút đăng nhập điều hướng trực tiếp trình duyệt tới:
  ```text
  {API_BASE}/api/v1/auth/google?redirectUrl={encodeURIComponent(FE_RETURN_URL)}
  ```
  Trong đó `FE_RETURN_URL` là URL callback trên frontend: `${window.location.origin}/auth/callback`.

### Lý do chọn (Rationale)
1. **Bảo mật tuyệt đối**: Không nhúng bất kỳ Google Client Secret hay SDK của bên thứ ba vào code client.
2. **Hiệu năng & Ổn định**: Không làm chậm thời gian tải trang bằng external script (`accounts.google.com/gsi/client`), không bị chặn bởi các trình chặn quảng cáo (AdBlock, Brave Shields) hay chính sách mạng nghiêm ngặt.
3. **Mô hình Cookie HttpOnly**: Backend trực tiếp hoàn tất trao đổi mã với Google, khởi tạo phiên và đặt cookie `accessToken` & `refreshToken` (`SameSite=Strict`, `HttpOnly`) trong response chuyển hướng về `FE_RETURN_URL`. Trình duyệt tự động nhận diện phiên mà client không cần thao tác với chuỗi token thô.
4. **Khuyến nghị chính thức từ Backend**: Backend đã hoàn tất triển khai endpoint này tại `specs/021-google-login`.

### Các giải pháp thay thế đã đánh giá (Alternatives Considered)
- **Google Identity Services (One Tap / GIS Button - §2)**: Nhúng script `gsi/client`, lấy `idToken` rồi gọi `POST /api/v1/auth/google`. Mặc dù mang lại trải nghiệm One Tap tức thì, giải pháp này phụ thuộc vào script ngoài và phức tạp hơn khi xử lý CSP. Đã thống nhất hoãn sang phiên bản mở rộng (v2) nếu có nhu cầu bổ sung.

---

## 2. Thiết kế luồng xử lý tại Callback Route (`/auth/callback`)

### Quyết định (Decision)
Tạo page chuyên trách tại `src/app/(guest)/auth/callback/page.tsx` (và `CallbackClient.tsx`).
Quy trình thực thi tuần tự:
1. Đọc query string trên URL (`useSearchParams`):
   - **Trường hợp có `?error=<code>`**:
     - Ánh xạ `code` sang thông báo tiếng Việt theo Bảng ánh xạ mã lỗi (§4).
     - Bắn Toast thông báo qua `sonner` (`toast.error(...)` hoặc `toast.info(...)` với `access_denied`).
     - Dùng `router.replace('/auth/login')` để chuyển người dùng về trang đăng nhập và xoá query khỏi lịch sử duyệt web.
   - **Trường hợp không có `error`**:
     - Trình duyệt đã có cookie HttpOnly do backend thiết lập.
     - Gọi `profileApi.getProfile()` (hoặc `GET /api/v1/me`) kèm `credentials: 'include'`.
     - Cập nhật React Query cache (`['authStatus']`, `PROFILE_QUERY_KEY`).
     - Hiển thị toast "Đăng nhập thành công!".
     - Đọc `returnUrl` đã lưu (xem mục 3), sau đó `router.replace(targetUrl)`.

### Lý do chọn (Rationale)
- Tránh việc để URL chứa query string lỗi hoặc token.
- Sử dụng `router.replace` thay vì `router.push` để người dùng không bấm Back quay lại màn hình callback trung gian.
- Giao diện Auth Card đồng bộ thẩm mỹ Closy với spinner loading nhẹ nhàng giúp người dùng có cảm giác mượt mà trong ~500ms xác thực.

---

## 3. Cơ chế bảo toàn ngữ cảnh trang đích (`returnUrl`)

### Quyết định (Decision)
Lưu `returnUrl` vào `sessionStorage` trước khi người dùng rời sang Google:
- Khóa lưu trữ: `closy_auth_return_url`.
- Khi người dùng nhấn nút "Đăng nhập bằng Google":
  - Kiểm tra xem URL hiện tại có param `returnUrl` hoặc `from` hay không (ví dụ `/auth/login?returnUrl=%2Fwardrobe`).
  - Nếu có, kiểm tra tính an toàn: chỉ chấp nhận URL nội bộ (bắt đầu bằng `/` đơn, không bắt đầu bằng `//` để tránh Open Redirect).
  - Lưu vào `sessionStorage.setItem('closy_auth_return_url', returnUrl)`.
- Khi về đến `/auth/callback`:
  - Đọc `const returnUrl = sessionStorage.getItem('closy_auth_return_url')`.
  - Xóa khóa `sessionStorage.removeItem('closy_auth_return_url')`.
  - Nếu có giá trị hợp lệ → chuyển hướng về `returnUrl`.
  - Nếu không có: dựa vào role của user (`isAdmin` → `/admin/dashboard`, bình thường → `/brands`).

### Lý do chọn (Rationale)
- `sessionStorage` tồn tại xuyên suốt trong tab hiện tại dù trình duyệt chuyển hướng ra bên ngoài domain (Google) rồi quay lại.
- Tránh việc mã hóa query parameter lồng nhau quá nhiều lớp trên URL redirect của Google OAuth.
- Ngăn chặn lỗi bảo mật Open Redirect thông qua validation tiền tố `/`.

---

## 4. Bảng ánh xạ mã lỗi chuẩn Backend ↔ Thông báo Frontend

### Quyết định (Decision)

| Mã lỗi (`?error=`) | Loại thông báo | Nội dung thông báo hiển thị cho người dùng | Hành động giao diện |
|---|---|---|---|
| `access_denied` | `toast.info` | Bạn đã huỷ đăng nhập bằng Google. | Chuyển về `/auth/login` |
| `email_unverified` | `toast.error` | Email tài khoản Google chưa được xác thực. Vui lòng xác thực email với Google. | Chuyển về `/auth/login` |
| `email_registered` | `toast.error` | Email này đã được đăng ký trong hệ thống. Vui lòng đăng nhập bằng mật khẩu. | Chuyển về `/auth/login` |
| `account_linked` | `toast.error` | Email đã được liên kết với một tài khoản Google khác. | Chuyển về `/auth/login` |
| `account_disabled` | `toast.error` | Tài khoản của bạn đã bị vô hiệu hoá. Vui lòng liên hệ CSKH Closy để được hỗ trợ. | Chuyển về `/auth/login` |
| `exchange_failed` | `toast.error` | Xác thực tài khoản Google thất bại hoặc phiên đã hết hạn. Vui lòng thử lại. | Chuyển về `/auth/login` |
| `server_error` | `toast.error` | Có lỗi xảy ra từ hệ thống máy chủ. Vui lòng thử lại sau giây lát. | Chuyển về `/auth/login` |
| *(Mã không xác định)* | `toast.error` | Đăng nhập Google không thành công. Vui lòng thử lại. | Chuyển về `/auth/login` |

---

## 5. Cấu trúc Component & Điểm gắn kết (UI Integration)

### Quyết định (Decision)
Tạo component tái sử dụng: `src/features/auth/components/GoogleLoginButton.tsx`:
- Render nút dạng pill hoặc rounded-2xl đồng bộ phong cách các nút hiện tại của Closy.
- Chứa SVG logo Google chuẩn đa sắc (Red, Blue, Yellow, Green).
- Quản lý trạng thái `isRedirecting` (khi người dùng click, disable nút và hiển thị spinner để tránh click đúp).
- Tích hợp vào:
  1. `src/app/(guest)/auth/login/components/LoginClient.tsx`
  2. `src/app/(guest)/auth/register/components/RegisterClient.tsx`
- Giữa form mật khẩu truyền thống và nút Google sử dụng Divider đường kẻ mảnh với chữ "HOẶC TIẾP TỤC VỚI".
