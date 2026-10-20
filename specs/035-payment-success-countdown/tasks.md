# Tasks: 035 Payment Success Countdown Redirect

**Feature**: 035 Payment Success Countdown Redirect  
**Branch**: `035-payment-success-countdown`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup

**Purpose**: Kiểm tra môi trường và chuẩn bị bộ kiểm thử hiện tại trước khi thực hiện thay đổi.

- [X] T001 Verify baseline payment result tests pass via `npm test src/app/payment/result/components/PaymentResultClient.test.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Xây dựng nền tảng hàm phân giải đích đến dùng chung và cơ chế bảo vệ chống điều hướng kép (idempotency guard) cần thiết cho mọi User Story.

⚠️ **CRITICAL**: Hoàn thành phần này trước khi triển khai chi tiết các User Story.

- [X] T002 Refactor and standardize `getTargetUrl` in `src/app/payment/result/components/PaymentResultClient.tsx` to serve as the single source of truth for both manual and auto redirect with strict open-redirect prevention (`next.startsWith('/') && !next.startsWith('//')`, flow `'purchase'` -> `'/pricing'`, default -> `'/profile?tab=wallet'`)
- [X] T003 Implement `hasRedirectedRef` idempotency guard in `src/app/payment/result/components/PaymentResultClient.tsx` to guarantee `router.replace` executes at most once across concurrent timer and click events

**Checkpoint**: Nền tảng điều hướng dùng chung sẵn sàng.

---

## Phase 3: User Story 1 - Tự động quay về trang đích sau khi thanh toán thành công (Priority: P1) 🎯 MVP

**Goal**: Hiển thị đồng hồ đếm ngược 5 giây sau khi dữ liệu tài khoản đồng bộ xong (`!isUpdating`), và tự động chuyển về đúng trang đích `getTargetUrl()` khi bộ đếm về 0 giây mà người dùng không bấm nút.

**Independent Test**:
- Mô phỏng giao dịch thành công (`code='00'`, `cancel='false'`).
- Sau khi kết thúc polling (`isUpdating = false`), nút hiển thị đếm ngược từ 5 giây.
- Sau 5 giây, hệ thống tự động gọi `router.replace` với đúng đường dẫn đích tương ứng theo `flow` và `next`.

### Tests for User Story 1

- [X] T004 [P] [US1] Add unit tests for 5-second countdown and automatic redirection for topup and purchase flows using Jest fake timers in `src/app/payment/result/components/PaymentResultClient.test.tsx`

### Implementation for User Story 1

- [X] T005 [US1] Implement countdown state (`countdown = 5`), 1-second interval timer effect activated only when `isSuccess && !isUpdating`, triggering `router.replace(getTargetUrl())` at 0 seconds, with cleanup on unmount in `src/app/payment/result/components/PaymentResultClient.tsx`
- [X] T006 [US1] Update button UI and auxiliary text to display real-time countdown `Tiếp tục (${countdown}s)` and descriptive guidance in `src/app/payment/result/components/PaymentResultClient.tsx`

**Checkpoint**: User Story 1 hoàn chỉnh và có thể kiểm thử độc lập (đạt tiêu chuẩn MVP).

---

## Phase 4: User Story 2 - Người dùng chủ động nhấn tiếp tục trong thời gian đếm ngược (Priority: P1)

**Goal**: Cho phép người dùng bấm nút "Tiếp tục" bất cứ lúc nào trong thời gian đếm ngược để chuyển hướng ngay lập tức, đồng thời dọn dẹp timer để tránh chuyển trang lặp lại.

**Independent Test**:
- Tại màn hình thanh toán thành công đang đếm ngược ở giây thứ 3, bấm nút "Tiếp tục".
- Hệ thống lập tức chuyển hướng tới trang đích và không kích hoạt thêm lệnh chuyển hướng nào khác khi hết 5 giây.

### Tests for User Story 2

- [X] T007 [P] [US2] Add unit test verifying that manual click on "Tiếp tục" during countdown navigates immediately and cancels pending timer redirect in `src/app/payment/result/components/PaymentResultClient.test.tsx`

### Implementation for User Story 2

- [X] T008 [US2] Wire button `onClick` handler to immediately invoke `router.replace(getTargetUrl())`, set `hasRedirectedRef.current = true`, and clear active interval in `src/app/payment/result/components/PaymentResultClient.tsx`

**Checkpoint**: Người dùng hoàn toàn chủ động điều hướng ngay khi muốn mà không bị xung đột với bộ đếm tự động.

---

## Phase 5: User Story 3 - Giữ nguyên màn hình khi giao dịch bị hủy hoặc không thành công (Priority: P2)

**Goal**: Đảm bảo các giao dịch bị hủy hoặc lỗi thanh toán KHÔNG khởi động bộ đếm ngược và KHÔNG tự động chuyển trang.

**Independent Test**:
- Mô phỏng trạng thái hủy (`cancel='true'`) hoặc lỗi (`code='99'`).
- Chờ qua hơn 5-10 giây; xác nhận không có bất kỳ lệnh điều hướng tự động nào được gọi và nút "Tiếp tục" không hiển thị số giây đếm ngược.

### Tests for User Story 3

- [X] T009 [P] [US3] Add unit tests verifying that cancelled and failed payment states do not start countdown timer or trigger automatic redirection in `src/app/payment/result/components/PaymentResultClient.test.tsx`

### Implementation for User Story 3

- [X] T010 [US3] Ensure countdown timer guard strictly prevents timer initialization when `!isSuccess` in `src/app/payment/result/components/PaymentResultClient.tsx`

**Checkpoint**: Tất cả các kịch bản ngoại lệ và hủy giao dịch hoạt động an toàn.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Đảm bảo chất lượng toàn diện của mã nguồn, kiểm thử hồi quy và tuân thủ tiêu chuẩn dự án.

- [X] T011 [P] Run full payment result test suite via `npm test src/app/payment/result/components/PaymentResultClient.test.tsx`
- [X] T012 [P] Verify TypeScript types via `npx tsc --noEmit` and code linting via `npm run lint`
- [X] T013 Validate end-to-end scenarios against `specs/035-payment-success-countdown/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Có thể thực hiện ngay lập tức.
- **Foundational (Phase 2)**: Phụ thuộc vào Phase 1; là điều kiện tiên quyết cho tất cả các User Stories.
- **User Story 1 (Phase 3)**: Phụ thuộc vào Phase 2. Cung cấp giá trị MVP cốt lõi.
- **User Story 2 (Phase 4)**: Phụ thuộc vào Phase 3 (kế thừa timer state và UI button).
- **User Story 3 (Phase 5)**: Phụ thuộc vào Phase 2 & 3 (xác nhận guard logic cho non-success).
- **Polish (Phase 6)**: Phụ thuộc vào việc hoàn tất tất cả các User Stories mong muốn.

### User Story Dependencies

- **User Story 1 (P1)**: Xây dựng bộ đếm và tự động điều hướng khi hoàn tất đồng bộ dữ liệu.
- **User Story 2 (P1)**: Tích hợp sự kiện click thủ công sớm với bộ đếm đã tạo ở US1.
- **User Story 3 (P2)**: Xác nhận sự cô lập của bộ đếm chỉ với trạng thái thành công.

---

## Parallel Opportunities

- **Phase 3 Tests & Phase 4 Tests**: `T004` [P] [US1] và `T007` [P] [US2] có thể được viết trong cùng file test.
- **Phase 6 Verification**: `T011` [P] và `T012` [P] có thể chạy song song độc lập.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Thực hiện Phase 1 (Setup) và Phase 2 (Foundational).
2. Triển khai Phase 3 (User Story 1 - Tự động đếm ngược 5s và chuyển về đúng trang đích).
3. Kiểm thử độc lập US1 -> Đã có thể demo hoặc đưa vào sử dụng ngay (MVP hoàn chỉnh).

### Incremental Delivery

1. Setup + Foundational -> Nền tảng điều hướng dùng chung an toàn.
2. US1 -> Tự động chuyển trang sau 5s khi thành công.
3. US2 -> Hỗ trợ click bấm tiếp tục sớm, dọn dẹp timer.
4. US3 -> Bảo đảm không tự động chuyển trang khi hủy/thất bại.
5. Polish -> Chạy test, typecheck, linting.
