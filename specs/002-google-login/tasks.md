# Tasks: Đăng nhập Google (Frontend Web)

**Branch**: `002-google-login`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Danh sách công việc triển khai tính năng Đăng nhập Google cho Frontend Web (`smart-wardrobe-fe`) theo luồng Web Authorization Code Redirect.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Khởi tạo thư mục và cấu trúc nền tảng cho tính năng Google Login

- [x] T001 Tạo cấu trúc thư mục `src/app/(guest)/auth/callback/components` và `src/features/auth/utils`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Các kiểu dữ liệu, hàm tiện ích và component dùng chung cần hoàn thiện trước khi triển khai các User Story

**⚠️ CRITICAL**: Không thể bắt đầu thực hiện User Story khi chưa hoàn thành giai đoạn này

- [x] T002 [P] Định nghĩa TypeScript types (`GoogleAuthErrorCode`, `GoogleCallbackQueryParams`, `AuthReturnUrl`) trong `src/features/auth/types/google-auth.types.ts`
- [x] T003 [P] Cài đặt các tiện ích Google Auth (`buildGoogleAuthUrl`, `mapGoogleAuthError`, `saveReturnUrl`, `getAndClearReturnUrl`, `isValidReturnUrl`) trong `src/features/auth/utils/google-auth.utils.ts`
- [x] T004 [P] Tạo component `GoogleLoginButton` với SVG Google chính thức và hiệu ứng loading trong `src/features/auth/components/GoogleLoginButton.tsx`

**Checkpoint**: Nền tảng tiện ích và UI component sẵn sàng - có thể tiến hành triển khai các User Story

---

## Phase 3: User Story 1 - Người dùng đăng nhập thành công bằng tài khoản Google (Priority: P1) 🎯 MVP

**Goal**: Người dùng nhấn "Đăng nhập bằng Google", chuyển sang Google ủy quyền, quay lại `/auth/callback`, tự động xác nhận phiên qua HttpOnly cookie và điều hướng vào ứng dụng.

**Independent Test**: Nhấn nút "Đăng nhập bằng Google" từ `/auth/login` hoặc `/auth/register`, chuyển hướng tới Google, callback trả về không kèm lỗi, giao diện gọi `GET /api/v1/me` thành công, hiển thị toast thành công và đưa vào `/brands` (hoặc `/admin/dashboard`).

### Implementation for User Story 1

- [x] T005 [P] [US1] Xây dựng component giao diện chờ Auth Card với animation loading và logo Closy trong `src/app/(guest)/auth/callback/components/CallbackLoadingCard.tsx`
- [x] T006 [US1] Xây dựng component `CallbackClient` xử lý kiểm tra phiên đăng nhập (`profileApi.getProfile()`), cập nhật React Query cache (`['authStatus']`, `PROFILE_QUERY_KEY`) và điều hướng theo vai trò người dùng trong `src/app/(guest)/auth/callback/components/CallbackClient.tsx`
- [x] T007 [US1] Tạo route Server Component `/auth/callback` bọc `CallbackClient` trong Suspense boundary tại `src/app/(guest)/auth/callback/page.tsx`
- [x] T008 [P] [US1] Tích hợp `GoogleLoginButton` kèm divider "HOẶC TIẾP TỤC VỚI" vào form đăng nhập tại `src/app/(guest)/auth/login/components/LoginClient.tsx`
- [x] T009 [P] [US1] Tích hợp `GoogleLoginButton` kèm divider "HOẶC TIẾP TỤC VỚI" vào form đăng ký tại `src/app/(guest)/auth/register/components/RegisterClient.tsx`

**Checkpoint**: User Story 1 (MVP) hoàn chỉnh - luồng đăng nhập Google Happy Path có thể chạy độc lập

---

## Phase 4: User Story 2 - Tiếp nhận và xử lý các kịch bản lỗi từ Google hoặc Backend (Priority: P2)

**Goal**: Khi callback trả về có query parameter `?error=<code>`, diễn giải sang thông báo tiếng Việt thân thiện, bắn Toast Sonner và đưa người dùng về `/auth/login`.

**Independent Test**: Truy cập trực tiếp `http://localhost:3000/auth/callback?error=access_denied` hoặc `?error=account_disabled`, xác nhận màn hình tự động chuyển về `/auth/login` và toast Sonner hiển thị đúng nội dung thông báo.

### Implementation for User Story 2

- [x] T010 [US2] Cập nhật `CallbackClient` trong `src/app/(guest)/auth/callback/components/CallbackClient.tsx` để đọc query `error`, kích hoạt Sonner toast (`toast.error` / `toast.info`) và gọi `router.replace('/auth/login')`
- [x] T011 [US2] Viết unit tests kiểm thử hàm `mapGoogleAuthError` và `isValidReturnUrl` với đầy đủ 8 mã lỗi trong `src/features/auth/utils/__tests__/google-auth.utils.test.ts`

**Checkpoint**: User Story 1 và 2 đều hoạt động độc lập và vững chắc trước các kịch bản lỗi

---

## Phase 5: User Story 3 - Duy trì ngữ cảnh trang đích sau khi đăng nhập Google (Priority: P3)

**Goal**: Giữ nguyên trang người dùng đang xem dở trước khi đăng nhập (ví dụ: `/wardrobe` hoặc xem sản phẩm) để quay về đúng trang đó sau khi callback thành công.

**Independent Test**: Đăng nhập từ URL có `?returnUrl=%2Fwardrobe`, sau khi callback hoàn tất xác nhận trang đích đến là `/wardrobe` và `closy_auth_return_url` trong `sessionStorage` đã được dọn sạch.

### Implementation for User Story 3

- [x] T012 [US3] Cập nhật `GoogleLoginButton` trong `src/features/auth/components/GoogleLoginButton.tsx` để đọc `returnUrl` từ URL hiện tại hoặc props, kiểm tra an toàn và lưu vào `sessionStorage` trước khi redirect
- [x] T013 [US3] Cập nhật `CallbackClient` trong `src/app/(guest)/auth/callback/components/CallbackClient.tsx` để ưu tiên đọc `returnUrl` từ `sessionStorage`, xóa khóa và điều hướng về trang đích thay vì trang mặc định

**Checkpoint**: Cả 3 User Story đều hoạt động hoàn chỉnh và liên kết thông suốt

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Kiểm tra chất lượng, xác thực bảo mật và hoàn tất tài liệu

- [x] T014 [P] Cập nhật tài liệu hướng dẫn frontend cho Google Auth trong `docs/api/google-login.md`
- [x] T015 Kiểm tra TypeScript compilation và ESLint rules bằng lệnh `npm run build`
- [x] T016 Thực hiện kiểm chứng toàn bộ 5 kịch bản theo tài liệu `specs/002-google-login/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không có phụ thuộc - thực hiện ngay
- **Foundational (Phase 2)**: Phụ thuộc vào Setup (Phase 1) - **BLOCKS toàn bộ User Stories**
- **User Story 1 (Phase 3 - MVP)**: Phụ thuộc vào Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Phụ thuộc vào User Story 1 (kế thừa `CallbackClient`)
- **User Story 3 (Phase 5)**: Phụ thuộc vào User Story 1 & 2
- **Polish (Phase 6)**: Phụ thuộc vào việc hoàn thành các User Stories

### Parallel Opportunities

- Phase 2: T002, T003, T004 có thể chạy song song (file độc lập).
- Phase 3: T005, T008, T009 có thể chạy song song với nhau.
- Phase 6: T014 có thể chạy song song với kiểm thử.

---

## Parallel Example: User Story 1

```bash
# Thực hiện đồng thời các component UI độc lập:
Task: "T005 [P] [US1] Xây dựng component CallbackLoadingCard trong src/app/(guest)/auth/callback/components/CallbackLoadingCard.tsx"
Task: "T008 [P] [US1] Tích hợp GoogleLoginButton vào LoginClient.tsx trong src/app/(guest)/auth/login/components/LoginClient.tsx"
Task: "T009 [P] [US1] Tích hợp GoogleLoginButton vào RegisterClient.tsx trong src/app/(guest)/auth/register/components/RegisterClient.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Hoàn thành Phase 1 (Setup) & Phase 2 (Foundational).
2. Hoàn thành Phase 3 (User Story 1).
3. **STOP & VALIDATE**: Kiểm thử độc lập luồng Happy Path (đăng nhập thành công vào `/brands`).
4. Triển khai tiếp Phase 4 (Xử lý lỗi) và Phase 5 (Bảo toàn `returnUrl`).
