# Implementation Plan: Đồng bộ và xử lý toàn diện trạng thái phân tích ảnh trang phục AI

**Branch**: `027-analyze-status-handling` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/027-analyze-status-handling/spec.md` & `specs\023-analyze-status-handling\frontend-guide.md` (Delta 2026-10-01)

## Summary

Đồng bộ toàn diện cơ chế xử lý trạng thái phân tích ảnh trang phục AI trên Frontend theo tài liệu tích hợp backend mới nhất:
1. Ánh xạ chính xác các mã lý do thất bại sang tiếng Việt thân thiện, bao gồm mã mới `no_fashion_item_detected` cho ảnh không phải trang phục.
2. Ẩn nút "Thử lại" đối với nhóm ảnh không hợp lệ (không phải trang phục, nhiều món, toàn thân), ngăn chặn vòng lặp lỗi 400.
3. Hoàn thiện luồng rà soát danh mục (`needs_review`): bắt buộc chọn `categoryId` trước khi retry, lắng nghe kết quả qua SSE và xử lý trường hợp phân tích lại thất bại (BC-3).
4. Khắc phục lỗi đóng sớm stream SSE trong `subscribeTaskSSE` khi đếm nhầm sự kiện `processing` là sự kiện hoàn tất.
5. Cập nhật đồng bộ API và Realtime cho cả tủ đồ cá nhân và cổng thông tin nhãn hàng (Brand Portal).

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+

**Primary Dependencies**: Next.js 16.2.6 (App Router), React 19.2.4, @tanstack/react-query 5.100.14, Axios 1.16.1, Sonner 2.0.7, Lucide React 1.21.0, Framer Motion 12.40.0, GSAP 3.15.0

**Storage**: TanStack Query Cache, browser memory

**Testing**: Jest 30.0.0, @testing-library/react 16.3.2

**Target Platform**: Web (Desktop & Mobile Responsive)

**Project Type**: Next.js Web Application Frontend

**Performance Goals**: Cập nhật trạng thái realtime trong < 50ms khi nhận SSE event; không có hiện tượng giật lag layout (CLS = 0) khi chuyển trạng thái thẻ trang phục.

**Constraints**: Tự động đồng bộ lại từ server sau tối đa 10-15 giây nếu kênh realtime bị gián đoạn; bảo toàn 100% quy tắc phân quyền người dùng và nhãn hàng.

**Scale/Scope**: Áp dụng cho toàn bộ các màn hình liên quan đến phân tích AI: Tủ đồ cá nhân (`/wardrobe`), Chi tiết món đồ (`/wardrobe/item/[id]`), Tải ảnh lên (`/wardrobe/upload`), và Cổng nhãn hàng (`/brand/[brandId]/products`).

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Client-First Responsiveness**: Giao diện cập nhật tức thì, hiển thị thông điệp thân thiện thay vì mã lỗi kỹ thuật.
- [x] **Type Safety**: Tất cả các mã lý do lỗi và trạng thái được định nghĩa kiểu dữ liệu chặt chẽ (`enum`, `union type`).
- [x] **Idempotency & Resilience**: Không tạo kết nối SSE trùng lặp; tự động dọn dẹp kết nối khi unmount; cơ chế fallback refetch khi mất mạng.
- [x] **Backward Compatibility**: Giữ nguyên tính tương thích với các trang phục hiện có trong tủ đồ.

---

## Project Structure

### Documentation (this feature)

```text
specs/027-analyze-status-handling/
├── spec.md              # Đặc tả nghiệp vụ và yêu cầu chức năng
├── plan.md              # Kế hoạch kỹ thuật này
├── research.md          # Ghi nhận các quyết định kiến trúc và lý do
├── data-model.md        # Cấu trúc dữ liệu và State Machine
├── quickstart.md        # Hướng dẫn kiểm thử và xác thực thực tế
└── contracts/
    └── api-contracts.md # Hợp đồng API và SSE
```

### Source Code Impact

```text
src/
├── features/
│   ├── wardrobe/
│   │   ├── types/index.ts                  # Cập nhật Reason codes, WardrobeItemRes, RetryReq
│   │   ├── api/wardrobe.api.ts             # Sửa subscribeTaskSSE & hỗ trợ categoryId trong retry-analysis
│   │   ├── utils/analysis-status.ts        # [NEW] Helper ánh xạ reason text & gate action "Thử lại"
│   │   ├── hooks/useWardrobeSSE.ts         # Cập nhật xử lý sự kiện, toast theo mã lý do
│   │   ├── hooks/useWardrobeSSE.test.tsx   # Bổ sung test case cho mã lỗi mới & gating
│   │   └── queries/wardrobe.queries.ts     # useRetryWardrobeItemAnalysis hỗ trợ categoryId
│   │
│   └── brand-portal/
│       ├── api/brand-portal.api.ts         # Thêm retryBrandItemAnalysis
│       └── hooks/useBrandItemSSE.ts        # Ánh xạ reason text cho brand portal
│
└── app/(user)/wardrobe/
    ├── components/
    │   ├── WardrobeCardV2.tsx              # Hiển thị badge trạng thái Cần rà soát / Thất bại
    │   └── WardrobeClient.tsx              # Điều hướng & xử lý click phù hợp với trạng thái
    └── item/[id]/components/
        └── WardrobeItemDetailClient.tsx    # Giao diện rà soát danh mục & ẩn retry khi ảnh không hợp lệ
```

---

## Complexity Tracking

Không có vi phạm kiến trúc nào. Tất cả các thay đổi đều nằm trong phạm vi tinh chỉnh giao diện, cập nhật kiểu dữ liệu và sửa lỗi logic stream theo đúng hợp đồng backend.
