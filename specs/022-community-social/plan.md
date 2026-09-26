# Implementation Plan: 022 Community Social Frontend Integration

**Branch**: `022-community-social` | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/022-community-social/spec.md` và tài liệu hợp đồng backend `specs/022-community-social/contracts/frontend-integration.md`.

## Summary

Triển khai tích hợp đồng bộ mã nguồn frontend cho phân hệ Mạng xã hội Thời trang (Community Social) theo đặc tả Backend 022. Kế hoạch tập trung vào:
1. Di trú hoàn toàn cấu trúc dữ liệu tác giả sang dạng đối tượng lồng (`user: CommunityUserRes`) và chuẩn hóa enums sang chữ thường (`outfit | media`, `image | video`).
2. Xóa bỏ hoàn toàn mã nguồn cũ liên quan đến chuyển nhượng / mua bán đồ cũ (`items`, `PostItemRes`, `resale`).
3. Bổ sung các tính năng cốt lõi: Bộ lọc Feed (Explore/Following & Hot/Latest), Trình soạn thảo bài viết hỗ trợ đính kèm Trang phục (Outfit) hoặc Media (Ảnh/Video), Tương tác Theo dõi (Follow), Trang cá nhân công khai (`/users/[username]`), Tìm kiếm tập trung hai khối Người dùng & Bài viết (`/search`), và Quản trị kiểm duyệt nội dung (Admin moderation).

---

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16 (App Router)
**Primary Dependencies**:
- `@tanstack/react-query`: Quản lý state máy chủ, bộ đệm, phân trang vô tận và Optimistic Updates.
- `axios`: Máy khách HTTP với xác thực `withCredentials` qua cookie phiên.
- `gsap` & `@gsap/react`: Hiệu ứng vi chuyển động (nảy tim, hiệu ứng cuộn bảng tin).
- `lucide-react`: Hệ thống biểu tượng UI nhất quán.
- `sonner`: Thông báo Toast tiếng Việt.
- Cloudinary Direct Upload: Tải ảnh/video trực tiếp từ trình duyệt qua chữ ký bảo mật.

**Storage**: TanStack Query Cache, LocalStorage/Cookie phiên người dùng.
**Testing**: Jest & React Testing Library (`npm test`).
**Target Platform**: Trình duyệt Web hiện đại (Desktop & Mobile Responsive).
**Project Type**: Next.js App Router Web Application.
**Performance Goals**:
- Phản hồi tương tác giao diện (Like / Follow): < 100ms nhờ Optimistic Update.
- Thời gian tải bảng tin trang đầu: < 2.0s trên kết nối mạng trung bình.
- Hoạt họa cuộn mượt mà đạt chuẩn 60fps.

**Constraints**:
- Tiêu đề ≤ 150 ký tự; Nội dung bài ≤ 5000 ký tự; Bình luận ≤ 1000 ký tự.
- Tối đa 10 tệp media; Ảnh ≤ 10MB; Video ≤ 100MB và thời lượng ≤ 60s.
- Xử lý giới hạn tần suất (Rate limit 429) và thông báo lỗi thân thiện bằng tiếng Việt.

**Scale/Scope**:
- Áp dụng trên toàn bộ khu vực Community người dùng (`/community`, `/posts/[postPublicId]`, `/users/[username]`), trang Tìm kiếm (`/search`), và khu vực Quản trị viên (`/admin/moderation`).

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Nguyên tắc | Đánh giá | Trạng thái |
|---|---|---|
| **I. Clean Architecture & Separation of Concerns** | Tách bạch rõ ràng giữa API Client (`api/`), React Query Hooks (`queries/`), Kiểu dữ liệu (`types/`), và Thành phần giao diện (`components/`). | **PASS** |
| **II. User-Centric & Resilience** | Xử lý phòng thủ khi thông tin `user` có thể là `null` hoặc `omitempty`. Cung cấp Optimistic Update cho các tương tác thường xuyên. | **PASS** |
| **III. Testable & Deterministic** | Dễ dàng kiểm thử độc lập từng tầng: Service API, Hooks, và UI Components. | **PASS** |
| **IV. Single Source of Truth** | Toàn bộ contracts và types được đồng bộ từ `specs/022-community-social/contracts/frontend-integration.md`. | **PASS** |

---

## Project Structure

### Documentation (this feature)

```text
specs/022-community-social/
├── spec.md                              # Đặc tả yêu cầu người dùng và tiêu chí thành công
├── plan.md                              # Kế hoạch triển khai kiến trúc kỹ thuật (Tập tin này)
├── research.md                          # Phân tích kỹ thuật & các quyết định giải pháp
├── data-model.md                        # Chi tiết thực thể, types TypeScript & quy tắc chuyển đổi trạng thái
├── quickstart.md                        # Hướng dẫn kiểm thử và xác thực chạy thử nghiệm
├── checklists/
│   └── requirements.md                  # Danh mục kiểm định chất lượng yêu cầu
└── contracts/
    ├── frontend-integration.md          # Tài liệu hợp đồng tích hợp bàn giao từ Backend
    └── community-api-contract.md        # Giao diện dịch vụ API & danh mục TanStack Query Hooks
```

### Source Code Changes (repository root)

```text
src/
├── features/
│   ├── community/
│   │   ├── types/
│   │   │   └── index.ts                 # [MODIFY] Cập nhật PostRes, CommentRes, CommunityUserRes, loại bỏ resale
│   │   ├── api/
│   │   │   ├── community.api.ts         # [MODIFY] Cập nhật upload-signature, params feed, like, comments
│   │   │   ├── user-social.api.ts       # [NEW] Dịch vụ Follow, Public Profile, User Follows
│   │   │   └── search.api.ts            # [NEW] Dịch vụ tìm kiếm tập trung GET /search
│   │   ├── queries/
│   │   │   ├── community.queries.ts     # [MODIFY] Cập nhật feed query keys, mutation like/comment
│   │   │   ├── user-social.queries.ts   # [NEW] Hooks usePublicProfile, useFollowUser, useUserFollows
│   │   │   └── search.queries.ts        # [NEW] Hook useCommunitySearch
│   │   └── components/
│   │       ├── PostCard.tsx             # [MODIFY] Đọc post.user.*, hiển thị outfit/video, like, follow, sharePath
│   │       ├── CommunityList.tsx        # [MODIFY] Thêm tab explore/following, sort hot/latest
│   │       ├── PostComposerModal.tsx    # [NEW] Modal tạo/sửa bài viết hỗ trợ Outfit picker & Media upload
│   │       ├── OutfitPickerModal.tsx    # [NEW] Modal chọn outfit từ tủ đồ cá nhân
│   │       ├── PostCommentsModal.tsx    # [MODIFY] Đọc comment.user.*, xử lý isDeleted
│   │       ├── CommentItem.tsx          # [MODIFY] Đọc comment.user.*, xử lý placeholder bị xóa
│   │       ├── PostLikesModal.tsx       # [NEW] Modal xem danh sách người thích bài viết phân trang
│   │       ├── PostShareModal.tsx       # [MODIFY] Đồng bộ route chia sẻ chuẩn
│   │       └── VideoPlayer.tsx          # [NEW] Thành phần phát video tối ưu cho bài đăng media
│   └── admin/
│       ├── api/
│       │   └── community-admin.api.ts   # [NEW] API quản lý bài viết và bình luận (hide/restore/delete)
│       ├── queries/
│       │   └── community-admin.queries.ts # [NEW] Hooks quản trị kiểm duyệt
│       └── components/
│           ├── AdminPostsModeration.tsx # [MODIFY] Đọc user lồng, cập nhật thao tác Ẩn/Khôi phục
│           └── AdminCommentsModeration.tsx # [NEW] Bảng kiểm duyệt bình luận
├── app/
│   └── (user)/
│       ├── community/
│       │   ├── page.tsx                 # [KEEP/REVIEW]
│       │   └── components/
│       │       ├── CommunityData.tsx    # [MODIFY] Kết nối trực tiếp API Backend, bỏ mock data
│       │       └── CommunityClient.tsx  # [MODIFY] Cập nhật truyền bộ lọc feed tab/sort
│       ├── posts/[postPublicId]/
│       │   ├── page.tsx                 # [MODIFY] SEO metadata từ post.user & title
│       │   └── components/
│       │       ├── PostData.tsx         # [MODIFY] Bỏ mock fallback, gọi trực tiếp API
│       │       └── PostDetailClient.tsx # [MODIFY] Đọc post.user, render đúng dạng outfit/media
│       ├── community/posts/[postPublicId]/
│       │   └── page.tsx                 # [NEW] Redirect/Proxy về /posts/[postPublicId] theo sharePath
│       ├── users/[username]/
│       │   ├── page.tsx                 # [NEW] Trang hồ sơ công khai
│       │   └── components/
│       │       ├── UserProfileHeader.tsx # [NEW] Header hồ sơ, thống kê và nút Follow
│       │       ├── UserFollowsModal.tsx  # [NEW] Modal danh sách người theo dõi/đang theo dõi
│       │       └── UserPostsGrid.tsx     # [NEW] Lưới bài viết của người dùng
│       └── search/
│           └── components/
│               └── SearchClient.tsx     # [MODIFY] Tích hợp GET /search, chia 2 khối Users & Posts
└── lib/
    └── cloudinary.ts                    # [MODIFY] Hỗ trợ resourceType = image | video
```

---

## Phases & Deliverables

### Phase 0: Research & Clarifications (Completed)
- [x] Tạo `research.md` giải quyết các bài toán kỹ thuật (user lồng, outfit vs media, upload video, routing).

### Phase 1: Data Model & Contracts (Completed)
- [x] Tạo `data-model.md` định nghĩa toàn bộ Types, Enums, State Transitions và Validation.
- [x] Tạo `contracts/community-api-contract.md` đặc tả các hàm service và hooks.
- [x] Tạo `quickstart.md` kịch bản kiểm thử tích hợp giao diện.

### Phase 2: Tasks Execution Plan (Next: `/speckit-tasks`)
- Tiếp tục với lệnh `/speckit-tasks` để sinh danh sách các công việc cụ thể (tasks) có thứ tự phụ thuộc chặt chẽ, sẵn sàng cho việc triển khai code.
