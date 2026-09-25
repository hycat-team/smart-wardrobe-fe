# Implementation Plan: Đăng Nhập Google (Frontend Web)

**Branch**: `002-google-login` | **Date**: 2026-09-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-google-login/spec.md` and Backend Guide `google-login-frontend-guide.md`

## Summary

Triển khai tính năng Đăng nhập bằng Google trên ứng dụng Web Closy (`smart-wardrobe-fe`) theo luồng **Web Authorization Code + Redirect**. Nút "Đăng nhập bằng Google" xuất hiện đồng bộ ở cả trang Đăng nhập (`/auth/login`) và Đăng ký (`/auth/register`), chuyển hướng người dùng qua backend `{API_BASE}/api/v1/auth/google?redirectUrl=...`. Trang tiếp nhận `/auth/callback` xử lý nhận diện lỗi từ query string (bắn toast Sonner), xác nhận phiên HttpOnly qua `GET /api/v1/me` / React Query cache, và khôi phục ngữ cảnh trang đích (`returnUrl`) thông qua `sessionStorage`.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15 (App Router), React 19  
**Primary Dependencies**: `@tanstack/react-query`, `lucide-react`, `sonner`, `axios`, `zod`, `react-hook-form`, `tailwind-merge`  
**Storage**: Trình duyệt `sessionStorage` (lưu tạm `closy_auth_return_url`), Cookie HttpOnly SameSite=Strict (`accessToken`, `refreshToken` do backend/BFF quản lý)  
**Testing**: Unit tests / Component tests với Jest & React Testing Library, kiểm thử thủ công qua kịch bản kiểm chứng nhanh (Quickstart)  
**Target Platform**: Web Browsers (Chrome, Safari, Firefox, Edge) trên cả Desktop và Mobile Web  
**Project Type**: Next.js App Router Web Application  
**Performance Goals**: Xử lý callback, nạp hồ sơ người dùng và điều hướng trong < 1.0 giây  
**Constraints**: Không nhúng SDK Google ngoài (GIS) vào client; không lưu trữ token truy cập trong JS/localStorage; tuân thủ quy tắc bảo mật HttpOnly  
**Scale/Scope**: Tích hợp xác thực cho toàn bộ người dùng và quản trị viên nền tảng Closy  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Library & Component Reusability**: PASS — Thành phần nút đăng nhập Google được tách thành component dùng chung `GoogleLoginButton.tsx` cho cả trang Login và Register.
- **Contract & Type Integrity**: PASS — Định nghĩa đầy đủ kiểu dữ liệu mã lỗi, tham số callback và mapping chuẩn tại `data-model.md` và `contracts/google-auth-contract.md`.
- **Security & Token Isolation**: PASS — Token hoàn toàn nằm trong HttpOnly cookie, loại bỏ rủi ro XSS lấy cắp token.
- **Integration Validation**: PASS — Có kịch bản kiểm thử giả lập nhanh các mã lỗi tại `quickstart.md`.

## Project Structure

### Documentation (this feature)

```text
specs/002-google-login/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Architecture decisions & error code mapping
├── data-model.md        # State transitions & TypeScript interfaces
├── quickstart.md        # Run & verification scenarios
├── contracts/
│   └── google-auth-contract.md  # Frontend ↔ Backend integration contract
└── checklists/
    └── requirements.md  # Quality validation checklist
```

### Source Code (repository layout)

```text
src/
├── app/
│   └── (guest)/
│       └── auth/
│           ├── callback/
│           │   ├── page.tsx                     # Route /auth/callback (Server Component wrapper)
│           │   └── components/
│           │       └── CallbackClient.tsx       # Client Component xử lý query, verify session & redirect
│           ├── login/
│           │   └── components/
│           │       └── LoginClient.tsx          # Nhúng GoogleLoginButton & divider
│           └── register/
│               └── components/
│                   └── RegisterClient.tsx       # Nhúng GoogleLoginButton & divider
├── features/
│   └── auth/
│       ├── components/
│       │   └── GoogleLoginButton.tsx            # Component nút bấm chuẩn Google branding
│       └── utils/
│           └── google-auth.utils.ts             # Helper sinh redirect URL, map mã lỗi, validate returnUrl
```

---

## Phases & Deliverables

### Phase 0: Outline & Research *(Completed)*
- Nghiên cứu cơ chế Web Redirect (§1) vs GIS One Tap (§2).
- Xác lập quyết định dùng Web Redirect thuần, không phụ thuộc Google SDK ngoài.
- Thống nhất bảng ánh xạ 8 mã lỗi từ backend sang thông điệp tiếng Việt.
- Cơ chế bảo vệ `returnUrl` chống Open Redirect bằng `sessionStorage`.
- **Artifacts**: [specs/002-google-login/research.md](./research.md)

### Phase 1: Design & Contracts *(Completed)*
- Thiết kế Data Model, TypeScript types và sơ đồ chuyển đổi trạng thái: [specs/002-google-login/data-model.md](./data-model.md)
- Xây dựng hợp đồng giao tiếp Frontend ↔ Backend: [specs/002-google-login/contracts/google-auth-contract.md](./contracts/google-auth-contract.md)
- Xây dựng tài liệu kiểm chứng nhanh: [specs/002-google-login/quickstart.md](./quickstart.md)
- Hoàn thiện kế hoạch thực thi: [specs/002-google-login/plan.md](./plan.md)

### Phase 2: Implementation Breakdown *(Will be detailed in tasks.md by `/speckit-tasks`)*
1. **Tiện ích và Helpers (`google-auth.utils.ts`)**:
   - `buildGoogleAuthUrl()`: Tạo URL trỏ tới `{API_BASE}/api/v1/auth/google?redirectUrl=...`.
   - `mapGoogleAuthError(errorCode)`: Ánh xạ mã lỗi sang chuỗi tiếng Việt.
   - `saveReturnUrl()`, `getAndClearReturnUrl()`: Quản lý an toàn `sessionStorage`.
2. **Giao diện Nút Bấm (`GoogleLoginButton.tsx`)**:
   - Thiết kế nút với SVG Google chính thức, hiệu ứng click & loading disabled.
3. **Tích hợp Form Đăng Nhập & Đăng Ký**:
   - Cập nhật `LoginClient.tsx` (gỡ bỏ code placeholder cũ, thay bằng `GoogleLoginButton`).
   - Cập nhật `RegisterClient.tsx` (bổ sung divider và `GoogleLoginButton`).
4. **Trang Callback (`/auth/callback`)**:
   - Tạo `page.tsx` và `CallbackClient.tsx`.
   - Hiển thị Auth Card loading trung tâm.
   - Xử lý điều hướng lỗi (toast Sonner) và điều hướng thành công (lấy profile, route admin/user/returnUrl).
