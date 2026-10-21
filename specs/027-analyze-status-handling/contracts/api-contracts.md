# API Contracts: Đồng bộ và xử lý toàn diện trạng thái phân tích ảnh trang phục AI

**Feature**: `027-analyze-status-handling`
**Date**: 2026-10-03
**Status**: Completed

## 1. Wardrobe Personal APIs

### 1.1 Phân tích lại món đồ cá nhân (`retry-analysis`)

- **Endpoint**: `POST /api/v1/wardrobe-items/{id}/retry-analysis`
- **Mục đích**: Gửi yêu cầu phân tích lại cho món đồ đang ở trạng thái lỗi tạm thời hoặc cần rà soát danh mục.

#### Request

- **Path Parameters**:
  - `id`: UUID của món đồ trong tủ đồ (`WardrobeItem.id`)
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <access_token>`
- **Body**:

```json
{
  "categoryId": "123e4567-e89b-12d3-a456-426614174000"
}
```

> **Quy tắc**:
> - Nếu món đồ đang ở trạng thái `NeedsReview` (5): Trường `categoryId` là **BẮT BUỘC**.
> - Nếu món đồ đang ở trạng thái `Failed` (4) do lỗi tạm thời: Trường `categoryId` là **TÙY CHỌN** (có thể bỏ qua hoặc gửi null).

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Yêu cầu phân tích lại trang phục đã được gửi thành công",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "status": 3,
    "isLocked": false,
    "taskId": "987fcdeb-51a2-43f1-b890-123456789abc",
    "fashionItem": {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "imageUrl": "https://res.cloudinary.com/.../image.png",
      "color": null,
      "colorHex": null,
      "reviewReason": null,
      "processingErrorReason": null
    }
  }
}
```

#### Mã lỗi thường gặp

- **400 Bad Request**:
  - Thử lại món `NeedsReview` nhưng không gửi kèm `categoryId` hoặc `categoryId` không hợp lệ.
  - Thử lại món đang ở trạng thái không cho phép (`Processing` hoặc `InWardrobe`).
  - Thử lại món thất bại do ảnh không hợp lệ (`multiple_items_detected`, `full_body_outfit_detected`, `no_fashion_item_detected`).
- **404 Not Found**: Món đồ không tồn tại hoặc đã bị xóa.

---

### 1.2 Luồng sự kiện thời gian thực Tủ đồ (`SSE`)

- **Endpoint**: `GET /api/v1/wardrobe-items/tasks/{taskId}/sse`
- **Headers**:
  - `Accept: text/event-stream`
  - `Cache-Control: no-cache`

#### Payload Event (`data: {...}`)

```json
{
  "itemId": "123e4567-e89b-12d3-a456-426614174001",
  "status": "processing | completed | failed | needs_review",
  "total": 1,
  "index": 0,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "status": 0,
    "fashionItem": {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "category": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Áo sơ mi",
        "slug": "ao-so-mi"
      },
      "imageUrl": "https://res.cloudinary.com/.../image.png",
      "color": "trắng",
      "colorHex": "#ffffff",
      "style": "thanh lịch",
      "material": "cotton",
      "reviewReason": null,
      "processingErrorReason": null
    }
  },
  "error": null
}
```

> **Lưu ý**:
> - Khi `status` là `"failed"`: trường `error` chứa mã lý do (ví dụ: `"no_fashion_item_detected"`, `"multiple_items_detected"`, `"analysis_temporary_error"`).
> - Khi `status` là `"needs_review"`: trường `data.fashionItem.reviewReason` chứa `"uncertain_category"`.

---

## 2. Brand Portal APIs

### 2.1 Phân tích lại sản phẩm nhãn hàng

- **Endpoint**: `POST /api/v1/brand-portal/brands/{brandId}/items/{itemId}/retry-analysis`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <access_token>`
- **Body**:

```json
{
  "categoryId": "123e4567-e89b-12d3-a456-426614174000"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "message": "Yêu cầu phân tích lại sản phẩm đã được gửi thành công",
  "data": {
    "id": "uuid-item",
    "brandId": "uuid-brand",
    "status": "draft",
    "taskId": "uuid-task",
    "fashionItem": {
      "id": "uuid-fashion-item",
      "imageUrl": "https://...",
      "colorHex": null,
      "reviewReason": "uncertain_category",
      "processingErrorReason": null
    }
  }
}
```

### 2.2 Luồng sự kiện thời gian thực Nhãn hàng (`SSE`)

- **Endpoint**: `GET /api/v1/brand-portal/brands/{brandId}/items/tasks/{taskId}/sse`
- Format tương tự Wardrobe SSE.
