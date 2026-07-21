# Quy trình kiểm thử thủ công (Manual Testing Flow)

Dưới đây là kịch bản kiểm thử thủ công để bạn có thể tự mình verify (kiểm tra) lại toàn bộ các tính năng vừa được hoàn thành. 

> [!NOTE]
> Để thực hiện đầy đủ kịch bản, bạn nên sử dụng **2 trình duyệt** hoặc **1 trình duyệt thường và 1 tab Ẩn danh (Incognito)**:
> - **Trình duyệt 1 (Brand Staff):** Đăng nhập tài khoản Nhân viên hoặc Quản lý Nhãn hàng.
> - **Trình duyệt 2 (Customer):** Đăng nhập tài khoản Người dùng (Shopper).

---

## 1. Kiểm thử Giao diện Người dùng & Tham gia Loyalty (Customer Side)

**Mục tiêu:** Đảm bảo API lấy thông tin nhãn hàng thực tế hoạt động và tính năng Đăng ký thẻ thành viên thành công.

1. Đăng nhập vào ứng dụng dành cho **Customer**.
2. Để tìm một ID của nhãn hàng đang hoạt động, bạn có thể xem danh sách tại trang Admin (`http://localhost:3000/admin/brands`) hoặc dùng một ID đã biết.
3. Truy cập vào trang chi tiết của Nhãn hàng theo route: 
   👉 `http://localhost:3000/brands/[brandId]` 
   *(Ví dụ: `http://localhost:3000/brands/123e4567-e89b-12d3-a456-426614174000`)*
4. **Kiểm tra dữ liệu:** Đảm bảo Tên nhãn hàng, Logo, Mô tả hiển thị đúng dữ liệu thực tế lấy từ API. Danh sách sản phẩm (nếu có) cũng được hiển thị thay thế cho dữ liệu mẫu.
5. Nhấn nút **"Membership"** (hoặc "Tham gia Loyalty").
6. **Kỳ vọng:**
   - Nút sẽ hiển thị trạng thái loading quay vòng (spinner).
   - Có thông báo góc phải màn hình báo "Đăng ký Loyalty thành công!" (hoặc báo lỗi nếu user đã tham gia hoặc API không hợp lệ).
   - Giao diện có thể load lại thông tin nhãn hàng.

---

## 2. Kiểm thử Chat Hỗ trợ Trực tuyến (Real-time Support Chat)

**Mục tiêu:** Xác minh luồng trò chuyện hai chiều giữa Khách hàng và Nhân viên cửa hàng.

### Bước 2.1: Khách hàng gửi tin nhắn
1. Tại trang chi tiết Nhãn hàng bên **Customer** (`http://localhost:3000/brands/[brandId]`), ở khu vực thông tin (cạnh nút Theo dõi và Membership), hãy nhấn vào nút **"Nhắn tin"**.
2. Một cửa sổ Chat trực tuyến sẽ được mở ra.
3. Nhập tin nhắn: *"Xin chào, tôi cần tư vấn về size áo!"* và nhấn **Gửi**.
4. **Kỳ vọng:** Tin nhắn hiện lên trong cửa sổ chat với định dạng là tin nhắn của người gửi (nằm bên phải, màu đen).

### Bước 2.2: Nhân viên phản hồi
1. Mở **Trình duyệt 1 (Brand Staff)**.
2. Truy cập vào Brand Portal của nhãn hàng đó qua route:
   👉 `http://localhost:3000/brand/[brandId]/chat`
3. Ở cột bên trái của Chat Inbox, bạn sẽ thấy tên khách hàng vừa nhắn tin hiện lên đầu tiên (có thể có chấm thông báo tin nhắn chưa đọc).
4. Bấm vào khách hàng đó để mở khung hội thoại chi tiết bên phải.
5. **Kỳ vọng:** Dòng chữ *"Xin chào, tôi cần tư vấn về size áo!"* của khách hàng hiện ở phía bên trái (màu xám nhạt).
6. Ở ô nhập tin nhắn bên dưới, nhân viên chat lại: *"Chào bạn, bạn cao nặng bao nhiêu ạ?"* và nhấn **Gửi**.

### Bước 2.3: Khách hàng nhận được tin
1. Chuyển lại sang **Trình duyệt 2 (Customer)**.
2. **Kỳ vọng:** Cửa sổ chat của khách hàng sẽ tự động xuất hiện câu trả lời của nhân viên (do cơ chế refetch liên tục 10s hoặc real-time).

---

## 3. Kiểm thử Quản lý Thành viên (Member Management)

**Mục tiêu:** Quản lý cửa hàng (Owner) có thể thêm nhân viên vận hành vào brand của mình.

1. Bằng tài khoản Quản trị Nhãn hàng, truy cập vào tab **Thành viên** trong Brand Portal:
   👉 `http://localhost:3000/brand/[brandId]/members`
2. **Kiểm tra UI ban đầu:** Bạn sẽ thấy danh sách nhân sự hiện tại gồm Tên, Email, Vai trò (Owner/Staff), Trạng thái.
3. Nhấn vào nút **"+ Thêm thành viên"** ở góc phải trên.
4. Một cửa sổ (Dialog) mở ra. Nhập Email hoặc Username của một nhân viên bạn muốn thêm.
5. Chọn vai trò: **"Nhân viên (Staff)"**. Nhấn **Thêm thành viên**.
6. **Kỳ vọng:**
   - Có thông báo thành công.
   - Dialog tự đóng lại.
   - Bảng danh sách thành viên tự động load lại và hiển thị nhân viên bạn vừa thêm vào.

---

## 4. Kiểm thử Liên kết Tài khoản Offline (Offline Claim Token)

**Mục tiêu:** Đồng bộ lịch sử mua sắm offline của khách lên App thông qua Claim Token.

### Bước 4.1: Nhân viên tạo mã
1. Truy cập vào CRM Khách hàng trong Brand Portal, chọn một khách hàng:
   👉 `http://localhost:3000/brand/[brandId]/customers/[customerId]`
2. Đảm bảo khách hàng này chưa có Loyalty Account trên App. Tại góc trên cùng bên phải, cạnh nút Cộng Điểm, nhấn vào nút **"Tạo mã Claim"**.
3. Chọn **"Tạo mã mới"**.
4. **Kỳ vọng:** Hệ thống sẽ trả về một chuỗi mã dài (VD: `CLAIM-832FJD`), hiển thị mã số và ngày hết hạn. Nhấn vào nút copy mã.

### Bước 4.2: Khách hàng liên kết tài khoản
1. Trở lại **Trình duyệt 2 (Customer)**.
2. Truy cập vào màn hình **Hồ sơ cá nhân (Profile)** của khách hàng:
   👉 `http://localhost:3000/profile`
3. Tại tab **Tổng quan (Overview)**, cuộn xuống dưới bạn sẽ thấy khối chức năng **"Liên kết tài khoản nhãn hàng"**.
4. Dán mã Claim vừa copy được từ bước 4.1 vào ô nhập liệu.
5. Nhấn **"Liên kết"**.
6. **Kỳ vọng:**
   - Nút hiển thị loading.
   - Nếu mã đúng: Xuất hiện thông báo *"Liên kết tài khoản thành công!"*.
   - Từ nay lịch sử điểm của khách sẽ được đồng bộ từ offline lên tài khoản này.

> [!WARNING]
> **Lưu ý trong lúc test:**
> - Nếu một số nút bị ẩn hoặc báo lỗi, hãy mở cửa sổ **Network (F12)** trên trình duyệt để kiểm tra xem API backend đã được deploy đúng phiên bản cập nhật hay chưa (VD: Backend đã mở route `/brands/claim` chưa).
> - Tính năng auto refetch (lấy tin nhắn mới) trong cửa sổ chat khách hàng được cài đặt khoảng cách 10s mỗi lần để tiết kiệm tài nguyên. Do đó nếu chat không hiện ngay, hãy chờ vài giây.
