# Implementation Plan: Kéo thả tệp hình ảnh vào tủ đồ (Wardrobe Drag & Drop Upload)

**Branch**: `028-wardrobe-drag-drop-upload` | **Date**: 2026-10-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/028-wardrobe-drag-drop-upload/spec.md`

---

## Summary

Nâng cấp trải nghiệm tải trang phục lên tủ đồ cá nhân (`/wardrobe/upload`) bằng cách bổ sung tính năng kéo thả (drag & drop) tệp ảnh trực tiếp từ thư mục máy tính:
1. Xây dựng custom hook chuyên dụng `useFileDropzone` để quản lý sự kiện kéo thả HTML5, ngăn ngừa giật nháy (flicker) bằng bộ đếm độ sâu DOM và xử lý chống hành vi mặc định mở ảnh của trình duyệt.
2. Tích hợp vùng kéo thả tương tác sinh động ở cả 2 bước: Bước 1 khi chưa có ảnh (Empty Dropzone) và Bước 2 khi đang có 1–4 ảnh xem trước (Preview Drop Area / Card thêm ảnh).
3. Cơ chế kiểm duyệt nghiêm ngặt: chỉ nhận ảnh hợp lệ (PNG, JPG, JPEG, WEBP, HEIC), giới hạn 5MB/ảnh, chiến lược lấy tối đa 5 ảnh (Partial Slicing) kèm thông báo tiếng Việt thân thiện qua `toast` (`sonner`).
4. Viết unit test hoàn chỉnh cho hook kéo thả đảm bảo độ ổn định và không làm ảnh hưởng đến luồng phân tích AI và Cloudinary hiện tại.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+

**Primary Dependencies**: Next.js 16.2.6 (App Router), React 19.2.4, Lucide React 1.21.0, Sonner 2.0.7, GSAP 3.15.0, Tailwind CSS v4

**Storage**: Local DOM state (`useState`), `URL.createObjectURL`, browser memory

**Testing**: Jest 30.0.0, @testing-library/react 16.3.2

**Target Platform**: Web Desktop / Laptop (với cơ chế fallback click chọn tệp cho mobile)

**Project Type**: Next.js Web Application Frontend

**Performance Goals**: Phản hồi hiệu ứng kéo thả tức thì (< 16ms, 60fps); tạo ảnh xem trước (object URL) trong < 100ms cho 5 ảnh; không gây layout shift (CLS = 0).

**Constraints**: Không thêm thư viện bên ngoài; tuân thủ giới hạn tối đa 5 ảnh và 5MB/ảnh; vô hiệu hóa kéo thả khi đang tải lên đám mây hoặc đang phân tích AI.

**Scale/Scope**: Áp dụng trực tiếp tại màn hình tải ảnh tủ đồ người dùng (`src/app/(user)/wardrobe/upload/components/UploadClient.tsx`) và tái sử dụng hook cho các màn hình tải tệp khác nếu cần.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Client-First Responsiveness**: Hiệu ứng active drag state mượt mà, phản hồi tức thì với thao tác chuột của người dùng.
- [x] **Type Safety**: Tất cả các options, states, và lý do từ chối tệp được định nghĩa kiểu dữ liệu chặt chẽ trong TypeScript.
- [x] **Resilience & Defensiveness**: Ngăn chặn triệt để lỗi trình duyệt tự động mở tệp khi thả trượt; chống giật nháy khi rê qua các icon con; loại trừ tệp thư mục hoặc tệp hỏng.
- [x] **Backward Compatibility**: Giữ nguyên vẹn 100% logic tải lên Cloudinary và gọi API phân tích AI hàng loạt (`useBatchUploadWardrobeItems`).

---

## Project Structure

### Documentation (this feature)

```text
specs/028-wardrobe-drag-drop-upload/
├── spec.md                  # Đặc tả nghiệp vụ và yêu cầu chức năng
├── plan.md                  # Kế hoạch kỹ thuật này (/speckit-plan)
├── research.md              # Phase 0: Phân tích kỹ thuật & quyết định kiến trúc
├── data-model.md            # Phase 1: Thực thể dữ liệu & máy trạng thái kéo thả
├── quickstart.md            # Phase 1: Hướng dẫn kiểm thử thủ công và tự động
├── checklists/
│   └── requirements.md      # Bảng thẩm định chất lượng đặc tả
└── contracts/
    └── ui-contracts.md      # Phase 1: Hợp đồng giao diện, hook & toast messages
```

### Source Code Impact

```text
src/
├── features/
│   └── wardrobe/
│       └── hooks/
│           ├── useFileDropzone.ts          # [NEW] Hook xử lý sự kiện kéo thả & xác thực tệp
│           └── useFileDropzone.test.ts     # [NEW] Unit test cho hook kéo thả
│
└── app/(user)/wardrobe/upload/
    └── components/
        └── UploadClient.tsx                # Tích hợp hook kéo thả vào Empty Dropzone & Preview Grid
```

---

## Complexity Tracking

Không có vi phạm kiến trúc nào. Toàn bộ tính năng được hiện thực bằng chuẩn Web API Drag & Drop kết hợp React hook, không cài đặt thêm package nặng và không làm thay đổi các API phía máy chủ.
