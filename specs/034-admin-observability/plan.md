# Implementation Plan: Admin Observability & Operational Dashboard

**Branch**: `034-admin-observability` | **Date**: 2026-10-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/034-admin-observability/spec.md` & backend integration guide `frontend-guide.md`.

## Summary

Triển khai hoàn thiện 2 trang quản trị mới dành cho Admin trên repo `smart-wardrobe-fe`:
1. **Trang Giao dịch payOS** (`/admin/transactions`): Danh sách 11 trạng thái, xem chi tiết và 4 hành động đối soát thủ công có điều kiện kích hoạt an toàn.
2. **Trang Hoạt động người dùng** (`/admin/activity-events`): Tra cứu nhật ký xác thực (`login`/`refresh`) có phân trang, lọc theo danh tính người dùng và khoảng thời gian.
3. **Cải tổ Dashboard Admin**: Phân tách rành mạch chỉ số ảnh chụp (KPI snapshot ~15 phút) và các bảng biểu theo kỳ; cung cấp preset ngày chuẩn giờ Việt Nam (+07:00); đồng bộ gửi đủ 2 đầu `{ fromDate, toDate }` cho cả 7 endpoint theo kỳ; hiển thị trực tiếp tỷ lệ lỗi AI $\le 100\%$ và tổng tiền giao dịch thực tế từ backend; xử lý lỗi 400 thân thiện bằng tiếng Việt.

## Technical Context

**Language/Version**: TypeScript 5+, Next.js 15 (App Router), React 19  
**Primary Dependencies**: `@tanstack/react-query`, `axios`, `date-fns`, `recharts`, `lucide-react`, `shadcn/ui` (dialog, popover, calendar, select, badge, table, tabs, pagination), `sonner`  
**Storage**: React Query client cache, URL Search Parameters (bộ lọc lưu trong query params để hỗ trợ back/forward và chia sẻ liên kết)  
**Testing**: Jest, `@testing-library/react`, `axios-mock-adapter`  
**Target Platform**: Web (Admin Portal trên trình duyệt máy tính và máy tính bảng)  
**Project Type**: Next.js App Router Web Application  
**Performance Goals**: Tải trang < 1.5s, phản hồi bộ lọc tức thì trên URL, không giật layout khi chuyển tab  
**Constraints**: Chuẩn múi giờ `Asia/Ho_Chi_Minh` (+07:00), cận ngày nửa mở `[from, to)` không để lọt giờ buổi sáng do UTC, không nuốt lỗi 400 im lặng.  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Tuân thủ kiến trúc phân tầng (Types -> API Client -> React Query Hooks -> Components -> Page Router)
- [x] Không can thiệp hoặc thay đổi các logic DTO thanh toán phía User (`PaymentLinkDTO.paymentStatus` vẫn giữ nguyên dạng số)
- [x] 100% xử lý lỗi có thông báo tiếng Việt từ phản hồi `message` của máy chủ
- [x] Giữ nguyên tính toàn vẹn của các test suite hiện hữu và bổ sung unit test cho các module mới

## Project Structure

### Documentation (this feature)

```text
specs/034-admin-observability/
├── plan.md              # Kế hoạch triển khai kiến trúc
├── research.md          # Quyết định kỹ thuật & múi giờ
├── data-model.md        # Mô hình DTO và thực thể dữ liệu
├── quickstart.md        # Hướng dẫn kiểm thử và xác thực
├── contracts/           # Hợp đồng API chi tiết
│   ├── admin-activity-api.md
│   ├── admin-billing-api.md
│   └── dashboard-observability-api.md
└── checklists/
    └── requirements.md  # Checklist thẩm định chất lượng đặc tả
```

### Source Code (repository root)

```text
src/
├── app/
│   └── admin/
│       ├── activity-events/                     # [MỚI] Trang nhật ký hoạt động
│       │   ├── page.tsx
│       │   └── components/
│       │       ├── ActivityEventsClient.tsx
│       │       ├── ActivityEventsToolbar.tsx
│       │       └── ActivityEventsTable.tsx
│       ├── transactions/                        # [MỚI] Trang giao dịch payOS
│       │   ├── page.tsx
│       │   └── components/
│       │       ├── TransactionsClient.tsx
│       │       ├── TransactionsToolbar.tsx
│       │       ├── TransactionsTable.tsx
│       │       ├── TransactionDetailModal.tsx
│       │       └── ReconciliationActionDialog.tsx
│       └── dashboard/                           # [CẬP NHẬT] Dashboard admin
│           ├── page.tsx
│           └── components/
│               ├── DashboardClient.tsx          # Cập nhật query date-range đồng bộ
│               ├── DashboardToolbar.tsx         # Bổ sung presets ngày VN
│               ├── DashboardKpiGrid.tsx         # Gắn nhãn snapshot và updatedAt
│               ├── PayOSPanel.tsx               # Cập nhật pending/voided và ngày VN
│               ├── AIMarginPanel.tsx            # Cập nhật ngày VN & tiếng Việt
│               ├── DashboardInsights.tsx        # Cập nhật ngôn ngữ & chú thích kỳ
│               ├── DashboardTrendChart.tsx      # Fix UTC shift & granularity label
│               ├── AIEventsTable.tsx            # Fix filter dropdown & cột lỗi
│               └── DashboardData.tsx            # SSR data fetching theo kỳ
└── features/
    └── admin/
        ├── types/
        │   ├── activity.ts                      # [MỚI] Type nhật ký hoạt động
        │   ├── transactions.ts                  # [MỚI] Type giao dịch 11 status & actions
        │   └── dashboard.ts                     # [CẬP NHẬT] Type PayOS & AIEvent
        ├── api/
        │   ├── activity.api.ts                  # [MỚI] API client hoạt động
        │   ├── transactions.api.ts              # [MỚI] API client giao dịch & đối soát
        │   └── dashboard.api.ts                 # [CẬP NHẬT] 7 endpoints nhận from/to
        ├── queries/
        │   ├── activity.queries.ts              # [MỚI] React Query hooks hoạt động
        │   ├── transactions.queries.ts          # [MỚI] React Query hooks giao dịch
        │   └── dashboard.queries.ts             # [CẬP NHẬT] React Query hooks dashboard
        ├── utils/
        │   ├── activity.ts                      # [MỚI] Format tên, badge hoạt động
        │   ├── transactions.ts                  # [MỚI] Map 11 status, format VND
        │   └── dashboard.ts                     # [CẬP NHẬT] Preset ngày VN, bỏ fallback im lặng
        └── components/
            └── AdminSidebar.tsx                 # [CẬP NHẬT] Thêm 2 mục menu điều hướng
```

**Structure Decision**: Tách biệt rõ ràng theo module tính năng (`activity`, `transactions`, `dashboard`) trong `features/admin/`, đồng thời đặt các màn hình tương ứng theo cấu trúc App Router của Next.js (`src/app/admin/`).

## Complexity Tracking

Không có vi phạm hay ngoại lệ phức tạp cần biện minh. Toàn bộ giải pháp tuân thủ chặt chẽ kiến trúc frontend hiện hữu và hợp đồng đã được đối chiếu live với backend 029.
