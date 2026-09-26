# Implementation Plan: Hiển thị Hạn mức Profile & Quản lý Phiên Cookie Auth Chuẩn hoá

**Branch**: `023-profile-limits-auth-session` | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/023-profile-limits-auth-session/spec.md` and Guide `docs/frontend-profile-limits-and-session-guide`

## Summary

Kế hoạch triển khai nhằm giải quyết triệt để 2 vấn đề lớn:
1. **Hiển thị chính xác và minh bạch hạn mức Tủ đồ & Outfit trên trang `/profile`**: Tách nguồn lấy hạn mức tối đa (từ `GET /api/v1/subscriptions/me/daily-quota`) và số lượng thực tế đã dùng (từ `GET /api/v1/me/wardrobe-items/stats`). Xử lý trơn tru các trường hợp biên: hiển thị `0` an toàn, hiển thị `∞` khi gói không giới hạn (`max = 0`), tính toán thanh tiến trình an toàn không chia cho 0, sửa lỗi lặp biểu thức logic tại `CurrentPlanCard.tsx`, và đồng bộ khóa cache React Query `['subscription', 'daily-quota']`.
2. **Chuẩn hoá cơ chế phiên làm việc (Auth Cookie Single Source of Truth)**: Loại bỏ hoàn toàn sự cố "4 token / 2 domain" bằng cách áp dụng **Phương án B (Proxy Rewrite thuần túy)**. Gỡ bỏ các route handler BFF tại `src/app/api/v1/auth/*` và `src/app/api/auth/*` đang tự re-set cookie host-only; gỡ bỏ các câu lệnh `set/delete` cookie auth trong `src/middleware.ts`. Để Next.js rewrite forward trực tiếp yêu cầu tới backend và chuyển tiếp nguyên vẹn header `Set-Cookie` (kèm `Domain=.closy.hycat.online`, `HttpOnly`, `SameSite=Strict/Lax`) từ backend tới trình duyệt.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15 (App Router), React 19  
**Primary Dependencies**: `@tanstack/react-query`, `axios`, `lucide-react`, `sonner`, `tailwind-merge`  
**Storage**: Trình duyệt Cookies (HttpOnly, SameSite=Strict/Lax, Domain=.closy.hycat.online do Backend quản lý), React Query cache (in-memory)  
**Testing**: TypeScript Type Checking (`tsc --noEmit`), ESLint, Unit/Component Tests, Manual Verification qua `quickstart.md`  
**Target Platform**: Web Browsers (Chrome, Edge, Firefox, Safari) trên Desktop và Mobile Web  
**Project Type**: Next.js App Router Web Application  
**Performance Goals**: Nạp và hiển thị thông tin hạn mức Profile trong < 300ms; làm mới phiên ngầm (Token Refresh) trong < 500ms; đăng xuất sạch hoàn toàn trong < 1.0 giây  
**Constraints**: 
- Tuyệt đối không để xảy ra tình trạng sinh cookie host-only song song với domain cookie.
- Không để xảy ra lỗi chia cho 0 (`NaN%`, `Infinity%`) khi người dùng sở hữu gói không giới hạn (`max = 0`).
- Không làm gián đoạn luồng làm việc của ứng dụng di động (Mobile App dùng header/body độc lập).  
**Scale/Scope**: Tác động tới toàn bộ người dùng đăng nhập trên nền tảng Web Closy, bao gồm luồng Profile, Wardrobe và hệ thống xác thực Auth toàn cục.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Single Source of Truth cho Cookie Auth**: PASS — Backend là đơn vị duy nhất cấp phát và hủy cookie auth (`accessToken`, `refreshToken`, `forgotPasswordToken`). Frontend và BFF không can thiệp `Set-Cookie`.
- **Cache Integrity & Deduplication**: PASS — Thống nhất queryKey `['subscription', 'daily-quota']` qua hook `useDailyQuota()`, dùng lại `useWardrobeStats()`, chia sẻ cache mượt mà giữa các component.
- **Resilient UI Formatting**: PASS — Chuẩn hóa hàm format với toán tử nullish coalescing `?? 0`, kiểm tra `isUnlimited(max)` tránh chia cho 0.
- **Zero Host-only Auth Cookies**: PASS — Gỡ bỏ toàn bộ BFF auth routes và middleware cookie mutation, chuyển sang Next.js native rewrite proxy.

## Project Structure

### Documentation (this feature)

```text
specs/023-profile-limits-auth-session/
├── spec.md                  # Đặc tả yêu cầu tính năng
├── plan.md                  # Kế hoạch triển khai kỹ thuật (Tập tin này)
├── research.md              # Báo cáo nghiên cứu & quyết định kiến trúc
├── data-model.md            # Mô hình dữ liệu & chuyển trạng thái phiên
├── quickstart.md            # Kịch bản kiểm chứng nhanh
├── checklists/
│   └── requirements.md      # Bảng thẩm định chất lượng đặc tả
└── contracts/
    ├── profile-quota-contract.md  # Khế ước API Hạn mức & Thống kê Tủ đồ
    └── auth-session-contract.md   # Khế ước API Quản lý Phiên Cookie Auth
```

### Source Code (repository root layout)

```text
src/
├── app/
│   ├── (user)/
│   │   └── profile/
│   │       └── components/
│   │           └── ProfileClient.tsx            # [CẬP NHẬT] Đổi queryKey sang useDailyQuota, thêm useWardrobeStats
│   ├── api/
│   │   ├── auth/                                # [XÓA BỎ HOẶC NEUTRALIZE] Gỡ bỏ BFF routes re-set cookie host-only
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── refresh-token/route.ts
│   │   │   └── status/route.ts
│   │   └── v1/
│   │       └── auth/                            # [XÓA BỎ] Xóa các route re-export để Next.js rewrite sang backend
│   │           ├── login/route.ts
│   │           ├── logout/route.ts
│   │           ├── refresh-token/route.ts
│   │           └── status/route.ts
├── features/
│   ├── subscription/
│   │   ├── components/
│   │   │   └── CurrentPlanCard.tsx              # [CẬP NHẬT] Hiển thị {current}/{max}, sửa lỗi lặp dòng 89, thanh tiến trình an toàn
│   │   └── queries/
│   │       └── subscription.queries.ts          # [XÁC NHẬN] Giữ chuẩn useDailyQuota (key: ['subscription', 'daily-quota'])
│   ├── wardrobe/
│   │   └── queries/
│   │       └── wardrobe.queries.ts              # [TÁI SỬ DỤNG] Hook useWardrobeStats
│   └── auth/
│       └── api/
│           └── auth.api.ts                      # [CẬP NHẬT] Gọi chuẩn endpoint qua axios withCredentials
├── lib/
│   ├── auth-cookies.ts                          # [CẬP NHẬT] Bỏ/deprecate các options set/clear cookie auth không domain
│   └── axios.ts                                 # [CẬP NHẬT] Interceptor refresh token đảm bảo withCredentials: true
└── middleware.ts                                # [CẬP NHẬT] Bỏ set/delete cookie auth tại dòng 158-207, bỏ duplicate refresh
```

## Complexity Tracking

| Thành phần / Kiến trúc | Lý do cần thiết | Giải pháp đơn giản hơn đã bị loại bỏ vì sao |
|---|---|---|
| **Xóa bỏ hoàn toàn BFF Auth Routes thay vì chỉnh sửa `domain` trong BFF** | Đảm bảo Backend là Single Source of Truth duy nhất, không cần bảo trì đồng bộ logic domain phức tạp giữa FE và BE. | Đã loại bỏ phương án giữ BFF và thêm `domain` vào `res.cookies.set()` vì vẫn có nguy cơ lệch cấu hình domain giữa các môi trường, vi phạm nguyên tắc backend kiểm soát cookie. |
| **Dùng Next.js Native Rewrites (`next.config.ts`)** | Cho phép trình duyệt gọi same-origin `/api/v1/*`, Next.js chuyển tiếp nguyên trạng header `Set-Cookie` của Backend. | Đã loại bỏ Phương án A (Client gọi trực tiếp domain backend) vì gây phức tạp CORS, cần cấu hình origin cho nhiều môi trường và phải đổi base URL trong Axios. |
