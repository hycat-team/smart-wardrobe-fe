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