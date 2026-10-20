# Implementation Plan: Bộ Chọn Kỳ Dùng Chung Quản Trị Hệ Thống (037-admin-period-navigator)

**Branch**: `dev` (feature: `037-admin-period-navigator`) | **Date**: 2026-10-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/037-admin-period-navigator/spec.md` & backend integration guide `frontend-guide.md`.

## Summary

Xây dựng và tích hợp bộ chọn kỳ dùng chung (`AdminPeriodNavigator`) áp dụng thống nhất cho cả 3 trang giám sát vận hành quản trị viên:
1. **Tổng quan Dashboard** (`/admin/dashboard`)
2. **Nhật ký Hoạt động Người dùng** (`/admin/activity-events`)
3. **Giao dịch payOS** (`/admin/transactions`)

Bộ điều hướng chuẩn hóa 5 preset: *Hôm nay*, *Tuần này* (Thứ 2 → hôm nay), *Tháng này* (01 → hôm nay), *Năm này* (01/01 → hôm nay), và *Tuỳ chọn*; mặc định khi không có query param là **Tháng này**. Hai nút mũi tên ◀ ▶ hỗ trợ lùi/tiến chu kỳ trọn vẹn trong quá khứ và tự động kẹp `toDate = hôm nay` khi chạm mốc hiện tại (vô hiệu hóa nút ▶). Trạng thái kỳ và preset được đồng bộ đầy đủ vào URL, khôi phục qua Back/Forward, tự động reset `page = 1` khi đổi kỳ, giữ dữ liệu cũ (`keepPreviousData`), không nháy skeleton toàn trang và không trượt vị trí cuộn trang.

---

## Technical Context

**Language/Version**: TypeScript 5+, Next.js 16 (App Router), React 19  
**Primary Dependencies**: `@tanstack/react-query: ^5.100.14`, `date-fns: ^4.4.0`, `react-day-picker: ^10.0.1`, `lucide-react`, `tailwind-merge`, `clsx`, `shadcn/ui` (Button, Popover, Calendar, Input, Select)  
**Storage**: URL Search Parameters (`preset`, `fromDate`, `toDate`, `page`), TanStack Query in-memory cache  
**Testing**: Jest, `@testing-library/react`  
**Target Platform**: Web (Admin Portal trên trình duyệt máy tính và máy tính bảng)  
**Project Type**: Next.js App Router Web Application  
**Performance Goals**: Phản hồi đổi kỳ tức thì dưới 100ms, không nháy skeleton trắng toàn trang, giữ nguyên vị trí cuộn trang (`scroll: false`)  
**Constraints**: Chuẩn múi giờ `Asia/Ho_Chi_Minh` (+07:00), kẹp trần ngày hiện tại, giữ nguyên trạng thái comment của 2 thẻ KPI card `totalBrands` & `pendingReviewBrands` trên `dev`, dùng đúng hạ tầng auth hiện có (cookie + axios/serverFetch, không hardcode Bearer token).  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Tuân thủ kiến trúc phân tầng: Thư viện tính toán ngày (`period.ts`) $\rightarrow$ Component UI dùng chung (`AdminPeriodNavigator.tsx`) $\rightarrow$ Tích hợp vào Toolbar của 3 trang $\rightarrow$ React Query Hooks & URL sync.
- [x] Không can thiệp hoặc thay đổi các logic DTO thanh toán phía User (`PaymentLinkDTO.paymentStatus` vẫn giữ nguyên dạng số).
- [x] 100% tuân thủ ràng buộc repo: Làm việc trên nhánh `dev`, không sửa `main`, không tự ý bỏ comment 2 thẻ KPI card `totalBrands`/`pendingReviewBrands`.
- [x] Không hardcode token, sử dụng axios baseURL `/api/v1` và cookie phiên hiện có.
- [x] Đầy đủ unit tests kiểm thử các ca biên: tuần bắt đầu Thứ Hai, lùi/tiến đơn vị đầy đủ, clamp không vượt hôm nay, dịch chuyển khoảng ngày tùy chọn, parse/serialize URL params.

---

## Project Structure

### Documentation (this feature)

```text
specs/037-admin-period-navigator/
├── plan.md              # Kế hoạch triển khai kiến trúc (Tài liệu này)
├── research.md          # Quyết định kỹ thuật & phân tích bước nhảy chu kỳ
├── data-model.md        # Mô hình kiểu dữ liệu & sơ đồ chuyển trạng thái
├── quickstart.md        # Hướng dẫn kiểm thử & các kịch bản nghiệm thu
├── contracts/           # Hợp đồng giao diện & tham số URL
│   └── admin-period-navigator.md
└── checklists/
    └── requirements.md  # Checklist thẩm định chất lượng đặc tả
```

### Source Code (repository root)

```text
src/
├── features/
│   └── admin/
│       ├── types/
│       │   └── period.ts                             # [MỚI] Type PeriodPreset, PeriodRange, NavigationResult
│       ├── utils/
│       │   ├── period.ts                             # [MỚI] Thuật toán tính mốc ngày VN, ◀ ▶ step, clamping, nhãn kỳ
│       │   ├── dashboard.ts                          # [CẬP NHẬT] Tích hợp period utils, đổi default sang 'this_month'
│       │   └── __tests__/
│       │       └── period.test.ts                    # [MỚI] Bộ test đơn vị cho toàn bộ thuật toán kỳ
│       └── components/
│           ├── AdminPeriodNavigator.tsx              # [MỚI] Component chọn kỳ dùng chung (pills, ◀ ▶, popover calendar)
│           └── __tests__/
│               └── AdminPeriodNavigator.test.tsx     # [MỚI] Unit test cho component navigator
└── app/
    └── admin/
        ├── dashboard/
        │   └── components/
        │       ├── DashboardToolbar.tsx              # [CẬP NHẬT] Thay thế bộ chọn ngày cũ bằng AdminPeriodNavigator
        │       ├── DashboardClient.tsx               # [CẬP NHẬT] Đọc/ghi preset từ URL, reset page=1 khi đổi kỳ
        │       └── DashboardData.tsx                 # [CẬP NHẬT] SSR default 'this_month' thay vì 30 ngày cuốn
        ├── activity-events/
        │   └── components/
        │       ├── ActivityEventsToolbar.tsx         # [CẬP NHẬT] Tích hợp AdminPeriodNavigator thay cho popover cũ
        │       └── ActivityEventsClient.tsx          # [CẬP NHẬT] Đọc/ghi preset, default 'this_month', reset page=1
        └── transactions/
            └── components/
                ├── TransactionsToolbar.tsx           # [CẬP NHẬT] Tích hợp AdminPeriodNavigator thay cho popover cũ
                └── TransactionsClient.tsx            # [CẬP NHẬT] Đọc/ghi preset, default 'this_month', reset page=1
```

**Structure Decision**: 
- Đóng gói toàn bộ logic tính toán ngày tháng và quy tắc bước nhảy chu kỳ vào `src/features/admin/utils/period.ts` để đảm bảo độc lập, dễ viết unit test toàn diện mà không phụ thuộc DOM.
- Đóng gói giao diện bộ chọn vào `src/features/admin/components/AdminPeriodNavigator.tsx` để tái sử dụng 100% trên cả 3 trang quản trị, tránh lặp lại mã nguồn.
- Giữ nguyên cấu trúc Server Component & Client Component hiện có của từng trang (`DashboardData`, `ActivityEventsClient`, `TransactionsClient`), chỉ cập nhật cơ chế đọc/ghi query param để đồng bộ `preset`, `fromDate`, `toDate`.

---

## Complexity Tracking

Không có vi phạm kiến trúc nào. Thiết kế tái sử dụng tối đa các thành phần và quy ước sẵn có của dự án.
