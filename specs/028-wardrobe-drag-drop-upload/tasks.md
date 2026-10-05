# Tasks: Kéo thả tệp hình ảnh vào tủ đồ (Wardrobe Drag & Drop Upload)

**Feature**: `028-wardrobe-drag-drop-upload` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Định nghĩa cấu trúc dữ liệu, kiểu TypeScript và hàm tiện ích xác thực tệp cho tính năng kéo thả.

- [X] T001 [P] Define drag & drop types, states, and validation interfaces in `src/features/wardrobe/types/dropzone.ts`
- [X] T002 [P] Create file validation utility `validateDroppedFiles` with MIME, extension, size (5MB), and capacity slicing in `src/features/wardrobe/utils/file-validation.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Xây dựng custom hook `useFileDropzone` và bộ kiểm thử tự động trước khi tích hợp vào giao diện người dùng.

**⚠️ CRITICAL**: Không bắt đầu triển khai các User Story cho đến khi hoàn tất Phase này.

- [X] T003 Implement core `useFileDropzone` custom hook with DOM depth counter (flicker prevention), window-level default prevention, and validation dispatch in `src/features/wardrobe/hooks/useFileDropzone.ts`
- [X] T004 [P] Create comprehensive unit tests for `useFileDropzone` covering dragenter, dragleave counter, drop events, and limit slicing in `src/features/wardrobe/hooks/useFileDropzone.test.ts`

**Checkpoint**: Nền tảng hook kéo thả và bộ test đã sẵn sàng — có thể bắt đầu tích hợp vào giao diện.

---

## Phase 3: User Story 1 - Kéo thả tệp hình ảnh vào khu vực tải ảnh trống (Priority: P1) 🎯 MVP

**Goal**: Cho phép người dùng kéo thả 1–5 ảnh từ thư mục máy tính vào khung tải ảnh khi chưa chọn ảnh nào, hiển thị hiệu ứng trực quan sinh động và tự động chuyển sang màn hình danh sách xem trước.

**Independent Test**: Mở `/wardrobe/upload` khi chưa có ảnh nào, kéo thả 1–5 tệp ảnh vào khung nét đứt, xác nhận khung đổi sang viền `border-primary`, hiển thị nhãn "Thả file vào đây để tải lên", nhả chuột và kiểm tra danh sách xem trước hiển thị đầy đủ các ảnh vừa thả.

### Implementation for User Story 1

- [X] T005 [US1] Integrate `useFileDropzone` into the empty state upload container in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`
- [X] T006 [US1] Implement active drag visual state (border-primary, background accent tint, dynamic label "Thả file vào đây để tải lên", icon scale animation) for empty dropzone in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`
- [X] T007 [US1] Wire dropped files to preview state and trigger GSAP entrance animation to preview container in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`

**Checkpoint**: User Story 1 hoàn tất độc lập — người dùng có thể kéo thả ảnh từ thư mục để nạp vào tủ đồ thay vì chỉ bấm nút chọn tệp.

---

## Phase 4: User Story 3 - Kiểm tra định dạng tệp và thông báo lỗi kéo thả thân thiện (Priority: P1)

**Goal**: Ngăn chặn các tệp sai định dạng (PDF, DOCX, ZIP, v.v.), tệp vượt quá 5MB, thư mục hoặc tệp trùng lặp, đồng thời hiển thị thông báo toast tiếng Việt thân thiện qua Sonner mà không gây lỗi giao diện.

**Independent Test**: Kéo thả tệp `.pdf` hoặc tệp ảnh lớn hơn 5MB vào vùng dropzone, xác nhận tệp bị từ chối, xuất hiện toast lỗi tiếng Việt tương ứng và vùng dropzone không bị crash.

### Implementation for User Story 3

- [X] T008 [US3] Wire Vietnamese toast notifications for invalid file format, size exceeding 5MB, folder drop, and duplicate files in `src/features/wardrobe/hooks/useFileDropzone.ts`
- [X] T009 [US3] Implement drag reject visual state (border-destructive, red tint, warning feedback) when hovering invalid items in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`
- [X] T010 [US3] Add disabled state guarding dropzone when uploadState.status is not idle (`isUploading` is true) in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`

**Checkpoint**: User Story 3 hoàn tất độc lập — hệ thống được bảo vệ vững chắc trước dữ liệu không hợp lệ.

---

## Phase 5: User Story 2 - Kéo thả bổ sung hình ảnh trong màn hình xem trước (Priority: P2)

**Goal**: Cho phép người dùng kéo thả thêm ảnh khi danh sách xem trước đang có từ 1 đến 4 ảnh, hỗ trợ thẻ "Thêm ảnh" tương tác và cơ chế cắt lát hạn mức (Partial Slicing) nếu vượt quá 5 ảnh.

**Independent Test**: Đang có 2 ảnh trong danh sách xem trước, kéo thả thêm 2 ảnh vào ô Thêm ảnh, xác nhận danh sách cập nhật thành 4/5 ảnh; kéo thả 4 ảnh khi đã có 3 ảnh thì nhận 2 ảnh đầu tiên và hiển thị cảnh báo bỏ qua 2 ảnh còn lại.

### Implementation for User Story 2

- [X] T011 [US2] Implement dedicated dropzone '+ Thêm ảnh' card in the preview grid when files count is under 5 in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`
- [X] T012 [US2] Wire container-level drop with capacity slicing (maximum 5 items total) and warning toast in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`

**Checkpoint**: User Story 2 hoàn tất độc lập — trải nghiệm kéo thả liền mạch xuyên suốt cả hai bước tải ảnh.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hoàn thiện khả năng truy cập (accessibility), chạy toàn bộ bộ kiểm thử và kiểm tra chất lượng tổng thể.

- [X] T013 [P] Ensure keyboard accessibility and fallback `<input type="file">` file dialog click trigger work seamlessly alongside drag-drop in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`
- [X] T014 Execute unit test suite with `npm test -- useFileDropzone` in `src/features/wardrobe/hooks/useFileDropzone.test.ts`
- [X] T015 Validate all manual verification scenarios according to `specs/028-wardrobe-drag-drop-upload/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không có phụ thuộc — thực thi đầu tiên (T001, T002 có thể chạy song song).
- **Foundational (Phase 2)**: Phụ thuộc vào Phase 1 — **BLOCKS** tất cả User Stories.
- **User Story 1 (Phase 3 - MVP)**: Phụ thuộc vào Phase 2 hoàn tất.
- **User Story 3 (Phase 4)**: Phụ thuộc vào Phase 2 & Phase 3 (bổ sung validation và reject visual state).
- **User Story 2 (Phase 5)**: Phụ thuộc vào Phase 3 (màn hình preview đã tích hợp dropzone).
- **Polish (Phase 6)**: Phụ thuộc vào tất cả các User Stories hoàn tất.

### Parallel Opportunities

- **Phase 1**: `T001` (Types) và `T002` (Validation utility) có thể thực thi song song.
- **Phase 2**: `T004` (Unit test) có thể viết song song với `T003` (Hook implementation) theo phong cách TDD.
- **Phase 6**: `T013` (Accessibility check) có thể chạy độc lập.

---

## Parallel Example: Foundational Phase

```bash
# Developer A hoặc Task 1:
Task: "Implement core useFileDropzone custom hook in src/features/wardrobe/hooks/useFileDropzone.ts"

# Developer B hoặc Task 2:
Task: "Create comprehensive unit tests in src/features/wardrobe/hooks/useFileDropzone.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Hoàn thành **Phase 1: Setup** (T001, T002).
2. Hoàn thành **Phase 2: Foundational** (T003, T004).
3. Hoàn thành **Phase 3: User Story 1** (T005, T006, T007).
4. **DỪNG LẠI & KIỂM THỬ**: Thử nghiệm kéo thả 1–5 ảnh vào màn hình trống `/wardrobe/upload`. Lúc này đã có MVP hoàn chỉnh bàn giao được cho người dùng!

### Incremental Delivery

1. Setup + Foundational -> Nền tảng kéo thả hoàn tất.
2. User Story 1 (P1) -> Kéo thả vào vùng trống hoạt động (MVP).
3. User Story 3 (P1) -> Xác thực tệp và phản hồi lỗi thân thiện, bảo vệ hệ thống.
4. User Story 2 (P2) -> Kéo thả bổ sung ở màn hình xem trước.
5. Polish -> Chạy test và hoàn thiện chi tiết giao diện.
