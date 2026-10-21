---
description: "Task list for fixing avatar upload invalid signature bug (032-fix-avatar-signature)"
---

# Tasks: 032 Fix Avatar Signature Upload

**Input**: Design documents từ `specs/032-fix-avatar-signature/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/cloudinary-avatar-upload.md`, `quickstart.md`).

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/cloudinary-avatar-upload.md`.

**Tests**: Bao gồm các task kiểm thử tự động với Jest (`src/lib/cloudinary.test.ts`) và kiểm tra kiểu dữ liệu TypeScript (`npx tsc --noEmit`) để xác thực tính toàn vẹn của hợp đồng biểu mẫu gửi lên Cloudinary.

**Organization**: Tasks được tổ chức theo User Stories (US1, US2, US3) từ `spec.md` để hỗ trợ triển khai và kiểm thử độc lập từng giai đoạn.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Chạy song song (khác file hoặc kiểm thử độc lập, không phụ thuộc task trước)
- **[Story]**: User story mà task thuộc về (`[US1]`, `[US2]`, `[US3]`)
- Mọi task đều có đường dẫn file cụ thể và các ràng buộc dữ liệu được trích dẫn chính xác

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Xác nhận cấu hình Cloudinary và môi trường kiểm thử sẵn có trong dự án.

- [X] T001 Xác nhận cấu hình biến môi trường `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` và fallback mặc định `"dzvwkngxu"` trong `src/lib/cloudinary.ts`

**Checkpoint**: Môi trường và các tham số cơ sở sẵn sàng; có thể bắt đầu pha nền tảng.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cập nhật hợp đồng kiểu dữ liệu cốt lõi tại tầng API client trước khi cập nhật thư viện upload và các component giao diện.

**CRITICAL**: Hoàn thành pha này trước khi triển khai các user stories.

- [X] T002 Bổ sung trường `publicId?: string` vào kiểu trả về của phương thức `profileApi.getAvatarSignature` trong `src/features/profile/api/profile.api.ts` để khớp hoàn toàn với response backend `UploadSignatureResult` theo `docs/api/identity/me-api.md §5`

**Checkpoint**: Kiểu dữ liệu API đã đồng bộ; user story implementation có thể bắt đầu.

---

## Phase 3: User Story 1 - Tải lên và cập nhật ảnh đại diện cá nhân thành công (Priority: P1) 🎯 MVP

**Goal**: Người dùng tải ảnh đại diện lên thành công từ giao diện web (`/profile` và `/profile/edit`) mà không bị lỗi `Invalid Signature`.

**Independent Test**: Gọi hàm `uploadToCloudinary` với `signatureParams` chứa `publicId`, kiểm tra `FormData` gửi đi được bổ sung `overwrite = "true"`, upload thành công và avatar mới hiển thị trên hồ sơ cá nhân.

### Implementation for User Story 1

- [X] T003 [US1] Bổ sung lệnh `formData.append("overwrite", "true");` vào bên trong khối `if (pid) { ... }` (dòng 56–59) của hàm `uploadToCloudinary` trong `src/lib/cloudinary.ts`, đảm bảo gửi cờ `overwrite = "true"` mỗi khi có `pid` (`publicId` hoặc `public_id`)
- [X] T004 [US1] Xác minh luồng gọi upload avatar trong `src/app/(user)/profile/components/ProfileClient.tsx` (dòng 64–75) và `src/app/(user)/profile/components/ProfileUpdateClient.tsx` (dòng 57–69) đảm bảo `signatureData` chứa `publicId` được truyền tự nhiên vào `signatureParams` của `uploadToCloudinary` và gọi `updateAvatar` với `avatarPublicId` và `avatarUrl`

**Checkpoint**: User Story 1 hoàn thành — lỗi Invalid Signature trên web đã được giải quyết dứt điểm (MVP).

---

## Phase 4: User Story 2 - Ghi đè ảnh cũ theo định danh người dùng và kiểm thử hợp đồng Cloudinary (Priority: P1)

**Goal**: Đảm bảo biểu mẫu multipart gửi lên Cloudinary tuân thủ nghiêm ngặt hợp đồng 7 trường bắt buộc khi có `publicId`, và tuyệt đối không gửi `overwrite`/`public_id` khi không có `publicId` (chống regression cho các luồng upload khác).

**Independent Test**: Chạy `npm test src/lib/cloudinary.test.ts` và xác nhận tất cả các ca kiểm thử assert FormData đều vượt qua.

### Tests & Assertions for User Story 2

- [X] T005 [P] [US2] Cập nhật ca kiểm thử `'KHÔNG gửi field camelCase publicId (làm hỏng chữ ký)'` trong `src/lib/cloudinary.test.ts` để assert thêm `expect(fd.get('overwrite')).toBe('true')` khi truyền `publicId: 'some-id'`
- [X] T006 [P] [US2] Bổ sung ca kiểm thử kiểm tra danh sách khóa biểu mẫu `formKeys(fd)` có đúng 7 trường `['api_key', 'file', 'folder', 'overwrite', 'public_id', 'signature', 'timestamp']` khi có `publicId` trong `src/lib/cloudinary.test.ts`
- [X] T007 [P] [US2] Bổ sung ca kiểm thử xác nhận khi không có `publicId` (như upload ảnh tủ đồ), form chỉ gồm 5 trường cơ bản `['api_key', 'file', 'folder', 'signature', 'timestamp']`, khẳng định `fd.get('overwrite') === null` và `fd.get('public_id') === null` trong `src/lib/cloudinary.test.ts`

**Checkpoint**: Hợp đồng biểu mẫu Cloudinary đã được khóa chặt bằng unit test tự động; ngăn chặn hoàn toàn lỗi tái phát.

---

## Phase 5: User Story 3 - Đồng bộ hợp đồng và kiểu dữ liệu giữa Web và Mobile (Priority: P2)

**Goal**: Đồng bộ hóa 100% kiểu dữ liệu và loại bỏ hoàn toàn các cảnh báo tĩnh, đảm bảo parity giữa web client và mobile repository (`profile_repository.dart`).

**Independent Test**: Chạy lệnh kiểm tra kiểu `npx tsc --noEmit` hoàn tất với mã thoát `0`.

### Implementation & Verification for User Story 3

- [X] T008 [US3] Thực thi kiểm tra phân tích tĩnh TypeScript qua lệnh `npx tsc --noEmit` tại thư mục gốc dự án để đảm bảo các thay đổi kiểu trả về trong `src/features/profile/api/profile.api.ts` hoàn toàn tương thích và không phát sinh lỗi biên dịch

**Checkpoint**: Toàn bộ hệ thống mã nguồn nhất quán về kiểu dữ liệu và đồng bộ với hợp đồng API.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Kiểm thử tích hợp toàn diện và hoàn tất tài liệu xác thực.

- [X] T009 [P] Cập nhật danh mục kiểm định yêu cầu trong `specs/032-fix-avatar-signature/checklists/requirements.md` ghi nhận hoàn thành các tiêu chí thiết kế và kiểm thử
- [X] T010 Chạy kiểm thử toàn bộ test suite `src/lib/cloudinary.test.ts` và thực hiện xác thực theo hướng dẫn trong `specs/032-fix-avatar-signature/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không phụ thuộc — có thể xác nhận ngay lập tức.
- **Foundational (Phase 2)**: Phụ thuộc vào Setup — cập nhật type trong `profile.api.ts`.
- **User Story 1 (Phase 3)**: Phụ thuộc vào Foundational — triển khai sửa lỗi trong `cloudinary.ts` và xác minh component.
- **User Story 2 (Phase 4)**: Có thể tiến hành song song hoặc ngay sau User Story 1 — viết test khóa hợp đồng biểu mẫu trong `cloudinary.test.ts`.
- **User Story 3 (Phase 5)**: Phụ thuộc vào User Story 1 & 2 — kiểm tra an toàn kiểu `tsc --noEmit`.
- **Polish (Phase 6)**: Phụ thuộc vào hoàn tất toàn bộ các user stories.

### User Story Dependencies

```
Phase 1: Setup (T001)
       │
       ▼
Phase 2: Foundational (T002: profile.api.ts)
       │
       ├───────────────────────────────────────────────┐
       ▼                                               ▼
Phase 3: User Story 1 (T003, T004: cloudinary.ts)   Phase 4: User Story 2 (T005, T006, T007: cloudinary.test.ts)
       │                                               │
       └───────────────────────┬───────────────────────┘
                               ▼
               Phase 5: User Story 3 (T008: tsc --noEmit)
                               │
                               ▼
               Phase 6: Polish (T009, T010: quickstart)
```

### Parallel Opportunities

- **Trong Phase 4 (User Story 2)**: Các task test T005, T006, T007 có thể viết và thực thi cùng lúc trong `src/lib/cloudinary.test.ts`.
- **Giữa Phase 3 và Phase 4**: Lập trình viên có thể áp dụng TDD bằng cách viết tests trong Phase 4 trước, sau đó triển khai T003 trong Phase 3 để các bài test chuyển sang trạng thái xanh (Green).

---

## Parallel Example: User Story 2 Test Suite

```bash
# Thực hiện bổ sung các assertions cho hợp đồng FormData trong src/lib/cloudinary.test.ts:
Task T005: "Cập nhật ca kiểm thử case publicId: 'some-id' assert fd.get('overwrite') === 'true'"
Task T006: "Bổ sung ca kiểm thử kiểm tra formKeys(fd) chứa đủ 7 trường khi có publicId"
Task T007: "Bổ sung ca kiểm thử khẳng định form không chứa overwrite/public_id khi không có publicId"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Hoàn thành Phase 1 (Setup) và Phase 2 (Foundational: `profile.api.ts`).
2. Hoàn thành Phase 3: Thêm `formData.append("overwrite", "true")` trong `src/lib/cloudinary.ts`.
3. **STOP & VALIDATE**: Kiểm tra upload avatar trên giao diện web `/profile`. Lỗi Invalid Signature được khắc phục ngay lập tức.

### Incremental Delivery
1. Triển khai MVP (T002 + T003).
2. Khóa chặt hợp đồng bằng Unit Tests (T005, T006, T007).
3. Xác minh tính toàn vẹn kiểu dữ liệu (T008).
4. Nghiệm thu tài liệu (T009, T010).

---

## Notes

- `[P]` đánh dấu các task có thể thực thi song song độc lập.
- `[Story]` gắn nhãn rõ ràng cho từng task để dễ dàng truy vết nguồn gốc yêu cầu từ `spec.md`.
- Mọi ràng buộc giá trị chuỗi (`"true"`, `"public_id"`, `publicId?: string`) đều được trích dẫn cụ thể, không để người thực hiện tự suy đoán.
