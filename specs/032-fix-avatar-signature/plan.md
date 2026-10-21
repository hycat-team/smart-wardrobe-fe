# Implementation Plan: 032 Fix Avatar Signature Upload

**Branch**: `032-fix-avatar-signature` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/032-fix-avatar-signature/spec.md`, đối chiếu tài liệu backend `docs/api/identity/me-api.md §5` và tham chiếu mobile `smart-wardrobe-mobile/lib/features/profile/data/profile_repository.dart:109-112`.

---

## Summary

Khắc phục triệt để lỗi "Invalid Signature" khi tải ảnh đại diện lên Cloudinary trên giao diện web bằng cách chuẩn hóa biểu mẫu `multipart/form-data` gửi lên Cloudinary REST API.

**Nguyên nhân gốc rễ**: Backend ký 4 trường (`timestamp`, `folder`, `public_id`, `overwrite=true`). Cloudinary tự tính lại chữ ký dựa trên đúng các trường client gửi lên; việc `src/lib/cloudinary.ts` chỉ append `public_id` mà thiếu `overwrite` làm lệch chuỗi tính toán chữ ký của Cloudinary, dẫn đến HTTP 400 Invalid Signature.

**Giải pháp**:
1. Trong `src/lib/cloudinary.ts` (hàm `uploadToCloudinary`), khi `pid` tồn tại (`signatureParams.publicId` hoặc `signatureParams.public_id`), bổ sung `formData.append("overwrite", "true")`.
2. Bổ sung `publicId?: string` vào kiểu trả về của `profileApi.getAvatarSignature` tại `src/features/profile/api/profile.api.ts` để đồng bộ đúng contract với backend.
3. Cập nhật và mở rộng bộ kiểm thử tự động tại `src/lib/cloudinary.test.ts` để assert biểu mẫu có đầy đủ `public_id` và `overwrite = 'true'` khi có `publicId`, đồng thời xác nhận không gửi thừa `overwrite` khi không có `publicId`.

---

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16 (App Router)

**Primary Dependencies**:
- `axios`: Giao tiếp HTTP với máy chủ ứng dụng.
- `@tanstack/react-query`: Quản lý mutation cập nhật avatar và vô hiệu hóa cache user.
- Cloudinary Upload REST API: Tiếp nhận tệp ảnh nhị phân với chữ ký số SHA.
- `sonner`: Hiển thị thông báo trạng thái cập nhật avatar.
- `jest` & `ts-jest`: Khung kiểm thử tự động cho các hàm tiện ích và hợp đồng API.

**Storage**: Kho lưu trữ đám mây Cloudinary (asset lưu tại folder `smart_wardrobe/avatars` với định danh `public_id = userId`).
**Testing**: Jest (`npm test src/lib/cloudinary.test.ts`), TypeScript check (`npx tsc --noEmit`).
**Target Platform**: Web Browsers (Desktop & Mobile Responsive).
**Project Type**: Next.js App Router Web Application.

**Performance Goals**:
- Hoàn tất upload và cập nhật avatar dưới 3 giây trên kết nối mạng băng thông thông thường.
- Không gây phát sinh thêm yêu cầu mạng (zero extra HTTP requests).

**Constraints**:
- Biểu mẫu multipart tải lên Cloudinary khi có `publicId` bắt buộc phải có đúng 7 trường: `file`, `api_key`, `timestamp`, `signature`, `folder`, `public_id`, `overwrite="true"` (tham chiếu `docs/api/identity/me-api.md §5`).
- Tuyệt đối không gửi thừa trường camelCase `publicId` hoặc các trường ngoài danh sách đã ký.
- Không làm thay đổi hành vi của các luồng upload không có `publicId` (tủ đồ, outfit, bài viết cộng đồng).

**Scale/Scope**:
- 2 file mã nguồn cốt lõi: `src/lib/cloudinary.ts`, `src/features/profile/api/profile.api.ts`.
- 1 file kiểm thử đơn vị: `src/lib/cloudinary.test.ts`.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Nguyên tắc | Đánh giá | Trạng thái |
|---|---|---|
| **I. Single Source of Truth & Contract Alignment** | Tuân thủ 100% hợp đồng backend `docs/api/identity/me-api.md §5` và đồng bộ logic với ứng dụng di động (`profile_repository.dart`). | **PASS** |
| **II. Separation of Concerns & Clean Code** | Thay đổi trực tiếp tại tầng tiện ích mạng `cloudinary.ts` và tầng API service `profile.api.ts`. Không làm bẩn logic tại các component giao diện người dùng. | **PASS** |
| **III. Zero Regression & Isolation** | Logic ghi đè chỉ kích hoạt khi có `pid`. Các luồng upload tài nguyên khác (wardrobe, outfits, posts) hoàn toàn độc lập và được bảo vệ bởi test suites. | **PASS** |
| **IV. Test-Driven Verification** | Kiểm thử đơn vị tự động xác nhận tính toàn vẹn của FormData (đúng và đủ 7 trường) được cập nhật và kiểm tra nghiêm ngặt trước khi triển khai. | **PASS** |

> **Post-Design Re-check**: Tất cả các nguyên tắc đều được đáp ứng đầy đủ (**PASS**). Không có vi phạm kiến trúc nào. Không cần mục Complexity Tracking.

---

## Project Structure

### Documentation (this feature)

```text
specs/032-fix-avatar-signature/
├── spec.md                              # Đặc tả yêu cầu tính năng
├── plan.md                              # Kế hoạch triển khai (File này)
├── research.md                          # Phân tích nguyên nhân & các quyết định kỹ thuật
├── data-model.md                        # Cấu trúc dữ liệu & hợp đồng biểu mẫu
├── quickstart.md                        # Hướng dẫn kiểm thử và xác thực
├── checklists/
│   └── requirements.md                  # Kiểm định chất lượng yêu cầu
└── contracts/
    └── cloudinary-avatar-upload.md      # Hợp đồng chi tiết biểu mẫu tải lên Cloudinary
```

### Source Code Changes (repository root)

```text
src/
├── lib/
│   ├── cloudinary.ts                    # [MODIFY] Thêm formData.append("overwrite", "true") khi if (pid)
│   └── cloudinary.test.ts               # [MODIFY] Cập nhật test case publicId assert public_id và overwrite
└── features/
    └── profile/
        └── api/
            └── profile.api.ts           # [MODIFY] Thêm publicId?: string vào type getAvatarSignature
```

**Structure Decision**:
Giải pháp thay đổi tối thiểu, đúng trọng tâm (surgical fix), tái sử dụng toàn bộ luồng gọi API và cập nhật giao diện sẵn có của `ProfileClient.tsx` và `ProfileUpdateClient.tsx`.

---

## Complexity Tracking

*Không có vi phạm nguyên tắc kiến trúc hoặc phát sinh độ phức tạp không cần thiết.*
