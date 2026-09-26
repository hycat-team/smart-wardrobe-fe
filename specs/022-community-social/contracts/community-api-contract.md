# Community API & Hooks Contract: 022 Community Social

**Feature**: `022-community-social`
**Created**: 2026-09-26
**Reference Document**: [frontend-integration.md](./frontend-integration.md)

Tài liệu này xác định giao diện hàm API (`communityApi`, `userProfileApi`, `searchApi`, `adminCommunityApi`) và các TanStack React Query Hooks tương ứng trên frontend.

---

## 1. Community API Service (`src/features/community/api/community.api.ts`)

```typescript
export const communityApi = {
  // 1. Danh sách bài viết bảng tin
  getCommunityPosts: (params?: {
    type?: 'explore' | 'following';
    sort?: 'hot' | 'latest';
    postType?: 'outfit' | 'media';
    username?: string;
    page?: number;
    limit?: number;
  }) => Promise<PaginationResult<PostRes>>,

  // 2. Chi tiết bài viết
  getPostDetails: (postPublicID: string) => Promise<PostRes>,

  // 3. Lấy chữ ký tải ảnh/video lên Cloudinary
  getPostUploadSignature: (params?: {
    resourceType?: 'image' | 'video';
  }) => Promise<UploadSignatureResult>,

  // 4. Tạo bài viết mới
  createPost: (data: CreatePostReq) => Promise<PostRes>,

  // 5. Chỉnh sửa bài viết
  updatePost: (postPublicID: string, data: UpdatePostReq) => Promise<PostRes>,

  // 6. Xóa bài viết
  deletePost: (postPublicID: string) => Promise<void>,

  // 7. Thích / Bỏ thích bài viết
  likePost: (postPublicID: string, data: LikePostReq) => Promise<void>,

  // 8. Danh sách người thích bài viết (phân trang)
  getPostLikes: (postPublicID: string, params?: {
    page?: number;
    limit?: number;
  }) => Promise<PaginationResult<CommunityUserRes>>,

  // 9. Danh sách bình luận gốc của bài viết (mảng phẳng)
  getPostComments: (postPublicID: string) => Promise<CommentRes[]>,

  // 10. Danh sách phản hồi con của bình luận gốc (mảng phẳng)
  getCommentReplies: (postPublicID: string, commentID: string) => Promise<CommentRes[]>,

  // 11. Thêm bình luận mới
  addComment: (postPublicID: string, data: AddCommentReq) => Promise<CommentRes>,

  // 12. Cập nhật nội dung bình luận
  updateComment: (postPublicID: string, commentID: string, data: { content: string }) => Promise<CommentRes>,

  // 13. Xóa bình luận
  deleteComment: (postPublicID: string, commentID: string) => Promise<void>,
};
```

---

## 2. User Social & Profile API Service (`src/features/community/api/user-social.api.ts`)

```typescript
export const userSocialApi = {
  // 1. Theo dõi / Bỏ theo dõi người dùng
  followUser: (username: string, data: FollowReq) => Promise<void>,

  // 2. Lấy hồ sơ công khai của người dùng
  getPublicProfile: (username: string) => Promise<PublicProfileRes>,

  // 3. Lấy danh sách bài viết của người dùng
  getUserPosts: (username: string, params?: {
    page?: number;
    limit?: number;
  }) => Promise<PaginationResult<PostRes>>,

  // 4. Lấy danh sách following / followers của người dùng
  getUserFollows: (username: string, params?: {
    type?: 'following' | 'followers';
    q?: string;
    page?: number;
    limit?: number;
  }) => Promise<PaginationResult<FollowUserRes>>,
};
```

---

## 3. Search API Service (`src/features/community/api/search.api.ts`)

```typescript
export const searchApi = {
  // Tìm kiếm tập trung (người dùng & bài viết 30 ngày)
  searchCommunity: (params: {
    q: string;
    type?: 'all' | 'users' | 'posts';
    postType?: 'outfit' | 'media';
    page?: number;
    limit?: number;
  }) => Promise<SearchRes>,
};
```

---

## 4. Admin Community API Service (`src/features/admin/api/community-admin.api.ts`)

```typescript
export const adminCommunityApi = {
  // 1. Quản lý danh sách bài viết
  getAdminPosts: (params?: {
    q?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => Promise<PaginationResult<AdminPostRes>>,

  // 2. Ẩn bài viết
  hidePost: (id: string) => Promise<void>,

  // 3. Khôi phục bài viết đã ẩn
  restorePost: (id: string) => Promise<void>,

  // 4. Xóa vĩnh viễn bài viết
  deletePost: (id: string) => Promise<void>,

  // 5. Quản lý danh sách bình luận
  getAdminComments: (params?: {
    q?: string;
    page?: number;
    limit?: number;
  }) => Promise<PaginationResult<AdminCommentRes>>,

  // 6. Ẩn bình luận
  hideComment: (id: string) => Promise<void>,

  // 7. Khôi phục bình luận đã ẩn
  restoreComment: (id: string) => Promise<void>,

  // 8. Xóa vĩnh viễn bình luận
  deleteComment: (id: string) => Promise<void>,
};
```

---

## 5. TanStack React Query Hooks

| Hook | Query Key | Đặc điểm / Hành vi |
|---|---|---|
| `useInfiniteCommunity(filters)` | `['community', 'feed', filters]` | Hỗ trợ tab `explore`/`following`, sort `hot`/`latest`. Phân trang infinite cuộn tới cuối. |
| `usePostDetail(publicId)` | `['community', 'detail', publicId]` | Lấy chi tiết bài viết, hỗ trợ fallback khi tác giả xem bài `hidden`. |
| `usePostLikes(publicId, page)` | `['community', 'likes', publicId, page]` | Phân trang danh sách người dùng đã thích bài viết. |
| `usePostComments(publicId)` | `['community', 'comments', publicId]` | Trả về danh sách bình luận gốc (mới nhất trước). |
| `useCommentReplies(publicId, commentId)` | `['community', 'replies', publicId, commentId]` | Trả về mảng phản hồi con (cũ nhất trước). |
| `usePublicProfile(username)` | `['community', 'user', username]` | Hồ sơ công khai kèm thống kê follower/following/posts. |
| `useUserPosts(username)` | `['community', 'user', username, 'posts']` | Danh sách bài viết do người dùng đăng tải. |
| `useUserFollows(username, type, q)`| `['community', 'user', username, 'follows', type, q]` | Danh sách quan hệ theo dõi. |
| `useCommunitySearch(params)` | `['community', 'search', params]` | Kết quả tìm kiếm 2 khối Người dùng & Bài viết. |
| `useLikePost()` | Mutation | **Optimistic Update**: Cập nhật tức thời `isLiked` & `likeCount` trên Feed và Detail. |
| `useFollowUser()` | Mutation | **Optimistic Update**: Cập nhật tức thời `isFollowingAuthor` trên bài viết và Profile. |
| `useAddComment()` | Mutation | Tự động cập nhật danh sách bình luận và số đếm comment bài viết. |
| `useUpdateComment()` | Mutation | Cập nhật trực tiếp nội dung tại chỗ. |
| `useDeleteComment()` | Mutation | Cập nhật nhãn "Bình luận đã bị xóa" nếu còn câu trả lời con. |
| `useCreatePost()` / `useUpdatePost()` | Mutation | Invalidate danh sách feed và profile. |
