# Research & Technical Decisions: 033 Fix PayOS Payment Flow

## 1. Cơ chế Cookie SameSite=Strict và Điều hướng Cross-Site

### Bối cảnh & Vấn đề
- Backend thiết lập cookie `accessToken` và `refreshToken` với `SameSite=Strict`.
- Khi người dùng hoàn thành thanh toán trên cổng PayOS (miền ngoài), PayOS chuyển hướng trình duyệt về website ứng dụng qua HTTP GET request (`cross-site top-level navigation`).
- Theo đặc tả bảo mật cookie của trình duyệt (RFC 6265bis), các cookie có cờ `SameSite=Strict` bị chặn hoàn toàn trong request điều hướng liên miền này.
- Khi người dùng được redirect về `/profile`, route này thuộc nhóm `(user)` và Server Component `ProfileData.tsx` gọi `serverFetch('/me')`. Do request đầu tiên không có cookie, serverFetch nhận HTTP 401 Unauthorized và lập tức kích hoạt `redirect('/auth/login')`.

### Quyết định kỹ thuật
- **Giải pháp**: Xây dựng trang đích kết quả công khai tại `/payment/result` (nằm ngoài route group `(user)`).
- **Cơ chế hoạt động**:
  1. Trang này là một Server Component bọc `<Suspense>` đơn giản, tuyệt đối không gọi `serverFetch('/me')` hay bất kỳ API nào yêu cầu xác thực phía server.
  2. Trang kết quả tải về thành công (HTTP 200 OK) về trình duyệt của người dùng.
  3. Khi mã JavaScript client component (`PaymentResultClient.tsx`) thực thi trên trình duyệt, ngữ cảnh đã nằm hoàn toàn trong cùng một miền gốc (`same-site`).
  4. Mọi yêu cầu HTTP bất đồng bộ (XHR/Fetch/Axios) do TanStack Query kích hoạt sau đó đều tự động đính kèm cookie `SameSite=Strict` bình thường.
  5. Sau khi dữ liệu được làm mới, client điều hướng nội bộ (`router.replace`) về `/profile?tab=wallet` hoặc `/pricing`, lúc này phiên đăng nhập được duy trì nguyên vẹn.

---

## 2. Xây dựng Địa chỉ Trả về Động (Dynamic Return URL)

### Bối cảnh & Vấn đề
- Trước đây, `TopUpModal.tsx` dùng `window.location.href` (trỏ trực tiếp về trang hiện tại `/profile`).
- `PricingCard.tsx` hoàn toàn không gửi `returnUrl` và `cancelUrl`, dẫn đến việc backend phải fallback về địa chỉ cấu hình mặc định (root domain).

### Quyết định kỹ thuật
- **Giải pháp**: Tạo URL kết quả thống nhất tại thời điểm người dùng bấm nút thanh toán trên client:
  - Cho nạp ví: `${window.location.origin}/payment/result?flow=topup&next=${encodeURIComponent('/profile?tab=wallet')}`
  - Cho mua gói: `${window.location.origin}/payment/result?flow=purchase&next=${encodeURIComponent('/pricing')}`
- **Lợi ích**:
  - Tự động thích ứng với mọi môi trường: `localhost:3000`, preview deployment, staging, và production (`closy.hycat.online`).
  - Không phụ thuộc vào biến môi trường hay cấu hình cứng.

---

## 3. Đồng bộ Dữ liệu Bất đồng bộ & Xử lý Độ trễ Webhook (Polling Strategy)

### Bối cảnh & Vấn đề
- PayOS gửi thông báo thanh toán thành công tới backend thông qua webhook.
- Tốc độ trình duyệt chuyển hướng từ PayOS về thường nhanh hơn thời gian máy chủ tiếp nhận, xác thực chữ ký và lưu trạng thái đơn hàng từ webhook (độ trễ khoảng 1 - 3 giây).
- Nếu chỉ refetch một lần ngay lập tức, dữ liệu tài khoản có thể vẫn hiển thị số dư hoặc gói cũ.

### Quyết định kỹ thuật
- **Giải pháp**:
  - Khi phát hiện giao dịch thành công (`code === '00' && cancel !== 'true'`), hiển thị trạng thái "Đang cập nhật..." kèm biểu tượng đang tải.
  - Vô hiệu hóa và gọi refetch định kỳ:
    - 5 lần thăm dò (polling).
    - Chu kỳ mỗi lần cách nhau 2 giây.
    - Làm mới các query keys: `['me']`, `['wallet', 'balance']`, `['wallet', 'statements']`, `['subscription', 'me']`, `['subscription', 'quota']`.
  - Nút "Tiếp tục" chỉ kích hoạt điều hướng khi chu kỳ refetch hoàn tất hoặc người dùng bấm chủ động sau khi đã có dữ liệu.

---

## 4. Bảo mật Chống Chuyển hướng Mở (Open Redirect Prevention)

### Bối cảnh & Vấn đề
- Tham số `next` trong URL có thể bị lợi dụng để điều hướng người dùng tới các trang lừa đảo bên ngoài nếu không được kiểm tra chặt chẽ.

### Quyết định kỹ thuật
- **Giải pháp**: Kiểm tra nghiêm ngặt đường dẫn đích:
  ```typescript
  const isValidNext = next && next.startsWith('/') && !next.startsWith('//');
  const targetUrl = isValidNext ? next : '/profile?tab=wallet';
  ```
- **Lý do**: Ngăn chặn cả đường dẫn tuyệt đối (`https://...`) và đường dẫn giao thức tương đối (`//malicious.com`).

---

## 5. Đồng bộ Tab Ví trên Trang Hồ sơ (Profile URL Tab Sync)

### Bối cảnh & Vấn đề
- Trước đây, trang `/profile` quản lý state `activeTab` bằng `useState('overview')`.
- Khi người dùng quay lại từ luồng nạp tiền, giao diện hiển thị tab Tổng quan thay vì tab Ví.

### Quyết định kỹ thuật
- **Giải pháp**:
  - Khởi tạo giá trị mặc định của `activeTab` dựa trên `useSearchParams().get('tab')`. Nếu giá trị là `'wallet'`, mặc định chọn tab ví.
  - Khi người dùng chuyển đổi tab, gọi `router.replace('/profile?tab=' + val, { scroll: false })` để cập nhật thanh địa chỉ mà không làm giật cuộn trang.
