# Quickstart & Verification Guide: 033 Fix PayOS Payment Flow

## 1. Kiểm tra Tự động (Automated Verification)

Chạy các lệnh kiểm tra mã nguồn từ thư mục gốc của repository `smart-wardrobe-fe`:

```bash
# 1. Kiểm tra quy tắc định dạng và linting
npm run lint

# 2. Kiểm tra tính toàn vẹn kiểu dữ liệu TypeScript
npx tsc --noEmit

# 3. Chạy toàn bộ test suites hiện có
npm test
```

Tất cả các lệnh trên phải vượt qua với mã thoát `0` (Exit code 0, không có lỗi).

---

## 2. Kịch bản Kiểm thử Thủ công (Manual Test Scenarios)

### Kịch bản 1: Nạp ví thành công
1. Đăng nhập tài khoản trên môi trường thử nghiệm.
2. Truy cập trang Cá nhân, chọn tab **Ví** (hoặc mở trực tiếp `/profile?tab=wallet`).
3. Bấm **Nạp tiền vào ví**, nhập số tiền `50000` và xác nhận.
4. Trình duyệt chuyển sang cổng PayOS Sandbox.
5. Thực hiện thanh toán thành công trên PayOS.
6. **Xác nhận**: Trình duyệt điều hướng về `/payment/result?code=00&...&flow=topup&next=%2Fprofile%3Ftab%3Dwallet`.
7. **Xác nhận**: Giao diện hiển thị biểu tượng thành công, mã đơn hàng và thông báo "Đang cập nhật...". Không bị văng sang `/auth/login`.
8. Bấm nút **Tiếp tục**: Trình duyệt mở lại `/profile?tab=wallet`, số dư mới đã được cộng 50,000 VND.

### Kịch bản 2: Hủy nạp ví
1. Mở modal nạp tiền và chuyển sang cổng PayOS.
2. Trên màn hình PayOS, bấm nút **Hủy giao dịch**.
3. **Xác nhận**: Trình duyệt chuyển về `/payment/result` hiển thị trạng thái giao dịch đã bị hủy, tuyệt đối không báo thành công.
4. Bấm **Tiếp tục**: Trình duyệt quay về `/profile?tab=wallet`.

### Kịch bản 3: Mua gói Pro thành công
1. Đăng nhập và truy cập trang Bảng giá (`/pricing`).
2. Chọn thanh toán trực tiếp (VietQR) cho gói Pro.
3. Hoàn tất thanh toán trên PayOS Sandbox.
4. **Xác nhận**: Trình duyệt quay về `/payment/result?flow=purchase...` hiển thị thành công, không bị rơi về trang chủ (`/`).
5. Bấm **Tiếp tục**: Trình duyệt mở lại trang `/pricing`, gói hiện tại của người dùng được hiển thị chính xác là Pro.

### Kịch bản 4: Hủy mua gói
1. Bấm thanh toán gói và nhấn Hủy tại PayOS.
2. **Xác nhận**: Giao diện hiển thị đã hủy, bấm Tiếp tục quay lại đúng `/pricing`.
