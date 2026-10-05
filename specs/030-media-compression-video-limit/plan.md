# Implementation Plan: Nén ảnh WebP sắc nét & Giới hạn dung lượng video tải lên (Media Compression & Video Upload Limits)

**Branch**: `030-media-compression-video-limit` | **Date**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/030-media-compression-video-limit/spec.md`

## Summary

Xây dựng hàm tiện ích nén ảnh client-side chuẩn Web native (`HTML5 Canvas` + `createImageBitmap` + `canvas.toBlob('image/webp', 0.85)`) giúp tự động nén các hình ảnh tải lên tủ đồ cá nhân (Wardrobe Upload) và bài viết cộng đồng (Community Post) sang định dạng WebP với chất lượng sắc nét (visually lossless, giảm 50% - 80% dung lượng tệp nhưng không vỡ hạt hay mất nét chi tiết trang phục). Đồng thời, thiết lập cơ chế kiểm soát chặt chẽ ở trình soạn bài viết cộng đồng để chặn ngay lập tức mọi tệp video có dung lượng lớn hơn 100MB ($104,857,600\text{ bytes}$) trước khi phát sinh bất kỳ yêu cầu mạng nào, hiển thị thông báo lỗi tức thì bằng tiếng Việt cho người dùng.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 (App Router)  
**Primary Dependencies**: HTML5 Canvas API (Native Web API - Zero external package), Sonner (`toast`), Cloudinary Direct Upload  
**Storage**: Client memory (`Blob`, `File`) $\rightarrow$ Cloudinary CDN / Cloud Storage  
**Testing**: Jest, React Testing Library, ts-jest (`npm test`)  
**Target Platform**: Trình duyệt Web hiện đại (Desktop & Mobile: Chrome, Edge, Firefox, Safari 14+)  
**Project Type**: Web Application Frontend (Next.js)  
**Performance Goals**: Nén một ảnh hoàn tất $< 1.5\text{s}$, giảm dung lượng ảnh $50\% - 80\%$ cho ảnh $> 1\text{MB}$, phản hồi chặn video $> 100\text{MB}$ tức thì $< 300\text{ms}$  
**Constraints**: 
- Không cài thêm thư viện bundle cồng kềnh (dùng HTML5 Canvas chuẩn).
- Bảo toàn độ nét (quality = 0.85, max dimension = 2048px).
- Bảo toàn kênh trong suốt (alpha transparency) cho ảnh PNG.
- Chặn cứng video $> 100\text{MB}$ (104,857,600 bytes) trước khi đọc metadata hoặc xin chữ ký upload.  
**Scale/Scope**:
- Phân hệ Tủ đồ: `src/app/(user)/wardrobe/upload/components/UploadClient.tsx`
- Phân hệ Cộng đồng: `src/features/community/components/PostComposerModal.tsx` & `src/features/community/utils/community.utils.ts`
- Thư viện dùng chung: `src/lib/image-compression.ts`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Thư viện tiện ích độc lập (Library-First)**: Hàm nén ảnh được tách riêng biệt trong `src/lib/image-compression.ts`, độc lập với UI components và có thể tái sử dụng ở bất kỳ đâu trong dự án. **PASS**
- **II. Kiểm thử tự động (Test-First & Verifiable)**: Cung cấp đầy đủ unit tests cho hàm nén ảnh và hàm xác thực media (`image-compression.test.ts`, `community.utils.test.ts`). **PASS**
- **III. Tính tối giản (Simplicity & YAGNI)**: Không thêm dependency mới, tận dụng Canvas native API có sẵn của trình duyệt. **PASS**
- **IV. An toàn & Khả năng chịu lỗi (Resilience)**: Có cơ chế fallback tự động giữ file gốc nếu nén lỗi hoặc file gốc nhẹ hơn. **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/030-media-compression-video-limit/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Technical research & decisions
├── data-model.md        # Entities, interfaces, state flows
├── quickstart.md        # Step-by-step verification guide
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── contracts/
    ├── image-compression-contract.md
    └── community-media-validation-contract.md
```

### Source Code Layout

```text
src/
├── lib/
│   ├── image-compression.ts               # [NEW] Hàm nén ảnh sang WebP sắc nét
│   ├── image-compression.test.ts          # [NEW] Unit tests kiểm thử hàm nén ảnh
│   └── cloudinary.ts                      # [EXISTING] Hàm uploadToCloudinary
├── app/
│   └── (user)/
│       └── wardrobe/
│           └── upload/
│               └── components/
│                   └── UploadClient.tsx   # [MODIFY] Nén WebP trước khi upload lên Cloudinary
└── features/
    └── community/
        ├── components/
        │   └── PostComposerModal.tsx      # [MODIFY] Nén WebP ảnh và tích hợp chặn video > 100MB
        └── utils/
            ├── community.utils.ts         # [MODIFY] Kiểm tra dung lượng video > 100MB ưu tiên
            └── community.utils.test.ts    # [MODIFY] Unit test kiểm tra chặn video > 100MB
```

**Structure Decision**:
- Đặt hàm nén ảnh trong `src/lib/image-compression.ts` để trở thành utility dùng chung cho cả Wardrobe, Community và bất kỳ tính năng tải ảnh nào trong tương lai.
- Chỉnh sửa trực tiếp điểm kích hoạt upload trong `UploadClient.tsx` và `PostComposerModal.tsx`.
- Củng cố quy tắc chặn video trong `src/features/community/utils/community.utils.ts`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *Không có vi phạm* | *Giải pháp tối giản, zero-dependency* | *Nén bằng thư viện bên ngoài bị từ chối do tăng bundle size không cần thiết* |
