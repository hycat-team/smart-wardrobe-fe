# Implementation Plan: Admin Campaign Management & Eligibility Lookup (Quản lý Chiến dịch Tặng gói & Tra cứu Điều kiện Tài khoản)

**Branch**: `031-admin-campaign-management` | **Date**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/031-admin-campaign-management/spec.md` (derived from backend integration guides `025-signup-campaign-grant` and `026-campaign-registry-db`).

---

## Summary

Xây dựng phân hệ Quản trị Chiến dịch Tặng Gói và Công cụ Tra cứu Điều kiện Tài khoản Khách hàng hoàn chỉnh tại `/admin/campaigns` và `/admin/campaigns/[code]`:
1. **Bảng điều khiển & Giám sát ngân sách thời gian thực**: Quản lý danh sách chiến dịch, hiển thị tiến độ ngân sách chính xác, kiểm soát 6 trạng thái vòng đời (`not_started`, `running`, `compensation`, `exhausted`, `expired`, `closed`), và đặc biệt là hệ thống cảnh báo đỏ khẩn cấp khi cơ chế cấp nền bị lỗi (`degraded = true`).
2. **Kích hoạt điều hướng quản trị**: Tích hợp liên kết "Chiến dịch tặng gói" trên thanh điều hướng chính [`AdminSidebar.tsx`](file:///c:/FPT/Project/smart-wardrobe/smart-wardrobe-fe/src/features/admin/components/AdminSidebar.tsx).
3. **Mở & Sửa chiến dịch an toàn**: Biểu mẫu kiểm tra nghiêm ngặt định dạng mã, thời gian RFC3339 có múi giờ, cơ chế tự động khóa các trường ngân sách (`quota`, `reserve`, `planSlug`) khi chiến dịch đã cấp (`budgetLocked = true`), và kiểm soát xung đột phiên bản qua `version` (HTTP 412).
4. **Đóng cưỡng bức một chiều**: Hộp thoại cảnh báo nguy hiểm yêu cầu bắt buộc nhập lý do đóng, lưu vết vào nhật ký kiểm toán.
5. **Công cụ Tra cứu Điều kiện Khách hàng**: Trực tiếp hỗ trợ bộ phận CS tra cứu tình trạng nhận gói theo `userId` và `campaignCode`, phân biệt chính xác 6 trạng thái `eligibility` (đặc biệt không gộp `eligible_pending` vào `exhausted`), và hiển thị 12 mã `reason` bằng tiếng Việt thân thiện.
6. **Lượt cấp (`claims`) & Nhật ký kiểm toán (`audit`)**: Bảng danh sách tài khoản đã cấp có lọc theo thời gian RFC3339, và bảng đối chiếu Trước → Sau (Before/After Diff) các thao tác quản trị.
7. **Đồng bộ hóa dữ liệu**: Tuân thủ nguyên tắc luôn gọi lại `GET /{code}` ngay sau mọi thao tác ghi để hiển thị số liệu ngân sách thực tế.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+

**Primary Dependencies**: Next.js 16.2.6 (App Router), React 19.2.4, `@tanstack/react-query` 5.100.14, Lucide React 1.21.0, Sonner 2.0.7, Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-tabs`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tooltip`), Tailwind CSS v4, `react-hook-form` 7.80.0, `zod` 4.4.3, `date-fns` 4.4.0

**Storage**: Server-side REST API qua axios client (`@/lib/axios`), TanStack Query in-memory cache

**Testing**: Jest 30.0.0, @testing-library/react 16.3.2, ESLint 9

**Target Platform**: Web Desktop / Laptop cho Quản trị viên và Nhân viên Hỗ trợ

**Project Type**: Next.js Web Application Frontend (Admin Portal)

**Performance Goals**: Tải bảng danh sách và chi tiết chiến dịch < 800ms; tra cứu điều kiện khách hàng < 500ms; chuyển đổi tab mượt mà 0ms; cảnh báo `degraded` hiển thị tức thời.

**Constraints**:
- Tuân thủ thiết kế Closy Admin; bảo vệ an toàn các thao tác đóng bằng `AlertDialog`.
- Đảm bảo quyền truy cập chỉ dành cho Admin (`RolesAuthorize`).
- Luôn gửi thời gian RFC3339 có múi giờ để không bị từ chối 400.
- Tuyệt đối không cache hoặc lấy số liệu ngân sách từ response của 3 API ghi (`POST`, `PATCH`, `close`).

**Scale/Scope**: Bao phủ 2 tuyến route chính (`/admin/campaigns`, `/admin/campaigns/[code]`), 1 mục điều hướng trên `AdminSidebar`, 8 API endpoints backend và 6 màn hình/chức năng quản trị.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Client-First Responsiveness**: Giao diện cập nhật tức thì với TanStack Query invalidation và tự động re-fetch `GET /{code}` sau mỗi lần ghi.
- [x] **Type Safety**: Tất cả các models dữ liệu chiến dịch (21 trường), lượt cấp, điều kiện tài khoản và nhật ký kiểm toán được định kiểu TypeScript nghiêm ngặt.
- [x] **Resilience & Defensiveness**: Xử lý đầy đủ loading states, empty states, error fallbacks, phân biệt rõ các mã lỗi 400, 404 (mã vs user), 409, 412 (concurrency), 422 (budget lock), 429 và 500.
- [x] **Design Consistency**: Đồng bộ hoàn toàn với palette màu, typography và components hiện tại của khu vực Closy Admin.
- [x] **Auditing & Traceability**: Hỗ trợ hiển thị đầy đủ lịch sử thay đổi Before/After và lý do đóng chiến dịch.

---

## Project Structure

### Documentation (this feature)

```text
specs/031-admin-campaign-management/
├── spec.md                  # Đặc tả nghiệp vụ và yêu cầu chức năng
├── plan.md                  # Kế hoạch kỹ thuật này (/speckit-plan)
├── research.md              # Phase 0: Phân tích kỹ thuật & quyết định kiến trúc
├── data-model.md            # Phase 1: Thực thể dữ liệu & máy trạng thái
├── quickstart.md            # Phase 1: Hướng dẫn kiểm thử thủ công và tự động
├── checklists/
│   └── requirements.md      # Bảng thẩm định chất lượng đặc tả
└── contracts/
    ├── api-contracts.md     # Phase 1: Hợp đồng kết nối 8 API endpoints
    └── ui-contracts.md      # Phase 1: Hợp đồng component, props & visual states
```

### Source Code Impact

```text
src/
├── app/
│   └── admin/
│       └── campaigns/
│           ├── page.tsx                           # [NEW] Danh sách chiến dịch & Tra cứu điều kiện khách hàng
│           └── [code]/
│               └── page.tsx                       # [NEW] Chi tiết chiến dịch: Overview, Claims, Audit Tabs
│
└── features/
    └── admin/
        ├── components/
        │   └── AdminSidebar.tsx                   # [UPDATE] Kích hoạt mục menu "Chiến dịch tặng gói"
        │
        └── campaigns/                             # [NEW] Feature module chuyên biệt cho Campaign Admin
            ├── api/
            │   └── campaign-admin.api.ts          # [NEW] Client gọi 8 endpoint /api/v1/admin/campaigns
            ├── queries/
            │   └── campaign-admin.queries.ts      # [NEW] TanStack Query hooks, mutations, cache invalidation
            ├── types/
            │   └── campaign-admin.types.ts        # [NEW] Type definitions (21 fields, claims, eligibility, audit)
            ├── utils/
            │   ├── campaign-status.ts             # [NEW] Mapping 6 statuses, labels, styles
            │   └── eligibility-reason.ts          # [NEW] Mapping 12 reason codes, descriptions, empty handling
            └── components/
                ├── CampaignDashboardHeader.tsx    # [NEW] Header trang danh sách + CTA Mở chiến dịch
                ├── CampaignUrgentBanner.tsx       # [NEW] Cảnh báo đỏ nổi bật khi degraded: true
                ├── CampaignTable.tsx              # [NEW] Bảng danh sách chiến dịch, status badges, budget locked
                ├── CampaignStatusBadge.tsx        # [NEW] Badge trạng thái chiến dịch có tooltip closedAt
                ├── CampaignBudgetProgressBar.tsx  # [NEW] Thanh tiến độ ngân sách chính vs dự phòng
                ├── CustomerEligibilityCard.tsx    # [NEW] Thẻ tra cứu điều kiện tài khoản khách hàng
                ├── CreateCampaignModal.tsx        # [NEW] Modal mở chiến dịch mới + validation Zod
                ├── EditCampaignModal.tsx          # [NEW] Modal sửa chiến dịch + budget locked enforcement
                ├── CloseCampaignDialog.tsx        # [NEW] Dialog đóng cưỡng bức + mandatory reason
                ├── CampaignClaimsTab.tsx          # [NEW] Tab danh sách lượt cấp + bộ lọc ngày RFC3339
                └── CampaignAuditTab.tsx           # [NEW] Tab nhật ký kiểm toán + Before/After Diff viewer
```

---

## Complexity Tracking

Không có vi phạm hay ngoại lệ so với kiến trúc chuẩn của dự án.
Toàn bộ giải pháp tuân thủ Feature-Sliced Design trong Next.js App Router và TanStack Query.
