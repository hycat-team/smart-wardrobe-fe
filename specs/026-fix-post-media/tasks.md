---

description: "Task list for fixing post media flow (026-fix-post-media)"
---

# Tasks: 026 Fix Post Media

**Input**: Design documents từ `specs/026-fix-post-media/` (spec.md, plan.md, research.md, data-model.md, contracts/post-media-ui-contract.md, quickstart.md)

**Prerequisites**: plan.md (đã xong), spec.md (đã xong), research.md, data-model.md, contracts/

**Tests**: Bao gồm task test tối thiểu cho pure function (`validateMediaFile`) và component dùng chung (`PostMediaGallery`) vì repo có sẵn hạ tầng Jest/RTL và quickstart.md tham chiếu unit tests.

**Organization**: Tasks được nhóm theo user story (US1→US4) để mỗi story có thể implement & test độc lập.

**Ghi chú giải quyết mâu thuẫn thiết kế**: `contracts/post-media-ui-contract.md` §2 nói `PostCard` dùng `PostMediaGallery` khi `media.length > 0`, nhưng §2 Navigation/§8 lại nói toàn bộ vùng media của feed bọc trong `<Link>` điều hướng, trong khi gallery mở lightbox (không điều hướng). Quyết định kỹ thuật (đã ghi trong tasks T003/T004/T008): `PostMediaGallery` hỗ trợ `variant?: 'full' | 'compact'` — `full` (grid + lightbox, dùng cho detail & comments modal) và `compact` (ảnh chính + badge `+N`, bọc `Link`, dùng cho feed card). Điều này thỏa đồng thời FR-001 (detail đầy đủ), FR-003 (feed có badge), FR-004 (video feed điều hướng được).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Chạy song song (khác file, không phụ thuộc)
- **[Story]**: User story mà task thuộc về (US1, US2, US3, US4)
- Mọi task đều có đường dẫn file cụ thể

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Xác nhận hạ tầng sẵn có đã khớp contract — không cần thêm dependency hay khởi tạo dự án mới.

- [X] T001 Xác nhận types trong `src/features/community/types/index.ts` khớp contract §3.2/§3.3: `PostMediaRes` gồm `mediaType: 'image' | 'video'`, `mediaUrl: string`, `publicId?: string`, `sortOrder: number`; `PostRes.media?: PostMediaRes[]` (optional, "omitempty", tối đa 10 phần tử). Không thay đổi code nếu đã khớp.
- [X] T002 [P] Xác nhận `uploadToCloudinary` trong `src/lib/cloudinary.ts` hỗ trợ `resourceType: 'image' | 'video'` và `communityApi.getPostUploadSignature({ resourceType })` trong `src/features/community/api/community.api.ts` trả về `resourceType`. Không thay đổi code nếu đã đúng.

**Checkpoint**: Không có thay đổi hạ tầng mới; có thể bắt đầu Foundational.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Các khối dùng chung cho nhiều user story — MUST hoàn thành trước US1–US4.

**CRITICAL**: Không story nào bắt đầu được trước Phase 2.

- [X] T003 Tạo component `PostMediaGallery` trong `src/features/community/components/PostMediaGallery.tsx`:
  - Props: `{ media: PostMediaRes[]; title?: string | null; className?: string; variant?: 'full' | 'compact' }`.
  - Sắp xếp `media` theo `sortOrder` tăng dần (stable sort, giữ thứ tự xuất hiện nếu trùng `sortOrder`).
  - `variant='full'` (mặc định): lưới với tệp đầu làm ảnh chính lớn (`aspect-[4/5]`), các tệp còn lại là ô vuông nhỏ; bấm vào tệp mở lightbox đơn giản (React state, prev/next, chỉ số `{index+1}/{total}`), không thêm dependency mới (không dùng embla/swiper).
  - Ảnh dùng `next/image` (lazy, `object-cover`); video dùng `VideoPlayer`.
  - Render matrix: `media.length === 0` → `null`; `media.length === 1` → tệp duy nhất; `media.length > 1` → grid + lightbox.
  - Ảnh lỗi → placeholder icon `ImageOff`; video lỗi → placeholder icon `Video` (không vỡ layout, giữ `aspect-[4/5]`).
  - Không gọi API; không chứa logic nghiệp vụ (pure presentational).
- [X] T004 Bổ sung `variant='compact'` cho `PostMediaGallery` trong `src/features/community/components/PostMediaGallery.tsx`:
  - Hiển thị tệp đầu tiên (ảnh full hoặc `VideoPlayer`) + badge góc trên `+{N-1}` khi `media.length > 1` (icon ảnh kèm số, theo data-model §2.2).
  - Bọc toàn bộ vùng media trong `<Link href="/posts/{publicId}">` (chỉ compact variant); video dùng `VideoPlayer` đã chặn event điều khiển.
  - Giữ nguyên `aspect-[4/5]`.
- [X] T005 Sửa `VideoPlayer` trong `src/features/community/components/VideoPlayer.tsx`:
  - Thêm state `hasError`; gắn `onError` cho `<video>` → khi nguồn lỗi render placeholder (icon `Video` + text "Video không khả dụng") thay vì vùng đen (FR-011).
  - Đảm bảo `togglePlay` và `toggleMute` gọi `e.stopPropagation()` (đã có) và thêm `e.preventDefault()` để không lan tới `<Link>` cha khi bấm nút điều khiển (FR-004).
  - Giữ `autoPlay` mặc định `false`, `muted` mặc định `true`, `loop`, `playsInline`.
- [X] T006 Sửa `validateMediaFile` trong `src/features/community/utils/community.utils.ts` theo whitelist MIME của contract §3.12 (thay vì `startsWith('image/')`/`startsWith('video/')`):
  - Ảnh hợp lệ chỉ gồm MIME: `image/jpeg`, `image/png`, `image/webp` — nếu khác, trả về `{ isValid: false, error: 'Ảnh chỉ hỗ trợ định dạng jpg, png, webp.' }`.
  - Video hợp lệ chỉ gồm MIME: `video/mp4`, `video/webm` — nếu khác, trả về `{ isValid: false, error: 'Video chỉ hỗ trợ định dạng mp4, webm.' }`.
  - Giữ nguyên giới hạn kích thước: ảnh ≤ `10 * 1024 * 1024` byte ("Ảnh vượt quá dung lượng tối đa 10MB."), video ≤ `100 * 1024 * 1024` byte ("Video vượt quá dung lượng tối đa 100MB.").
  - Giữ nguyên kiểm tra thời lượng video ≤ 60 giây qua `getVideoDuration` ("Thời lượng video ... vượt quá giới hạn tối đa 60 giây.").
  - Trả về `{ isValid: true, mediaType: 'image' | 'video' }` khi hợp lệ; giữ chữ ký `Promise<MediaValidationResult>`.
- [X] T007 [P] Tạo unit test `src/features/community/utils/community.utils.test.ts` cho `validateMediaFile`:
  - `image/gif`, `image/svg+xml` → invalid với message "Ảnh chỉ hỗ trợ định dạng jpg, png, webp.".
  - `video/avi`, `video/quicktime` → invalid với message "Video chỉ hỗ trợ định dạng mp4, webm.".
  - Ảnh `image/jpeg` > 10MB → invalid message vượt dung lượng.
  - Video `video/mp4` ≤ 100MB, duration ≤ 60s → `{ isValid: true, mediaType: 'video' }`.
  - File `image/jpeg` hợp lệ → `{ isValid: true, mediaType: 'image' }`.

**Checkpoint**: Foundation ready — các user story có thể bắt đầu.

---

## Phase 3: User Story 1 - Xem đầy đủ media trên trang chi tiết (Priority: P1)

**Goal**: Trang chi tiết `/posts/[postPublicId]` và modal bình luận hiển thị TOÀN BỘ tệp trong `media[]` theo `sortOrder` (không chỉ `media[0]`), video phát bằng trình phát có điều khiển (FR-001, FR-002).

**Independent Test**: Mở bài đăng `media` có ≥ 2 tệp (hỗn hợp ảnh + video) tại `/posts/[postPublicId]` → tất cả ảnh/video hiển thị theo thứ tự; video phát được (play/pause/âm lượng). Mở modal bình luận của bài đó → vùng visual hiển thị đầy đủ gallery.

### Implementation for User Story 1

- [X] T008 [US1] Sửa `PostCard` trong `src/features/community/components/PostCard.tsx`:
  - Thêm prop `mediaVariant?: 'full' | 'compact'` (mặc định `'compact'`).
  - Khi `postType === 'media'` và `media.length > 0`: render `PostMediaGallery` với `variant={mediaVariant}` thay cho khối `firstMedia`/`isVideo` hiện tại (bỏ nhánh render `media[0]`-only ở dòng 175–202).
  - Khi `postType === 'media'` và `media.length === 0`: không render vùng media (chỉ content/title, không vùng rỗng/lỗi) — data-model §2.
  - Giữ nguyên nhánh `postType === 'outfit'` (coverImageUrl + thẻ outfit).
  - Loại bỏ biến `firstMedia`/`isVideo`/`hasMedia` cũ nếu không còn dùng ở nhánh outfit.
- [X] T009 [US1] Sửa `PostCommentsModal` trong `src/features/community/components/PostCommentsModal.tsx`:
  - Left panel (dòng 63–99): khi `postType === 'media'` và `media.length > 0` → render `PostMediaGallery` (variant `full`) thay cho nhánh `firstMedia?.mediaType === 'video'` và `firstMedia?.mediaUrl` hiện tại.
  - Khi `media.length === 0` → giữ hiển thị title + content (như hiện tại).
  - Bỏ import/`firstMedia` không còn dùng.
- [X] T010 [US1] Sửa `PostDetailClient` trong `src/app/(user)/posts/[postPublicId]/components/PostDetailClient.tsx`:
  - Render `<PostCard post={post} mediaVariant="full" />` (thay vì `<PostCard post={post} />`) để trang chi tiết hiển thị gallery đầy đủ (grid + lightbox).
- [X] T011 [P] [US1] Tạo render test `src/features/community/components/PostMediaGallery.test.tsx`:
  - `media.length === 0` → render `null`.
  - 3 ảnh → render 3 ô (ảnh chính + 2 ô nhỏ), sắp theo `sortOrder`.
  - Bấm một tệp → lightbox mở, hiển thị chỉ số `{index+1}/{total}` và nút prev/next.
  - Tệp `mediaType === 'video'` → render `VideoPlayer`.

**Checkpoint**: US1 hoàn tất — detail & comments modal hiển thị toàn bộ media, test độc lập được.

---

## Phase 4: User Story 2 - Đăng bài media đúng ràng buộc contract (Priority: P1)

**Goal**: Composer chặn tệp sai định dạng/kích thước/thời lượng ngay khi chọn, giới hạn 10 tệp, chặn bài rỗng, thông báo lỗi 400/401/429 tiếng Việt (FR-005, FR-006, FR-010).

**Independent Test**: Mở composer → tab "Hình ảnh / Video", chọn gif/svg → bị chặn; ảnh >10MB → bị chặn; video avi/quicktime → bị chặn; video >100MB hoặc >60s → bị chặn; chọn 11 tệp → chỉ nhận 10 + toast; đăng bài trống (không chữ, không tệp) → bị chặn.

### Implementation for User Story 2

- [X] T012 [US2] Sửa `handleFilesSelected` trong `src/features/community/components/PostComposerModal.tsx`:
  - Khi `files.length > availableSlots` (vượt 10 tệp): slice nhận đúng `availableSlots` tệp đầu và hiển thị toast "Mỗi bài viết chỉ được đính kèm tối đa 10 tệp." (hiện chỉ toast khi `availableSlots <= 0`, bổ sung khi vượt số còn lại).
  - Đảm bảo mọi tệp sai MIME/size/duration đều dùng `validateMediaFile` mới (đã có) và toast đúng message tiếng Việt (FR-006); xác nhận không gọi API cho tệp bị chặn.
- [X] T013 [US2] Kiểm tra & hoàn thiện chặn bài rỗng trong `handleSubmit` của `src/features/community/components/PostComposerModal.tsx`:
  - Với `postType === 'media'`: nếu `!trimmedContent && mediaList.length === 0` → toast "Bài viết phải có ít nhất nội dung chia sẻ hoặc 1 hình ảnh/video." và không submit (đã có — xác nhận đúng thứ tự trước khi upload).
  - Giữ giới hạn `title` ≤ 150 và `content` ≤ 5000 (đã có toast tương ứng).
- [X] T014 [US2] Xác nhận xử lý lỗi mutation tạo bài:
  - `useCreatePost`/`useUpdatePost` trong `src/features/community/queries/community.queries.ts` đã dùng `handleApiError` (xử lý 400/401/429 tiếng Việt qua `src/lib/api-error.ts`) — kiểm tra message 429 là "thao tác quá nhanh, thử lại sau" hoặc tương đương; không retry tự động dồn dập (FR-010).
  - Xác nhận nút submit disabled trong lúc `isPending` để tránh submit trùng (đã có `disabled={isPending}`).

**Checkpoint**: US2 hoàn tất — composer chặn đúng mọi tệp vượt giới hạn trước khi gửi server (SC-005).

---

## Phase 5: User Story 3 - Chỉnh sửa bài media giữ nguyên loại và media (Priority: P2)

**Goal**: Sửa bài `media` giữ nguyên tệp cũ (không tải lại), tải lên song song tệp mới, cô lập lỗi từng tệp, khóa `postType` (FR-008, FR-009).

**Independent Test**: Mở bài `media` của mình → Chỉnh sửa → đổi nội dung, xóa 1 ảnh, thêm 1 video mới, lưu → bài cập nhật đúng, tệp còn lại giữ nguyên, loại bài vẫn `media`, tab chọn loại bị khóa. Xóa hết tệp + trống nội dung → bị chặn.

### Implementation for User Story 3

- [X] T015 [US3] Sửa `handleSubmit` trong `src/features/community/components/PostComposerModal.tsx` — chuyển upload từ tuần tự (for-loop `await`) sang song song:
  - Nhóm tệp `isExisting` giữ nguyên (không gọi upload lại): `mediaUrl`/`publicId` giữ từ `previewUrl`/`publicId`, `sortOrder` theo vị trí trong `mediaList`.
  - Các tệp mới (`item.file`) upload song song bằng `Promise.allSettled`: mỗi tệp gọi `communityApi.getPostUploadSignature({ resourceType: item.mediaType })` → `uploadToCloudinary({ file, signatureParams, resourceType })`.
  - Tệp thành công → `PostMediaReq { mediaType, mediaUrl: cloudRes.secure_url, publicId: cloudRes.public_id, sortOrder: i }`.
  - Tệp thất bại → thu thập tên tệp vào mảng `failedFiles`, KHÔNG dừng các tệp khác (FR-009).
- [X] T016 [US3] Quyết định submit sau upload trong `src/features/community/components/PostComposerModal.tsx`:
  - Nếu có `trimmedContent` hoặc `uploadedMedia.length > 0` → vẫn gửi createPost/updatePost; nếu `failedFiles.length > 0` → toast cảnh báo liệt kê tệp lỗi nhưng vẫn gửi.
  - Nếu không `content` và `uploadedMedia.length === 0` → chặn submit + toast lỗi.
  - Xóa logic `catch` hủy toàn bộ luồng cũ (chỉ bắt lỗi upload không mong đợi).
- [X] T017 [US3] Xác nhận khóa loại bài khi chỉnh sửa trong `src/features/community/components/PostComposerModal.tsx`:
  - Bộ chọn loại bài đã ẩn khi `isEditing` (dòng 242 `{!isEditing && ...}`) — xác nhận `postType` được set từ `editingPost.postType` và payload `updatePost` KHÔNG chứa `postType` (FR-008).
  - Đảm bảo khi sửa bài `media` xóa hết tệp + trống nội dung → chặn theo T013/T016.

**Checkpoint**: US3 hoàn tất — sửa bài media đúng contract, không mất tệp, không đổi loại.

---

## Phase 6: User Story 4 - Feed & chi tiết hiển thị dấu hiệu nhiều tệp media (Priority: P2)

**Goal**: Thẻ bài `media` trong feed hiển thị dấu hiệu số lượng tệp (badge `+N`), video trong feed điều hướng được sang trang chi tiết (FR-003, FR-004).

**Independent Test**: Duyệt feed `/community` → bài `media` ≥ 2 tệp có badge số lượng; bấm vào vùng video (không phải nút điều khiển) → vào `/posts/{publicId}`; bấm nút play/mute trong video feed → chỉ phát/tắt tiếng, không điều hướng; lưới `/users/[username]` hiển thị badge.

### Implementation for User Story 4

- [X] T018 [US4] Sửa `PostCard` trong `src/features/community/components/PostCard.tsx` để feed dùng compact gallery:
  - Gọi `PostMediaGallery` với `variant="compact"` (mặc định) cho `postType === 'media'` (T008 đã wire prop).
  - Badge `+{N-1}` xuất hiện khi `media.length > 1` (compact variant của gallery đã render badge — verify hiển thị đúng).
- [X] T019 [US4] Xác nhận video trong feed điều hướng:
  - `PostMediaGallery` compact bọc vùng media trong `<Link href="/posts/{publicId}">` (T004) — xác nhận bấm vùng video (ngoài nút điều khiển) điều hướng, bấm nút play/pause/mute chỉ tương tác player (dựa `stopPropagation`/`preventDefault` của `VideoPlayer`, T005).
  - Thêm `role="button"`/cursor pointer phù hợp trên vùng video compact để gợi ý điều hướng (research Q2).
- [X] T020 [US4] Sửa `UserPostsGrid` trong `src/app/(user)/users/[username]/components/UserPostsGrid.tsx`:
  - Khi `post.postType === 'media'` và `media.length > 1`: hiển thị badge `+{N-1}` (icon ảnh kèm số) ở góc ô lưới (giữ cover = `media[0]`).
  - Giữ nguyên badge video/outfit hiện có và điều hướng `/posts/{publicId}`.

**Checkpoint**: US4 hoàn tất — feed & user grid hiển thị dấu hiệu đa tệp, video feed điều hướng đúng.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Kiểm soát chất lượng tổng thể, xử lý phòng thủ và xác thực toàn bộ luồng.

- [X] T021 [P] Rà soát xử lý phòng thủ `user = null` trên mọi bề mặt hiển thị media: `PostCard` (đã dùng `getCommunityUserDisplayName`/`getCommunityUserAvatar`), `PostCommentsModal`, `UserPostsGrid` — đảm bảo không crash khi `post.user` null (FR-011).
- [X] T022 [P] Rà soát placeholder cho URL tệp lỗi trên mọi bề mặt: feed (compact), detail & comments modal (full gallery), user grid (ảnh cover dùng `Image` — thêm `onError` fallback nếu chưa có) — không vỡ layout (FR-011).
- [X] T023 Chạy `npx tsc --noEmit` — 0 lỗi TypeScript.
- [X] T024 Chạy `npm run lint` — 0 lỗi ESLint.
- [X] T025 Chạy `npm test` — toàn bộ test suite (cũ + mới) pass.
- [ ] T026 Thực hiện xác thực thủ công theo `specs/026-fix-post-media/quickstart.md`: 8 kịch bản (detail gallery, video navigation, badge feed, MIME validation, upload song song cô lập lỗi, media placeholder, edit media, lỗi 400/401/429).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Không phụ thuộc — chạy ngay.
- **Foundational (Phase 2)**: Phụ thuộc Setup — **BLOCKS toàn bộ user stories** (PostMediaGallery, VideoPlayer, validateMediaFile).
- **User Stories (Phase 3+)**: Phụ thuộc Foundational.
  - US1 (P1) và US2 (P1) độc lập nhau, chạy song song được.
  - US3 (P2) phụ thuộc US2 (cùng file `PostComposerModal.tsx` — tránh conflict).
  - US4 (P2) phụ thuộc US1 (cùng file `PostCard.tsx` + `PostMediaGallery` compact).
- **Polish (Phase 7)**: Phụ thuộc toàn bộ stories hoàn tất.

### User Story Dependencies

- **US1 (P1)**: Sau Foundational (T003–T006). Phụ thuộc T003/T004/T005.
- **US2 (P1)**: Sau Foundational (T006 `validateMediaFile`). Độc lập với US1.
- **US3 (P2)**: Sau US2 — sửa cùng `PostComposerModal.tsx` (tránh chạy song song US2/US3 trên cùng file).
- **US4 (P2)**: Sau US1 — sửa cùng `PostCard.tsx` và dùng `PostMediaGallery` compact (T004).

### Within Each User Story

- Foundational trước; gallery/player/util trước; tích hợp component sau; xác thực cuối.

### Parallel Opportunities

- T002 [P] (Setup) chạy song song T001.
- T007 [P] (test `validateMediaFile`) chạy song song với T003–T006.
- US1 và US2 có thể chạy song song (khác file) sau Foundational.
- T011 [P] (test gallery) song song với T008–T010; T021/T022 [P] (polish) song song nhau.
- Không chạy song song US2/US3 (cùng file composer) hay US1/US4 (cùng file PostCard).

---

## Parallel Example: User Story 1

```bash
# Foundational trước (bắt buộc):
Task: "Tạo PostMediaGallery (full + compact variant) trong src/features/community/components/PostMediaGallery.tsx"
Task: "Sửa VideoPlayer thêm hasError + stopPropagation trong src/features/community/components/VideoPlayer.tsx"

# Sau đó chạy song song trong US1:
Task: "Sửa PostCard mediaVariant + PostMediaGallery trong src/features/community/components/PostCard.tsx"
Task: "Sửa PostCommentsModal dùng PostMediaGallery trong src/features/community/components/PostCommentsModal.tsx"
Task: "Sửa PostDetailClient truyền mediaVariant=full trong src/app/(user)/posts/[postPublicId]/components/PostDetailClient.tsx"
Task: "Render test PostMediaGallery trong src/features/community/components/PostMediaGallery.test.tsx"
```

---

## Implementation Strategy

### MVP First (US1 + US2 — cả hai là P1)

1. Hoàn thành Phase 1: Setup (T001, T002).
2. Hoàn thành Phase 2: Foundational (T003–T007) — **CRITICAL, blocks mọi story**.
3. Hoàn thành Phase 3: US1 (T008–T011) — detail & comments modal hiển thị toàn bộ media.
4. Hoàn thành Phase 4: US2 (T012–T014) — composer chặn đúng ràng buộc contract.
5. **STOP & VALIDATE**: Test US1 và US2 độc lập (quickstart kịch bản 1–5).
6. Deploy/demo nếu cần.

### Incremental Delivery

1. Setup + Foundational → Foundation ready.
2. US1 (detail gallery) → test độc lập → deploy/demo.
3. US2 (validation composer) → test độc lập → deploy/demo.
4. US3 (edit media) → test độc lập → deploy/demo.
5. US4 (feed indicators + video nav) → test độc lập → deploy/demo.
6. Polish (T021–T026) → xác thực toàn diện.

### Parallel Team Strategy

1. Team hoàn thành Setup + Foundational cùng nhau.
2. Sau Foundational:
   - Developer A: US1 (detail/comments gallery).
   - Developer B: US2 (composer validation).
3. Developer A tiếp tục US4; Developer B tiếp tục US3 (sau khi US2 xong).

---

## Notes

- [P] tasks = khác file, không phụ thuộc.
- [Story] label map task về đúng user story.
- Mỗi user story độc lập hoàn thiện & test được.
- Sửa `PostComposerModal.tsx` ở cả US2 và US3 — chạy tuần tự, không song song.
- Sửa `PostCard.tsx` ở cả US1 (T008) và US4 (T018) — chạy tuần tự.
- Trước khi implement, chạy `npm run dev` và xác thực theo quickstart.md sau mỗi checkpoint.

---

## Phase 8: Convergence

**Purpose**: Đóng khoảng cách giữa intent (spec/plan/tasks) và code hiện tại — gồm test case còn thiếu (phát hiện bởi `/speckit-converge` lần 1) và các partial gap về VideoPlayer/gallery interaction (phát hiện bởi `/speckit-converge` lần 2, đã gộp và đánh lại ID duy nhất T027–T031).

- [X] T027 Bổ sung test case video hợp lệ vào `src/features/community/utils/community.utils.test.ts`: `video/mp4` ≤ 100MB với duration ≤ 60s → `{ isValid: true, mediaType: 'video' }` (mock `getVideoDuration` nếu cần, vì jsdom không load metadata video) — per T007 (partial)
- [X] T028 Bổ sung render test tương tác lightbox vào `src/features/community/components/PostMediaGallery.test.tsx`: bấm một tệp trong grid (variant `full`) → lightbox mở, hiển thị chỉ số `{index+1}/{total}`; nút prev/next chuyển đúng tệp; bấm đóng → đóng lightbox — per T011 (partial)
- [X] T029 Sửa `VideoPlayer` trong `src/features/community/components/VideoPlayer.tsx` để vùng video trong feed điều hướng được theo FR-004 (partial): khi video dừng (paused), nút play KHÔNG được phủ toàn bộ vùng `absolute inset-0` — thu nhỏ thành nút tròn trung tâm (`w-14 h-14`) với `pointer-events-auto` trên nền overlay `pointer-events-none`, cho phép bấm vào vùng video còn lại (ngoài nút điều khiển) lan tới `<Link>` cha để điều hướng `/posts/{publicId}`; đảm bảo nút điều khiển vẫn `stopPropagation`/`preventDefault`.
- [X] T030 Bổ sung nút điều khiển pause cho `VideoPlayer` trong `src/features/community/components/VideoPlayer.tsx` theo FR-002 (partial): thêm nút toggle play/pause luôn có trên thanh điều khiển (cạnh nút mute, hiển thị theo cùng logic `showControls || !isPlaying`) để người dùng pause được khi video đang phát — hiện overlay chỉ render khi `!isPlaying` và container không còn `onClick={togglePlay}`, nên không thể pause sau khi phát.
- [X] T031 Sửa `PostMediaGallery` trong `src/features/community/components/PostMediaGallery.tsx` theo FR-001 / contract §1 (partial): ô media chính khi là ảnh phải mở được lightbox khi bấm — bọc `MediaImage` chính trong `<button type="button" onClick={() => setActiveIndex(0)}>` (ô video chính giữ `VideoPlayer` phát inline, tránh lồng button-in-button) để mọi tệp ảnh đều "bấm vào tệp → mở overlay xem tệp đó".

---
