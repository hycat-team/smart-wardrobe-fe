Auth Routes
Method	Route	Mô tả
POST	/api/v1/auth/forgot-password	Yêu cầu khôi phục mật khẩu
POST	/api/v1/auth/forgot-password/confirm-otp	Xác thực OTP khôi phục mật khẩu
POST	/api/v1/auth/login	Đăng nhập
POST	/api/v1/auth/logout	Đăng xuất
POST	/api/v1/auth/refresh-token	Xoay vòng token (Refresh Token)
POST	/api/v1/auth/register	Đăng ký tài khoản
POST	/api/v1/auth/register/confirm-otp	Xác thực OTP đăng ký
POST	/api/v1/auth/reset-password	Đặt lại mật khẩu

Me Routes
Method	Route	Mô tả
GET	/api/v1/me	Lấy thông tin cá nhân
PUT	/api/v1/me	Cập nhật thông tin cá nhân
PUT	/api/v1/me/change-password	Đổi mật khẩu

Subscription
GET	/api/v1/subscriptions/me/daily-quota	Lẩy hạn ngạch sử dụng hàng ngày
PATCH /api/v1/subscriptions/me/toggle-auto-renew	Bật/Tắt tự động gia hạn gói cước
GET	/api/v1/subscriptions/plans	Lẩy danh sách các gói Premium

Billing

POST	/api/v1/subscriptions/me/purchase	Đăng ký mua gói cước trực tiếp
POST	/api/v1/subscriptions/me/purchase-with-wallet	Đăng ký mua gói cước bằng ví nội bộ
GET	/api/v1/subscriptions/me/wallet	Lẩy số dư vỉ người dùng
GET	/api/v1/subscriptions/me/wallet/statements	Lẩy lịch sử giao dịch vỉ nội bộ
POST	/api/v1/subscriptions/me/wallet/topup	Tạo yêu cầu nạp tiền vào ví nội bộ
POST	/api/v1/subscriptions/payos-webhook	Xử lý Webhook thong bao thanh toán từ PayOS

POST	/api/v1/outfits 	Tạo trang phục mới từ ảnh

GET	/api/v1/outfits 	Tải danh sách trang phục (Có thể lọc theo category)

GET	/api/v1/outfits/{id}	Lấy chi tiết trang phục

DELETE	/api/v1/outfits/{id}	Xóa trang phục

POST	/api/v1/outfits/generate/outfit	Lấy gợi ý trang phục

POST	/api/v1/outfits/generate/outfit	Đăng ký mua gói cước trực tiếp

POST	/api/v1/outfits/generate/outfit	Đăng ký mua gói cước bằng ví nội bộ