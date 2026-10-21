# Research & Architecture Decisions: Luồng xử lý khi AI phân tích ảnh lỗi

**Feature**: `025-ai-analysis-failure-handling`
**Date**: 2026-09-28
**Status**: Completed

---

## 1. Bối cảnh & Hiện trạng Xử lý Lỗi

### 1.1 Hiện trạng mã nguồn liên quan

| Thành phần | Vai trò | Xử lý trạng thái lỗi hiện tại |
| :--- | :--- | :--- |
| `types/index.ts` | Enum `WardrobeItemStatus` (0 InWardrobe, 1 Selling, 2 Sold, 3 Processing, 4 Failed, 5 NeedsReview) | Đã đầy đủ; `AnalyzeTaskStatusType` = `completed \| failed \| needs_review \| string` |
| `api/wardrobe.api.ts` | `subscribeTaskSSE` (bộ đọc RFC 8895), `retryWardrobeItemAnalysis` → `POST /wardrobe-items/:id/retry-analysis`, `updateWardrobeItem` → `PUT /wardrobe-items/:id/manual-classify` | Bộ đọc đã xử lý `event: done/error/ping` + fallback `message`; nhận diện terminal status |
| `hooks/useWardrobeSSE.ts` | Theo dõi item Processing, subscribe SSE, optimistic cache, toast | Đã có nhánh `failed` (toast lỗi + cache `Failed`) và `needs_review` (toast.info + cache `NeedsReview`) |
| `components/WardrobeCard.tsx` | Thẻ món đồ trong danh sách | **Chưa có** props/nhánh hiển thị `Failed` hay `NeedsReview` |
| `components/WardrobeClient.tsx` | Màn hình danh sách tủ đồ | Chỉ tính `isProcessing`; **không** tính cờ failed/needsReview để truyền xuống thẻ |
| `item/[id]/components/WardrobeItemDetailClient.tsx` | Trang chi tiết | Đã có badge "Phân tích thất bại" + banner retry + nút "Thử phân tích lại" (disabled khi `isPending`) |
| `item/[id]/components/WardrobeItemEditClient.tsx` | Form chỉnh sửa / phân loại thủ công | Đã có form `manual-classify` đầy đủ (danh mục, màu, chất liệu, fit, họa tiết, mùa, phong cách, giá) |
| `queries/wardrobe.queries.ts` | `useRetryWardrobeItemAnalysis`, `useBulkDeleteWardrobeItems`, `useUpdateWardrobeItem` | Đã có mutations; retry chưa invalidate `detail` cache |

### 1.2 Khoảng trống chính (Gap Analysis)

1. **Danh sách tủ đồ không hiển thị trạng thái lỗi**: `WardrobeCard` không nhận cờ `Failed`/`NeedsReview` → món lỗi trông giống món bình thường, vi phạm FR-001 và SC-001.
2. **Không có hành động phục hồi ngay trên thẻ**: người dùng phải bấm vào món (nếu biết nó lỗi) rồi mới thấy nút thử lại; chưa có lối tắt "Phân loại thủ công" cho món cần xem lại.
3. **Thông báo lỗi SSE dùng message thô của backend**: `payload.error` có thể chứa mã lỗi kỹ thuật; chưa có ánh xạ `errorCode` → thông điệp tiếng Việt thân thiện (vi phạm FR-002).
4. **Thiếu tóm tắt kết quả batch**: khi upload nhiều ảnh, nếu một phần lỗi, hệ thống chỉ toast từng món, chưa có bản tin gộp "X/Y ảnh lỗi" (liên quan FR-010).
5. **Không có số lần thử lại / lý do thất bại trên UI chi tiết**: banner hiện tại chỉ nói "AI chưa thể nhận diện", chưa hiển thị lý do thân thiện và số lần thử (FR-012).
6. **Toast lỗi có thể trùng lặp**: cùng một task gửi nhiều event `failed` sẽ toast nhiều lần (FR-005 phòng trùng).

### 1.3 Chuẩn SSE Production (từ `docs/Doccument-SSE.md`)

- Event `error` phải kèm `errorCode` (ví dụ: `INVALID_IMAGE_RESOLUTION`, `UNSUPPORTED_FILE_TYPE`, `QUOTA_EXCEEDED`, `PROCESSING_TIMEOUT`, `UNKNOWN_ERROR`) và `message` thân thiện.
- Heartbeat `ping` mỗi 15–30s chống 504 gateway.
- Idempotency: server đẩy ngay trạng thái hiện tại khi client mới kết nối.
- Ownership: backend xác thực `taskId` thuộc user, trả 404 nếu không khớp.

> `docs/Note.md` ghi nhận một phần các chuẩn này chưa được backend áp dụng đầy đủ (event types, heartbeat, ownership, idempotency). Các hạng mục backend đó **nằm ngoài phạm vi spec này**; frontend phải xử lý an toàn cả khi backend gửi payload cũ (event `message`, status lowercase) lẫn payload chuẩn mới.

---

## 2. Các Quyết định Thiết kế (Decisions)

### Decision 1: Module pure functions `wardrobe-status.ts`

- **Decision**: Tách toàn bộ logic trạng thái/thông báo thành module thuần túy trong `src/features/wardrobe/utils/wardrobe-status.ts`.
- **Rationale**: Pattern tương tự đã được repo áp dụng (xem `outfit-canvas-layout.ts` ở feature 024) — pure function tách khỏi lifecycle, test dễ dàng, tránh lặp logic rải rác trong component. Giảm rủi ro render-test phức tạp cho phần quyết định trạng thái.
- **Alternatives considered**:
  - Logic trực tiếp trong component/hook: loại bỏ vì khó test và dễ lệch giữa các màn hình (danh sách vs chi tiết).
  - Thư viện state machine ngoài: loại bỏ vì thêm dependency không cần thiết cho phạm vi nhỏ.

### Decision 2: Ánh xạ mã lỗi → thông điệp thân thiện (errorCode mapping)

- **Decision**: `getFailureMessage(errorCode?, fallback?)` trả thông điệp tiếng Việt thân thiện theo bảng:
  - `INVALID_IMAGE_RESOLUTION` → "Ảnh quá mờ hoặc quá nhỏ, vui lòng tải ảnh rõ nét hơn."
  - `UNSUPPORTED_FILE_TYPE` → "Định dạng ảnh không được hỗ trợ."
  - `QUOTA_EXCEEDED` → "Bạn đã vượt hạn mức phân tích hôm nay."
  - `PROCESSING_TIMEOUT` → "Thời gian phân tích quá lâu, vui lòng thử lại."
  - `UNKNOWN_ERROR` / thiếu mã → fallback "AI chưa thể nhận diện trang phục này."
  - `needs_review` → "Một số hình ảnh cần bạn chọn lại danh mục."
- **Rationale**: Chuẩn `docs/Doccument-SSE.md` quy định frontend xử lý `errorCode` để hiển thị đúng theo loại lỗi. Giữ message mặc định tiếng Việt thống nhất với UI hiện tại.
- **Alternatives considered**: Hiển thị nguyên `payload.error` từ backend — loại bỏ vì có thể lộ chi tiết kỹ thuật và không nhất quán ngôn ngữ.

### Decision 3: Nâng cấp `useWardrobeSSE` với dedupe + tóm tắt batch

- **Decision**: Duy trì cấu trúc hook hiện có; thêm (a) dedupe toast lỗi theo `taskId`, (b) tóm tắt kết quả batch khi nhiều món kết thúc trong một lần theo dõi.
- **Rationale**: Giữ nguyên kiến trúc RFC 8895 reader và optimistic cache đã hoạt động; chỉ thêm lớp chuyển đổi trạng thái → thông báo. Dedupe tránh spam toast (FR-005); summary nâng trải nghiệm batch (FR-010).
- **Alternatives considered**: Viết lại hook bằng `EventSource` — loại bỏ vì mất hỗ trợ AbortController/cookie như hiện tại và chệch chuẩn đã có.

### Decision 4: Hiển thị trạng thái + menu hành động trên thẻ danh sách

- **Decision**: `WardrobeCard` nhận thêm props `statusFailed`/`statusNeedsReview`; khi `true` hiển thị overlay badge và cho phép DropdownMenu hành động (Thử lại / Phân loại thủ công / Xóa) từ `WardrobeClient`.
- **Rationale**: Đáp ứng trực tiếp FR-001, FR-003, FR-006, FR-007, FR-008 tại đúng nơi người dùng nhìn thấy món đầu tiên. Ảnh gốc vẫn render (không blur như Processing) để người dùng ra quyết định.
- **Alternatives considered**: Chỉ hiện badge không kèm hành động — loại bỏ vì chưa đủ "lối thoát" theo FR; buộc đi qua trang chi tiết cho mọi hành động — giữ làm fallback (click vào thẻ vẫn mở chi tiết).

### Decision 5: Detail banner nâng cấp (lý do + số lần thử + CTA phân loại thủ công)

- **Decision**: Banner thất bại trên trang chi tiết hiển thị lý do thân thiện qua `getFailureMessage`, số lần thử lại (nếu backend trả), và thêm nút "Phân loại thủ công" bên cạnh "Thử phân tích lại". Banner riêng cho trạng thái `NeedsReview`.
- **Rationale**: Đáp ứng FR-003, FR-006, FR-011, FR-012; tận dụng form `manual-classify` đã có.
- **Alternatives considered**: Mở modal phân loại ngay trên trang chi tiết — loại bỏ vì trùng form edit hiện có; giữ định tuyến `/edit` để tránh nhân đôi UI.

---

## 3. Ràng buộc Kỹ thuật Được Giữ Nguyên

- Bộ đọc SSE RFC 8895 trong `wardrobe.api.ts` giữ nguyên (tách `\n\n`, nối multi-line `data:`, bỏ qua `ping`, tự đóng stream khi terminal).
- Enum `WardrobeItemStatus` giữ nguyên giá trị số để tương thích backend.
- Pattern trạng thái "lỏng" hiện có (`status === 3`, `"Processing"`, `"processing"`) được gói lại trong pure functions để các màn hình dùng chung thay vì rải rác `as any`.
- Không thêm dependency mới; chỉ dùng các thư viện đã có trong `package.json`.

---

## 4. Kết luận

Giải pháp gồm 4 nhóm thay đổi nhỏ, có thể bàn giao độc lập:
1. Pure functions `wardrobe-status.ts` (nền tảng).
2. Nâng cấp hook `useWardrobeSSE` (realtime + thông báo thân thiện + dedupe + batch summary).
3. Thẻ danh sách hiển thị trạng thái + menu phục hồi.
4. Banner chi tiết nâng cấp (lý do, số lần thử, CTA phân loại thủ công, trạng thái needs_review).

Toàn bộ quyết định đều giữ nguyên kiến trúc feature-folder hiện có, không thêm service, không phụ thuộc backend mới.