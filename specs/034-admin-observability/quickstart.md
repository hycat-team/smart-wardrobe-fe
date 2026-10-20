# Quickstart Validation Guide: Admin Observability (034)

Hướng dẫn kiểm thử và xác thực luồng vận hành của tính năng Admin Observability.

## Điều kiện tiên quyết (Prerequisites)

1. Tài khoản thử nghiệm có vai trò `admin` (đăng nhập tại `/auth/login` hoặc sử dụng cookie token).
2. Backend API đang chạy tại cổng proxy `/api/v1` (hỗ trợ các endpoint thuộc feature 029).

---

## Kịch bản 1: Xác thực trang Giao dịch payOS & Thao tác Đối soát thủ công

### Các bước thực hiện:
1. Đăng nhập với tài khoản Admin và nhấp vào mục **"Giao dịch payOS"** trên thanh Sidebar (`/admin/transactions`).
2. Quan sát bảng dữ liệu:
   - Cột trạng thái hiển thị đúng huy hiệu màu sắc và nhãn tiếng Việt cho các trạng thái: `pending`, `success`, `reconciliation_required`, v.v.
   - Số tiền hiển thị định dạng VND.
3. Thử nghiệm bộ lọc:
   - Chọn bộ lọc trạng thái: `Cần đối soát` (`reconciliation_required`). Kiểm tra URL query param có `status=reconciliation_required`.
   - Chọn preset ngày: "Tháng này". Kiểm tra URL có `fromDate` và `toDate` chuẩn `YYYY-MM-DD`.
4. Xem chi tiết giao dịch:
   - Nhấn nút "Chi tiết" ở một giao dịch. Modal chi tiết mở ra hiển thị đầy đủ thông tin (DTO camelCase).
5. Thực hiện hành động đối soát:
   - Nếu giao dịch ở trạng thái chưa thành công, bấm nút **"Xác nhận đã thanh toán"**.
   - Hộp thoại mở ra yêu cầu nhập: Lý do, Mã tham chiếu đối tác, Mã link PayOS.
   - Nhập thông tin và bấm Xác nhận.
6. Kết quả mong đợi:
   - Toast thông báo thành công hiển thị nội dung tiếng Việt từ máy chủ.
   - Chi tiết giao dịch và bảng danh sách tự động làm mới, cập nhật trạng thái mới.

---

## Kịch bản 2: Kiểm tra Dashboard Vận hành & Phân tách Snapshot / Kỳ

### Các bước thực hiện:
1. Truy cập trang **Dashboard Admin** (`/admin/dashboard`).
2. Kiểm tra khối KPI:
   - Thấy nhãn "Ảnh chụp" và mốc thời gian cập nhật gần nhất (`updatedAt`).
   - Thẻ "DAU hôm nay" có chú thích ảnh chụp định kỳ (~15 phút).
   - Thẻ "Doanh thu" có chú thích "Doanh thu hôm nay (ảnh chụp)".
3. Kiểm tra khối theo kỳ:
   - Bấm chọn preset **"Hôm nay"**: Các panel Đối soát PayOS, AI Margin, Phân tích lỗi AI hiển thị số liệu của ngày hôm nay.
   - Bấm chọn preset **"Tháng này"**: Khoảng ngày tự động nhảy từ ngày 01 đến hôm nay (giờ VN). Toàn bộ 7 panel đồng loạt refetch số liệu theo kỳ mới.
   - Kiểm tra panel **Đối soát PayOS**: Có hiển thị tổng giao dịch, số thành công, thất bại, đang xử lý và tổng giá trị thanh toán thực nhận.
   - Kiểm tra panel **Phân tích lỗi AI**: Tỷ lệ lỗi luôn $\le 100\%$, tử số và mẫu số cùng thuộc kỳ đã chọn.
4. Kiểm tra xử lý lỗi khoảng ngày:
   - Thử chỉnh sửa URL query `fromDate=2026-10-20&toDate=2026-10-10` (đảo chiều).
   - Kết quả: Hệ thống hiển thị thông báo lỗi tiếng Việt "Ngày bắt đầu không được sau ngày kết thúc", giữ nguyên ngày trên thanh công cụ để chỉnh sửa, không im lặng chuyển về 30 ngày.

---

## Kịch bản 3: Tra cứu Nhật ký Hoạt động Người dùng

### Các bước thực hiện:
1. Nhấp vào mục **"Hoạt động người dùng"** trên thanh Sidebar (`/admin/activity-events`).
2. Quan sát bảng dữ liệu:
   - Cột thời điểm hiển thị giờ Việt Nam (`dd/MM/yyyy HH:mm:ss`).
   - Cột người dùng hiển thị tên đầy đủ hoặc fallback về email.
   - Cột loại hoạt động hiển thị badge "Đăng nhập" hoặc "Làm mới phiên".
3. Thử nghiệm lọc:
   - Chọn loại hoạt động "Đăng nhập" -> Bảng cập nhật danh sách các lượt đăng nhập.
   - Chọn "Tất cả" -> URL query xóa bỏ param `activityType`, bảng hiển thị mọi hoạt động.
   - Nhập UUID người dùng vào ô tìm kiếm -> Bảng lọc đúng theo người dùng đó.
