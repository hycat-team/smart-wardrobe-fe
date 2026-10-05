# Research & Technical Decisions: Đồng bộ và xử lý toàn diện trạng thái phân tích ảnh trang phục AI

**Feature**: `027-analyze-status-handling`
**Date**: 2026-10-03
**Status**: Completed

## 1. Nghiên cứu & Quyết định Kiến trúc

### Quyết định 1: Phân loại mã lý do (Reason Codes) và cơ chế Gate hành động "Thử lại"

- **Quyết định**:
  - Tạo bảng ánh xạ mã lý do chuẩn hóa tại `src/features/wardrobe/utils/analysis-status.ts` (hoặc types):
    - `no_fashion_item_detected` (Mới - Delta 2026-10-01): Nhóm lỗi ảnh không phải trang phục. Text: *"Ảnh không phải trang phục — hãy tải ảnh đúng món đồ"*. Nút "Thử lại": **ẨN**.
    - `multiple_items_detected`: Nhóm lỗi ảnh nhiều món. Text: *"Ảnh có nhiều món — tải ảnh khác"*. Nút "Thử lại": **ẨN**.
    - `full_body_outfit_detected`: Nhóm lỗi ảnh toàn thân. Text: *"Ảnh toàn thân — tải ảnh cận một món"*. Nút "Thử lại": **ẨN**.
    - `uncertain_category`: Nhóm cần rà soát danh mục. Text: *"AI chưa chắc danh mục — chọn danh mục rồi gửi phân tích lại"*. Nút "Thử lại": **BẮT BUỘC KÈM `categoryId`**.
    - `analysis_temporary_error`: Lỗi tạm thời phía AI/hệ thống. Text: *"Lỗi tạm thời — thử lại"*. Nút "Thử lại": **HIỆN**.
    - `auto_retry_exceeded`: Đã thử tự động tối đa lần nhưng không thành công. Text: *"Đã thử nhiều lần — thử lại"*. Nút "Thử lại": **HIỆN**.
    - Mã lạ: Hiển thị thông báo dự phòng mặc định: *"AI chưa thể nhận diện trang phục này. Vui lòng thử lại hoặc tải ảnh khác."*
  - Đọc mã lý do: Luôn đọc tại `data.fashionItem.reviewReason` hoặc `data.fashionItem.processingErrorReason` (camelCase) và fallback sang `payload.error` từ SSE event.
- **Lý do**:
  - Backend đã cập nhật Delta 2026-10-01: ảnh không có trang phục giờ trả `no_fashion_item_detected` thay vì bị báo nhầm là `multiple_items_detected`.
  - Backend sẽ từ chối 400 nếu client gửi yêu cầu retry cho các mã ảnh không hợp lệ (vì cùng 1 ảnh thì AI vẫn sẽ nhận diện không hợp lệ). Ẩn nút "Thử lại" sẽ loại bỏ triệt để các lỗi 400 và trải nghiệm thử lại vô hạn.
- **Các giải pháp thay thế đã xem xét**:
  - Cho phép người dùng bấm "Thử lại" cho mọi mã lỗi: Bị bác bỏ vì backend trả 400, tạo trải nghiệm ức chế.
  - Tự động xóa món khi phân tích lỗi: Bị bác bỏ vì người dùng cần xem lại ảnh gốc để biết vì sao lỗi và tự quyết định xóa hoặc tải ảnh khác.

---

### Quyết định 2: Sửa lỗi đếm sự kiện sớm trong `subscribeTaskSSE`

- **Quyết định**:
  - Tách biệt biến đếm sự kiện: Phân biệt rõ giữa sự kiện tiến trình (`status: "processing"`) và sự kiện trạng thái kết thúc (`completed`, `failed`, `needs_review`).
  - Trong `wardrobeApi.subscribeTaskSSE`:
    - Chỉ tăng biến đếm kết thúc `terminalProcessedCount` khi `isTerminalStatus` là `true`.
    - Hoặc theo dõi tập hợp các `itemId` đã hoàn tất `completedItemIds = new Set<string>()`.
    - Chỉ gọi `onDone()` và đóng stream khi `terminalProcessedCount >= totalItems` (hoặc khi stream kết thúc tự nhiên `done: true` từ phía server).
- **Lý do**:
  - Trong code hiện tại: `processedCount++` được gọi ở mọi frame nhận được kể cả `status: "processing"`.
  - Khi người dùng upload 1 ảnh (`totalItems = 1`), sự kiện đầu tiên server gửi là `status: "processing"`. Biến đếm `processedCount` tăng lên 1, thỏa mãn `processedCount >= totalItems`, dẫn đến việc gọi `onDone()` và `reader.cancel()` ngay lập tức. Client bị ngắt kết nối trước khi sự kiện `completed` hoặc `failed` kịp gửi về!
- **Các giải pháp thay thế đã xem xét**:
  - Bỏ hoàn toàn logic tự đóng client và chỉ chờ `reader.read()` trả `done: true`: Vẫn duy trì kiểm tra `terminalProcessedCount >= totalItems` làm điều kiện an toàn, nhưng chỉ kích hoạt khi thực sự nhận đủ các trạng thái kết thúc.

---

### Quyết định 3: Xử lý luồng rà soát danh mục (`needs_review`) & đón nhận kết quả thất bại (BC-3)

- **Quyết định**:
  - Cập nhật hàm gọi API `retryWardrobeItemAnalysis(id: string, data?: { categoryId?: string })`: nhận thêm body tùy chọn `{ categoryId }`.
  - Cập nhật mutation hook `useRetryWardrobeItemAnalysis`: hỗ trợ truyền `categoryId`.
  - Trên màn hình chi tiết món đồ (`WardrobeItemDetailClient.tsx`):
    - Khi món có `item.status === WardrobeItemStatus.NeedsReview`:
      - Hiển thị giao diện rà soát danh mục: danh sách danh mục dropdown/combobox và nút "Gửi phân tích lại".
      - Nút "Gửi phân tích lại" bị disable cho đến khi người dùng chọn category hợp lệ.
      - Khi bấm nút: gọi mutation `retryWardrobeItemAnalysis({ id: itemId, categoryId })`.
      - Sau khi gọi thành công: backend trả về `taskId` và `status: 3` (`processing`).
      - Client cập nhật trạng thái món sang `Processing`, subscribe SSE qua `useWardrobeSSE` với `taskId`.
      - **Quan trọng (BC-3)**: Không tự ý chuyển trạng thái sang `InWardrobe` hay coi như đã xong. Chờ kết quả qua SSE:
        - Nếu SSE trả về `completed`: cập nhật món sang `InWardrobe`, toast thông báo thành công.
        - Nếu SSE trả về `failed` (với mã `no_fashion_item_detected`, `multiple_items_detected`, hoặc `full_body_outfit_detected`): hiển thị giao diện thất bại và hướng dẫn tải ảnh khác.
- **Lý do**:
  - Theo Delta 2026-10-01 (BC-3), backend đã bổ sung kiểm tra ảnh cho cả nhánh fixed-category retry. Nếu ảnh ban đầu thực sự không phải trang phục hoặc ảnh toàn thân, backend sẽ trả `failed`. Frontend bắt buộc phải lắng nghe kết quả thay vì điều hướng hay coi như thành công ngay.
- **Các giải pháp thay thế đã xem xét**:
  - Cho phép người dùng tự điền mọi thuộc tính qua form mà không cần AI phân tích lại: Backend không hỗ trợ endpoint PATCH cho các trường thuộc tính do AI sinh ra (`color`, `style`, `material`, `pattern`...), chỉ chấp nhận danh mục và giá. Do đó bắt buộc phải gọi `retry-analysis` với danh mục cố định.

---

### Quyết định 4: Cơ chế dự phòng khi đứt kết nối Realtime (Resilience & Best-effort)

- **Quyết định**:
  - Giữ nguyên kiến trúc Reconnect của `useWardrobeSSE`:
    - Khi component mount hoặc `items` thay đổi, quét các item có trạng thái `Processing` và `taskId`.
    - Tạo kết nối SSE tương ứng nếu chưa có trong `activeControllers`.
    - Khi SSE hoàn tất hoặc gặp lỗi, luôn kích hoạt `queryClient.invalidateQueries` và `refetchQueries` cho danh sách tủ đồ.
  - Bổ sung cơ chế fallback polling nhẹ / timeout: nếu item ở trạng thái `Processing` quá 15 giây mà không có sự kiện mới, kích hoạt refetch danh sách để đối chiếu trạng thái thực từ DB.
- **Lý do**:
  - SSE là best-effort qua mạng HTTP. Khi mạng chập chờn hoặc người dùng chuyển tab, sự kiện có thể bị mất. Cơ chế refetch đảm bảo không có món nào kẹt mãi ở "Đang xử lý".

---

### Quyết định 5: Đồng bộ trạng thái sản phẩm cho Brand Portal

- **Quyết định**:
  - Bổ sung hàm API `retryBrandItemAnalysis: (brandId: string, itemId: string, data?: { categoryId?: string })` vào `src/features/brand-portal/api/brand-portal.api.ts`.
  - Cập nhật `useBrandItemSSE.ts` để phân biệt các mã lý do lỗi, hiển thị toast tiếng Việt chuẩn hóa tương tự wardrobe cá nhân.
  - Chặn thao tác chuyển trạng thái thủ công (`PATCH /status`) đối với sản phẩm đang có trạng thái `failed`.
- **Lý do**:
  - Đảm bảo tính nhất quán trên toàn hệ thống và tuân thủ mục 2.2 và 2.4 của `frontend-guide.md`.
