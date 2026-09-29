# Implementation Plan: Luồng xử lý khi AI phân tích ảnh lỗi (AI Analysis Failure Handling)

**Branch**: `025-ai-analysis-failure-handling` | **Date**: 2026-09-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/025-ai-analysis-failure-handling/spec.md`

---

## Summary

Hoàn thiện toàn bộ vòng đời xử lý khi AI phân tích ảnh trang phục thất bại trong module Tủ đồ (Wardrobe): từ lúc món đồ rơi vào trạng thái `Failed`/`NeedsReview`, hệ thống phải **hiển thị đúng trạng thái ở mọi màn hình** (danh sách tủ đồ, trang chi tiết), **thông báo thân thiện realtime** khi phân tích đang chạy bị lỗi, và **cung cấp 3 lối thoát phục hồi** cho người dùng: (1) thử phân tích lại không cần upload lại, (2) tự phân loại thủ công qua form chỉnh sửa sẵn có, (3) xóa món lỗi.

Hiện trạng cho thấy: trang chi tiết đã có banner thất bại + nút thử lại (`WardrobeItemDetailClient.tsx`), hook `useWardrobeSSE` đã bắt sự kiện `failed`/`needs_review` và cập nhật cache + toast. **Khoảng trống chính nằm ở màn hình danh sách tủ đồ**: `WardrobeCard` không nhận cờ `Failed`/`NeedsReview` nên món lỗi hiển thị giống món bình thường, không có hành động phục hồi ngay trên thẻ, và thông báo lỗi SSE còn dùng message thô của backend. Phần này sẽ lấp các khoảng trống đó bằng module hàm thuần túy (pure functions) + nâng cấp hook SSE + bổ sung trạng thái hiển thị và menu hành động trên thẻ.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 16 (App Router), React 19

**Primary Dependencies**: `@tanstack/react-query` (cache + invalidation + mutations), `sonner` (toast), `lucide-react` (icon), `radix-ui` `AlertDialog` / `DropdownMenu` (xác nhận xóa / menu hành động), `react-hook-form` (form phân loại thủ công)

**Storage**: Dữ liệu trang phục + tác vụ phân tích nằm ở backend (REST); phía frontend chỉ lưu trạng thái trong TanStack Query cache và optimistic updates

**Testing**: Jest 30 + React Testing Library (`npm test`), đã có bộ test sẵn `useWardrobeSSE.test.tsx`; bổ sung unit test cho pure functions và render test cho thẻ tủ đồ

**Target Platform**: Trình duyệt Web (Chrome, Safari, Firefox, Edge) trên máy tính và di động

**Project Type**: Next.js App Router Web Application

**Performance Goals**: Phản hồi optimistic + toast sau khi nhận sự kiện SSE lỗi dưới 100ms; không phát sinh thêm network call trên mỗi lần render thẻ; không tạo nhiều kết nối SSE trùng lặp cho cùng một task

**Constraints**: Copy UX tiếng Việt thân thiện, không lộ `errorCode`/detail kỹ thuật thô của backend; vô hiệu hóa hành động thử lại khi đang chạy để tránh trùng lặp; giữ nguyên bộ đọc stream SSE chuẩn RFC 8895 hiện có; tương thích các trạng thái `Processing`, `Selling`, `Sold`, `InWardrobe`, `NeedsReview`

**Scale/Scope**: Toàn bộ module Tủ đồ (upload, danh sách, chi tiết, chỉnh sửa) — phủ toàn bộ vòng đời lỗi phân tích AI

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

> **Ghi chú**: `.specify/memory/constitution.md` hiện là file template chưa điền nội dung nguyên tắc cụ thể (chỉ có placeholder). Do đó các gate dưới đây được kế thừa từ chuẩn thực hành đã được áp dụng thống nhất trong repo (tham chiếu `specs/024-ai-stylist-canvas-layout/plan.md`).

- **Library & Pure Function Decoupling**: PASS — Logic nhận diện trạng thái, ánh xạ thông báo lỗi và tóm tắt kết quả batch được tách thành module hàm thuần túy `wardrobe-status.ts`, độc lập với React lifecycle, dễ kiểm thử tự động.
- **Contract & Type Integrity**: PASS — Mở rộng kiểu `WardrobeTaskSSEPayload` với `errorCode`; định nghĩa hợp đồng hiển thị trạng thái và hành động phục hồi tại `data-model.md` và `contracts/failure-handling-contract.md`.
- **UX Standards & Accessibility**: PASS — Mỗi trạng thái lỗi có chỉ báo trực quan riêng (badge/overlay) và hành động phù hợp; thông báo lỗi thân thiện; nút thử lại có trạng thái disabled khi chạy.
- **Test-First & Verifiability**: PASS — Xây dựng kịch bản kiểm chứng tự động và thủ công tại `quickstart.md`.

---

## Project Structure

### Documentation (this feature)

```text
specs/025-ai-analysis-failure-handling/
├── spec.md               # Feature specification
├── plan.md               # Implementation plan (this file)
├── research.md           # Architecture decisions & gap analysis
├── data-model.md         # Status transitions, invariants & UI contracts
├── quickstart.md         # Automated & manual validation scenarios
├── contracts/
│   └── failure-handling-contract.md # SSE payload ↔ UI status ↔ recovery actions
└── checklists/
    └── requirements.md   # Specification quality checklist
```

### Source Code (repository layout)

```text
src/
├── features/
│   └── wardrobe/
│       ├── types/
│       │   └── index.ts                    # Mở rộng: WardrobeTaskSSEPayload.errorCode, AnalyzeFailureCode
│       ├── utils/
│       │   ├── wardrobe-status.ts          # [NEW] Pure functions: nhận diện trạng thái, ánh xạ message lỗi, summarize batch
│       │   └── wardrobe-status.test.ts     # [NEW] Unit tests cho pure functions
│       ├── hooks/
│       │   ├── useWardrobeSSE.ts           # Nâng cấp: map errorCode → message thân thiện, toast tóm tắt batch, dedupe toast lỗi
│       │   └── useWardrobeSSE.test.tsx     # Mở rộng test: sự kiện failed/needs_review
│       └── queries/
│           └── wardrobe.queries.ts         # useRetryWardrobeItemAnalysis: thêm invalidate detail + trả thông tin message/attempts
└── app/
    └── (user)/
        └── wardrobe/
            ├── components/
            │   ├── WardrobeClient.tsx      # Tính cờ failed/needsReview, menu hành động phục hồi trên thẻ
            │   └── WardrobeCard.tsx        # Thêm props statusFailed/statusNeedsReview: badge overlay + quick actions
            └── item/
                └── [id]/
                    └── components/
                        └── WardrobeItemDetailClient.tsx  # Banner lỗi: hiển thị lý do thân thiện + số lần thử lại + CTA phân loại thủ công
```

**Structure Decision**: Giữ nguyên kiến trúc feature-folder `src/features/wardrobe` kết hợp page components dưới `src/app/(user)/wardrobe`. Toàn bộ logic thuần túy đặt trong `utils/wardrobe-status.ts`; không tạo thư mục/service mới. Chi tiết cây thư mục tham chiếu ở trên phản ánh đúng các đường dẫn hiện có trong repo.

---

## Phases & Deliverables

### Phase 0: Outline & Research *(Completed)*
- Phân tích mã nguồn hiện tại (`useWardrobeSSE.ts`, `WardrobeClient.tsx`, `WardrobeCard.tsx`, `WardrobeItemDetailClient.tsx`, `wardrobe.api.ts`, `wardrobe.queries.ts`) để xác định khoảng trống xử lý lỗi.
- Đối chiếu hiện trạng với chuẩn SSE production (`docs/Doccument-SSE.md`, `docs/Note.md`) và đặc tả feature.
- Quyết định kiến trúc: tách pure functions `wardrobe-status.ts`; nâng cấp hook SSE; thêm trạng thái hiển thị + menu hành động trên thẻ; mở rộng kiểu `errorCode`.
- **Tài liệu bàn giao**: [research.md](./research.md)

### Phase 1: Design & Contracts *(Completed)*
- Xây dựng mô hình chuyển trạng thái và bất biến cho vòng đời lỗi phân tích: [data-model.md](./data-model.md)
- Thiết lập hợp đồng SSE payload ↔ trạng thái UI ↔ hành động phục hồi: [contracts/failure-handling-contract.md](./contracts/failure-handling-contract.md)
- Xây dựng hướng dẫn kiểm chứng nhanh tự động và thủ công: [quickstart.md](./quickstart.md)
- Hoàn thiện kế hoạch thực thi: [plan.md](./plan.md)

### Phase 2: Implementation Breakdown *(Sẽ được cụ thể hóa thành tasks.md bởi lệnh `/speckit-tasks`)*
1. **Khởi tạo module `utils/wardrobe-status.ts`**:
   - `isProcessingStatus(status)`, `isFailedStatus(status)`, `isNeedsReviewStatus(status)` — chuẩn hóa enum số/chuỗi như pattern hiện có.
   - `getFailureMessage(errorCode?, fallback?)` — ánh xạ mã lỗi nghiệp vụ sang thông điệp tiếng Việt thân thiện (ví dụ: ảnh quá mờ, định dạng không hỗ trợ, vượt hạn mức, xử lý quá lâu).
   - `summarizeBatchResults(results)` — gom kết quả batch (thành công / lỗi / cần xem lại) thành bản tin tóm tắt.
   - `getRecoveryActions(status)` — trả về các hành động phục hồi cho phép với từng trạng thái.
2. **Nâng cấp `useWardrobeSSE`**:
   - Sự kiện `failed`: đọc `payload.errorCode`/`payload.error` → `getFailureMessage`; hiển thị toast lỗi thân thiện; optimistic update cache sang `Failed`; invalidate lists/stats.
   - Sự kiện `needs_review`: toast thông báo cần xem lại + cập nhật cache sang `NeedsReview`.
   - Chống toast lặp: dedupe theo `taskId` khi nhiều event lỗi của cùng task.
   - Tóm tắt batch khi một lần upload có nhiều món kết thúc khác trạng thái.
3. **Cập nhật `WardrobeCard` + `WardrobeClient`**:
   - Thêm props `statusFailed` / `statusNeedsReview` → overlay badge "Phân tích thất bại" / "Cần chọn danh mục" trên vùng ảnh; vẫn giữ ảnh gốc xem được.
   - Trong `WardrobeClient`: tính cờ từ `item.status`; thêm DropdownMenu hành động trên thẻ lỗi: **Thử lại**, **Phân loại thủ công** (→ `/wardrobe/item/:id/edit`), **Xóa** (AlertDialog xác nhận).
   - Thẻ lỗi vẫn mở được trang chi tiết khi bấm vào vùng chính.
4. **Nâng cấp `WardrobeItemDetailClient`**:
   - Banner thất bại: hiển thị lý do thân thiện (từ `getFailureMessage`), số lần đã thử lại (nếu có), nút thử lại giữ trạng thái disabled khi đang chạy (đã có `isPending`).
   - Món `NeedsReview`: hiển thị banner riêng "Cần chọn lại danh mục" + CTA "Phân loại thủ công" dẫn đến trang sửa.
5. **Kiểm thử & Hoàn thiện**:
   - Chạy `npm test` cho `wardrobe-status.test.ts` và `useWardrobeSSE.test.tsx`.
   - Chạy `npm run lint`.
   - Kiểm thử thủ công theo `quickstart.md`.

---

## Complexity Tracking

> Không có vi phạm Constitution Check cần biện minh; phần này bỏ trống.