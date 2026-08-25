Brand Benefit
Docs: docs/api/brand/brand-loyalty-api.md


API thay đổi
Endpoint
Auth
Thay đổi
GET /brands/:brandId/benefits
Public
Thêm query params page, limit, unlockType, benefitType. Response giờ là {items, metadata} thay vì array
GET /brand-portal/brands/:brandId/benefits
Brand member (staff)
Tương tự
GET /brands/:brandId/loyalty/tiers/:tierId
Mới - Public
Trả về chi tiết tier kèm danh sách benefits gắn với tier
GET /brand-portal/brands/:brandId/loyalty/tiers/:tierId
Mới - Brand member (staff)
Tương tự



UI chia 2 nơi
1. Trang đổi quyền lợi bằng điểm (Public)

Gọi: GET /brands/:brandId/benefits?unlockType=point_redemption
Mỗi benefit hiển thị:
Tên, mô tả
Số điểm cần đổi (requiredPoints)
Nếu có requiredTierId → hiển thị thêm "Yêu cầu hạng: {requiredTierName}" (tức user phải đạt hạng đó mới được đổi)
Nút "Đổi"

2. Trang quyền lợi theo hạng (Public, xem từ chi tiết tier)

Gọi: GET /brands/:brandId/loyalty/tiers/:tierId
Hiển thị: thông tin tier (tên, rank, minSpend) + danh sách benefits từ response
Mỗi benefit hiển thị: tên, mô tả, loại quyền lợi

Bỏ qua: manual_grant (chưa có nghiệp vụ)

