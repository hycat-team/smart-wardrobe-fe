# Walkthrough: Tích hợp API Flow 1 vào UI

Chúng ta đã hoàn thành việc tích hợp toàn bộ các API của **Flow 1** (Authentication, Profile, Subscription Non-billing) vào giao diện React / Next.js, thay thế hoàn toàn cho dữ liệu giả (mock data).

## 🚀 Các Thay Đổi Chính (What Changed)

### 1. Đồng bộ trạng thái đăng nhập với `AuthProvider`
- **Tạo mới `AuthProvider`** (`src/components/providers/auth-provider.tsx`): 
  - Đóng vai trò là cầu nối giữa API và Global Store (`useAuthStore`).
  - Nếu trình duyệt có Token (Cookie), ứng dụng sẽ tự động fetch API `useProfile()` và gọi hàm `setUser` để cập nhật trạng thái đăng nhập đồng bộ.
  - Tích hợp thêm các dữ liệu tương thích ngược (như `name`, `avatar` qua Dicebear, và `isPremium`) để giữ cho các UI Component hiện hành hoạt động mượt mà không cần sửa đổi nhiều.
- Cấu hình vào gốc ứng dụng tại `src/app/layout.tsx`.

### 2. Luồng Đăng nhập & Đăng ký
- **Đăng nhập (`/auth/login`)**:
  - Gỡ logic "if email === admin".
  - Tích hợp hàm `login` từ `useLogin()`. Khi API phản hồi thành công (token được đẩy vào HTTP-Only hoặc js-cookie), người dùng sẽ được chuyển ngay sang trang `/wardrobe`.
- **Đăng ký (`/auth/register`)**:
  - Viết lại toàn bộ form để khớp với schema API: Thêm Họ Tên riêng, Ngày sinh, Địa chỉ, Giới tính, Xác nhận mật khẩu.
  - Xây dựng **luồng 2 bước (2-step form)** ngay trên cùng một màn hình: Sau khi Đăng ký thành công (`useRegister`), UI chuyển sang bước **Nhập mã OTP**.
  - Sau khi xác thực OTP thành công (`useConfirmRegisterOtp`), hệ thống sẽ chuyển hướng sang trang chọn sở thích (Preferences).

### 3. Trang Quản lý Hồ Sơ (Profile)
- **Settings Profile (`/settings/profile`)**:
  - Viết lại toàn bộ form cập nhật thông tin cá nhân. API cung cấp gì (Tên, Họ, Ngày sinh, Địa chỉ), form map y hệt.
  - Các dữ liệu tự động được điền (hydrated) sau khi fetch từ Backend.
  - Bổ sung Form **Đổi Mật Khẩu** ở phía dưới (dùng Hook `useChangePassword()`).
- **User Profile (`/profile`)**:
  - Hoạt động mượt mà dựa vào data truyền xuống từ `useAuthStore` sau khi đã được `AuthProvider` xử lý (như hiện đúng avatar Dicebear, icon Premium, v.v.).

### 4. Gói cước và Hạn ngạch (Subscription)
- **Billing Settings (`/settings/billing`)**:
  - Thay vì hardcode số lượt dùng AI, ứng dụng giờ đây sẽ gọi hook `useDailyQuota()` để đọc số lượt Chat AI và tạo Outfit tối đa trong ngày.
  - Tích hợp một nút **Đổi trạng thái Auto Renew** cho người dùng gói Premium, sử dụng `useToggleAutoRenew()`.

## ✅ Kết quả xác minh (Validation)
1. Mã nguồn đã được biên dịch không lỗi TypeScript bằng lệnh `tsc --noEmit`. Các giao diện (UI props) cũ không bị ảnh hưởng do chúng ta đã dùng adapter pattern nhỏ bên trong `AuthProvider`.
2. Form dữ liệu liên kết chuẩn xác với cấu trúc `UserRes`, `RegisterReq`, `UpdateProfileReq`.

> [!TIP]  
> Các tính năng hiện tại đã đủ để bạn kết nối và kiểm thử toàn bộ **Flow 1** với Backend trên môi trường local hoặc staging! Hướng tiếp theo chúng ta có thể chuyển sang **Flow 2** (Thanh toán & Nạp ví).
