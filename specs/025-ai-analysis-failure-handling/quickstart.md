# Quickstart: Hướng dẫn Kiểm chứng Luồng xử lý lỗi AI phân tích ảnh

**Feature**: `025-ai-analysis-failure-handling`
**Date**: 2026-09-28
**Status**: Completed

---

## 1. Mục đích

Cung cấp các kịch bản kiểm thử độc lập, thực thi nhanh để xác nhận toàn bộ vòng đời xử lý khi AI phân tích ảnh thất bại: hiển thị trạng thái, thông báo realtime, và 3 lối thoát phục hồi (thử lại / phân loại thủ công / xóa).

---

## 2. Kiểm chứng Tự động (Unit Tests)

### Lệnh thực thi

```bash
npm test -- src/features/wardrobe/utils/wardrobe-status.test.ts src/features/wardrobe/hooks/useWardrobeSSE.test.tsx
```

### Các ca kiểm thử cần đạt Pass

1. **`normalizeStatus` / `isFailedStatus` / `isNeedsReviewStatus` / `isProcessingStatus`**:
   - `4`, `"Failed"`, `"failed"`, `WardrobeItemStatus.Failed` → `isFailedStatus === true`.
   - `5`, `"NeedsReview"`, `"needs_review"` → `isNeedsReviewStatus === true`.
   - `3`, `"Processing"`, `"processing"` → `isProcessingStatus === true`.
2. **`getFailureMessage`**:
   - `INVALID_IMAGE_RESOLUTION` → message về ảnh mờ/quá nhỏ.
   - `UNSUPPORTED_FILE_TYPE` → message định dạng không hỗ trợ.
   - `QUOTA_EXCEEDED` → message vượt hạn mức.
   - `PROCESSING_TIMEOUT` → message xử lý quá lâu.
   - `UNKNOWN_ERROR` / undefined → fallback "AI chưa thể nhận diện trang phục này.".
3. **`summarizeBatchResults`**:
   - `[InWardrobe, Failed, Failed, NeedsReview]` → `{ total: 4, completed: 1, failed: 2, needsReview: 1 }`.
4. **`getRecoveryActions`**:
   - `Failed` → gồm Thử lại, Phân loại thủ công, Xóa.
   - `NeedsReview` → gồm Phân loại thủ công, Xóa (không có Thử lại nếu quyết định vậy; ghi rõ trong test theo hợp đồng).
   - `InWardrobe` → rỗng.
5. **`useWardrobeSSE` — sự kiện `failed`**:
   - Gọi `onMessage({ itemId, status: 'failed', errorCode: 'INVALID_IMAGE_RESOLUTION', error: '...' })` → `toast.error` được gọi với message thân thiện; cache list item chuyển `status = Failed`.
   - Cùng `taskId` gửi thêm event `failed` → `toast.error` **không** gọi lần 2 (dedupe).
6. **`useWardrobeSSE` — sự kiện `needs_review`**:
   - `onMessage({ itemId, status: 'needs_review', data: {...} })` → `toast.info` được gọi; cache item chuyển `status = NeedsReview`.

> Tái sử dụng harness test hiện có trong `useWardrobeSSE.test.tsx` (QueryClient + mock `subscribeTaskSSE` + mock `sonner`).

---

## 3. Kiểm chứng Trực quan trên Giao diện (Manual UI Walkthrough)

### Điều kiện tiên quyết

- Dev server chạy (`npm run dev`) và đăng nhập tài khoản có quyền upload.
- Backend hỗ trợ tạo item ở trạng thái `Failed`/`NeedsReview` (hoặc dùng mock/dev tool).

### Kịch bản 1: Món lỗi hiển thị đúng ở danh sách + thử lại thành công

1. Chuẩn bị một món có trạng thái `Failed` (upload ảnh mờ/không hợp lệ hoặc seed data).
2. Mở `/wardrobe` → thấy badge **"Phân tích thất bại"** trên thẻ, ảnh gốc vẫn rõ nét.
3. Hover thẻ → menu hành động → bấm **"Thử lại"** → nút chuyển spinner/disabled, món chuyển sang "AI ĐANG XỬ LÝ".
4. Chờ kết quả: nếu thành công món về trạng thái bình thường + toast thành công; nếu lỗi lại, badge thất bại hiển thị lại, không mất ảnh.

### Kịch bản 2: Thông báo realtime khi đang xem danh sách

1. Upload ảnh rồi **ở lại trang `/wardrobe`** (không điều hướng).
2. Giả lập sự kiện phân tích thất bại (backend/mock).
3. **Xác nhận**: toast lỗi thân thiện hiện ra trong vòng vài giây, thẻ món chuyển sang trạng thái lỗi mà không cần tải lại trang.

### Kịch bản 3: Batch upload lỗi một phần

1. Upload 3 ảnh (ví dụ: 2 ảnh hợp lệ, 1 ảnh lỗi).
2. **Xác nhận**: 2 ảnh hợp lệ về trạng thái bình thường, 1 ảnh lỗi hiển thị badge thất bại; không bị đánh dấu sai toàn bộ; có bản tin tóm tắt (nếu triển khai batch summary).

### Kịch bản 4: Phân loại thủ công cho món lỗi / cần xem lại

1. Mở món `Failed` hoặc `NeedsReview` từ danh sách.
2. Bấm **"Phân loại thủ công"** (hoặc vào `/wardrobe/item/:id/edit`).
3. Chọn danh mục + nhập thuộc tính cơ bản → Lưu.
4. **Xác nhận**: món về trạng thái `InWardrobe`, hiển thị dữ liệu thủ công trên trang chi tiết và danh sách.

### Kịch bản 5: Xóa món lỗi

1. Từ danh sách, mở menu hành động trên món lỗi → **Xóa** → xác nhận AlertDialog.
2. **Xác nhận**: món biến mất khỏi danh sách ngay và sau khi tải lại trang vẫn không xuất hiện.

### Kịch bản 6: Detail banner — lý do + số lần thử + needs_review

1. Mở trang chi tiết món `Failed` → banner hiển thị lý do thân thiện (ví dụ "Ảnh quá mờ..."), nút "Thử phân tích lại" và "Phân loại thủ công".
2. Thử lại nhiều lần → số lần thử (nếu có) tăng, nút disabled khi đang chạy.
3. Mở món `NeedsReview` → banner khác biệt "Cần chọn lại danh mục", không nhầm với banner thất bại.

### Kịch bản 7: Phục hồi sau mất kết nối (idempotency)

1. Để món đang `Processing`, tải lại trang (hoặc để mất mạng rồi quay lại).
2. **Xác nhận**: trang hiển thị trạng thái cuối đúng (thành công/lỗi), không kẹt mãi ở "AI ĐANG XỬ LÝ".

---

## 4. Kiểm tra Chất lượng Code

```bash
npm run lint
npm test
```

- Lint 0 lỗi, toàn bộ test suite pass (không phá vỡ test hiện có của `useWardrobeSSE`).