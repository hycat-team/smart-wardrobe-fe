# Implementation Plan: 026 Fix Post Media

**Branch**: `026-fix-post-media` | **Date**: 2026-09-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/026-fix-post-media/spec.md` và tài liệu hợp đồng backend `specs/022-community-social/contracts/frontend-integration.md`.

## Summary

Sửa toàn bộ luồng bài đăng dạng `media` (ảnh/video) cho khớp với contract `022-community-social/contracts/frontend-integration.md`. Hiện tại FE mới hiển thị **tệp đầu tiên** (`media[0]`) ở mọi nơi (feed, chi tiết, modal bình luận), video trong feed không điều hướng được sang trang chi tiết, không có dấu hiệu số lượng tệp trên thẻ bài, validate MIME client-side quá lỏng (chấp nhận mọi `image/*`/`video/*` thay vì whitelist jpg/png/webp + mp4/webm), và luồng tải tệp trong composer tuần tự (một tệp lỗi làm hỏng cả bài).

Giải pháp:
1. Xây dựng component tái sử dụng `PostMediaGallery` (grid + lightbox/carousel đơn giản, không thêm dependency mới) để chi tiết bài viết và modal bình luận hiển thị **toàn bộ** tệp theo `sortOrder`.
2. Nâng cấp `PostCard` hiển thị badge số lượng tệp cho bài `media` nhiều tệp; bọc video trong `Link` điều hướng trong khi vẫn giữ điều khiển phát.
3. Siết chặt `validateMediaFile` theo whitelist MIME và giới hạn từ contract (§3.12).
4. Tách luồng tải lên trong `PostComposerModal` thành từng tệp độc lập (parallel + cô lập lỗi), giữ nguyên `sortOrder` theo thứ tự tác giả chọn.
5. Thêm trạng thái lỗi phòng thủ cho ảnh và video (placeholder, không vỡ layout).

---

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16 (App Router)

**Primary Dependencies**:
- `@tanstack/react-query`: Quản lý state máy chủ và bộ đệm bài viết (feed/detail/comments).
- `axios`: Máy khách HTTP với xác thực `withCredentials`.
- `lucide-react`: Hệ thống biểu tượng UI (các icon media, xem trước, phát video).
- `sonner`: Thông báo Toast tiếng Việt.
- `gsap` & `@gsap/react`: Hiệu ứng vi chuyển động hiện có (không thêm mới).
- Cloudinary Direct Upload: Tải ảnh/video trực tiếp qua chữ ký kèm `resourceType`.

**Storage**: TanStack Query Cache (feed/detail/comments); LocalStorage/Cookie phiên người dùng.
**Testing**: Jest & React Testing Library (`npm test`); kiểm thử TypeScript `npx tsc --noEmit`.
**Target Platform**: Trình duyệt Web hiện đại (Desktop & Mobile Responsive).
**Project Type**: Next.js App Router Web Application.

**Performance Goals**:
- Render toàn bộ gallery của bài `media` (≤ 10 tệp) trên trang chi tiết trong < 500ms sau khi dữ liệu sẵn sàng (lazy-load ảnh).
- Tải lên các tệp `media` chạy song song; không chặn submit nếu một tệp lỗi.

**Constraints**:
- Tối đa 10 tệp/bài; ảnh ≤ 10MB (jpg/png/webp); video ≤ 100MB và ≤ 60s (mp4/webm).
- Bài `media` cần ít nhất nội dung chữ hoặc ≥ 1 tệp; không đổi `postType` khi chỉnh sửa.
- Mọi thông báo lỗi bằng tiếng Việt; xử lý lỗi 400/401/429 thân thiện.
- `mediaType` dùng chữ thường: `'image' | 'video'`.

**Scale/Scope**:
- Toàn bộ bề mặt hiển thị bài `media`: `/community` (feed), `/posts/[postPublicId]` (chi tiết), modal bình luận, lưới bài viết `/users/[username]`, và composer tạo/sửa bài.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Nguyên tắc | Đánh giá | Trạng thái |
|---|---|---|
| **I. Clean Architecture & Separation of Concerns** | Giữ tách bạch API (`api/`), Hooks (`queries/`), Types (`types/`), Utils thuần (`utils/`), và Components (`components/`). Gallery là component thuần hiển thị, không chứa logic nghiệp vụ gọi API. | **PASS** |
| **II. User-Centric & Resilience** | Xử lý phòng thủ khi URL tệp lỗi, `media` vắng key, và `user = null`. Tải lên cô lập lỗi từng tệp; không tạo bài một nửa. | **PASS** |
| **III. Testable & Deterministic** | `validateMediaFile` là hàm thuần dễ kiểm thử; gallery/feed card render theo dữ liệu `media[]` có thể test độc lập bằng React Testing Library. | **PASS** |
| **IV. Single Source of Truth** | Toàn bộ giới hạn (số tệp, kích thước, thời lượng, định dạng) và shape `media[]` đồng bộ từ `contracts/frontend-integration.md` §3.12. | **PASS** |

> **Re-check sau Phase 1 (post-design)**: Tất cả nguyên tắc vẫn **PASS**. `PostMediaGallery` là pure presentational component (II, III); `validateMediaFile` là pure function với whitelist MIME đồng bộ contract (I, IV); không vi phạm gate nào. Không cần mục Complexity Tracking.

---

## Project Structure

### Documentation (this feature)

```text
specs/026-fix-post-media/
├── spec.md                              # Đặc tả yêu cầu (Tập tin gốc)
├── plan.md                              # Kế hoạch triển khai (Tập tin này)
├── research.md                          # Phân tích kỹ thuật & các quyết định giải pháp
├── data-model.md                        # Thực thể media, validation rules, trạng thái hiển thị
├── quickstart.md                        # Hướng dẫn kiểm thử và xác thực
├── checklists/
│   └── requirements.md                  # Danh mục kiểm định chất lượng yêu cầu
└── contracts/
    └── post-media-ui-contract.md        # Hợp đồng component & quy tắc hiển thị media
```

### Source Code Changes (repository root)

```text
src/
├── features/
│   └── community/
│       ├── types/
│       │   └── index.ts                 # [KEEP] Shape PostMediaRes/PostRes đã đúng contract
│       ├── utils/
│       │   └── community.utils.ts       # [MODIFY] Siết validateMediaFile: whitelist MIME (jpg/png/webp, mp4/webm)
│       ├── api/
│       │   └── community.api.ts         # [KEEP] getPostUploadSignature/createPost/updatePost đã đúng
│       ├── queries/
│       │   └── community.queries.ts     # [KEEP] Hooks feed/detail/comments đã đúng
│       └── components/
│           ├── PostMediaGallery.tsx     # [NEW] Component hiển thị toàn bộ tệp media (grid + lightbox), dùng chung detail & comments modal
│           ├── PostCard.tsx             # [MODIFY] Badge số lượng tệp; bọc video trong Link; xử lý lỗi video
│           ├── VideoPlayer.tsx          # [MODIFY] Thêm trạng thái lỗi nguồn video (onError → placeholder)
│           ├── PostCommentsModal.tsx    # [MODIFY] Dùng PostMediaGallery thay cho firstMedia
│           ├── PostComposerModal.tsx    # [MODIFY] Upload song song + cô lập lỗi từng tệp; giữ sortOrder
│           └── CreatePostModal.tsx      # [KEEP] Wrapper hiện có (delegate PostComposerModal)
├── app/
│   └── (user)/
│       ├── posts/[postPublicId]/
│       │   └── components/
│       │       └── PostDetailClient.tsx # [MODIFY] Render PostMediaGallery cho bài media (thay PostCard-only)
│       └── users/[username]/
│           └── components/
│               └── UserPostsGrid.tsx    # [MODIFY] (Tùy chọn) Badge số lượng tệp trên lưới bài viết
└── lib/
    └── cloudinary.ts                    # [KEEP] uploadToCloudinary đã hỗ trợ resourceType image|video
```

---

## Phases & Deliverables

### Phase 0: Research & Clarifications
- [x] `research.md`: giải quyết các bài toán (multi-media rendering, video navigation trong feed, strict MIME validation, upload parallel + error isolation, defensive media fallback).
- [x] Không còn `NEEDS CLARIFICATION` nào mở.

### Phase 1: Data Model & Contracts
- [x] `data-model.md`: định nghĩa quy tắc hiển thị `media[]`, bảng validation client-side, trạng thái lỗi/fallback.
- [x] `contracts/post-media-ui-contract.md`: hợp đồng component (`PostMediaGallery`, feed card, video player) và quy tắc render.
- [x] `quickstart.md`: kịch bản kiểm thử thủ công + tự động cho luồng bài `media`.
- [x] Constitution Check re-evaluation sau Phase 1: PASS.

### Phase 2: Tasks Execution Plan (Next: `/speckit-tasks`)
- Tiếp tục với lệnh `/speckit-tasks` để sinh danh sách công việc cụ thể, có thứ tự phụ thuộc.