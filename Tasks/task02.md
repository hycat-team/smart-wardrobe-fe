Frontend Note: API Changes từ Backend
Các API sau sẽ có thay đổi về response structure. Cần cập nhật cách gọi API và render tương ứng.


1. GET /api/v1/me/benefit-redemptions
Thay đổi 1: Response format
Trước (array):

{

  "data": [

    { "id": "...", "brandId": "...", "benefitId": "..." }

  ]

}

Sau (pagination):

{

  "data": {

    "items": [

      { "id": "...", "benefitId": "..." }

    ],

    "metadata": {

      "page": 1,

      "limit": 20,

      "totalItems": 5,

      "totalPages": 1

    }

  }

}

Cần sửa:

Thay response.data[i] → response.data.items[i]
Thêm xử lý pagination (nút phân trang hoặc load more)
Thay đổi 2: Field brandId bỏ, thêm brand object
Trước:

{ "brandId": "abc-123", "benefitId": "..." }

Sau:

{

  "brand": {

    "id": "abc-123",

    "name": "Nike Vietnam",

    "slug": "nike-vietnam",

    "description": "...",

    "logoUrl": "https://...",

    "backgroundUrl": "https://..."

  },

  "benefitId": "..."

}

Cần sửa:

item.brandId → item.brand.id
item.brandName (nếu có dùng) → item.brand.name
Render logo: item.brand.logoUrl, background: item.brand.backgroundUrl
Thay đổi 3: Query param mới
Hỗ trợ filter: GET /api/v1/me/benefit-redemptions?brandId=xxx&page=1&limit=20


2. POST /api/v1/brand-benefits/:benefitId/redeem
Trước:

{ "brandId": "abc-123", "benefitId": "..." }

Sau:

{

  "brand": {

    "id": "abc-123",

    "name": "Nike Vietnam",

    "slug": "nike-vietnam",

    "description": "...",

    "logoUrl": "https://...",

    "backgroundUrl": "https://..."

  },

  "benefitId": "..."

}

Cần sửa:

res.brandId → res.brand.id


3. GET /api/v1/me/brand-loyalties
Trước — field brand chứa 13 fields:

{

  "brandId": "...",

  "brand": {

    "id": "...",

    "slug": "...",

    "name": "...",

    "description": "...",

    "logoUrl": "...",

    "backgroundUrl": "...",

    "status": "APPROVED",

    "totalCustomer": 150,

    "createdByUserId": "...",

    "approvedByUserId": "...",

    "approvedAt": "...",

    "createdAt": "...",

    "updatedAt": "..."

  }

}

Sau — field brand chỉ còn 6 fields:

{

  "brand": {

    "id": "...",

    "name": "...",

    "slug": "...",

    "description": "...",

    "logoUrl": "...",

    "backgroundUrl": "..."

  }

}

Cần sửa:

Nếu đang dùng brand.status → cần xem lại logic (đã bỏ)
Nếu đang dùng brand.totalCustomer → cần xem lại logic (đã bỏ)
Các field brand.createdAt, brand.updatedAt, brand.createdByUserId, brand.approvedByUserId, brand.approvedAt đã bỏ
4. GET /api/v1/me/brand-loyalties/:brandId
Giống section 3 — cùng response BrandLoyaltyRes.


Tổng kết các field cần kiểm tra
Field cũ
Field mới
Endpoint bị ảnh hưởng
item.brandId
item.brand.id
benefit-redemptions, benefit redeem
item.brandName
item.brand.name
enefit-redemptions, benefit redeem
item.brand.logoUrl
Giữ nguyên
—
res.brand.status
Đã bỏ
brand-loyalties
res.brand.totalCustomer
Đã bỏ
brand-loyalties
res.brand.createdByUserId
Đã bỏ
brand-loyalties
res.brand.approvedByUserId
Đã bỏ
brand-loyalties
res.brand.approvedAt
Đã bỏ
brand-loyalties
res.brand.createdAt
Đã bỏ
brand-loyalties
res.brand.updatedAt
Đã bỏ
brand-loyalties
response.data[i]
response.data.items[i]
benefit-redemptions (pagination)




