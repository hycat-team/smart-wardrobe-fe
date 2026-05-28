# Kế hoạch tích hợp API Auth & Profile

Tài liệu này trình bày kế hoạch tích hợp các API theo định nghĩa trong `ROUTE.md` và `swagger.yaml` vào Frontend dự án Smart Wardrobe, tuân thủ đúng kiến trúc 3 lớp đã đề ra trong `ARCHITECTURE.md`.

## User Review Required
> [!WARNING]
> Theo Swagger backend, API `/api/v1/auth/login` chỉ trả về `accessToken` (và có thể là `refreshToken`) trong `data`, không trả về thông tin `user`. 
> Do đó, trong frontend khi gọi `login` thành công, ta sẽ cần tiếp tục gọi thêm API `/api/v1/me` để lấy thông tin user và lưu vào Global State (Zustand). Xin xác nhận luồng này là hợp lý với thiết kế của backend.

> [!IMPORTANT]
> Frontend hiện đang cấu hình `baseURL` trong Axios là `/api`, vì vậy các endpoint sẽ cần thêm prefix `/v1` (ví dụ: `/v1/auth/login`). Nếu backend thực tế là `/api/v1` thay vì `/api`, ta có thể sửa lại `baseURL` thành `/api/v1` trong file `src/lib/axios.ts` để các đường dẫn gọi API gọn hơn. Kế hoạch bên dưới giả định sẽ cập nhật lại `baseURL` của Axios thành `/api/v1`.

## Proposed Changes

---

### Cấu hình Core (Lớp 1)

Cập nhật cấu hình Axios để trỏ đúng `baseURL` và sửa cách truy xuất dữ liệu phản hồi (Response API của backend bọc trong object `data`).

#### [MODIFY] [axios.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/lib/axios.ts)
- Thay đổi `baseURL` thành `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'`.
- Đảm bảo logic refresh token hoạt động trơn tru với API `/auth/refresh-token`.

---

### Khai báo Types (DTOs)

Cập nhật các interfaces/types theo sát Swagger Schema của backend.

#### [MODIFY] [index.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/auth/types/index.ts)
- Thêm các interface Request: `RegisterReq`, `ConfirmRegisterOtpReq`, `LoginReq`, `SendForgotPasswordOtpReq`, `ConfirmForgotPasswordOtpReq`, `ResetPasswordReq`, `ChangePasswordReq`, `UpdateProfileReq`.
- Thêm các interface Response: `UserRes`, `AuthTokens`.
- Định nghĩa kiểu `APIResponse<T>` chung để nhận diện cấu trúc `{ message: string, data: T }`.

---

### Lớp Service (Lớp 2)

Viết các hàm gọi API thuần tuý (sử dụng Axios) cho tất cả các route đã liệt kê trong `ROUTE.md`.

#### [MODIFY] [auth.api.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/auth/api/auth.api.ts)
- Thay đổi đường dẫn các endpoint cũ (bỏ `/api/v1` do `baseURL` đã bao gồm).
- Cập nhật API:
  - `POST /auth/login`
  - `POST /auth/logout`
  - `POST /auth/refresh-token`
  - `POST /auth/register`
  - `POST /auth/register/confirm-otp`
  - `POST /auth/forgot-password`
  - `POST /auth/forgot-password/confirm-otp`
  - `POST /auth/reset-password`
- Cập nhật Profile API:
  - `GET /me`
  - `PUT /me`
  - `PUT /me/change-password`

---

### Lớp Hooks (Lớp 3)

Bọc các API service bằng React Query (TanStack Query) để quản lý side-effects, cache và state.

#### [MODIFY] [auth.queries.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/features/auth/queries/auth.queries.ts)
- Chỉnh sửa `useLogin`: Sau khi có được `accessToken`, lưu vào Cookies, đồng thời gọi fetch Profile (`authApi.getProfile()`) ngay lập tức rồi mới lưu `user` vào Zustand.
- Sửa lại `useLogout`: Xoá cookies và xoá Zustand store.
- Bổ sung các Mutation mới cho các luồng:
  - `useRegister`: Gọi API `/auth/register`.
  - `useConfirmRegisterOtp`: Gọi API `/auth/register/confirm-otp`.
  - `useForgotPassword`: Gọi API `/auth/forgot-password`.
  - `useConfirmForgotPasswordOtp`: Gọi API `/auth/forgot-password/confirm-otp`.
  - `useResetPassword`: Gọi API `/auth/reset-password`.
  - `useChangePassword`: Gọi API `/me/change-password`.

## Verification Plan

### Manual Verification
- Bạn có thể trực tiếp test gọi các Custom Hooks trong một component nháp (ví dụ màn hình Login / Register) để xác nhận việc gửi Request có body chuẩn xác.
- Kiểm tra Network Tab để đảm bảo payload gửi lên và URL `/api/v1/auth/login` hoặc `/api/v1/me` hoàn toàn trùng khớp với Swagger.
- Kiểm tra Cookie lưu trữ Token và Store Zustand có được set dữ liệu người dùng đúng không.
