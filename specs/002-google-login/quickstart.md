# Quickstart Validation Guide: Đăng Nhập Google (Frontend Web)

**Feature**: `002-google-login`  
**Date**: 2026-09-25  
**Spec**: [spec.md](./spec.md)  
**Contract**: [contracts/google-auth-contract.md](./contracts/google-auth-contract.md)

Tài liệu này hướng dẫn cách kiểm thử và kiểm chứng nhanh (Quickstart Verification) tính năng Đăng nhập Google trên Frontend Web trong môi trường cục bộ (localhost) và môi trường tích hợp.

---

## 1. Điều Kiện Tiên Quyết (Prerequisites)

1. **Frontend Dev Server**: Đang chạy trên cổng mặc định `http://localhost:3000`.
   ```bash
   npm run dev
   ```
2. **Backend API**:
   - Backend chạy tại `http://localhost:8080` (hoặc cấu hình trỏ tới `https://api.closy.hycat.online`).
   - Biến môi trường `.env.local` của Frontend:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
     ```
   - Backend đã đăng ký `http://localhost:3000/auth/callback` trong danh sách các origin / redirect URL hợp lệ.

---

## 2. Các Kịch Bản Kiểm Thử Xác Thực (Validation Scenarios)

### Kịch Bản 1: Kiểm tra hiển thị nút trên các trang xác thực
- **Thực hiện**:
  1. Mở trình duyệt và truy cập `http://localhost:3000/auth/login`.
  2. Mở trình duyệt và truy cập `http://localhost:3000/auth/register`.
- **Kỳ vọng**:
  - Cả 2 màn hình đều có nút "Đăng nhập bằng Google" (hoặc "Tiếp tục với Google") với logo chuẩn của Google.
  - Nút có hiệu ứng hover mượt mà và trạng thái con trỏ tay chỉ.

---

### Kịch Bản 2: Kiểm tra chuyển hướng khởi tạo OAuth
- **Thực hiện**:
  1. Tại `http://localhost:3000/auth/login`, mở DevTools Network tab.
  2. Nhấn nút "Đăng nhập bằng Google".
- **Kỳ vọng**:
  - Trình duyệt điều hướng đến URL có dạng:
    `{API_BASE}/api/v1/auth/google?redirectUrl=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback`
  - Backend tiếp nhận và điều hướng tiếp sang màn hình đăng nhập tài khoản của Google (`accounts.google.com`).

---

### Kịch Bản 3: Kiểm chứng trang Callback khi thành công (Happy Path)
- **Thực hiện**:
  1. Hoàn tất đăng nhập trên màn hình Google.
  2. Google redirect về backend, backend set cookie và redirect về `http://localhost:3000/auth/callback`.
- **Kỳ vọng**:
  - Màn hình hiển thị Auth Card với logo Closy và thông báo "Đang hoàn tất đăng nhập...".
  - Frontend gọi `GET /api/v1/me` với cookie HttpOnly vừa nhận, lấy thành công thông tin người dùng.
  - Hiển thị Toast thông báo: *"Đăng nhập thành công"*.
  - Tự động chuyển hướng vào `/brands` (với tài khoản User) hoặc `/admin/dashboard` (với tài khoản Admin).
  - Cookie `accessToken` và `refreshToken` tồn tại trong tab Storage/Cookies của trình duyệt.

---

### Kịch Bản 4: Giả lập và kiểm chứng xử lý lỗi (Error Handling Simulation)
Bạn có thể kiểm tra trực tiếp khả năng xử lý mã lỗi mà không cần tạo lỗi thực tế trên Google bằng cách truy cập các URL test:

1. **Người dùng hủy ủy quyền (`access_denied`)**:
   - Truy cập: `http://localhost:3000/auth/callback?error=access_denied`
   - **Kỳ vọng**: Tự động chuyển hướng về `http://localhost:3000/auth/login`, xuất hiện Toast info: *"Bạn đã huỷ đăng nhập bằng Google."*. URL trên thanh địa chỉ không còn lưu `?error=...`.

2. **Tài khoản bị vô hiệu hóa (`account_disabled`)**:
   - Truy cập: `http://localhost:3000/auth/callback?error=account_disabled`
   - **Kỳ vọng**: Chuyển về `/auth/login`, xuất hiện Toast error: *"Tài khoản của bạn đã bị vô hiệu hoá. Vui lòng liên hệ CSKH Closy để được hỗ trợ."*.

3. **Mã lỗi không xác định**:
   - Truy cập: `http://localhost:3000/auth/callback?error=unknown_code_xyz`
   - **Kỳ vọng**: Chuyển về `/auth/login`, xuất hiện Toast error an toàn mặc định: *"Đăng nhập Google không thành công. Vui lòng thử lại."*.

---

### Kịch Bản 5: Kiểm chứng duy trì ngữ cảnh trang đích (`returnUrl`)
- **Thực hiện**:
  1. Giả sử người dùng vào trang yêu cầu đăng nhập: `http://localhost:3000/auth/login?returnUrl=%2Fwardrobe`.
  2. Nhấn nút "Đăng nhập bằng Google".
  3. Kiểm tra trong DevTools Application tab -> Session Storage -> Khóa `closy_auth_return_url` có giá trị `/wardrobe`.
  4. Sau khi callback thành công, kiểm tra trang chuyển hướng cuối cùng có phải là `/wardrobe` hay không.
  5. Kiểm tra khóa `closy_auth_return_url` đã được xóa sạch khỏi `sessionStorage`.
