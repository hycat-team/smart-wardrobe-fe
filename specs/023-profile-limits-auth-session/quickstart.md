# Quickstart & Verification Guide: Hạn mức Profile & Quản lý Phiên Cookie Auth

**Feature**: `023-profile-limits-auth-session`  
**Date**: 2026-09-26  
**Status**: Ready for Verification  

---

## 1. Yêu cầu Tiền đề (Prerequisites)

- Node.js >= 20.x, npm / yarn / pnpm.
- Biến môi trường kết nối Backend:
  ```env
  NEXT_PUBLIC_API_URL=https://api.closy.hycat.online/api/v1
  ```
- Tài khoản kiểm thử:
  - Tài khoản A (Gói Premium hoặc gói có giới hạn: ví dụ 500 đồ, 50 outfit).
  - Tài khoản B (Gói Không giới hạn / Unlimited: `maxWardrobeItems = 0` hoặc `maxOutfits = 0`).
  - Tài khoản C (Tài khoản mới, 0 món đồ, 0 outfit: `activeItemsCount = 0`).

---

## 2. Các Kịch bản Kiểm chứng Tính năng (Verification Scenarios)

### Kịch bản 1: Kiểm tra Hiển thị Hạn mức Tủ đồ & Outfit (Gói có Giới hạn thông thường)

1. Mở trình duyệt, truy cập trang web `https://closy.hycat.online` (hoặc `http://localhost:3000`).
2. Đăng nhập bằng **Tài khoản A**.
3. Điều hướng tới trang Cá nhân (`/profile`) và chọn tab **Tổng quan**.
4. Quan sát thẻ **GÓI HIỆN TẠI CỦA BẠN** (`CurrentPlanCard`):
   - **Kỳ vọng**:
     - Mục "TỐI ĐA MÓN ĐỒ": Hiển thị chính xác dạng `{activeItemsCount} / {maxWardrobeItems} MÓN` (ví dụ: `128 / 500 MÓN`).
     - Mục "TỐI ĐA BỘ PHỐI ĐỒ": Hiển thị chính xác dạng `{outfitsCount} / {maxOutfits} BỘ` (ví dụ: `12 / 50 BỘ`).
     - Thanh tiến trình: Hiển thị thanh màu tương ứng với tỷ lệ phần trăm `(128 / 500) * 100 = 25.6%`.
     - Không có lỗi hiển thị, không bị lặp chữ hoặc lặp logic.

---

### Kịch bản 2: Kiểm tra Xử lý Gói Không giới hạn (Unlimited - `max = 0`) & Số lượng bằng 0

1. Đăng nhập bằng **Tài khoản B** (Gói cước có `maxWardrobeItems = 0` hoặc `maxOutfits = 0`).
2. Mở trang `/profile`:
   - **Kỳ vọng**:
     - Hiển thị `{activeItemsCount} / ∞ MÓN` hoặc `{outfitsCount} / ∞ BỘ`.
     - Tuyệt đối không xuất hiện lỗi JavaScript chia cho 0 (`NaN%` hay `Infinity%`).
     - Thanh tiến trình ở trạng thái ẩn hoặc hiển thị an toàn ở mức 0%.
3. Đăng nhập bằng **Tài khoản C** (Tài khoản mới tạo, chưa thêm đồ):
   - **Kỳ vọng**:
     - Hiển thị rõ ràng số `0 / {max} MÓN` và `0 / {max} BỘ`.
     - Số 0 không bị biến mất hay bị thay thế bằng dấu vô cực `∞`.

---

### Kịch bản 3: Kiểm tra Đăng nhập & Xác minh Duy nhất 1 Cặp Cookie (Loại bỏ 4 Token)

1. Mở DevTools của trình duyệt (F12) -> Chuyển sang tab **Application** -> mục **Cookies**.
2. Thực hiện đăng nhập tại trang `/auth/login`.
3. Kiểm tra danh sách cookie lưu trữ:
   - **Kỳ vọng**:
     - Chỉ tồn tại **duy nhất 1** cookie `accessToken` và **duy nhất 1** cookie `refreshToken`.
     - Cột `Domain` của cả 2 cookie đều mang giá trị domain cấp cao (ví dụ `.closy.hycat.online` hoặc tương ứng với backend domain).
     - **Không tồn tại** cookie thứ hai cùng tên ở cấp host-only (không có 4 token song song).
     - Cờ `HttpOnly` và `Secure` được bật đầy đủ.

---

### Kịch bản 4: Kiểm tra Tự động Làm mới Phiên (Token Refresh) & Xoay vòng

1. Tại tab DevTools -> Network, thực hiện mô phỏng hoặc chờ khi `accessToken` hết hạn (khoảng 15 phút).
2. Thực hiện một hành động cần xác thực trên web (ví dụ: chuyển tab, thêm đồ, mở trang cá nhân).
3. Quan sát tab Network:
   - **Kỳ vọng**:
     - Yêu cầu đầu tiên gặp lỗi 401.
     - Axios interceptor tự động phát đi `POST /api/v1/auth/refresh-token` với `withCredentials: true`.
     - Backend trả về cặp token mới kèm `Set-Cookie`.
     - Yêu cầu ban đầu được tự động thực hiện lại thành công mà người dùng không hề bị văng ra trang đăng nhập.
     - Danh sách Cookies trong DevTools vẫn giữ đúng 1 cặp token mới nhất, không sinh thêm token dư thừa.

---

### Kịch bản 5: Kiểm tra Đăng xuất Sạch sẽ (Clean Logout)

1. Khi đang trong trạng thái đăng nhập, người dùng nhấn nút **Đăng xuất**.
2. Quan sát phản hồi mạng và danh sách cookies:
   - **Kỳ vọng**:
     - Gửi yêu cầu `POST /api/v1/auth/logout`.
     - Backend gửi `Set-Cookie` xóa sạch `accessToken` và `refreshToken` (Max-Age=0).
     - Trong DevTools -> Cookies: Cả 2 cookie biến mất hoàn toàn.
     - Ứng dụng đưa người dùng về trang `/auth/login`.
     - Khi bấm F5 hoặc mở tab mới, trạng thái hoàn toàn là khách (chưa đăng nhập).

---

## 3. Lệnh Chạy Kiểm Thử Tự Động (Automated Test Commands)

```bash
# Kiểm tra định dạng mã nguồn và kiểu TypeScript
npm run type-check # hoặc npx tsc --noEmit

# Chạy linting toàn dự án
npm run lint

# Chạy unit tests liên quan đến profile & auth
npm run test
```
