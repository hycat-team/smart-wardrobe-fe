# API Contracts: Community Admin Endpoints

**Feature**: [spec.md](../spec.md) | **Branch**: `029-community-admin-dashboard` | **Date**: 2026-10-04

---

## 1. Tổng hợp các Cổng kết nối (Endpoint Registry)

Dựa trên Swagger API được cung cấp:

| Phương thức | Đường dẫn API | Mô tả chức năng | Vai trò |
|---|---|---|---|
| `GET` | `/api/v1/admin/posts` | Danh sách bài đăng (quản trị) | Admin xem, tìm kiếm và lọc bài viết |
| `PATCH` | `/api/v1/admin/posts/{postId}/hide` | Ẩn bài đăng (quản trị) | Ẩn bài viết khỏi bảng tin công cộng |
| `PATCH` | `/api/v1/admin/posts/{postId}/restore` | Khôi phục bài đăng (quản trị) | Khôi phục bài viết về trạng thái công khai |
| `DELETE` | `/api/v1/admin/posts/{postId}` | Xóa bài đăng (quản trị) | Xóa vĩnh viễn hoặc đánh dấu xóa bài viết |
| `GET` | `/api/v1/admin/comments` | Danh sách bình luận (quản trị) | Admin xem, tìm kiếm và lọc bình luận toàn sàn |
| `PATCH` | `/api/v1/admin/comments/{commentId}/hide` | Ẩn bình luận (quản trị) | Ẩn bình luận khỏi luồng thảo luận |
| `PATCH` | `/api/v1/admin/comments/{commentId}/restore` | Khôi phục bình luận (quản trị) | Đưa bình luận trở lại hoạt động |
| `DELETE` | `/api/v1/admin/comments/{commentId}` | Xóa bình luận (quản trị) | Xóa vĩnh viễn bình luận |

---

## 2. Chi tiết Hợp đồng Yêu cầu & Phản hồi (Request / Response Payloads)

### 2.1. `GET /api/v1/admin/posts`

* **Query Parameters**:
  * `q` (string, optional): Từ khóa tìm kiếm trong tiêu đề, nội dung, hoặc tên người dùng.
  * `status` (string, optional): Lọc theo trạng thái (`published`, `hidden`, `deleted`).
  * `page` (number, default: 1): Số thứ tự trang hiện tại.
  * `limit` (number, default: 10): Số bản ghi trên mỗi trang.
* **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Lấy danh sách bài đăng thành công",
    "data": {
      "items": [
        {
          "id": "post-uuid-1",
          "publicId": "pst_abc123",
          "title": "Phối đồ phong cách tối giản mùa thu",
          "content": "Chia sẻ cùng mọi người set đồ nhẹ nhàng cuối tuần...",
          "postType": "outfit",
          "status": "published",
          "user": {
            "userId": "usr_999",
            "username": "fashionista",
            "firstName": "Mai",
            "lastName": "Anh",
            "avatarUrl": "https://res.cloudinary.com/.../avatar.jpg"
          },
          "outfit": {
            "outfitId": "outfit-1",
            "name": "Minimal Autumn Chic",
            "coverUrl": "https://res.cloudinary.com/.../outfit.jpg"
          },
          "likeCount": 42,
          "commentCount": 8,
          "createdAt": "2026-10-02T08:30:00Z"
        }
      ],
      "metadata": {
        "page": 1,
        "limit": 10,
        "totalItems": 154,
        "totalPages": 16
      }
    }
  }
  ```

---

### 2.2. `PATCH /api/v1/admin/posts/{postId}/hide` & `restore`

* **Path Parameter**: `postId` (string) - Mã định danh bài viết cần xử lý.
* **Headers**: `Authorization: Bearer <ADMIN_TOKEN>`
* **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Đã ẩn bài viết thành công" // hoặc "Đã khôi phục bài viết thành công"
  }
  ```

---

### 2.3. `DELETE /api/v1/admin/posts/{postId}`

* **Path Parameter**: `postId` (string) - Mã định danh bài viết cần xóa.
* **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Đã xóa bài viết thành công"
  }
  ```

---

### 2.4. `GET /api/v1/admin/comments`

* **Query Parameters**:
  * `q` (string, optional): Từ khóa tìm kiếm trong nội dung bình luận hoặc tên tác giả.
  * `status` (string, optional): Lọc trạng thái (`active`, `hidden`, `deleted`).
  * `page` (number, default: 1): Trang hiện tại.
  * `limit` (number, default: 15): Số bình luận mỗi trang.
* **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Lấy danh sách bình luận thành công",
    "data": {
      "items": [
        {
          "id": "cmt-uuid-456",
          "postPublicId": "pst_abc123",
          "content": "Bộ này mua áo khoác ở đâu vậy bạn?",
          "status": "active",
          "user": {
            "userId": "usr_888",
            "username": "stylist_linh",
            "firstName": "Linh",
            "lastName": "Trần",
            "avatarUrl": "https://res.cloudinary.com/.../linh.jpg"
          },
          "createdAt": "2026-10-02T09:15:00Z"
        }
      ],
      "metadata": {
        "page": 1,
        "limit": 15,
        "totalItems": 430,
        "totalPages": 29
      }
    }
  }
  ```

---

### 2.5. `PATCH /api/v1/admin/comments/{commentId}/hide`, `restore` & `DELETE`

* **Path Parameter**: `commentId` (string)
* **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Đã cập nhật trạng thái bình luận thành công"
  }
  ```
