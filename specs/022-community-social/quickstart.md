# Quickstart Validation Guide: 022 Community Social Frontend Integration

**Feature**: `022-community-social`
**Created**: 2026-09-26
**Purpose**: Hướng dẫn các bước xác thực và kiểm thử tích hợp giao diện người dùng sau khi triển khai mã nguồn.

---

## 1. Điều kiện tiên quyết (Prerequisites)

1. Máy chủ Backend đang chạy tại `http://localhost:8080/api/v1` (hoặc proxy qua `npm run dev`).
2. Tài khoản kiểm thử:
   - Tài khoản User A: `test_user_a`
   - Tài khoản User B: `test_user_b`
   - Tài khoản Admin: `admin_user`
3. Đã có ít nhất 1 bộ trang phục được tạo trong tủ đồ của `test_user_a` (dùng để kiểm thử đăng bài dạng `outfit`).

---

## 2. Kịch bản xác thực 1: Khám phá bảng tin & chuyển đổi bộ lọc Feed

- **Mục tiêu**: Đảm bảo tab Explore/Following và Sort hot/latest hoạt động chính xác.
- **Thực hiện**:
  1. Truy cập `http://localhost:3000/community`.
  2. Kiểm tra tab mặc định là "Khám phá" (Explore) và sắp xếp "Nổi bật" (Hot).
  3. Bấm chuyển sang sắp xếp "Mới nhất" (Latest) -> kiểm tra danh sách bài viết cập nhật theo thời gian tạo gần nhất.
  4. Bấm chuyển sang tab "Đang theo dõi" (Following) khi chưa đăng nhập -> kiểm tra xuất hiện thông báo yêu cầu đăng nhập.
  5. Đăng nhập với `test_user_a` và quay lại tab "Đang theo dõi" -> kiểm tra chỉ hiển thị bài của những người `test_user_a` đang theo dõi và bài của chính mình.
- **Kết quả kỳ vọng**: Dữ liệu tải nhanh, không xuất hiện bài viết bị xóa (`deleted`) hoặc bài ẩn (`hidden`) của người khác.

---

## 3. Kịch bản xác thực 2: Đăng bài viết dạng Outfit và Media (Ảnh/Video)

- **Mục tiêu**: Xác thực quy trình chọn outfit từ tủ đồ và quy trình tải ảnh/video lên Cloudinary.
- **Thực hiện**:
  1. Nhấn nút "Tạo bài viết" trên bảng tin.
  2. **Test Case Outfit**:
     - Chọn tab loại bài "Trang phục (Outfit)".
     - Chọn 1 bộ trang phục trong modal chọn outfit.
     - Nhập tiêu đề (≤ 150 ký tự) và nội dung chia sẻ.
     - Nhấn "Đăng bài" -> kiểm tra bài viết xuất hiện ngay trên đầu feed với ảnh bìa outfit và nhãn trang phục.
  3. **Test Case Media (Video)**:
     - Mở lại trình tạo bài viết, chọn tab "Đa phương tiện (Media)".
     - Chọn 1 video ngắn (< 60s, < 100MB).
     - Nhập nội dung chia sẻ -> Nhấn "Đăng bài".
     - Kiểm tra bài viết xuất hiện với trình phát video có thể phát mượt mà.
  4. **Test Case Validation**:
     - Thử chọn 1 ảnh dung lượng > 10MB -> kiểm tra hệ thống báo lỗi client-side ngay khi chọn tệp, không gọi API.
- **Kết quả kỳ vọng**: Trạng thái tải lên có thanh tiến trình hoặc spinner, thông báo thành công và làm mới danh sách bài viết tự động.

---

## 4. Kịch bản xác thực 3: Thả tim (Like) & Theo dõi (Follow) Optimistic Update

- **Mục tiêu**: Kiểm tra phản hồi giao diện tức thì của tương tác Like và Follow.
- **Thực hiện**:
  1. Bấm nút Tim trên 1 bài viết -> icon Tim đổi màu đỏ và số lượt thích tăng +1 ngay tức thì (< 100ms) kèm hiệu ứng nảy tim.
  2. Bấm lại vào nút Tim -> số lượt thích giảm -1 ngay tức thì.
  3. Bấm vào dòng "X lượt thích" -> modal danh sách người thích mở ra, hiển thị phân trang người dùng đã thích bài viết.
  4. Bấm nút "Theo dõi" trên thẻ bài viết của `test_user_b` -> nút chuyển thành "Đang theo dõi" ngay lập tức.
- **Kết quả kỳ vọng**: Không có độ trễ giật cục, trạng thái được đồng bộ trên toàn bộ feed và trang chi tiết.

---

## 5. Kịch bản xác thực 4: Thảo luận bình luận phân cấp & Xóa bình luận

- **Mục tiêu**: Kiểm tra luồng gửi bình luận gốc, phản hồi con, và xử lý bình luận đã xóa.
- **Thực hiện**:
  1. Mở bài viết, nhập nội dung "Bình luận gốc thử nghiệm" và nhấn gửi -> bình luận xuất hiện ở đầu danh sách.
  2. Nhấn nút "Trả lời" dưới bình luận gốc, nhập "Phản hồi thử nghiệm" và gửi -> câu trả lời hiển thị thụt dòng dưới bình luận gốc.
  3. Dùng tài khoản tác giả bình luận gốc bấm "Xóa" bình luận gốc -> bình luận gốc hiển thị chữ nghiêng *"Bình luận đã bị xóa"* trong khi phản hồi con vẫn hiển thị bình thường.
- **Kết quả kỳ vọng**: Số lượng bình luận hiển thị chính xác, cấu trúc lồng cấp rõ ràng.

---

## 6. Kịch bản xác thực 5: Trang cá nhân công khai & Tìm kiếm tập trung

- **Mục tiêu**: Xác thực điều hướng `/users/[username]` và trang tìm kiếm `/search`.
- **Thực hiện**:
  1. Nhấp vào tên hoặc avatar của `test_user_b` trên bài viết -> chuyển hướng đến `/users/test_user_b`.
  2. Kiểm tra các số liệu thống kê: số bài viết, số follower, số following.
  3. Bấm vào số follower -> modal danh sách người theo dõi mở ra với ô tìm kiếm tên/tài khoản.
  4. Mở trang `/search`, nhập từ khóa tìm kiếm -> kiểm tra giao diện chia thành 2 tab/khối: "Mọi người" và "Bài viết".
- **Kết quả kỳ vọng**: Dữ liệu thống kê chuẩn xác, tìm kiếm lọc đúng người dùng và bài đăng trong 30 ngày.
