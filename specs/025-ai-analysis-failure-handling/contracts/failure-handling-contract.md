# Contract: Xử lý lỗi phân tích AI (Failure Handling Contract)

**Feature**: `025-ai-analysis-failure-handling`
**Date**: 2026-09-28
**Status**: Completed

---

## 1. Hợp đồng Dữ liệu SSE → Trạng thái UI

### 1.1 Nguồn sự kiện

- **Endpoint**: `GET /api/v1/wardrobe-items/tasks/:taskId/sse` (đã có trong `wardrobe.api.ts`).
- **Chuẩn**: RFC 8895; backend có thể gửi event name chuẩn (`done`/`error`/`progress`/`ping`) hoặc fallback `message` với `status` lowercase.

### 1.2 Bảng ánh xạ SSE → Trạng thái món

| SSE event / `status` | Ý nghĩa | Trạng thái món | Hành động UI |
| :--- | :--- | :--- | :--- |
| `event: done` hoặc `status: completed` | Phân tích thành công | `InWardrobe` (0) | Cập nhật dữ liệu món; toast thành công; invalidate lists/stats |
| `event: error` hoặc `status: failed` | Phân tích thất bại | `Failed` (4) | Toast lỗi thân thiện (`getFailureMessage`); cập nhật cache; invalidate |
| `status: needs_review` | Không chắc chắn | `NeedsReview` (5) | Toast.info "cần chọn lại danh mục"; cập nhật cache; invalidate |
| `event: ping` | Heartbeat | — | Bỏ qua hoàn toàn |
| Stream đóng (done) | Kết thúc tác vụ | — | Refetch active lists + stats |

### 1.3 Quy tắc chuyển đổi payload

- `errorCode` (nếu có) được chuẩn hóa về `AnalyzeFailureCode`; nếu thiếu/không biết → `UNKNOWN_ERROR`.
- Message hiển thị = `getFailureMessage(errorCode, payload.error)` — ưu tiên bảng ánh xạ, fallback về message backend nếu trống.
- Mọi event `failed` của cùng `taskId` trong một phiên theo dõi chỉ hiển thị **một** toast (dedupe).

---

## 2. Hợp đồng Module Thuần túy `wardrobe-status.ts`

```typescript
/**
 * src/features/wardrobe/utils/wardrobe-status.ts
 */

/** Chuẩn hóa mọi dạng giá trị trạng thái (enum số / chuỗi) về enum chuẩn */
export function normalizeStatus(raw: unknown): WardrobeItemStatus;

/** true nếu món đang chờ AI phân tích (status === 3, "Processing", "processing", 3) */
export function isProcessingStatus(status: unknown): boolean;

/** true nếu món phân tích thất bại (status === 4, "Failed", "failed") */
export function isFailedStatus(status: unknown): boolean;

/** true nếu món cần người dùng chọn lại danh mục (status === 5, "NeedsReview", "needs_review") */
export function isNeedsReviewStatus(status: unknown): boolean;

/** Ánh xạ mã lỗi nghiệp vụ → thông điệp tiếng Việt thân thiện */
export function getFailureMessage(errorCode?: AnalyzeFailureCode, fallback?: string): string;

/** Gom kết quả batch thành bản tin tóm tắt */
export function summarizeBatchResults(
  statuses: Array<WardrobeItemStatus | string>
): BatchAnalysisSummary;

/** Trả về các hành động phục hồi cho phép với một trạng thái */
export function getRecoveryActions(status: unknown): RecoveryAction[];
```

---

## 3. Hợp đồng Thẻ Danh sách (`WardrobeCard`)

```typescript
export interface WardrobeCardProps {
  item: WardrobeItemRes;
  isLocked: boolean;
  isProcessing: boolean;
  /** [NEW] Món phân tích thất bại → badge "Phân tích thất bại" */
  isFailed?: boolean;
  /** [NEW] Món cần xem lại → badge "Cần chọn danh mục" */
  isNeedsReview?: boolean;
  isSelectMode: boolean;
  isSelected: boolean;
  onClick: () => void;
  getWardrobeItemName: (item: WardrobeItemRes) => string;
  hideDetails?: boolean;
  hideTitle?: boolean;
  priority?: boolean;
  /** [NEW] DropdownMenu hành động phục hồi hiển thị khi isFailed/isNeedsReview */
  renderRecoveryMenu?: () => React.ReactNode;
}
```

### 3.1 Quy tắc hành vi

1. Ảnh gốc của món `Failed`/`NeedsReview` render **rõ nét** (không `blur`/`opacity` như `Processing`).
2. Badge overlay nằm ở vùng ảnh (trên cùng, tương tự badge "Đang bán" trên trang chi tiết).
3. Khi có `renderRecoveryMenu`, menu hiển thị trên hover (desktop) / chạm (mobile), **không** chặn click vào thẻ mở trang chi tiết.
4. Trạng thái `Failed`/`NeedsReview` không tương tác với chế độ chọn nhiều/xóa hàng loạt (vẫn cho phép chọn/xóa như món thường).

---

## 4. Hợp đồng Màn hình Danh sách (`WardrobeClient`)

- Tính `isFailed`/`isNeedsReview` từ `item.status` bằng pure functions (không dùng `as any` rải rác).
- Menu phục hồi trên thẻ lỗi gồm:
  - **Thử lại** — gọi `useRetryWardrobeItemAnalysis`; disabled + spinner khi `isPending`; invalidate lists + detail.
  - **Phân loại thủ công** — điều hướng `/wardrobe/item/:id/edit`.
  - **Xóa** — AlertDialog xác nhận → `useBulkDeleteWardrobeItems({ ids: [id] })` (hoặc `useDeleteWardrobeItem`).
- Sau khi bấm "Thử lại" thành công, món chuyển sang `Processing`; hook `useWardrobeSSE` tự bắt task mới.

---

## 5. Hợp đồng Trang Chi tiết (`WardrobeItemDetailClient`)

- Banner `Failed`:
  - Dòng 1: `getFailureMessage(errorCode)` — lý do thân thiện (fallback "AI chưa thể nhận diện trang phục này.").
  - Dòng 2: số lần thử lại (nếu backend/SSE cung cấp) — tối giản "Đã thử lại N lần".
  - Nút **"Thử phân tích lại"** (giữ nguyên, disabled khi `isPending`).
  - Nút **"Phân loại thủ công"** → `/wardrobe/item/:id/edit` (mới).
- Banner `NeedsReview`:
  - Thông điệp "AI chưa chắc chắn về danh mục. Bạn có thể chọn lại hoặc thử phân tích lại."
  - Nút **"Chọn danh mục"** → `/wardrobe/item/:id/edit`; nút **"Thử phân tích lại"**.
- Không đổi cấu trúc trang/navigation hiện có.

---

## 6. Endpoint Liên quan (không thay đổi)

| Endpoint | Phương thức | Mục đích |
| :--- | :--- | :--- |
| `/wardrobe-items/:id/retry-analysis` | POST | Thử phân tích lại (đã có) |
| `/wardrobe-items/:id/manual-classify` | PUT | Phân loại thủ công (đã có) |
| `/wardrobe-items/bulk` | DELETE | Xóa hàng loạt (đã có) |
| `/wardrobe-items/tasks/:taskId/sse` | GET | Theo dõi tiến trình (đã có) |