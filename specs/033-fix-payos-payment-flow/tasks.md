---
description: "Task list for fixing PayOS payment flow bug (033-fix-payos-payment-flow)"
---

# Tasks: 033 Fix PayOS Payment Flow

**Input**: Design documents từ `specs/033-fix-payos-payment-flow/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/payment-result-contract.md`, `quickstart.md`).

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/payment-result-contract.md`.

**Tests**: Kiểm tra tính toàn vẹn kiểu dữ liệu TypeScript (`npx tsc --noEmit`), linting (`npm run lint`), và xác thực thủ công theo kịch bản `specs/033-fix-payos-payment-flow/quickstart.md`.

**Organization**: Tasks được phân chia theo từng User Story (US1, US2, US3, US4) để đảm bảo tính độc lập và khả năng triển khai, kiểm thử từng phần.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Chạy song song (khác file, không phụ thuộc task trước đó)
- **[Story]**: User story mà task phục vụ (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Mọi task đều có đường dẫn file cụ thể và mô tả hành động rõ ràng

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Mở rộng hợp đồng kiểu dữ liệu TypeScript tại tầng billing làm cơ sở cho toàn bộ các luồng.

- [X] T001 Mở rộng các interface `DirectPurchaseReq` (thêm `returnUrl?: string; cancelUrl?: string;`), `TopUpReq` (thêm `returnUrl?: string; cancelUrl?: string;`) và `PaymentLinkRes` (thêm `orderCode?: number;`) trong `src/features/billing/types/index.ts`

**Checkpoint**: Hợp đồng kiểu dữ liệu sẵn sàng; có thể bắt đầu xây dựng tầng nền tảng.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Xây dựng trang kết quả thanh toán công khai `/payment/result` độc lập bên ngoài route group `(user)` để loại bỏ triệt để hiện tượng văng phiên do cookie SameSite=Strict trong cross-site navigation.

**⚠️ CRITICAL**: Hoàn thành pha này trước khi triển khai các luồng nghiệp vụ chi tiết.

- [X] T002 [P] Tạo server component bọc `<Suspense>` tại `src/app/payment/result/page.tsx` bên ngoài route group `(user)`, không gọi `serverFetch('/me')` hay bất kỳ auth guard phía server nào
- [X] T003 [P] Tạo cấu trúc client component ban đầu với `'use client'` tại `src/app/payment/result/components/PaymentResultClient.tsx`, sử dụng `useSearchParams` để đọc các tham số truy vấn (`code`, `cancel`, `status`, `orderCode`, `flow`, `next`)

**Checkpoint**: Tuyến đường công khai `/payment/result` đã sẵn sàng để tiếp nhận điều hướng từ PayOS.

---

## Phase 3: User Story 1 - Nạp tiền vào ví qua cổng thanh toán và xác nhận số dư mới (Priority: P1) 🎯 MVP

**Goal**: Người dùng nạp tiền vào ví qua PayOS, được chuyển hướng về trang kết quả công khai, tự động cập nhật số dư ví qua TanStack Query polling, bấm Tiếp tục trở về tab Ví mà không bị văng sang trang đăng nhập.

**Independent Test**: Gọi nạp ví từ modal nạp tiền, PayOS điều hướng về `/payment/result?flow=topup&code=00&...&next=%2Fprofile%3Ftab%3Dwallet`, giao diện hiển thị thông báo thành công cùng mã đơn hàng, hiển thị trạng thái "Đang cập nhật...", tự động refetch số dư và lịch sử ví, bấm Tiếp tục mở đúng `/profile?tab=wallet` với số dư mới.

### Implementation for User Story 1

- [X] T004 [US1] Xây dựng logic xử lý trạng thái thành công (`code === '00' && cancel !== 'true'`), hiển thị thông tin đơn hàng `orderCode`, và cơ chế tự động thăm dò (polling 5 lần x 2s) vô hiệu hóa và refetch các query keys `['me']`, `['wallet', 'balance']`, `['wallet', 'statements']`, `['subscription', 'me']`, `['subscription', 'quota']` kèm nhãn "Đang cập nhật..." trong `src/app/payment/result/components/PaymentResultClient.tsx`
- [X] T005 [US1] Xây dựng nút hành động "Tiếp tục" trong `src/app/payment/result/components/PaymentResultClient.tsx` với logic kiểm tra an toàn chống Open Redirect (`next.startsWith('/') && !next.startsWith('//')`, fallback `/profile?tab=wallet`) và điều hướng bằng `router.replace(targetUrl)` sau khi hoàn tất chu kỳ refetch
- [X] T006 [US1] Cập nhật hàm gọi nạp tiền trong `src/features/wallet/components/TopUpModal.tsx` (dòng 30–39), thay thế `window.location.href` bằng URL kết quả động `${window.location.origin}/payment/result?flow=topup&next=${encodeURIComponent('/profile?tab=wallet')}` cho cả `returnUrl` và `cancelUrl`
- [X] T007 [P] [US1] Cập nhật component `src/features/billing/components/TopupModal.tsx` và hook mutation trong `src/features/billing/queries/billing.queries.ts` để truyền và xử lý `returnUrl` và `cancelUrl` đồng bộ với hợp đồng API nạp tiền

**Checkpoint**: User Story 1 hoàn thành — luồng nạp tiền vào ví hoạt động trơn tru từ đầu đến cuối không bị mất phiên (MVP sẵn sàng).

---

## Phase 4: User Story 2 - Đăng ký mua gói hội viên trực tiếp và quay về trang bảng giá (Priority: P1)

**Goal**: Người dùng nâng cấp gói Pro/VIP qua VietQR tại trang Bảng giá, PayOS chuyển hướng về trang kết quả thanh toán, làm mới thông tin gói hội viên và đưa người dùng trở lại trang Bảng giá thay vì trang chủ.

**Independent Test**: Bấm mua gói trả phí trên `/pricing`, PayOS điều hướng về `/payment/result?flow=purchase&code=00&...&next=%2Fpricing`, trang hiển thị thông báo mua gói thành công, bấm Tiếp tục đưa người dùng về `/pricing` với thông tin gói mới đã được cập nhật.

### Implementation for User Story 2

- [X] T008 [US2] Cập nhật hàm `handlePurchaseDirect` trong `src/features/subscription/components/PricingCard.tsx` (dòng 20–22) để tạo URL kết quả `${window.location.origin}/payment/result?flow=purchase&next=${encodeURIComponent('/pricing')}` và truyền vào `purchaseDirect.mutate({ planSlug, returnUrl: resultUrl, cancelUrl: resultUrl })`

**Checkpoint**: User Story 2 hoàn thành — luồng mua gói trực tiếp qua PayOS quay về đúng trang kết quả và bảng giá.

---

## Phase 5: User Story 3 - Xử lý thông báo khi hủy hoặc thất bại trong giao dịch thanh toán (Priority: P2)

**Goal**: Hiển thị chính xác thông báo hủy giao dịch hoặc thất bại khi người dùng bấm Hủy trên PayOS hoặc gặp sự cố, tuyệt đối không báo thành công, và cung cấp nút điều hướng quay về an toàn.

**Independent Test**: Bấm Hủy thanh toán trên cổng PayOS, trình duyệt chuyển về `/payment/result?cancel=true&status=CANCELLED...`, trang kết quả hiển thị biểu tượng và thông điệp hủy giao dịch cùng mã đơn hàng, không kích hoạt làm mới số dư/gói, bấm Tiếp tục đưa người dùng về trang trước.

### Implementation for User Story 3

- [X] T009 [US3] Bổ sung logic hiển thị giao diện trạng thái Đã hủy (`cancel === 'true' || status === 'CANCELLED'`) và trạng thái Lỗi/Đang xử lý trong `src/app/payment/result/components/PaymentResultClient.tsx`, sử dụng các component `Card`, `Button`, icon từ `lucide-react`, hiển thị `orderCode`, không kích hoạt polling refetch và cho phép người dùng bấm Tiếp tục quay lại trang đích an toàn

**Checkpoint**: User Story 3 hoàn thành — các kịch bản hủy và lỗi được xử lý tường minh, chính xác.

---

## Phase 6: User Story 4 - Điều hướng và đồng bộ trạng thái tab Ví trên trang Hồ sơ (Priority: P2)

**Goal**: Trang hồ sơ cá nhân nhận diện tham số `?tab=wallet` để mở tab Ví trực tiếp sau khi hoàn tất nạp tiền, và đồng bộ URL khi người dùng chuyển đổi qua lại giữa các tab mà không reload trang.

**Independent Test**: Truy cập trực tiếp `/profile?tab=wallet` xác nhận tab Ví được kích hoạt mặc định; chuyển sang tab Tổng quan xác nhận URL cập nhật thành `/profile?tab=overview` mà không tải lại toàn bộ trang.

### Implementation for User Story 4

- [X] T010 [US4] Cập nhật `src/app/(user)/profile/components/ProfileClient.tsx` để khởi tạo `activeTab` từ `useSearchParams().get('tab')` (mặc định `'wallet'` nếu `tab === 'wallet'`), và gọi `router.replace('/profile?tab=' + val, { scroll: false })` khi người dùng thay đổi tab

**Checkpoint**: User Story 4 hoàn thành — liên kết tab ví và URL trên trang Profile được đồng bộ hoàn hảo.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Đảm bảo chất lượng toàn diện của mã nguồn, kiểm tra phân tích tĩnh và quy tắc linting.

- [X] T011 [P] Thực thi kiểm tra phân tích tĩnh toàn bộ dự án với lệnh `npx tsc --noEmit` để đảm bảo không có lỗi kiểu dữ liệu phát sinh
- [X] T012 [P] Thực thi kiểm tra quy tắc mã nguồn với lệnh `npm run lint` để đảm bảo không vi phạm quy chuẩn linter
- [X] T013 Thực hiện xác thực hồi quy toàn diện các luồng thanh toán theo kịch bản trong `specs/033-fix-payos-payment-flow/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không phụ thuộc — bắt đầu ngay lập tức
- **Foundational (Phase 2)**: Phụ thuộc vào Phase 1 (kiểu dữ liệu trong types) — BLOCKS toàn bộ các user story
- **User Story 1 (Phase 3 - P1 MVP)**: Phụ thuộc vào Phase 2 hoàn thành — Luồng cốt lõi nạp ví và trang kết quả
- **User Story 2 (Phase 4 - P1)**: Phụ thuộc vào Phase 2 và T001 hoàn thành — Luồng mua gói trực tiếp
- **User Story 3 (Phase 5 - P2)**: Phụ thuộc vào T003 hoàn thành — Bổ sung UI hủy/lỗi trên PaymentResultClient
- **User Story 4 (Phase 6 - P2)**: Độc lập với trang kết quả — Đồng bộ tab ví trên ProfileClient
- **Polish (Phase 7)**: Phụ thuộc vào toàn bộ các task code (T001–T010) hoàn thành

### Parallel Opportunities

- **Phase 2**: `T002` (page.tsx) và `T003` (PaymentResultClient.tsx) có thể tạo khung song song
- **Phase 3**: `T006` (TopUpModal.tsx) và `T007` (billing TopupModal.tsx) có thể triển khai song song
- **Phase 4 & Phase 6**: Có thể triển khai song song với nhau do chỉnh sửa các file độc lập (`PricingCard.tsx` và `ProfileClient.tsx`)
- **Phase 7**: `T011` (tsc) và `T012` (lint) có thể chạy kiểm tra độc lập

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Hoàn thành Phase 1: Mở rộng types (`T001`)
2. Hoàn thành Phase 2: Khởi tạo route kết quả công khai (`T002`, `T003`)
3. Hoàn thành Phase 3: Hoàn thiện logic kết quả, polling refetch và liên kết từ `TopUpModal.tsx` (`T004`, `T005`, `T006`, `T007`)
4. **Xác thực MVP**: Thử nghiệm luồng nạp ví PayOS — không còn bị văng sang trang đăng nhập, số dư cập nhật thành công

### Incremental Delivery

1. Setup + Foundation + US1 (Nạp ví không bị mất phiên - MVP)
2. Thêm US2 (Mua gói trả phí không bị rơi về trang chủ)
3. Thêm US3 (Xử lý tường minh trạng thái hủy thanh toán)
4. Thêm US4 (Đồng bộ URL tab ví trên Profile)
5. Hoàn tất Polish (tsc, lint, kiểm thử xác thực)
