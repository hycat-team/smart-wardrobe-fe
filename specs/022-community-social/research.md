# Research & Technical Decisions: 022 Community Social Frontend Integration

**Feature**: `022-community-social`
**Created**: 2026-09-26
**Status**: Completed

## 1. Technical Context & Clarifications

### Research Question 1: Kiến trúc chuyển đổi cấu trúc tác giả lồng (`post.user`, `comment.user`, `follow.user`)
- **Vấn đề**: Backend chuyển từ trường phẳng cấp gốc (`post.userId`, `post.username`, `post.avatarUrl`...) sang đối tượng lồng `user: CommunityUserRes`. Nếu frontend truy cập trực tiếp `post.user.username` khi mạng lag hoặc backend trả `user = null` (theo spec: Account service tạm thời lỗi) sẽ gây crash component (`TypeError: Cannot read properties of undefined`).
- **Quyết định**:
  - Toàn bộ component và hook sẽ truy cập phòng thủ qua optional chaining (`post.user?.username`, `post.user?.avatarUrl`).
  - Viết helper hàm chuẩn hóa: `getCommunityUserDisplayName(user?: CommunityUserRes)` và `getCommunityUserAvatar(user?: CommunityUserRes)` để fallback về avatar mặc định hoặc chữ cái đầu.
  - Sửa logic kiểm tra quyền sở hữu bài viết và bình luận:
    `const isOwner = currentUser?.username && currentUser.username === post.user?.username;`
- **Alternatives considered**:
  - Ép kiểu hoặc giả định `user` luôn tồn tại: Bị loại bỏ vì tài liệu backend nhấn mạnh `user` có thể là `null` trong kịch bản Account service suy hao.

---

### Research Question 2: Luồng Composer tạo bài viết với Outfit vs Media
- **Vấn đề**: Loại bài viết được chuẩn hóa thành `outfit` và `media`. Khi `postType = 'outfit'`, bắt buộc phải gửi kèm `outfitId` (thuộc sở hữu người dùng). Cần giao diện chọn trang phục từ tủ đồ cá nhân.
- **Quyết định**:
  - Tận dụng hook `useOutfits()` từ feature `outfits` (`src/features/outfits/queries/outfits.queries.ts`) để hiển thị danh sách trang phục dạng carousel/grid trong modal chọn trang phục khi người dùng chọn tab "Trang phục (Outfit)".
  - Khi người dùng chọn trang phục, hiển thị thẻ preview trang phục đính kèm (`outfit.name` và `outfit.coverImageUrl`) và gán `outfitId`.
  - Khi người dùng chọn "Hình ảnh & Video (Media)", ẩn bộ chọn outfit và mở khu vực tải lên ảnh/video (1-10 tệp).
  - Tách trình soạn thảo thành component chuyên trách `PostComposerModal.tsx` thay vì nhúng trực tiếp toàn bộ form tạo vào `CommunityList.tsx`, giúp tái sử dụng được ở cả trang `/community`, thanh điều hướng hoặc profile.
- **Alternatives considered**:
  - Để người dùng nhập tay ID trang phục: Bị loại bỏ vì trải nghiệm người dùng kém và dễ nhập sai.

---

### Research Question 3: Tải lên đa phương tiện (Ảnh & Video) qua Cloudinary
- **Vấn đề**: `GET /posts/upload-signature` nay yêu cầu query `resourceType=image|video`. Cloudinary tiếp nhận URL tương ứng `https://api.cloudinary.com/v1_1/{cloud}/{resourceType}/upload`. Video có giới hạn 100MB và ≤ 60 giây.
- **Quyết định**:
  - Mở rộng hàm `uploadToCloudinary` trong `src/lib/cloudinary.ts` để nhận tham số `resourceType: 'image' | 'video'`.
  - Bổ sung hàm kiểm tra client-side `validateMediaFile(file: File)`:
    - Ảnh: kiểm tra `file.size <= 10 * 1024 * 1024` (10MB) và MIME type `image/jpeg, image/png, image/webp`.
    - Video: kiểm tra `file.size <= 100 * 1024 * 1024` (100MB), MIME type `video/mp4, video/webm`, và dùng đối tượng `HTMLVideoElement` để kiểm tra thời lượng `duration <= 60` giây trước khi gọi API lấy signature.
- **Alternatives considered**:
  - Chỉ để Cloudinary từ chối khi upload: Tốn băng thông người dùng và không có thông báo tiếng Việt kịp thời trước khi tệp tải lên hoàn tất.

---

### Research Question 4: Quản lý Cache TanStack Query (Feed Tab, Like & Follow Optimistic Update)
- **Vấn đề**:
  - `GET /posts` nhận `type: explore | following`, `sort: hot | latest`.
  - Tương tác Thích và Theo dõi cần phản hồi tức thì mà không chờ vòng lặp mạng máy chủ.
- **Quyết định**:
  - `COMMUNITY_QUERY_KEYS` được chuẩn hóa:
    - `all: ['community']`
    - `feed: (filters: { type?: string; sort?: string; postType?: string; username?: string }) => ['community', 'feed', filters]`
    - `detail: (publicId: string) => ['community', 'detail', publicId]`
    - `comments: (postId: string) => ['community', 'comments', postId]`
    - `replies: (postId: string, commentId: string) => ['community', 'replies', postId, commentId]`
    - `likes: (publicId: string) => ['community', 'likes', publicId]`
    - `userProfile: (username: string) => ['community', 'user', username]`
    - `userFollows: (username: string, type?: string) => ['community', 'user', username, 'follows', type]`
  - Mutation `useLikePost`: thực hiện Optimistic Update trên tất cả các trang của `feed` query keys và `detail` query key.
  - Mutation `useFollowUser`: cập nhật lạc quan trạng thái `isFollowingAuthor` trong các bài viết của tác giả đó trên feed, cũng như trường `isFollowing` và `stats.followerCount` trong query profile của người đó.
- **Alternatives considered**:
  - Chờ máy chủ trả về rồi mới invalidate: Làm người dùng có cảm giác ứng dụng chậm chạp (lag) khi thả tim hoặc bấm follow.

---

### Research Question 5: Thiết kế Định tuyến (Routes) & Trang cá nhân công khai
- **Vấn đề**:
  - Cần trang công khai `/users/[username]` hiển thị thông tin hồ sơ, thống kê, và danh sách bài viết.
  - Hiện tại đường dẫn bài viết chi tiết là `/posts/[postPublicId]`, trong khi backend trả `sharePath = "/community/posts/{publicId}"`.
- **Quyết định**:
  - Tạo route mới `src/app/(user)/users/[username]/page.tsx` và `UserProfileClient.tsx`.
  - Để tương thích với cả `sharePath` do BE trả về lẫn route hiện có:
    - Tạo route `src/app/(user)/community/posts/[postPublicId]/page.tsx` re-export hoặc redirect về `/posts/[postPublicId]`, đảm bảo bất kỳ đường dẫn nào từ link chia sẻ cũng hoạt động trơn tru 100%.
- **Alternatives considered**:
  - Bắt buộc BE sửa `sharePath`: Không cần thiết vì FE hoàn toàn có thể hỗ trợ cả 2 route hoặc rewrite/redirect trong Next.js.

---

### Research Question 6: Nâng cấp Trang Tìm kiếm (`/search`)
- **Vấn đề**: Trang `/search` hiện tại đang lọc wardrobe client-side, chưa tích hợp API tìm kiếm cộng đồng `GET /search?q=&type=all|users|posts`.
- **Quyết định**:
  - Tái cấu trúc `SearchClient.tsx`:
    - Khi có từ khóa `q`, gọi `searchApi.searchCommunity({ q, type, postType, page, limit })`.
    - Hiển thị 2 tab/khối kết quả: "Mọi người (Users)" và "Bài viết thời trang (Posts)".
    - Phân trang độc lập cho 2 nhóm kết quả vì mỗi nhóm có metadata riêng.
- **Alternatives considered**:
  - Gộp chung phân trang: Vi phạm cấu trúc backend vì `users` và `posts` có 2 bộ metadata `page/limit/totalItems` riêng biệt.
