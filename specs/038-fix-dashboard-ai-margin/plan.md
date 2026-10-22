# Implementation Plan: Đồng Bộ Kỳ Báo Cáo Cho Bảng Hiệu Quả Chi Phí AI (038-fix-dashboard-ai-margin)

**Branch**: `dev` (feature: `038-fix-dashboard-ai-margin`) | **Date**: 2026-10-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/038-fix-dashboard-ai-margin/spec.md`.

---

## Summary

Khắc phục lỗi lệch kỳ dữ liệu trên bảng "Hiệu quả chi phí AI" (`AIMarginPanel`) của trang Dashboard Quản trị (`/admin/dashboard`):
1. **Server Component (`DashboardData.tsx`)**: Luôn gọi endpoint `/admin/dashboard/ai-margin?fromDate=...&toDate=...` với các tham số ngày của kỳ hiện tại (bỏ điều kiện kiểm tra `shouldFetchCustomMargin`). Khởi tạo `initialData.aiMargin` trực tiếp từ kết quả này, không fallback sang `overview?.aiMargin` (vốn là dữ liệu 30 ngày cố định).
2. **Client Component (`DashboardClient.tsx`)**: Bỏ prop `hasCustomDateRange`. Hook `useDashboardAIMargin` luôn hoạt động (`enabled: true`), cung cấp dữ liệu trực tiếp cho `AIMarginPanel`. Nút "Làm mới" (`refreshAll`), cờ `isRefreshing`, trạng thái tải, lỗi và hành động thử lại của panel đều được liên kết trực tiếp với query này.
3. **Dead Code Elimination**: Xóa hàm `hasCustomDashboardDateRange` trong `src/features/admin/utils/dashboard.ts` do không còn nơi sử dụng.
4. **Kiểm thử tự động**: Cập nhật `DashboardClient.test.tsx` phản ánh đúng luồng mới: không truyền `hasCustomDateRange`, kiểm chứng `mockMarginRefetch` luôn được gọi khi refresh.

---

## Technical Context

**Language/Version**: TypeScript 5+, Next.js 16 (App Router), React 19  
**Primary Dependencies**: `@tanstack/react-query: ^5.100.14`, `axios`, `lucide-react`, `tailwind-merge`, `clsx`  
**Storage**: TanStack Query cache, Next.js Server Components `serverFetch`  
**Testing**: Jest, `@testing-library/react`  
**Target Platform**: Web (Admin Portal)  
**Project Type**: Next.js App Router Web Application  
**Performance Goals**: Không phát sinh độ trễ phụ (SSR fetch song song qua `Promise.all`), phản hồi UI tức thì khi đổi kỳ  
**Constraints**: Bảo toàn quy ước kiến trúc repo hiện có; giữ nguyên 2 thẻ KPI card `totalBrands`/`pendingReviewBrands` đang bị comment trên `dev`; sử dụng đúng hạ tầng auth (cookie + `serverFetch`/axios); giữ thẻ KPI "Biên lợi nhuận AI" là snapshot 30 ngày từ `overview`.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Tuân thủ kiến trúc phân tầng: Server Component (`DashboardData`) nạp SSR song song $\rightarrow$ Client Component (`DashboardClient`) quản lý state & React Query hooks $\rightarrow$ UI Component (`AIMarginPanel`).
- [x] Không can thiệp hoặc thay đổi các logic nghiệp vụ User / Payment DTO.
- [x] 100% tuân thủ ràng buộc repo: Thực hiện trên nhánh `dev`, không sửa `main`, không tự ý bỏ comment 2 thẻ KPI card `totalBrands`/`pendingReviewBrands`.
- [x] Không hardcode token, sử dụng axios baseURL `/api/v1` và cookie phiên hiện có.
- [x] Đầy đủ unit tests kiểm thử các ca biên: refresh luôn gọi query margin, không truyền prop thừa, `npm test` và `npm run lint` đạt 100%.

---

## Project Structure

### Documentation (this feature)

```text
specs/038-fix-dashboard-ai-margin/
├── plan.md              # Kế hoạch triển khai kiến trúc (Tài liệu này)
├── research.md          # Phân tích nguyên nhân & các quyết định kỹ thuật
├── data-model.md        # Mô hình dữ liệu & luồng trạng thái
├── quickstart.md        # Hướng dẫn kiểm thử & các kịch bản nghiệm thu
├── contracts/           # Hợp đồng API và Component
│   └── dashboard-ai-margin.md
└── checklists/
    └── requirements.md  # Checklist thẩm định chất lượng đặc tả
```

### Source Code (repository root)

```text
src/
├── features/
│   └── admin/
│       └── utils/
│           └── dashboard.ts                          # [CẬP NHẬT] Xóa hàm dead code hasCustomDashboardDateRange
└── app/
    └── admin/
        └── dashboard/
            └── components/
                ├── DashboardData.tsx                 # [CẬP NHẬT] Luôn serverFetch ai-margin theo kỳ, bỏ fallback overview.aiMargin
                ├── DashboardClient.tsx               # [CẬP NHẬT] Bỏ prop hasCustomDateRange, useDashboardAIMargin luôn enabled
                └── DashboardClient.test.tsx          # [CẬP NHẬT] Bỏ prop hasCustomDateRange, test refresh luôn gọi mockMarginRefetch
```

**Structure Decision**:
- Chỉ sửa đổi chính xác 4 tệp liên quan trực tiếp đến luồng dữ liệu của `AIMarginPanel` trên trang Dashboard, không làm ảnh hưởng đến bất kỳ màn hình nào khác.
- Dọn sạch dead code để giữ codebase tinh gọn và nhất quán.

---

## Complexity Tracking

*Không có vi phạm hay ngoại lệ kiến trúc nào cần theo dõi.*
