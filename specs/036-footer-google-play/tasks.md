# Tasks: 036 Tích hợp Huy hiệu Google Play và Tái cấu trúc Footer

**Feature**: 036 Tích hợp Huy hiệu Google Play và Tái cấu trúc Footer  
**Branch**: `036-footer-google-play`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup

**Purpose**: Rà soát chân trang hiện tại và kiểm tra hiện trạng mã nguồn trước khi triển khai.

- [X] T001 Review existing footer structure and baseline APK link in `src/app/(guest)/components/LandingClient.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Xây dựng component dùng chung `GooglePlayBadge` và bộ kiểm thử đơn vị nền tảng trước khi tích hợp vào giao diện footer.

⚠️ **CRITICAL**: Hoàn thành giai đoạn này trước khi tiến hành cập nhật giao diện trong các User Story.

- [X] T002 Create `GooglePlayBadge` presentation component with inline official Google Play vector SVG icon, dual-tier typography ("TẢI TRÊN" / "Google Play"), secure external link attributes (`target="_blank"`, `rel="noopener noreferrer"`), and default URL `https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share` in `src/components/common/GooglePlayBadge.tsx`
- [X] T003 [P] Create unit test suite verifying SVG rendering, destination URL, security attributes, and accessible labels in `src/components/common/GooglePlayBadge.test.tsx`

**Checkpoint**: Component `GooglePlayBadge` sẵn sàng hoạt động độc lập và đạt chuẩn kiểm thử.

---

## Phase 3: User Story 1 - Tải và truy cập ứng dụng trên Google Play từ Footer (Priority: P1) 🎯 MVP

**Goal**: Thay thế hoàn toàn liên kết tải file APK thủ công cũ (`/downloads/closy.apk`) bằng huy hiệu `GooglePlayBadge` tại chân trang, mở đúng trang Google Play của Closy.

**Independent Test**:
- Truy cập trang chủ, cuộn xuống chân trang (footer).
- Xác nhận nút/huy hiệu Google Play hiển thị rõ ràng.
- Nhấp vào nút: trình duyệt mở tab mới dẫn đến `https://play.google.com/store/apps/details?id=online.hycat.closy&pcampaignid=web_share`.
- Xác nhận đường dẫn `Tải file APK` (`/downloads/closy.apk`) đã bị gỡ bỏ hoàn toàn khỏi chân trang.

### Implementation for User Story 1

- [X] T004 [US1] Remove legacy APK download link (`href="/downloads/closy.apk"`) from footer in `src/app/(guest)/components/LandingClient.tsx`
- [X] T005 [US1] Integrate `GooglePlayBadge` component into footer with official destination link in `src/app/(guest)/components/LandingClient.tsx`

**Checkpoint**: User Story 1 hoàn chỉnh và có thể kiểm thử độc lập (đạt chuẩn MVP).

---

## Phase 4: User Story 2 - Bố cục chân trang được tổ chức lại hiện đại, cân đối và trực quan (Priority: P2)

**Goal**: Tái cấu trúc khu vực footer thành hệ thống bố cục 3 cột hiện đại, cân đối (Thương hiệu & Khẩu hiệu, Liên kết điều hướng & Pháp lý, Kêu gọi tải ứng dụng di động) kèm thanh đáy bản quyền (Bottom bar).

**Independent Test**:
- Kiểm tra trên Desktop: Bố cục 3 cột thoáng đãng, cân đối thị giác, tên thương hiệu `CLOSY` sáng rõ không bị chìm nền.
- Kiểm tra trên Mobile (320px - 375px): Các khối tự động xếp chồng theo chiều dọc gọn gàng, touch target thoải mái cho ngón tay (>= 44px), không xuất hiện thanh cuộn ngang.

### Implementation for User Story 2

- [X] T006 [US2] Reorganize footer in `src/app/(guest)/components/LandingClient.tsx` into a 3-column responsive grid layout separating Brand, Navigation/Legal links (`/privacy`, `/delete-account`, `mailto:...`), and Mobile App Download section
- [X] T007 [US2] Enhance brand identity block with high-contrast `CLOSY` logo styling, product tagline, and structured bottom bar copyright divider in `src/app/(guest)/components/LandingClient.tsx`

**Checkpoint**: Chân trang sở hữu diện mạo hiện đại, phân tầng thông tin rõ ràng và hiển thị hoàn hảo trên mọi kích thước màn hình.

---

## Phase 5: User Story 3 - Phản hồi tương tác và khả năng tiếp cận (Accessibility & Micro-interactions) (Priority: P3)

**Goal**: Bổ sung hiệu ứng tương tác vi mô mượt mà, hỗ trợ chuẩn trợ năng WCAG AA và phím điều hướng `Tab` cho toàn bộ liên kết và nút tải Google Play.

**Independent Test**:
- Rê chuột vào `GooglePlayBadge`: Nút có hiệu ứng viền sáng nhẹ hoặc phóng to vi mô `hover:scale-[1.02]`.
- Sử dụng phím `Tab` di chuyển qua các liên kết: Xuất hiện vòng tiêu điểm sáng nét (`focus-visible:ring-2 focus-visible:ring-[#D9C5B2]`).
- Trình đọc màn hình phát hiện đúng vai trò và nhãn `aria-label="Tải ứng dụng Closy trên Google Play"`.

### Implementation for User Story 3

- [X] T008 [P] [US3] Add interactive hover transitions, subtle scale, and accessible `focus-visible` ring styling to `GooglePlayBadge` in `src/components/common/GooglePlayBadge.tsx`
- [X] T009 [US3] Apply unified focus-visible ring styles and smooth hover color transitions to all footer navigation links in `src/app/(guest)/components/LandingClient.tsx`

**Checkpoint**: Trải nghiệm tương tác đạt chất lượng cao cấp và tuân thủ chuẩn trợ năng.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Kiểm thử hồi quy, bảo đảm không có lỗi kiểu dữ liệu hoặc linting, và xác thực toàn diện giao diện.

- [X] T010 [P] Run unit test suite via `npm test -- GooglePlayBadge` to verify 100% test pass
- [X] T011 [P] Verify TypeScript types via `npx tsc --noEmit` and code linting via `npm run lint`
- [X] T012 Validate all manual scenarios against `specs/036-footer-google-play/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1: Setup
    │
    ▼
Phase 2: Foundational (T002, T003 [P]) ──► BLOCKS all User Stories
    │
    ├──────────────────────────┐
    ▼                          ▼
Phase 3: User Story 1 (P1)   Phase 4: User Story 2 (P2)
    │                          │
    └──────────┬───────────────┘
               ▼
Phase 5: User Story 3 (P3)
    │
    ▼
Phase 6: Polish & Validation (T010 [P], T011 [P], T012)
```

### User Story Dependencies

- **User Story 1 (P1)**: Bắt đầu ngay sau khi hoàn thành Phase 2 (Foundational) - Tạo MVP hoàn chỉnh.
- **User Story 2 (P2)**: Triển khai trực tiếp trên layout của footer sau khi User Story 1 đã tích hợp component.
- **User Story 3 (P3)**: Hoàn thiện hiệu ứng vi mô và trợ năng cho các thành phần đã dựng ở US1 và US2.

### Parallel Opportunities

- **T003 [P]** có thể viết song song với **T002** (TDD hoặc kiểm thử đơn vị độc lập).
- **T008 [P]** có thể tinh chỉnh độc lập trên `GooglePlayBadge.tsx` song song với **T009** trên `LandingClient.tsx`.
- **T010 [P]** và **T011 [P]** trong Phase 6 có thể chạy song song để kiểm tra chất lượng code.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Hoàn thành **T001** (Setup).
2. Xây dựng **T002** & **T003** (Foundational `GooglePlayBadge`).
3. Triển khai **T004** & **T005** (Gỡ link APK và gắn huy hiệu Google Play vào footer).
4. **Xác thực MVP**: Người dùng đã có thể nhấn vào nút Google Play để mở CH Play thay vì tải APK.

### Incremental Delivery
1. Đạt mốc MVP (US1).
2. Tái cấu trúc layout 3 cột hiện đại và sang trọng cho footer (US2).
3. Thêm hiệu ứng vi mô, vòng tiêu điểm phím Tab và trợ năng ARIA (US3).
4. Chạy toàn bộ test, tsc type-check và linting để chốt phát hành (Phase 6).
