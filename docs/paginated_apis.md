# Danh Sách Các API Hỗ Trợ Phân Trang (Pagination)

Tất cả các API phân trang trong hệ thống đều tuân thủ và sử dụng **Pagination Pattern** chung được định nghĩa tại `internal/shared/application/dto/pagination.go` (`shared_dto.PaginationQuery` cho Request và `shared_dto.PaginationResult` cho Response).

---

## 1. Tầng Cấu Trúc Chung (Common Pagination Structure)

### Request Query Parameters (`shared_dto.PaginationQuery`)
| Tên Tham Số | Kiểu Dữ Liệu | Giá Trị Mặc Định | Mô Tả |
| :--- | :--- | :--- | :--- |
| `page` | `int` | `1` | Số thứ tự trang hiện tại (1-indexed). |
| `limit` | `int` | `20` | Số lượng phần tử tối đa trả về trên mỗi trang. |

### Response Wrapper (`shared_dto.PaginationResult[T]`)
```json
{
  "page": 1,
  "limit": 20,
  "totalPages": 5,
  "totalItems": 98,
  "items": [...]
}
```

---

## 2. Chi Tiết Các API Phân Trang Theo Module

### 👕 Module Wardrobe (Quản Lý Tủ Đồ & Trang Phục)

#### 1. Lấy danh sách trang phục của tôi
* **Endpoint:** `GET /api/v1/me/wardrobe-items`
* **Mô tả:** Lấy danh sách toàn bộ trang phục cá nhân của người dùng hiện tại (hỗ trợ phân trang và lọc theo danh mục).
* **Tham số Query:**
  * `page` (int) - Số trang.
  * `limit` (int) - Số lượng phần tử mỗi trang.
  * `category_slug` (string) - Lọc theo slug danh mục trang phục.
* **Cấu trúc DTO Request:** `dto.GetWardrobeItemsQueryReq`
* **Cấu trúc Response:** `shared_dto.PaginationResult[dto.WardrobeItemRes]`

#### 2. Lấy danh sách bộ phối đồ của tôi
* **Endpoint:** `GET /api/v1/me/outfits`
* **Mô tả:** Trả về danh sách tất cả các bộ phối đồ (outfits) do người dùng hiện tại thiết kế.
* **Tham số Query:**
  * `page` (int) - Số trang.
  * `limit` (int) - Số lượng phần tử mỗi trang.
* **Cấu trúc DTO Request:** `dto.GetOutfitsQueryReq`
* **Cấu trúc Response:** `shared_dto.PaginationResult[dto.OutfitRes]`

#### 3. Lấy danh sách trang phục mẫu hệ thống (Admin)
* **Endpoint:** `GET /api/v1/admin/wardrobe-items`
* **Mô tả:** Cho phép quản trị viên lấy danh sách tất cả trang phục mẫu trong hệ thống để quản lý.
* **Tham số Query:**
  * `page` (int) - Số trang.
  * `limit` (int) - Số lượng phần tử mỗi trang.
  * `q` (string) - Từ khóa tìm kiếm trang phục mẫu.
  * `category_slug` (string) - Lọc theo slug danh mục.
* **Cấu trúc DTO Request:** `dto.GetSystemCatalogItemsQueryReq`
* **Cấu trúc Response:** `shared_dto.PaginationResult[dto.WardrobeItemRes]`

#### 4. Tìm kiếm trang phục hệ thống (Elasticsearch CQRS)
* **Endpoint:** `GET /api/v1/wardrobe-items/search`
* **Mô tả:** Hỗ trợ tìm kiếm thông minh đa thuộc tính, fuzzy gõ sai chính tả bằng bộ lọc Elasticsearch tốc độ mili-giây.
* **Tham số Query:**
  * `page` (int) - Số trang.
  * `limit` (int) - Số lượng phần tử mỗi trang.
  * `q` (string) - Từ khóa tìm kiếm (Ví dụ: áo sơ mi cotton mát mẻ).
  * `category_slug` (string) - Lọc theo slug danh mục cần lọc.
* **Cấu trúc DTO Request:** `dto.SearchWardrobeItemsQueryReq`
* **Cấu trúc Response:** `shared_dto.PaginationResult[dto.SearchWardrobeItemRes]`

---

### 💳 Module Subscription & Billing (Giao Dịch & Ví)

#### 5. Lấy lịch sử giao dịch ví nội bộ
* **Endpoint:** `GET /api/v1/subscriptions/me/wallet/statements`
* **Mô tả:** Lấy nhật ký biến động số dư và lịch sử giao dịch ví nội bộ của người dùng.
* **Tham số Query:**
  * `page` (int) - Số trang.
  * `limit` (int) - Số lượng phần tử mỗi trang.
* **Cấu trúc DTO Request:** `dto.GetWalletStatementsQueryReq`
* **Cấu trúc Response:** `shared_dto.PaginationResult[dto.WalletStatementDTO]`

---

### 👥 Module Community (Mạng Xã Hội Cộng Đồng)

#### 6. Lấy bảng tin bài đăng cộng đồng (Feed)
* **Endpoint:** `GET /api/v1/posts`
* **Mô tả:** Lấy bảng tin bài đăng khoe đồ/bán đồ của cộng đồng sắp xếp theo độ hot hoặc thời gian mới nhất.
* **Tham số Query:**
  * `page` (int) - Số trang.
  * `limit` (int) - Số lượng phần tử mỗi trang.
  * `sort` (string) - Tiêu chí sắp xếp (`newest` hoặc `hot`).
  * `username` (string) - Lọc theo tên người đăng bài.
  * `postType` (string) - Lọc theo loại bài đăng (`OUTFIT` hoặc `SALE`).
* **Cấu trúc DTO Request:** `community_dto.GetFeedQueryReq`
* **Cấu trúc Response:** `shared_dto.PaginationResult[*PostRes]`

#### 7. Lấy danh sách bài đăng cộng đồng (Admin)
* **Endpoint:** `GET /api/v1/admin/posts`
* **Mô tả:** Cho phép Admin quản lý danh sách bài viết trên hệ thống.
* **Tham số Query:**
  * `page` (int) - Số trang.
  * `limit` (int) - Số lượng phần tử mỗi trang.
  * `postType` (string) - Lọc theo loại bài viết (`OUTFIT`, `SALE`).
  * `isDeleted` (bool) - Lọc bài viết đã bị xóa hay chưa.
  * `q` (string) - Từ khóa tìm kiếm bài đăng.
* **Cấu trúc DTO Request:** `dto.AdminGetPostsQueryReq`
* **Cấu trúc Response:** `shared_dto.PaginationResult[*PostRes]`

#### 8. Lấy danh sách Listing / Post Items (Admin)
* **Endpoint:** `GET /api/v1/admin/post-items`
* **Mô tả:** Cho phép Admin quản lý danh sách toàn bộ các sản phẩm đăng bán trên các bài viết.
* **Tham số Query:**
  * `page` (int) - Số trang.
  * `limit` (int) - Số lượng phần tử mỗi trang.
  * `status` (int) - Lọc theo trạng thái sản phẩm.
  * `transferState` (int) - Lọc theo trạng thái giao dịch.
* **Cấu trúc DTO Request:** `dto.AdminGetPostItemsQueryReq`
* **Cấu trúc Response:** `shared_dto.PaginationResult[*PostItemRes]`

---

### 🔑 Module Identity (Người Dùng & Phân Quyền)

#### 9. Lấy danh sách người dùng trong hệ thống (Admin)
* **Endpoint:** `GET /api/v1/admin/users`
* **Mô tả:** Cho phép quản trị viên lấy danh sách tài khoản người dùng, phục vụ cho mục đích kiểm duyệt hoặc khóa/mở khóa tài khoản.
* **Tham số Query:**
  * `page` (int) - Số trang.
  * `limit` (int) - Số lượng phần tử mỗi trang.
  * `roleSlug` (string) - Lọc theo phân quyền (`member`, `admin`).
  * `isActive` (bool) - Lọc theo trạng thái hoạt động của tài khoản.
  * `q` (string) - Từ khóa tìm kiếm theo tên, email, username.
* **Cấu trúc DTO Request:** `dto.GetUsersQueryReq`
* **Cấu trúc Response:** `shared_dto.PaginationResult[*UserRes]`
