# Post Media UI Contract: 026 Fix Post Media

**Feature**: `026-fix-post-media`
**Created**: 2026-09-28
**Reference Document**: [frontend-integration.md](../../022-community-social/contracts/frontend-integration.md)

Tài liệu này định nghĩa hợp đồng giao diện (component contract) cho luồng hiển thị và thao tác bài đăng `media` trên frontend, đảm bảo mọi bề mặt render theo một đường logic duy nhất.

---

## 1. Component Contract: `PostMediaGallery`

**Location**: `src/features/community/components/PostMediaGallery.tsx`

### Props
```typescript
interface PostMediaGalleryProps {
  media: PostMediaRes[];          // Đã sắp xếp theo sortOrder tăng dần (hoặc tự sắp trong component)
  title?: string | null;          // Dùng cho alt ảnh
  className?: string;             // Override container
}
```

### Behavior
- Sắp xếp `media` theo `sortOrder` tăng dần (stable).
- Render lưới: tệp đầu tiên là ảnh chính (larger, `aspect-[4/5]`), các tệp còn lại là ô vuông nhỏ.
- Lightbox đơn giản: bấm vào tệp → mở overlay xem tệp đó; có nút prev/next và chỉ số `{index+1}/{total}`.
- Ảnh dùng `next/image` (lazy, `object-cover`); video dùng `VideoPlayer`.
- Ảnh lỗi → placeholder `ImageOff`; video lỗi → placeholder `Video`.
- **Không** gọi API; **không** chứa logic nghiệp vụ (pure presentational).

### Render matrix
| Input | Output |
|---|---|
| `media.length === 0` | Render `null` (component không render vùng rỗng) |
| `media.length === 1` | Một tệp duy nhất (ảnh full / video) |
| `media.length > 1` | Grid + lightbox |

---

## 2. Component Contract: `PostCard` (feed + detail)

**Location**: `src/features/community/components/PostCard.tsx`

### Media rendering
- `postType === 'media'` && `media.length > 0` → **dùng `PostMediaGallery`** (thay vì chỉ `media[0]`).
- `postType === 'media'` && `media.length === 0` → chỉ hiển thị nội dung chữ.
- `postType === 'outfit'` → giữ render `outfit.coverImageUrl` + thẻ outfit (không đổi).
- **Badge số lượng**: `media.length > 1` → badge góc trên `+{N-1}` (icon ảnh kèm số).

### Navigation
- Toàn bộ vùng media bọc trong `<Link href="/posts/{post.publicId}">`:
  - Ảnh: giữ nguyên (bấm → điều hướng).
  - Video: `VideoPlayer` phải `stopPropagation()`/`preventDefault()` khi bấm vào nút điều khiển; bấm vùng video khác → điều hướng.
- Header, actions (like/comment/share), content giữ nguyên hành vi 022.

### Defensive
- Ảnh lỗi → placeholder (`hasImageError` đã có).
- Video lỗi → placeholder (từ `VideoPlayer`).
- `user = null` → `getCommunityUserDisplayName`/`getCommunityUserAvatar` fallback (đã có).

---

## 3. Component Contract: `VideoPlayer`

**Location**: `src/features/community/components/VideoPlayer.tsx`

### Behavior (bổ sung cho 026)
- Thêm state `hasError`; khi `onerror` của `<video>` → render placeholder (icon `Video` + "Video không khả dụng") thay vì vùng đen.
- Các nút điều khiển (play/pause, mute) phải gọi `e.stopPropagation()` để không lan tới `Link` cha.
- Giữ `autoPlay` mặc định `false`, muted mặc định `true`, loop, playsInline.

---

## 4. Component Contract: `PostCommentsModal`

**Location**: `src/features/community/components/PostCommentsModal.tsx`

- Left panel (vùng visual): khi `postType === 'media'` && `media.length > 0` → render `PostMediaGallery` (thay vì `firstMedia`).
- Khi `media.length === 0` → hiển thị title + content (như hiện tại).
- Right panel (comments) giữ nguyên.

---

## 5. Component Contract: `PostComposerModal`

**Location**: `src/features/community/components/PostComposerModal.tsx`

### Media upload (thay đổi)
- Khi submit với `postType === 'media'`:
  - Tải **song song** các tệp mới bằng `Promise.allSettled`.
  - Mỗi tệp: `getPostUploadSignature({ resourceType: mediaType })` → `uploadToCloudinary`.
  - Kết quả: tệp thành công → `PostMediaReq { mediaType, mediaUrl, publicId, sortOrder }` với `sortOrder` theo vị trí trong `mediaList`; tệp lỗi → gom tên tệp.
- Tệp `isExisting` (khi chỉnh sửa): giữ nguyên, không tải lại.
- Quyết định submit:
  - Có `content` hoặc `uploadedMedia.length > 0` → gửi tạo/sửa bài; nếu có tệp lỗi thì toast cảnh báo nhưng vẫn gửi.
  - Không `content` và `uploadedMedia.length === 0` → chặn, toast lỗi.

### Validation (thay đổi)
- Dùng `validateMediaFile` với whitelist MIME mới (jpg/png/webp, mp4/webm).
- Giữ max 10 tệp, maxLength title/content, khóa `postType` khi chỉnh sửa.

---

## 6. Component Contract: `UserPostsGrid`

**Location**: `src/app/(user)/users/[username]/components/UserPostsGrid.tsx`

- (Tùy chọn) Hiển thị badge số lượng tệp `+{N-1}` trên ô lưới khi `media.length > 1`.
- Cover vẫn dùng `media[0]` / `outfit.coverImageUrl` (giữ nguyên).

---

## 7. Validation Contract: `validateMediaFile`

**Location**: `src/features/community/utils/community.utils.ts`

```typescript
const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_MIME = ['video/mp4', 'video/webm'];

export async function validateMediaFile(file: File): Promise<MediaValidationResult>
```

- Trả về `{ isValid: false, error: "…" }` khi MIME nằm ngoài whitelist, ảnh > 10MB, video > 100MB, video > 60s.
- Trả về `{ isValid: true, mediaType: 'image' | 'video' }` khi hợp lệ.
- Giữ nguyên thông báo lỗi tiếng Việt (xem bảng trong `data-model.md` §3).

---

## 8. Quy tắc điều hướng & link

| Tình huống | Link đích |
|---|---|
| Bấm ảnh bài `media` (feed) | `/posts/{publicId}` |
| Bấm video bài `media` (feed, ngoài nút điều khiển) | `/posts/{publicId}` |
| Bấm media trong `PostMediaGallery` | Mở lightbox (không điều hướng) |
| `sharePath` | Giữ nguyên hành vi 022 (`window.location.origin + sharePath`) |