# Tasks: Nén ảnh WebP sắc nét & Giới hạn dung lượng video tải lên (Media Compression & Video Upload Limits)

**Feature**: `030-media-compression-video-limit` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Định nghĩa cấu trúc dữ liệu và các interface TypeScript cho cơ chế nén ảnh phía client.

- [X] T001 [P] Define TypeScript interfaces `CompressionOptions` and `CompressionResult` in `src/lib/image-compression.ts` per `specs/030-media-compression-video-limit/data-model.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Xây dựng hàm tiện ích nén ảnh WebP độc lập và bộ unit test kiểm thử tự động.

**⚠️ CRITICAL**: Không bắt đầu triển khai các User Story cho đến khi hoàn tất Phase này.

- [X] T002 Implement core `compressImageToWebP` and `compressImageWithStats` utilities using HTML5 Canvas (`canvas.toBlob('image/webp', 0.85)`), aspect-ratio preservation, max dimension bounding (2048px), alpha transparency support, and size safeguard in `src/lib/image-compression.ts`
- [X] T003 [P] Create comprehensive unit tests for image compression covering WebP conversion, dimension scaling, quality settings, size safeguard, and fallback when canvas fails in `src/lib/image-compression.test.ts`

**Checkpoint**: Nền tảng hàm nén ảnh WebP đã sẵn sàng và được kiểm thử độc lập — có thể bắt đầu tích hợp vào các tính năng người dùng.

---

## Phase 3: User Story 1 - Tự động nén ảnh WebP sắc nét khi tải trang phục vào tủ đồ (Priority: P1) 🎯 MVP

**Goal**: Tự động nén các hình ảnh tải lên tủ đồ cá nhân (tối đa 5 ảnh) sang định dạng WebP với mức chất lượng sắc nét (quality 0.85) trước khi upload lên Cloudinary, giúp giảm 50% - 80% dung lượng tệp nhưng không làm mờ hay mất nét hoa văn trang phục.

**Independent Test**: Mở `/wardrobe/upload`, chọn ảnh chụp dung lượng lớn (3MB - 6MB), bấm "Tải lên & Phân tích", kiểm tra trong Network tab thấy tệp upload mang định dạng `.webp` với dung lượng giảm sâu dưới 1MB và ảnh hiển thị trên tủ đồ sắc nét hoàn hảo.

### Implementation for User Story 1

- [X] T004 [US1] Integrate `compressImageToWebP` into `handleUploadAndAnalyze` before calling `uploadToCloudinary` in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`
- [X] T005 [US1] Add compression error handling and safe fallback so any failed image compression gracefully falls back to the original file in `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`
- [X] T006 [P] [US1] Integrate `compressImageToWebP` into admin batch wardrobe upload before calling `uploadToCloudinary` in `src/app/admin/wardrobe/components/BatchUploadModal.tsx`

**Checkpoint**: User Story 1 hoàn tất độc lập — người dùng tải đồ vào tủ đồ được tối ưu hóa dung lượng WebP tự động và mượt mà.

---

## Phase 4: User Story 2 - Tự động nén ảnh WebP sắc nét khi đăng bài chia sẻ trên cộng đồng (Priority: P1)

**Goal**: Tự động nén các hình ảnh đính kèm (tối đa 10 ảnh) trong trình soạn thảo bài viết cộng đồng sang WebP sắc nét trước khi tải lên Cloudinary, đảm bảo bài viết tải lên nhanh và hiển thị sống động trên News Feed.

**Independent Test**: Mở modal "Tạo bài viết" trên `/community`, chọn 3 ảnh kích thước lớn, bấm "Đăng bài", kiểm tra các tệp ảnh được nén sang WebP trước khi gửi lên Cloudinary và bài viết hiển thị đầy đủ hình ảnh sắc nét.

### Implementation for User Story 2

- [X] T007 [US2] Integrate `compressImageToWebP` into `handleSubmit` for media items with `mediaType === 'image'` before calling `uploadToCloudinary` in `src/features/community/components/PostComposerModal.tsx`
- [X] T008 [US2] Ensure compressed WebP files pass correct filename (`.webp`), MIME type `image/webp`, and Cloudinary upload signature allowed formats (`allowed_formats`) in `src/features/community/components/PostComposerModal.tsx`

**Checkpoint**: User Story 2 hoàn tất độc lập — ảnh đăng tải lên cộng đồng luôn được tối ưu WebP siêu nhẹ mà vẫn giữ trọn vẹn vẻ đẹp thời trang.

---

## Phase 5: User Story 3 - Chặn và từ chối tệp video vượt quá 100MB ở bài đăng cộng đồng (Priority: P1)

**Goal**: Chặn tức thì mọi tệp video có dung lượng lớn hơn 100MB ($104,857,600\text{ bytes}$) ngay khi người dùng chọn tệp trong modal soạn bài viết cộng đồng, không tải thẻ video metadata, không xin chữ ký upload và hiển thị thông báo lỗi rõ ràng bằng tiếng Việt.

**Independent Test**: Mở modal "Tạo bài viết" tại `/community`, chọn tệp video 105MB, xác nhận tệp bị từ chối ngay lập tức, xuất hiện toast lỗi: `"Video '[Tên tệp]' vượt quá dung lượng tối đa 100MB."` và không phát sinh bất kỳ request mạng nào.

### Implementation for User Story 3

- [X] T009 [US3] Update `validateMediaFile` to enforce `file.size > 100 * 1024 * 1024` (104,857,600 bytes) as top priority for video files, returning exact message `Video "${file.name}" vượt quá dung lượng tối đa 100MB.` and preventing metadata loading for oversized files in `src/features/community/utils/community.utils.ts`
- [X] T010 [P] [US3] Add unit tests for 100MB video size boundary validation (100MB, 100MB + 1 byte, 105MB, and non-video files) in `src/features/community/utils/community.utils.test.ts`
- [X] T011 [US3] Verify immediate error toast and rejection behavior in `handleFilesSelected` so oversized videos are never added to `mediaList` in `src/features/community/components/PostComposerModal.tsx`

**Checkpoint**: User Story 3 hoàn tất độc lập — hệ thống được bảo vệ an toàn trước các tệp video quá khổ, mang lại phản hồi nhanh chóng cho người dùng.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Chạy toàn bộ các bộ kiểm thử tự động, xác thực kịch bản thực tế và rà soát chất lượng mã nguồn.

- [X] T012 [P] Execute unit test suites with `npm test -- src/lib/image-compression.test.ts` and `npm test -- src/features/community/utils/community.utils.test.ts` to ensure 100% pass rate
- [X] T013 Validate end-to-end manual testing scenarios according to `specs/030-media-compression-video-limit/quickstart.md`
- [X] T014 Perform code cleanup, TypeScript type-check, and lint verification across modified files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không có phụ thuộc — có thể bắt đầu ngay.
- **Foundational (Phase 2)**: Phụ thuộc vào Phase 1 — **BLOCKS** tất cả User Stories.
- **User Story 1 (Phase 3 - MVP)**: Phụ thuộc vào Phase 2 hoàn tất — có thể triển khai độc lập.
- **User Story 2 (Phase 4)**: Phụ thuộc vào Phase 2 hoàn tất — có thể triển khai song song hoặc sau US1.
- **User Story 3 (Phase 5)**: Có thể triển khai độc lập ngay sau Phase 2 (hoặc song song với US1, US2 vì nằm ở `community.utils.ts`).
- **Polish (Phase 6)**: Phụ thuộc vào tất cả các User Stories hoàn tất.

### Parallel Opportunities

- **Phase 1 & Phase 2**: `T001` (Setup interfaces), `T002` (Compression logic) và `T003` (Unit tests) có thể phát triển song song theo chuẩn TDD.
- **Giữa các User Stories**:
  - `US1` (Wardrobe upload: `T004`, `T005`, `T006`) và `US3` (Community video validation: `T009`, `T010`) hoàn toàn tác động lên các tệp khác nhau, có thể thực hiện song song 100%.
  - `US2` (`T007`, `T008`) và `US3` (`T011`) cùng tương tác trong `PostComposerModal.tsx` nên thực hiện tuần tự để tránh xung đột mã nguồn.

---

## Parallel Example: User Story 1 & User Story 3

```bash
# Developer A (User Story 1 - Wardrobe WebP Compression):
Task T004: "Integrate compressImageToWebP into handleUploadAndAnalyze in src/app/(user)/wardrobe/upload/components/UploadClient.tsx"
Task T005: "Add compression error handling in src/app/(user)/wardrobe/upload/components/UploadClient.tsx"

# Developer B (User Story 3 - Community Video Size Limit):
Task T009: "Update validateMediaFile in src/features/community/utils/community.utils.ts"
Task T010: "Add unit tests for 100MB video size boundary validation in src/features/community/utils/community.utils.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Hoàn tất Phase 1: Setup (`T001`)
2. Hoàn tất Phase 2: Foundational (`T002`, `T003`)
3. Hoàn tất Phase 3: User Story 1 (`T004`, `T005`, `T006`)
4. **STOP & VALIDATE**: Kiểm thử nén ảnh WebP ở tủ đồ độc lập. Đây là cốt lõi MVP!

### Incremental Delivery

1. Setup + Foundational $\rightarrow$ Đã có thư viện nén WebP độc lập.
2. Thêm User Story 1 $\rightarrow$ Tủ đồ upload ảnh WebP siêu nhẹ, siêu nét (MVP).
3. Thêm User Story 2 $\rightarrow$ Đăng bài cộng đồng upload ảnh WebP mượt mà.
4. Thêm User Story 3 $\rightarrow$ Chặn đứng video $> 100\text{MB}$ bảo vệ đường truyền và bộ nhớ.
5. Polish $\rightarrow$ Chạy toàn bộ test suite và hoàn thiện tài liệu.
