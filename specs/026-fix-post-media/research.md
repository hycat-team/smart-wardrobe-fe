# Research & Technical Decisions: 026 Fix Post Media

**Feature**: `026-fix-post-media`
**Created**: 2026-09-28
**Status**: Completed

## 1. Technical Context & Clarifications

### Research Question 1: Hiển thị toàn bộ media của bài `media` (multi-media rendering)
- **Vấn đề**: Contract `PostRes.media[]` cho phép tối đa 10 tệp (image/video), nhưng FE hiện chỉ render `media[0]` ở mọi nơi: `PostCard` (feed + chi tiết) và `PostCommentsModal`. Người dùng mất toàn bộ nội dung phía sau tệp đầu tiên.
- **Quyết định**:
  - Xây dựng component tái sử dụng `PostMediaGallery.tsx` nhận `media: PostMediaRes[]` và `postType`:
    - Sắp xếp theo `sortOrder` tăng dần.
    - Hiển thị **lưới** (grid) tất cả ảnh/video theo thứ tự; tệp đầu tiên là ảnh chính lớn hơn, các tệp còn lại là ô nhỏ.
    - Hỗ trợ **lightbox/carousel đơn giản** (prev/next, đếm `1/3`) bằng React state — **không thêm dependency mới** (repo không có thư viện carousel/embla/swiper hiện tại).
    - Ảnh dùng `next/image` lazy-load; video dùng `VideoPlayer`.
  - `PostDetailClient` và `PostCommentsModal` dùng `PostMediaGallery` khi `postType === 'media'` và `media.length > 0`; fallback về nội dung chữ khi không có tệp.
- **Alternatives considered**:
  - Thêm thư viện carousel (embla/swiper): Bị loại bỏ vì chỉ cần gallery tối giản, tránh dependency thừa và giữ bundle nhỏ.
  - Giữ `PostCard` cho detail (hiện tại): Bị loại vì chỉ render `media[0]`, vi phạm FR-001/SC-001.

---

### Research Question 2: Video trong feed điều hướng sang trang chi tiết
- **Vấn đề**: Trong `PostCard`, nhánh ảnh được bọc trong `<Link href="/posts/{publicId}">` nhưng nhánh video (`VideoPlayer`) **không** — người dùng bấm video không thể vào trang chi tiết (FR-004).
- **Quyết định**:
  - Bọc toàn bộ vùng media (cả ảnh lẫn video) trong `<Link>`, nhưng dừng `stopPropagation()`/`preventDefault()` khi người dùng thao tác điều khiển phát (play/pause, mute) trong `VideoPlayer`.
  - Cập nhật `VideoPlayer` để chặn event lan tới `Link` khi bấm vào nút điều khiển; bấm vào vùng video (không phải nút) vẫn điều hướng.
  - Thêm `role="button"`/cursor pointer phù hợp trên vùng video để gợi ý điều hướng.
- **Alternatives considered**:
  - Thêm nút "Xem chi tiết" riêng: Dư thừa, vỡ UX khi người dùng quen bấm vào media để mở bài.

---

### Research Question 3: Siết chặt validation MIME type theo whitelist
- **Vấn đề**: `validateMediaFile` hiện chỉ kiểm tra `file.type.startsWith('image/')`/`startsWith('video/')`, chấp nhận mọi định dạng (gif, svg, avi, mov...). Contract §3.12 giới hạn ảnh **jpg/png/webp** và video **mp4/webm**.
- **Quyết định**:
  - Dùng whitelist MIME tường minh trong `validateMediaFile`:
    - Ảnh: `image/jpeg`, `image/png`, `image/webp`.
    - Video: `video/mp4`, `video/webm`.
  - Giữ nguyên kiểm tra kích thước (ảnh ≤ 10MB, video ≤ 100MB) và thời lượng video ≤ 60s (qua `HTMLVideoElement`).
  - Đồng bộ `accept` attribute của `input[type=file]` trong `PostComposerModal` với whitelist (đã đúng: `image/jpeg,image/png,image/webp,video/mp4,video/webm`).
- **Alternatives considered**:
  - Chỉ dựa vào `accept` của file input: Không đủ vì người dùng vẫn chọn được file khác bằng drag & drop hoặc đổi bộ lọc; cần validate lại trong JS.

---

### Research Question 4: Tải lên media song song và cô lập lỗi từng tệp
- **Vấn đề**: `PostComposerModal.handleSubmit` hiện upload **tuần tự** (for-loop với `await`); nếu tệp thứ 3 lỗi thì `catch` hủy toàn bộ luồng, không tạo bài, và người dùng phải tải lại mọi thứ (vi phạm FR-009).
- **Quyết định**:
  - Chuyển sang upload **song song** bằng `Promise.allSettled` trên các tệp mới:
    - Mỗi tệp độc lập: gọi `getPostUploadSignature({ resourceType })` rồi `uploadToCloudinary`.
    - Tệp thành công → gộp vào `uploadedMedia` (giữ `sortOrder` theo vị trí trong `mediaList`).
    - Tệp thất bại → thu thập tên tệp vào danh sách lỗi, không dừng các tệp khác.
  - Nếu có tệp lỗi nhưng `uploadedMedia.length > 0` (hoặc có nội dung chữ): hiển thị toast cảnh báo "một số tệp tải thất bại" và vẫn gửi tạo bài với các tệp thành công — trừ khi dẫn đến bài rỗng (không nội dung, không tệp) thì chặn.
  - Nếu tất cả tệp lỗi và không có nội dung: chặn submit với toast lỗi.
  - Giữ `isExisting` (tệp giữ nguyên khi chỉnh sửa) — không tải lại.
- **Alternatives considered**:
  - Upload tuần tự (giữ nguyên): Đơn giản nhưng chậm với nhiều tệp và một lỗi làm hỏng cả bài — bị loại.

---

### Research Question 5: Xử lý phòng thủ khi media lỗi (broken URL)
- **Vấn đề**: Ảnh/video có thể trả URL lỗi hoặc bị xóa khỏi Cloudinary; `VideoPlayer` không có `onError`, `PostCard` chỉ xử lý `onError` cho ảnh. Contract §4.5 yêu cầu fallback an toàn không làm trắng trang.
- **Quyết định**:
  - `PostCard`: giữ `hasImageError` cho ảnh (đã có); thêm fallback placeholder cho video khi nguồn lỗi.
  - `VideoPlayer`: thêm state `hasError`; khi `video.onerror` xảy ra → render placeholder (icon `Video` + text "Video không khả dụng") thay vì vùng đen.
  - `PostMediaGallery`: mỗi ô ảnh xử lý `onError` riêng → placeholder; video lỗi → placeholder.
  - Giữ `aspect-[4/5]` / layout ổn định để không vỡ layout khi một tệp lỗi.
- **Alternatives considered**:
  - Xóa tệp lỗi khỏi danh sách: Không đúng vì `sortOrder` và số lượng phải giữ nguyên theo backend; chỉ ẩn nội dung lỗi tại ô đó.

---

### Research Question 6: Dấu hiệu số lượng tệp trên feed card
- **Vấn đề**: Thẻ bài `media` nhiều tệp trong feed không có gợi ý còn nội dung phía sau (FR-003).
- **Quyết định**:
  - Trên `PostCard`, khi `postType === 'media'` và `media.length > 1`, hiển thị badge góc trên: icon ảnh + số lượng (ví dụ `🖼 3`) hoặc dạng `+2` trên tệp thứ hai.
  - Dùng lưới xem trước tối giản khi khả thi (tệp 1 + tệp 2) kèm badge `+N` để gợi ý, không thay đổi bố cục chính.
  - `UserPostsGrid`: thêm badge số lượng tệp trên ô lưới (tùy chọn, giữ tối giản).
- **Alternatives considered**:
  - Không thêm dấu hiệu: Vi phạm FR-003/SC-003.

---

### Research Question 7: Cách tái sử dụng giữa chi tiết và modal bình luận
- **Vấn đề**: Cả `PostDetailClient` và `PostCommentsModal` đều cần gallery media nhưng hiện dùng logic lặp lại (render `firstMedia`).
- **Quyết định**:
  - Tạo một component `PostMediaGallery` duy nhất trong `src/features/community/components/`.
  - `PostDetailClient`: render `<PostCard>` (giữ nguyên phần thông tin/hành động) **hoặc** `PostMediaGallery` riêng ở vùng media? → **Quyết định**: vì `PostCard` đã tự render media theo `media[0]`, ta sửa `PostCard` để dùng `PostMediaGallery` nội bộ khi `media.length > 0` (hoặc `outfit`), đảm bảo detail, feed, comments modal đều thống nhất một đường render. `PostCommentsModal` thay nhánh left-panel bằng `PostMediaGallery`.
  - Nhờ đó 1 component phục vụ 3 bề mặt: feed card, detail, comments modal.
- **Alternatives considered**:
  - Component riêng cho từng bề mặt: Trùng lặp logic, khó bảo trì — bị loại.

---

## 2. Tổng hợp Quyết định

| # | Vấn đề | Quyết định |
|---|---|---|
| 1 | Hiển thị toàn bộ media | Component `PostMediaGallery` (grid + lightbox nhẹ, không thêm dependency) |
| 2 | Video điều hướng feed → detail | Bọc media trong `Link`, `VideoPlayer` chặn event của nút điều khiển |
| 3 | Validation MIME | Whitelist `image/jpeg|png|webp`, `video/mp4|webm` + size/duration |
| 4 | Upload | Song song `Promise.allSettled`, cô lập lỗi từng tệp, giữ `sortOrder` |
| 5 | Media lỗi | Placeholder cho ảnh & video, không vỡ layout |
| 6 | Dấu hiệu nhiều tệp | Badge số lượng / `+N` trên feed card & user grid |
| 7 | Tái sử dụng render | `PostCard`/`PostCommentsModal` dùng chung `PostMediaGallery` |