# Data Model & State Transitions: Đồng bộ và xử lý toàn diện trạng thái phân tích ảnh trang phục AI

**Feature**: `027-analyze-status-handling`
**Date**: 2026-10-03
**Status**: Completed

## 1. Data Types & Entities

### 1.1 Trạng thái Tủ đồ & Phân tích (`WardrobeItemStatus`)

```typescript
export enum WardrobeItemStatus {
  InWardrobe = 0,   // Món đồ sẵn sàng sử dụng trong tủ đồ
  Selling = 1,      // Đang đăng bán trên sàn
  Sold = 2,         // Đã bán thành công
  Processing = 3,   // Đang trong hàng đợi hoặc đang phân tích AI
  Failed = 4,       // Phân tích thất bại (ảnh không hợp lệ hoặc lỗi hệ thống)
  NeedsReview = 5,  // Cần người dùng rà soát và chọn danh mục hợp lệ
}
```

### 1.2 Nhóm mã lý do (Reason Codes)

```typescript
/**
 * Mã lý do rà soát danh mục (khi AI chắc chắn đúng 1 món nhưng chưa rõ phân loại)
 */
export type AnalyzeReviewReason = 'uncertain_category';

/**
 * Mã lý do thất bại phân tích ảnh (được trả về trong SSE hoặc data.fashionItem.processingErrorReason)
 */
export type AnalyzeErrorReason =
  | 'no_fashion_item_detected'  // Ảnh không có trang phục (chuột, điện thoại, sách, ảnh mờ...)
  | 'multiple_items_detected'   // Ảnh chụp nhiều món đồ cùng lúc
  | 'full_body_outfit_detected' // Ảnh chụp toàn thân người mẫu
  | 'analysis_temporary_error'  // Lỗi tạm thời phía dịch vụ AI
  | 'auto_retry_exceeded'       // Đã hết số lần tự động thử lại
  | string;                     // Dự phòng cho các mã tương lai
```

### 1.3 Cấu trúc Thực thể Thời trang (`FashionItemRes`)

```typescript
export interface FashionItemRes {
  id: string;
  category: CategoryRes;
  imageUrl: string;
  color: string;
  colorHex: string;
  colorHue: number;
  colorSaturation: number;
  colorLightness: number;
  style: string;
  material: string;
  pattern: string;
  fit: string;
  seasonality: string;
  description: string;
  reviewReason?: AnalyzeReviewReason | null;
  processingErrorReason?: AnalyzeErrorReason | null;
  createdAt: string;
  updatedAt: string;
}

export interface FashionItemBriefRes {
  id: string;
  imageUrl?: string;
  color?: string;
  colorHex?: string;
  style?: string;
  category?: CategoryBriefRes;
  reviewReason?: AnalyzeReviewReason | null;
  processingErrorReason?: AnalyzeErrorReason | null;
}
```

### 1.4 Dữ liệu sự kiện thời gian thực (`WardrobeTaskSSEPayload`)

```typescript
export type AnalyzeTaskStatusType =
  | 'processing'
  | 'completed'
  | 'failed'
  | 'needs_review'
  | string;

export interface WardrobeTaskSSEPayload {
  itemId: string;
  status: AnalyzeTaskStatusType;
  total: number;
  index: number;
  data?: WardrobeItemRes | WardrobeItemBriefRes | any;
  error?: AnalyzeErrorReason | string;
}
```

### 1.5 Dữ liệu yêu cầu phân tích lại (`RetryWardrobeItemReq`)

```typescript
export interface RetryWardrobeItemReq {
  categoryId?: string; // Bắt buộc truyền khi món đang ở trạng thái NeedsReview
}

export interface RetryWardrobeItemRes {
  id: string;
  status: WardrobeItemStatus.Processing; // 3
  isLocked: boolean;
  taskId: string;
  fashionItem?: FashionItemBriefRes;
}
```

---

## 2. State Machine & Transitions

### 2.1 Món đồ cá nhân (WardrobeItem)

```text
                        ┌───────────────────┐
                        │   Tải ảnh mới     │
                        │  (batch-upload)   │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │    Processing     │◄───────────────────┐
                        │    (status: 3)    │                    │
                        └─────────┬─────────┘                    │
                                  │                              │
         ┌────────────────────────┼────────────────────────┐     │
         ▼                        ▼                        ▼     │
┌─────────────────┐      ┌─────────────────┐      ┌──────────────┴──┐
│   InWardrobe    │      │     Failed      │      │   NeedsReview   │
│   (status: 0)   │      │   (status: 4)   │      │   (status: 5)   │
└─────────────────┘      └────────┬────────┘      └────────┬────────┘
  Sử dụng được                    │                        │
  trong phối đồ                   │                        │
                                  ├─ Lỗi tạm thời          │ Chọn category
                                  │  (Retry)               │ + Retry-analysis
                                  │                        │ (kèm categoryId)
                                  ├─ Ảnh không hợp lệ      │
                                  │  (Không retry,         │
                                  │   hướng dẫn tải khác)  │
                                  │                        │
                                  ▼                        ▼
                                [Xóa]                    [Xóa]
```

### 2.2 Quy tắc chuyển đổi trạng thái

| Trạng thái hiện tại | Sự kiện / Hành động | Điều kiện | Trạng thái tiếp theo | Ghi chú |
|---|---|---|---|---|
| Khởi tạo | `batch-upload` | Upload 1–5 ảnh | `Processing` (3) | Nhận `taskId` để subscribe SSE |
| `Processing` (3) | SSE event: `completed` | AI phân tích thành công | `InWardrobe` (0) | Cập nhật đầy đủ metadata, toast thành công |
| `Processing` (3) | SSE event: `needs_review` | AI nhận diện 1 món nhưng chưa chắc danh mục | `NeedsReview` (5) | Lý do luôn là `uncertain_category` |
| `Processing` (3) | SSE event: `failed` | Ảnh không hợp lệ hoặc lỗi tạm thời | `Failed` (4) | Nhận `error` là mã lý do |
| `NeedsReview` (5) | `retry-analysis` | Người dùng đã chọn `categoryId` | `Processing` (3) | Nhận `taskId` mới, tiếp tục lắng nghe SSE |
| `Processing` (3) sau khi retry NeedsReview | SSE event: `completed` | Ảnh hợp lệ, danh mục cố định | `InWardrobe` (0) | Hoàn tất phân tích |
| `Processing` (3) sau khi retry NeedsReview | SSE event: `failed` | Ảnh thực tế không dùng được (BC-3) | `Failed` (4) | Chuyển sang lỗi, ẩn retry, hướng dẫn tải ảnh khác |
| `Failed` (4) | `retry-analysis` | Mã lỗi là `analysis_temporary_error` hoặc `auto_retry_exceeded` | `Processing` (3) | Thử lại phân tích tự động |
| `Failed` (4) | Không cho phép | Mã lỗi là `no_fashion_item_detected`, `multiple_items_detected`, `full_body_outfit_detected` | Giữ nguyên `Failed` (4) | Ẩn nút "Thử lại", chỉ cho phép Xóa hoặc Tải ảnh khác |
| `Failed` (4) / `NeedsReview` (5) | `deleteWardrobeItem` | Người dùng chọn Xóa | Đã xóa | Biến mất khỏi danh sách |
