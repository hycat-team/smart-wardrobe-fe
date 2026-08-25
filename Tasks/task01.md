Loyalty Points
Docs: docs/api/brand/brand-loyalty-api.md


Tổng quan hệ thống
Backend xử lý 3 luồng điểm chính:

Earn: Cộng điểm từ mua hàng (staff POS) hoặc thủ công
Redeem: Trừ điểm khi user đổi quyền lợi (FIFO từ lot cũ nhất)
Expire: Tự động hết hạn điểm theo pointExpiryDays (worker cron)


Các màn hình cần xây dựng
1. Màn hình Customer (User App)
Màn hình
API
Mô tả
Thẻ thành viên
GET /me/brand-loyalties
Danh sách các brand đang tham gia loyalty, hiển thị điểm hiện tại, hạng, tổng chi tiêu
Chi tiết thẻ
GET /me/brand-loyalties/:brandId
Thông tin chi tiết 1 brand: điểm, hạng, lô điểm sắp hết hạn
Lịch sử điểm
GET /me/brand-loyalties/:brandId/transactions
Danh sách giao dịch: cộng/trừ điểm, lý do, số dư sau giao dịch
Đổi quyền lợi bằng điểm
GET /brands/:brandId/benefits?unlockType=point_redemption
Danh sách benefit có thể đổi bằng điểm, hiển thị requiredPoints, nút "Đổi"
Quyền lợi theo hạng
GET /brands/:brandId/loyalty/tiers/:tierId
Chi tiết tier + danh sách benefits gắn với tier
Vouchers đã đổi
GET /me/benefit-redemptions
Danh sách benefit đã redeem thành công

2. Màn hình Brand Portal (Staff)
Màn hình
API
Mô tả
Cấu hình chương trình
GET /brand-portal/brands/:brandId/loyalty/program
Xem/sửa amountPerPoint, pointExpiryDays, roundingMode
Quản lý hạng
GET /brand-portal/brands/:brandId/loyalty/tiers
CRUD tiers (name, rank, minTotalSpend)
Chi tiết hạng + benefits
GET /brand-portal/brands/:brandId/loyalty/tiers/:tierId
Xem tier + benefits gắn với tier
Cộng điểm
POST /brand-portal/brands/:brandId/loyalty/points
Staff POS nhập userId/phone/số tiền → hệ thống tự tính điểm
Đối soát điểm
GET /brand-portal/brands/:brandId/loyalty/accounts/:accountId/transactions
Xem lịch sử giao dịch của 1 customer
Quản lý benefits
GET /brand-portal/brands/:brandId/benefits
CRUD benefits, phân trang, filter theo unlockType/benefitType



Logic hiển thị theo loại benefit
unlockType
Vị trí hiển thị
Hiển thị gì
point_redemption
Trang đổi quyền lợi bằng điểm
Tên, mô tả, requiredPoints, nút "Đổi"
tier_privilege
Trong chi tiết tier
Tên, mô tả, loại quyền lợi (feature_access, voucher, ...)
manual_grant
Bỏ qua (chưa có nghiệp vụ)
-



Luồng điểm quan trọng cần hiểu
Earn: purchaseAmount / amountPerPoint → làm tròn theo roundingMode → tạo lot (hạn pointExpiryDays)
Redeem: Trừ từ lot cũ nhất (FIFO) → lot hết points → status consumed
Expire: Worker tự chạy mỗi 1h, lot hết hạn → remaining=0, status=expired
Tier: Chỉ tính lại khi earn (dựa trên totalSpend), không đổi khi redeem/expire


Swagger
Brand module: api/swagger/modules/brand/swagger.json
Docs chi tiết: docs/api/brand/brand-loyalty-api.md

