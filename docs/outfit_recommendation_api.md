# Tài Liệu Tích Hợp API: Đề Xuất Phối Đồ Bằng AI (AI Stylist Outfit Recommendation)

Tài liệu này cung cấp hướng dẫn ngắn gọn cho Frontend (FE) về luồng gửi Request, nhận Response và giải nghĩa các trường dữ liệu của API **Đề xuất phối đồ bằng AI**.

---

## 1. Thông Tin Chung (Endpoint Info)

- **HTTP Method**: `POST`
- **URL Path**: `/api/v1/ai/outfit-recommendations`
- **Authentication**: Tự động thông qua HTTP-only Cookie (Trình duyệt tự động đính kèm `accessToken` cookie)
- **Headers**: 
  - `Content-Type: application/json`

---

## 2. Cấu Trúc Request (Body JSON)

Yêu cầu đề xuất phối đồ hỗ trợ các bộ lọc và tùy chỉnh sau (tất cả các trường đều **không bắt buộc** - nullable):

```json
{
  "occasion": "work",
  "styleTarget": "minimalist",
  "season": "summer",
  "weather": "hot",
  "colorTone": "light",
  "details": "Mặc đi làm công sở lịch sự nhưng vẫn thoải mái"
}
```

### Giải nghĩa các trường:
- **`occasion`** *(string | null)*: Dịp phối đồ. Gợi ý: `"casual"` (dạo phố), `"work"` (đi làm), `"date"` (hẹn hò), `"party"` (tiệc tùng), `"sport"` (thể thao)... hoặc có thể nhập tùy ý.
- **`styleTarget`** *(string | null)*: Phong cách hướng tới. Gợi ý: `"minimalist"` (tối giản), `"streetwear"` (đường phố), `"elegant"` (thanh lịch), `"vintage"` (cổ điển)... hoặc nhập tùy ý.
- **`season`** *(string | null)*: Mùa phối đồ. Chỉ chấp nhận các giá trị: `"spring"`, `"summer"`, `"autumn"`, `"winter"`, hoặc `"all"`.
- **`weather`** *(string | null)*: Thời tiết hiện tại. Gợi ý: `"hot"` (nóng), `"cold"` (lạnh), `"rainy"` (mưa)...
- **`colorTone`** *(string | null)*: Tông màu chủ đạo. Gợi ý: `"light"` (sáng), `"dark"` (tối), `"pastel"`, `"earthy"` (tông đất)...
- **`details`** *(string | null)*: Mô tả/Ghi chú tự do bằng chữ (ví dụ: *"Có kèm blazer"* hoặc *"Tránh quần short"*).

---

## 3. Cấu Trúc Response (JSON)

Dữ liệu trả về tuân theo định dạng chuẩn của hệ thống (`shared_pres.APIResponse`):

```json
{
  "success": true,
  "message": "Tạo gợi ý phối đồ thành công",
  "data": {
    "title": "Minimalist Work Outfit",
    "explanation": "Bộ đồ này được thiết kế theo phong cách tối giản dành cho môi trường công sở vào ngày hè nóng. Chiếc áo sơ mi trắng chất liệu cotton mỏng nhẹ giúp bạn luôn mát mẻ nhưng vẫn giữ được nét thanh lịch cần thiết khi kết hợp cùng quần âu đen dáng suông.",
    "items": [
      {
        "role": "áo",
        "primary": {
          "id": "76ba1810-bb25-4c07-96a9-082df7cf840f",
          "userId": "d748f30b-905b-490f-9a22-f21278dce162",
          "imageUrl": "https://res.cloudinary.com/.../item1.jpg",
          "imagePublicId": "smart_wardrobe/items/item1",
          "color": "trắng",
          "colorHex": "#ffffff",
          "style": "minimalist",
          "material": "cotton",
          "pattern": "plain",
          "fit": "regular",
          "seasonality": "summer",
          "status": "in_wardrobe",
          "isLocked": false,
          "createdAt": "2026-06-10T12:00:00Z"
        },
        "alternatives": [
          {
            "id": "18ac29ab-7711-477d-94bb-902c31e9c20f",
            "userId": "d748f30b-905b-490f-9a22-f21278dce162",
            "imageUrl": "https://res.cloudinary.com/.../item2.jpg",
            "imagePublicId": "smart_wardrobe/items/item2",
            "color": "kem",
            "colorHex": "#f5f5dc",
            "style": "minimalist",
            "material": "linen",
            "pattern": "plain",
            "fit": "loose",
            "seasonality": "summer",
            "status": "in_wardrobe",
            "isLocked": false,
            "createdAt": "2026-06-10T12:05:00Z"
          }
        ]
      },
      {
        "role": "quần",
        "primary": {
          "id": "a24fa68b-968b-49dd-9a22-01553851c72e",
          "userId": "d748f30b-905b-490f-9a22-f21278dce162",
          "imageUrl": "https://res.cloudinary.com/.../item3.jpg",
          "imagePublicId": "smart_wardrobe/items/item3",
          "color": "đen",
          "colorHex": "#000000",
          "style": "formal",
          "material": "polyester",
          "pattern": "plain",
          "fit": "straight",
          "seasonality": "all",
          "status": "in_wardrobe",
          "isLocked": false,
          "createdAt": "2026-06-10T12:10:00Z"
        },
        "alternatives": []
      }
    ],
    "isFallback": false,
    "remainingQuota": 5
  }
}
```

### Giải nghĩa các trường dữ liệu trong `data`:
- **`title`**: Tiêu đề/Tên của set đồ gợi ý (do AI đặt tên tương ứng).
- **`explanation`**: Đoạn văn bản thuyết minh của AI Stylist giải thích lý do tại sao phối các món đồ này lại với nhau (phù hợp thời tiết, hoàn cảnh thế nào).
- **`isFallback`**: 
  - `false`: Gợi ý thành công dựa trên phân tích tủ đồ thật của người dùng.
  - `true`: Tủ đồ của người dùng quá ít món phù hợp, hệ thống chuyển sang trả về bộ trang phục mẫu có sẵn (fallback).
- **`remainingQuota`**: Số lượt sử dụng tính năng đề xuất phối đồ bằng AI còn lại trong ngày/tháng của người dùng (tùy thuộc gói VIP/Free).
- **`items`**: Danh sách các nhóm trang phục tạo nên set đồ gợi ý:
  - **`role`**: Vai trò của món đồ trong set (ví dụ: `"áo"`, `"quần"`, `"khoác"`, `"giày"`...).
  - **`primary`**: Món đồ chính được chọn để phối.
  - **`alternatives`**: Các món đồ khác có sẵn trong tủ đồ của user có cùng vai trò/loại có thể dùng thay thế cho món chính (danh sách này có thể rỗng `[]`).
