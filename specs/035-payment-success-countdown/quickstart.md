# Quickstart & Validation Guide: 035 Payment Success Countdown Redirect

## Overview

Tài liệu này hướng dẫn các bước kiểm thử và xác thực tính năng đếm ngược tự động chuyển trang khi thanh toán thành công trên môi trường kiểm thử tự động (Jest) và môi trường phát triển cục bộ (Local Dev).

---

## 1. Automated Testing (Jest)

Hệ thống sử dụng Jest cùng `@testing-library/react` để kiểm thử hành vi đếm ngược, tự động chuyển trang và dọn dẹp timer.

### Chạy kiểm thử:

```bash
npm test src/app/payment/result/components/PaymentResultClient.test.tsx
```

### Các kịch bản kiểm thử tự động cần xác thực:

1. **Kịch bản 1: Tự động chuyển trang sau khi đếm ngược 5s (Top-up flow)**
   - Thiết lập URL params: `?code=00&cancel=false&flow=topup&next=/profile?tab=wallet`
   - Kích hoạt hoàn tất cập nhật dữ liệu tài khoản (`isUpdating = false`)
   - Kiểm tra giao diện hiển thị đếm ngược ban đầu là `5` giây
   - Cho thời gian chạy qua 5 giây (`jest.advanceTimersByTime(5000)`)
   - Xác nhận `mockReplace` được gọi chính xác với `/profile?tab=wallet`

2. **Kịch bản 2: Tự động chuyển trang sau khi đếm ngược 5s (Purchase flow)**
   - Thiết lập URL params: `?code=00&cancel=false&flow=purchase&next=/pricing`
   - Kích hoạt kết thúc cập nhật dữ liệu
   - Cho thời gian chạy qua 5 giây
   - Xác nhận `mockReplace` được gọi với `/pricing`

3. **Kịch bản 3: Người dùng chủ động click nút "Tiếp tục" trong khi đếm ngược**
   - Thiết lập URL params thành công
   - Khi timer đang đếm ngược ở giây thứ 3, kích hoạt sự kiện click vào nút "Tiếp tục"
   - Xác nhận chuyển hướng ngay lập tức đến đúng trang đích
   - Cho thời gian chạy tiếp để kiểm tra timer không kích hoạt thêm lần điều hướng thứ 2

4. **Kịch bản 4: Giao dịch bị hủy hoặc thất bại không kích hoạt đếm ngược**
   - Thiết lập URL params: `?code=00&cancel=true&status=CANCELLED` hoặc `?code=99`
   - Cho thời gian trôi qua 10 giây
   - Xác nhận `mockReplace` hoàn toàn KHÔNG được gọi tự động

---

## 2. Manual Testing (Local Dev Server)

### Khởi chạy môi trường:

```bash
npm run dev
```

Mở trình duyệt và truy cập các kịch bản kiểm thử sau:

### Kịch bản A: Nạp ví thành công (`flow=topup`)
- **URL**: `http://localhost:3000/payment/result?code=00&cancel=false&orderCode=123456&flow=topup&next=%2Fprofile%3Ftab%3Dwallet`
- **Quan sát**:
  1. Ban đầu hiện "Đang cập nhật dữ liệu tài khoản..." kèm spinner trên nút.
  2. Sau khi cập nhật xong, nút chuyển thành "Tiếp tục (5s)".
  3. Số giây đếm lùi: `5s` -> `4s` -> `3s` -> `2s` -> `1s`.
  4. Sau khi về `0s`, trình duyệt tự động chuyển hướng đến `/profile?tab=wallet`.

### Kịch bản B: Mua gói thành công (`flow=purchase`)
- **URL**: `http://localhost:3000/payment/result?code=00&cancel=false&orderCode=888999&flow=purchase&next=%2Fpricing`
- **Quan sát**:
  1. Sau khi cập nhật xong, nút đếm ngược từ 5 giây.
  2. Người dùng để nguyên không bấm nút -> Trình duyệt tự động chuyển về `/pricing`.

### Kịch bản C: Người dùng bấm "Tiếp tục" sớm
- **URL**: `http://localhost:3000/payment/result?code=00&cancel=false&orderCode=123456&flow=topup&next=%2Fprofile%3Ftab%3Dwallet`
- **Quan sát**:
  1. Khi nút đang đếm ngược (ví dụ ở giây thứ 3), bấm ngay vào nút "Tiếp tục".
  2. Trình duyệt chuyển ngay tới `/profile?tab=wallet`, không bị giật hay reload lại.

### Kịch bản D: Giao dịch bị hủy
- **URL**: `http://localhost:3000/payment/result?code=00&cancel=true&status=CANCELLED&orderCode=123456`
- **Quan sát**:
  1. Giao diện báo "Giao dịch đã bị hủy".
  2. Nút "Tiếp tục" không có số giây đếm ngược.
  3. Màn hình giữ nguyên vô thời hạn nếu người dùng không tự tay bấm nút.
