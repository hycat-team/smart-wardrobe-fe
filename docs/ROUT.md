# Smart Wardrobe API Routes

This document is auto-generated from `swagger.json` to provide comprehensive details about API requests and responses.

## Admin

### `GET` `/api/v1/admin/categories`

**Summary**: Lấy danh sách danh mục trang phục (Admin)

**Description**: Cho phép Admin lấy danh sách toàn bộ danh mục trang phục trong hệ thống để quản trị

**Responses**:

- **200**: Danh sách danh mục
  - Data Schema: Array<[CategoryRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres)>
    **Properties**:
    - `id` (string)
    - `name` (string)
    - `slug` (string)

---

### `POST` `/api/v1/admin/categories`

**Summary**: Tạo danh mục trang phục (Admin)

**Description**: Cho phép Admin tạo mới một danh mục trang phục trong hệ thống

**Request Body**:

Thông tin danh mục cần tạo

- Schema: [CreateCategoryReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocreatecategoryreq)
    **Properties**:
    - `name` (string) **(Required)**
    - `slug` (string) **(Required)**

**Responses**:

- **201**: Thông tin danh mục sau khi tạo
  - Data Schema: [CategoryRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres)
    **Properties**:
    - `id` (string)
    - `name` (string)
    - `slug` (string)

---

### `GET` `/api/v1/admin/categories/{id}`

**Summary**: Lấy chi tiết danh mục trang phục (Admin)

**Description**: Cho phép Admin lấy thông tin chi tiết của một danh mục trang phục theo ID

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID danh mục |

**Responses**:

- **200**: Thông tin danh mục
  - Data Schema: [CategoryRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres)
    **Properties**:
    - `id` (string)
    - `name` (string)
    - `slug` (string)

---

### `PUT` `/api/v1/admin/categories/{id}`

**Summary**: Cập nhật danh mục trang phục (Admin)

**Description**: Cho phép Admin cập nhật thông tin của một danh mục trang phục theo ID

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID danh mục |

**Request Body**:

Thông tin danh mục cần cập nhật

- Schema: [UpdateCategoryReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtoupdatecategoryreq)
    **Properties**:
    - `name` (string) **(Required)**
    - `slug` (string) **(Required)**

**Responses**:

- **200**: Thông tin danh mục sau khi cập nhật
  - Data Schema: [CategoryRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres)
    **Properties**:
    - `id` (string)
    - `name` (string)
    - `slug` (string)

---

### `DELETE` `/api/v1/admin/categories/{id}`

**Summary**: Xóa danh mục trang phục (Admin)

**Description**: Cho phép Admin xóa một danh mục trang phục nếu không còn trang phục người dùng liên kết

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID danh mục |

**Responses**:

- **200**: Xóa danh mục thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `DELETE` `/api/v1/admin/comments/{commentID}`

**Summary**: Xóa bình luận community

**Description**: Cho phép admin xóa bình luận community vi phạm

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `commentID` | path | string | Yes | ID bình luận |

**Responses**:

- **200**: Xóa bình luận thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `PATCH` `/api/v1/admin/comments/{commentID}/restore`

**Summary**: Khôi phục bình luận community

**Description**: Cho phép admin khôi phục bình luận community đã bị soft delete

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `commentID` | path | string | Yes | ID bình luận |

**Responses**:

- **200**: Khôi phục bình luận thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/admin/post-items`

**Summary**: Lấy danh sách listing (Admin)

**Description**: Cho phép admin lấy danh sách listing phân trang và lọc theo status, transfer state.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |
| `status` | query | integer | No |  |
| `transferState` | query | integer | No |  |

**Responses**:

- **200**: Lấy danh sách sản phẩm bài đăng thành công
  - Data Schema: [AdminPostItemListRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtoadminpostitemlistres)
    **Properties**:
    - `items` (Array<PostItemRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `DELETE` `/api/v1/admin/post-items/{postItemID}`

**Summary**: Xóa listing community

**Description**: Cho phép admin xóa listing hoặc post item vi phạm bằng cách xóa luôn bài đăng cha liên quan

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postItemID` | path | string | Yes | ID post item |

**Responses**:

- **200**: Xóa listing vi phạm thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `PATCH` `/api/v1/admin/post-items/{postItemID}/hide`

**Summary**: Ẩn listing community

**Description**: Cho phép admin ẩn listing hoặc post item vi phạm khỏi community và giữ nguyên bài đăng cha

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postItemID` | path | string | Yes | ID post item |

**Responses**:

- **200**: Ẩn listing thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/admin/posts`

**Summary**: Lấy danh sách bài đăng (Admin)

**Description**: Cho phép admin lấy danh sách bài đăng phân trang, tìm kiếm và lọc.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `isDeleted` | query | boolean | No |  |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |
| `postType` | query | string | No |  |
| `q` | query | string | No |  |

**Responses**:

- **200**: Lấy danh sách bài đăng thành công
  - Data Schema: [AdminPostListRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtoadminpostlistres)
    **Properties**:
    - `items` (Array<PostRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `DELETE` `/api/v1/admin/posts/{postPublicID}`

**Summary**: Xóa bài đăng community

**Description**: Cho phép admin xóa bài đăng community vi phạm

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |

**Responses**:

- **200**: Xóa bài đăng thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `PATCH` `/api/v1/admin/posts/{postPublicID}/restore`

**Summary**: Khôi phục bài đăng community

**Description**: Cho phép admin khôi phục bài đăng community đã bị soft delete

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |

**Responses**:

- **200**: Khôi phục bài đăng thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/admin/users`

**Summary**: Lấy danh sách người dùng

**Description**: Cho phép admin lấy danh sách người dùng phân trang, tìm kiếm và lọc theo trạng thái/phân quyền.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `isActive` | query | boolean | No |  |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |
| `q` | query | string | No |  |
| `roleSlug` | query | string | No |  |

**Responses**:

- **200**: Lấy danh sách tài khoản thành công
  - Data Schema: [AdminUserListRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtoadminuserlistres)
    **Properties**:
    - `items` (Array<UserRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `PATCH` `/api/v1/admin/users/{id}/status`

**Summary**: Cập nhật trạng thái tài khoản người dùng

**Description**: Cho phép admin khóa hoặc mở lại tài khoản user. Khi khóa sang inactive, hệ thống chỉ revoke refresh token; access token hiện tại vẫn còn hiệu lực đến hết TTL theo cơ chế JWT stateless.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID người dùng |

**Request Body**:

Trạng thái tài khoản mới

- Schema: [UpdateUserStatusReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoupdateuserstatusreq)
    **Properties**:
    - `status` (object)

**Responses**:

- **200**: Cập nhật trạng thái tài khoản thành công
  - Data Schema: [UserRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtouserres)
    **Properties**:
    - `address` (string)
    - `avatarPublicId` (string)
    - `avatarUrl` (string)
    - `bodyProfile` (ref: UserBodyProfileRes)
    - `createdAt` (string)
    - `dateOfBirth` (string)
    - `email` (string)
    - `firstName` (string)
    - `gender` (ref: Gender)
    - `id` (string)
    - `lastName` (string)
    - `roleSlug` (ref: RoleSlug)
    - `status` (ref: UserStatus)
    - `subscription` (ref: UserSubscriptionRes)
    - `username` (string)

---

### `GET` `/api/v1/admin/wardrobe-items`

**Summary**: Lấy danh sách trang phục mẫu (Admin)

**Description**: Cho phép Admin lấy danh sách trang phục mẫu hệ thống để quản lý

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `categorySlug` | query | string | No |  |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |
| `q` | query | string | No |  |

**Responses**:

- **200**: Danh sách trang phục mẫu
  - Data Schema: [PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_WardrobeItemRes](#smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)
    **Properties**:
    - `items` (Array<WardrobeItemRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `PUT` `/api/v1/admin/wardrobe-items/{id}`

**Summary**: Cập nhật trang phục mẫu (Admin)

**Description**: Cho phép Admin cập nhật thông tin thuộc tính của một trang phục mẫu hệ thống

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID trang phục mẫu |

**Request Body**:

Thông tin cập nhật

- Schema: [UpdateSystemCatalogItemReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtoupdatesystemcatalogitemreq)
    **Properties**:
    - `categoryId` (string)
    - `color` (string)
    - `fit` (string)
    - `material` (string)
    - `pattern` (string)
    - `price` (number)
    - `seasonality` (string)
    - `style` (string)

**Responses**:

- **200**: Thông tin trang phục mẫu sau cập nhật
  - Data Schema: [WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)
    **Properties**:
    - `category` (ref: CategoryRes)
    - `color` (string)
    - `colorHex` (string)
    - `colorHue` (number)
    - `colorLightness` (number)
    - `colorSaturation` (number)
    - `createdAt` (string)
    - `fit` (string)
    - `id` (string)
    - `imagePublicId` (string)
    - `imageUrl` (string)
    - `isLocked` (boolean)
    - `material` (string)
    - `pattern` (string)
    - `price` (number)
    - `processingErrorReason` (string)
    - `reviewReason` (string)
    - `seasonality` (string)
    - `status` (ref: WardrobeItemStatus)
    - `style` (string)
    - `userId` (string)

---

### `DELETE` `/api/v1/admin/wardrobe-items/{id}`

**Summary**: Xóa trang phục mẫu (Admin)

**Description**: Cho phép Admin xóa một trang phục mẫu hệ thống

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID trang phục mẫu |

**Responses**:

- **200**: Xóa thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

## Wardrobe AI

### `GET` `/api/v1/ai/chat/sessions`

**Summary**: Lấy danh sách cuộc trò chuyện AI

**Description**: Lấy tất cả các phiên trò chuyện của người dùng hiện tại với stylist AI

**Responses**:

- **200**: Lấy danh sách cuộc trò chuyện thành công
  - Data Schema: Array<[ChatSessionRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtochatsessionres)>
    **Properties**:
    - `contextSummary` (string)
    - `createdAt` (string)
    - `id` (string)
    - `isArchived` (boolean)
    - `title` (string)
    - `updatedAt` (string)

---

### `POST` `/api/v1/ai/chat/sessions`

**Summary**: Tạo cuộc trò chuyện AI mới

**Description**: Khởi tạo một phiên tư vấn phong cách thời trang mới với stylist AI

**Request Body**:

Yêu cầu tạo cuộc trò chuyện

- Schema: [CreateChatSessionReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocreatechatsessionreq)
    **Properties**:
    - `title` (string)

**Responses**:

- **201**: Tạo cuộc trò chuyện thành công
  - Data Schema: [ChatSessionRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtochatsessionres)
    **Properties**:
    - `contextSummary` (string)
    - `createdAt` (string)
    - `id` (string)
    - `isArchived` (boolean)
    - `title` (string)
    - `updatedAt` (string)

---

### `PATCH` `/api/v1/ai/chat/sessions/{contextID}/archive`

**Summary**: Lưu trữ cuộc trò chuyện AI

**Description**: Lưu trữ/ẩn cuộc trò chuyện với stylist AI

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `contextID` | path | string | Yes | ID cuộc trò chuyện |

**Responses**:

- **200**: Lưu trữ cuộc trò chuyện thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/ai/chat/sessions/{contextID}/messages`

**Summary**: Lấy lịch sử tin nhắn AI

**Description**: Lấy toàn bộ các tin nhắn trong một phiên trò chuyện cụ thể (phân trang)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `contextID` | path | string | Yes | ID cuộc trò chuyện |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |

**Responses**:

- **200**: Lấy lịch sử tin nhắn thành công
  - Data Schema: [PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_ChatMessageRes](#smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmoduleswardrobeapplicationdtochatmessageres)
    **Properties**:
    - `items` (Array<ChatMessageRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `POST` `/api/v1/ai/chat/sessions/{contextID}/messages/stream`

**Summary**: Nhắn tin với stylist AI (Stream SSE)

**Description**: Gửi tin nhắn cho stylist AI và nhận phản hồi dạng stream sự kiện (Server-Sent Events).
Nếu mô hình AI phát hiện người dùng yêu cầu phối đồ từ tủ đồ cá nhân, nó sẽ thêm token '[ACTION:REDIRECT_OUTFIT]' vào cuối phản hồi stream.
CHÚ Ý: Token '[ACTION:REDIRECT_OUTFIT]' có thể bị phân mảnh (split) thành nhiều chunk nhỏ khi truyền tải stream (ví dụ: chunk 1 nhận '[ACTION:RE', chunk 2 nhận 'DIRECT_OUTFIT]').
Frontend cần tích luỹ toàn bộ chuỗi (accumulated string) hoặc ghép các chunk lại trước khi kiểm tra sự tồn tại của token này để hiển thị nút/card điều hướng sang tính năng Phối đồ chuyên dụng, thay vì chỉ kiểm tra đơn lẻ trên từng chunk nhận được.

**NOTE**: Gửi tin nhắn cho stylist AI và nhận phản hồi dạng stream sự kiện (Server-Sent Events).
Nội dung tin nhắn được giới hạn tối đa 2.000 ký tự Unicode sau khi chuẩn hóa NFC. Frontend nên kiểm tra giới hạn trước khi gửi để đảm bảo trải nghiệm người dùng.
Nếu mô hình AI phát hiện người dùng yêu cầu phối đồ từ tủ đồ cá nhân, nó sẽ thêm token '[ACTION:REDIRECT_OUTFIT]' vào cuối phản hồi stream.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `contextID` | path | string | Yes | ID cuộc trò chuyện |

**Request Body**:

Nội dung tin nhắn gửi đi

- Schema: [SendChatMessageReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtosendchatmessagereq)
    **Properties**:
    - `content` (string) **(Required)**

**Responses**:

- **200**: Stream Server-Sent Events (SSE) phản hồi từ AI
  - Schema: string

---

### `POST` `/api/v1/ai/outfit-recommendations`

**Summary**: Gợi ý phối đồ từ tủ đồ

**Description**: Nhận gợi ý phối đồ từ các trang phục có sẵn trong tủ đồ của người dùng dựa trên dịp, thời tiết và phong cách.

Các trường trong Request Body:
- occasion (Dịp phối đồ, gợi ý: casual, work, date, party, sport,...)
- styleTarget (Phong cách hướng tới, gợi ý: minimalist, vintage, streetwear, preppy, sporty, elegant,...)
- season (Mùa phối đồ, enum: spring, summer, autumn, winter, all)
- weather (Thời tiết hiện tại, gợi ý: hot, cold, warm, cool, rainy,...)
- colorTone (Tông màu phối đồ, gợi ý: light, dark, pastel, earthy, neon,...)
- details (Ghi chú thêm bằng tay - tự do)

**NOTE**Nhận gợi ý phối đồ từ các trang phục có sẵn trong tủ đồ của người dùng dựa trên dịp, thời tiết và phong cách.

Các trường trong Request Body:

occasion (Dịp phối đồ, gợi ý: casual, work, date, party, sport,...)
styleTarget (Phong cách hướng tới, gợi ý: minimalist, vintage, streetwear, preppy, sporty, elegant,...)
season (Mùa phối đồ, enum: spring, summer, autumn, winter, all)
weather (Thời tiết hiện tại, gợi ý: hot, cold, warm, cool, rainy,...)
colorTone (Tông màu phối đồ, gợi ý: light, dark, pastel, earthy, neon,...)
details (Ghi chú thêm bằng tay, tối đa 1.000 ký tự Unicode sau khi chuẩn hóa NFC. Frontend nên kiểm tra giới hạn trước khi gửi để đảm bảo trải nghiệm người dùng.)

**Request Body**:

Yêu cầu gợi ý phối đồ

- Schema: [RecommendOutfitReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtorecommendoutfitreq)
    **Properties**:
    - `colorTone` (string) - Tông màu phối đồ (Gợi ý: light, dark, pastel, earthy, neon... hoặc nhập tông màu tùy ý)
    - `details` (string) - Ghi chú thêm bằng tay (free text)
    - `occasion` (string) - Dịp phối đồ (Gợi ý: casual, work, date, party, sport, hoặc nhập dịp tùy ý)
    - `season` (string) - Mùa phối đồ @enums spring,summer,autumn,winter,all
    - `styleTarget` (string) - Phong cách hướng tới (Gợi ý: minimalist, vintage, streetwear, preppy, sporty, elegant, hoặc nhập phong cách tùy ý)
    - `weather` (string) - Thời tiết hiện tại (Gợi ý: hot, cold, warm, cool, rainy, hoặc nhập thời tiết cụ thể)

**Responses**:

- **200**: Gợi ý phối đồ thành công
  - Data Schema: [RecommendedOutfitRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtorecommendedoutfitres)
    **Properties**:
    - `explanation` (string)
    - `isFallback` (boolean)
    - `items` (Array<RecommendedItemGroup>)
    - `remainingQuota` (integer)
    - `title` (string)

---

## Auth

### `POST` `/api/v1/auth/forgot-password`

**Summary**: Yêu cầu khôi phục mật khẩu

**Description**: Gửi mã OTP xác thực khôi phục mật khẩu qua email

**Request Body**:

Email nhận OTP

- Schema: [SendForgotPasswordOtpReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtosendforgotpasswordotpreq)
    **Properties**:
    - `email` (string) **(Required)**

**Responses**:

- **200**: OK
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `POST` `/api/v1/auth/forgot-password/confirm-otp`

**Summary**: Xác thực OTP khôi phục mật khẩu

**Description**: Xác thực mã OTP khôi phục mật khẩu và lưu token tạm thời vào cookie

**Request Body**:

Mã OTP và Email

- Schema: [ConfirmForgotPasswordOtpReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoconfirmforgotpasswordotpreq)
    **Properties**:
    - `email` (string) **(Required)**
    - `otpCode` (string) **(Required)**

**Responses**:

- **200**: OK
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `POST` `/api/v1/auth/login`

**Summary**: Đăng nhập

**Description**: Đăng nhập hệ thống bằng username hoặc email và password

**Request Body**:

Thông tin đăng nhập

- Schema: [LoginReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtologinreq)
    **Properties**:
    - `loginName` (string) **(Required)**
    - `password` (string) **(Required)**

**Responses**:

- **200**: OK
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `POST` `/api/v1/auth/logout`

**Summary**: Đăng xuất

**Description**: Đăng xuất người dùng, vô hiệu hóa token hiện tại và xóa cookie refresh token & access token

**Responses**:

- **200**: OK
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `POST` `/api/v1/auth/refresh-token`

**Summary**: Xoay vòng token (Refresh Token)

**Description**: Sử dụng refresh token trong cookie để lấy access token mới và xoay vòng refresh token

**Responses**:

- **200**: accessToken trong dữ liệu
  - Data Schema: object

---

### `POST` `/api/v1/auth/register`

**Summary**: Đăng ký tài khoản

**Description**: Đăng ký tài khoản mới cho người dùng và gửi OTP xác thực qua email

**Request Body**:

Thông tin đăng ký

- Schema: [RegisterReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoregisterreq)
    **Properties**:
    - `address` (string) **(Required)**
    - `confirmPassword` (string) **(Required)**
    - `dateOfBirth` (string) **(Required)**
    - `email` (string) **(Required)**
    - `firstName` (string) **(Required)**
    - `gender` (object)
    - `lastName` (string)
    - `password` (string) **(Required)**
    - `username` (string) **(Required)**

**Responses**:

- **200**: OK
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `POST` `/api/v1/auth/register/confirm-otp`

**Summary**: Xác thực OTP đăng ký

**Description**: Xác nhận OTP gửi qua email để kích hoạt tài khoản

**Request Body**:

Mã OTP xác thực

- Schema: [ConfirmRegisterOtpReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoconfirmregisterotpreq)
    **Properties**:
    - `email` (string) **(Required)**
    - `otpCode` (string) **(Required)**

**Responses**:

- **200**: OK
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `POST` `/api/v1/auth/reset-password`

**Summary**: Đặt lại mật khẩu

**Description**: Sử dụng token tạm thời từ cookie để tiến hành đặt mật khẩu mới

**Request Body**:

Mật khẩu mới và mật khẩu xác nhận

- Schema: [ResetPasswordReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoresetpasswordreq)
    **Properties**:
    - `confirmPassword` (string) **(Required)**
    - `logoutAllDevices` (boolean)
    - `newPassword` (string) **(Required)**

**Responses**:

- **200**: OK
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

## Category

### `GET` `/api/v1/categories`

**Summary**: Lấy tất cả danh mục trang phục

**Description**: Lấy danh sách toàn bộ danh mục trang phục trong hệ thống

**Responses**:

- **200**: Danh sách danh mục
  - Data Schema: Array<[CategoryRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres)>
    **Properties**:
    - `id` (string)
    - `name` (string)
    - `slug` (string)

---

## Me

### `GET` `/api/v1/me`

**Summary**: Lấy thông tin cá nhân

**Description**: Lấy thông tin chi tiết tài khoản của người dùng hiện tại đang đăng nhập

**Responses**:

- **200**: Thông tin người dùng
  - Data Schema: [UserRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtouserres)
    **Properties**:
    - `address` (string)
    - `avatarPublicId` (string)
    - `avatarUrl` (string)
    - `bodyProfile` (ref: UserBodyProfileRes)
    - `createdAt` (string)
    - `dateOfBirth` (string)
    - `email` (string)
    - `firstName` (string)
    - `gender` (ref: Gender)
    - `id` (string)
    - `lastName` (string)
    - `roleSlug` (ref: RoleSlug)
    - `status` (ref: UserStatus)
    - `subscription` (ref: UserSubscriptionRes)
    - `username` (string)

---

### `PUT` `/api/v1/me`

**Summary**: Cập nhật thông tin cá nhân

**Description**: Cập nhật các trường thông tin của người dùng hiện tại đang đăng nhập

**Request Body**:

Thông tin cập nhật

- Schema: [UpdateProfileReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoupdateprofilereq)
    **Properties**:
    - `address` (string)
    - `dateOfBirth` (string)
    - `firstName` (string) **(Required)**
    - `gender` (object)
    - `lastName` (string)

**Responses**:

- **200**: Thông tin người dùng sau khi cập nhật
  - Data Schema: [UserRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtouserres)
    **Properties**:
    - `address` (string)
    - `avatarPublicId` (string)
    - `avatarUrl` (string)
    - `bodyProfile` (ref: UserBodyProfileRes)
    - `createdAt` (string)
    - `dateOfBirth` (string)
    - `email` (string)
    - `firstName` (string)
    - `gender` (ref: Gender)
    - `id` (string)
    - `lastName` (string)
    - `roleSlug` (ref: RoleSlug)
    - `status` (ref: UserStatus)
    - `subscription` (ref: UserSubscriptionRes)
    - `username` (string)

---

### `PUT` `/api/v1/me/avatar`

**Summary**: Cập nhật ảnh đại diện

**Description**: Cập nhật URL ảnh đại diện và public ID của người dùng

**Request Body**:

Thông tin ảnh đại diện mới

- Schema: [UpdateAvatarReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoupdateavatarreq)
    **Properties**:
    - `avatarPublicId` (string) **(Required)**
    - `avatarUrl` (string) **(Required)**

**Responses**:

- **200**: Thông tin người dùng sau khi cập nhật
  - Data Schema: [UserRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtouserres)
    **Properties**:
    - `address` (string)
    - `avatarPublicId` (string)
    - `avatarUrl` (string)
    - `bodyProfile` (ref: UserBodyProfileRes)
    - `createdAt` (string)
    - `dateOfBirth` (string)
    - `email` (string)
    - `firstName` (string)
    - `gender` (ref: Gender)
    - `id` (string)
    - `lastName` (string)
    - `roleSlug` (ref: RoleSlug)
    - `status` (ref: UserStatus)
    - `subscription` (ref: UserSubscriptionRes)
    - `username` (string)

---

### `GET` `/api/v1/me/avatar-signature`

**Summary**: Lấy chữ ký tải ảnh đại diện

**Description**: Lấy chữ ký bảo mật từ Cloudinary để client tải trực tiếp ảnh đại diện lên

**Responses**:

- **200**: Chữ ký và thông tin upload
  - Data Schema: [UploadSignatureResult](#smart-wardrobe-beinternalsharedapplicationdtouploadsignatureresult)
    **Properties**:
    - `apiKey` (string)
    - `folder` (string)
    - `publicId` (string)
    - `signature` (string)
    - `timestamp` (integer)

---

### `PUT` `/api/v1/me/body-profile`

**Summary**: Cập nhật hồ sơ cơ thể

**Description**: Cập nhật hồ sơ cơ thể đã xác nhận thủ công hoặc dữ liệu AI suy luận để phục vụ gợi ý phối đồ chính xác hơn

**Request Body**:

Thông tin hồ sơ cơ thể

- Schema: [UpdateBodyProfileReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoupdatebodyprofilereq)
    **Properties**:
    - `bodyShape` (string) **(Required)**
    - `heightCm` (number) **(Required)**
    - `inferredByAi` (ref: InferredBodyProfileReq)
    - `measurements` (ref: UpdateBodyMeasurementsReq)
    - `verifiedByUser` (boolean)
    - `weightKg` (number) **(Required)**

**Responses**:

- **200**: Thông tin người dùng sau khi cập nhật hồ sơ cơ thể
  - Data Schema: [UserRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtouserres)
    **Properties**:
    - `address` (string)
    - `avatarPublicId` (string)
    - `avatarUrl` (string)
    - `bodyProfile` (ref: UserBodyProfileRes)
    - `createdAt` (string)
    - `dateOfBirth` (string)
    - `email` (string)
    - `firstName` (string)
    - `gender` (ref: Gender)
    - `id` (string)
    - `lastName` (string)
    - `roleSlug` (ref: RoleSlug)
    - `status` (ref: UserStatus)
    - `subscription` (ref: UserSubscriptionRes)
    - `username` (string)

---

### `PUT` `/api/v1/me/change-password`

**Summary**: Đổi mật khẩu

**Description**: Thay đổi mật khẩu cho người dùng hiện tại đang đăng nhập

**Request Body**:

Mật khẩu cũ và mới

- Schema: [ChangePasswordReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtochangepasswordreq)
    **Properties**:
    - `confirmPassword` (string) **(Required)**
    - `logoutAllDevices` (boolean)
    - `newPassword` (string) **(Required)**
    - `oldPassword` (string) **(Required)**

**Responses**:

- **200**: OK
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

## Outfits

### `GET` `/api/v1/me/outfits`

**Summary**: Lấy danh sách bộ phối đồ của tôi

**Description**: Trả về danh sách tất cả các bộ phối đồ do tôi thiết kế.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |

**Responses**:

- **200**: Danh sách bộ phối đồ
  - Data Schema: [PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_OutfitRes](#smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfitres)
    **Properties**:
    - `items` (Array<OutfitRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `POST` `/api/v1/outfits`

**Summary**: Tạo bộ phối đồ mới

**Description**: Lưu bộ phối đồ tự thiết kế cùng danh sách trang phục kèm tọa độ kéo thả 2D và layer order.

**Request Body**:

Tọa độ 2D và thông tin phối đồ

- Schema: [SaveOutfitReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtosaveoutfitreq)
    **Properties**:
    - `coverImageUrl` (string)
    - `coverPublicId` (string)
    - `description` (string)
    - `items` (Array<SaveOutfitItemReq>) **(Required)**
    - `name` (string) **(Required)**

**Responses**:

- **201**: Tạo bộ phối đồ thành công
  - Data Schema: [OutfitRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfitres)
    **Properties**:
    - `coverImageUrl` (string)
    - `coverPublicId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `id` (string)
    - `items` (Array<OutfitItemRes>)
    - `name` (string)
    - `status` (ref: OutfitStatus)
    - `updatedAt` (string)
    - `userId` (string)

---

### `GET` `/api/v1/outfits/upload-signature`

**Summary**: Lấy chữ ký tải ảnh bìa bộ phối đồ

**Description**: Lấy thông tin chữ ký bảo mật từ Cloudinary để upload ảnh cover của outfit từ Client

**Responses**:

- **200**: Lấy chữ ký thành công
  - Data Schema: [UploadSignatureResult](#smart-wardrobe-beinternalsharedapplicationdtouploadsignatureresult)
    **Properties**:
    - `apiKey` (string)
    - `folder` (string)
    - `publicId` (string)
    - `signature` (string)
    - `timestamp` (integer)

---

### `GET` `/api/v1/outfits/{id}`

**Summary**: Chi tiết bộ phối đồ và tọa độ canvas

**Description**: Trả về chi tiết bộ phối đồ kèm danh sách trang phục đầy đủ và tọa độ 2D để render lên canvas.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID bộ phối đồ |

**Responses**:

- **200**: Chi tiết bộ phối đồ
  - Data Schema: [OutfitRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfitres)
    **Properties**:
    - `coverImageUrl` (string)
    - `coverPublicId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `id` (string)
    - `items` (Array<OutfitItemRes>)
    - `name` (string)
    - `status` (ref: OutfitStatus)
    - `updatedAt` (string)
    - `userId` (string)

---

### `PUT` `/api/v1/outfits/{id}`

**Summary**: Cập nhật bộ phối đồ

**Description**: Cập nhật lại thông tin hoặc điều chỉnh tọa độ kéo thả của bộ phối đồ.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID bộ phối đồ |

**Request Body**:

Thông tin cập nhật

- Schema: [SaveOutfitReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtosaveoutfitreq)
    **Properties**:
    - `coverImageUrl` (string)
    - `coverPublicId` (string)
    - `description` (string)
    - `items` (Array<SaveOutfitItemReq>) **(Required)**
    - `name` (string) **(Required)**

**Responses**:

- **200**: Cập nhật thành công
  - Data Schema: [OutfitRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfitres)
    **Properties**:
    - `coverImageUrl` (string)
    - `coverPublicId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `id` (string)
    - `items` (Array<OutfitItemRes>)
    - `name` (string)
    - `status` (ref: OutfitStatus)
    - `updatedAt` (string)
    - `userId` (string)

---

### `DELETE` `/api/v1/outfits/{id}`

**Summary**: Xóa bộ phối đồ tự thiết kế

**Description**: Xóa bộ phối đồ khỏi bộ sưu tập cá nhân.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID bộ phối đồ |

**Responses**:

- **200**: Xóa bộ phối đồ thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

## Wardrobe

### `GET` `/api/v1/me/wardrobe-items`

**Summary**: Lấy danh sách trang phục

**Description**: Lấy danh sách trang phục trong tủ đồ của người dùng, hỗ trợ lọc theo trạng thái và áp dụng trạng thái khóa động cho các món usable vượt hạn mức gói

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `categorySlug` | query | string | No |  |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |
| `status` | query | string | No |  |

**Responses**:

- **200**: Danh sách trang phục
  - Data Schema: [PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_WardrobeItemRes](#smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)
    **Properties**:
    - `items` (Array<WardrobeItemRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `GET` `/api/v1/system-catalog/wardrobe-items`

**Summary**: Lấy danh sách trang phục hệ thống

**Description**: Lấy danh sách trang phục mẫu của hệ thống, hỗ trợ tìm kiếm thông minh bằng Elasticsearch và fallback sang database khi cần

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `categorySlug` | query | string | No |  |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |
| `q` | query | string | No |  |

**Responses**:

- **200**: Danh sách trang phục tìm thấy
  - Data Schema: [PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_SearchWardrobeItemRes](#smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmoduleswardrobeapplicationdtosearchwardrobeitemres)
    **Properties**:
    - `items` (Array<SearchWardrobeItemRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `POST` `/api/v1/wardrobe-items/batch-upload`

**Summary**: Số hóa trang phục hàng loạt

**Description**: Hỗ trợ upload hàng loạt ảnh trang phục, hệ thống sẽ tạo các item ở trạng thái Đang xử lý và tự động gọi AI phân tích ngầm

**Request Body**:

Danh sách ảnh trang phục

- Schema: [BatchUploadWardrobeItemsReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtobatchuploadwardrobeitemsreq)
    **Properties**:
    - `items` (Array<WardrobeBatchUploadItemReq>) **(Required)**

**Responses**:

- **201**: Danh sách trang phục đang được xử lý ngầm
  - Data Schema: Array<[WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)>
    **Properties**:
    - `category` (ref: CategoryRes)
    - `color` (string)
    - `colorHex` (string)
    - `colorHue` (number)
    - `colorLightness` (number)
    - `colorSaturation` (number)
    - `createdAt` (string)
    - `fit` (string)
    - `id` (string)
    - `imagePublicId` (string)
    - `imageUrl` (string)
    - `isLocked` (boolean)
    - `material` (string)
    - `pattern` (string)
    - `price` (number)
    - `processingErrorReason` (string)
    - `reviewReason` (string)
    - `seasonality` (string)
    - `status` (ref: WardrobeItemStatus)
    - `style` (string)
    - `userId` (string)

---

### `DELETE` `/api/v1/wardrobe-items/bulk`

**Summary**: Xóa hàng loạt trang phục

**Description**: Cho phép người dùng chọn và xóa mềm hàng loạt trang phục khỏi tủ đồ để giải phóng quota dung lượng

**Request Body**:

Danh sách ID trang phục cần xóa

- Schema: [BulkDeleteItemsReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtobulkdeleteitemsreq)
    **Properties**:
    - `ids` (Array<string>) **(Required)**

**Responses**:

- **200**: Xóa hàng loạt trang phục thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `POST` `/api/v1/wardrobe-items/catalog-init`

**Summary**: Khởi tạo nhanh tủ đồ cá nhân

**Description**: Sao chép hàng loạt các trang phục mẫu từ hệ thống sang tủ đồ cá nhân của user, không tốn quota AI

**Request Body**:

Danh sách ID trang phục mẫu

- Schema: [InitClosetFromCatalogReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtoinitclosetfromcatalogreq)
    **Properties**:
    - `catalogItemIds` (Array<string>) **(Required)**

**Responses**:

- **201**: Danh sách trang phục cá nhân được tạo
  - Data Schema: Array<[WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)>
    **Properties**:
    - `category` (ref: CategoryRes)
    - `color` (string)
    - `colorHex` (string)
    - `colorHue` (number)
    - `colorLightness` (number)
    - `colorSaturation` (number)
    - `createdAt` (string)
    - `fit` (string)
    - `id` (string)
    - `imagePublicId` (string)
    - `imageUrl` (string)
    - `isLocked` (boolean)
    - `material` (string)
    - `pattern` (string)
    - `price` (number)
    - `processingErrorReason` (string)
    - `reviewReason` (string)
    - `seasonality` (string)
    - `status` (ref: WardrobeItemStatus)
    - `style` (string)
    - `userId` (string)

---

### `DELETE` `/api/v1/wardrobe-items/locked`

**Summary**: Xóa toàn bộ trang phục bị khóa

**Description**: Tự động quét và xóa mềm toàn bộ trang phục vượt quá hạn mức sử dụng bị khóa của người dùng để giải phóng quota

**Responses**:

- **200**: Xóa toàn bộ trang phục bị khóa thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/wardrobe-items/upload-signature`

**Summary**: Lấy chữ ký tải ảnh trang phục

**Description**: Lấy chữ ký bảo mật từ Cloudinary để client tải trực tiếp ảnh trang phục lên

**Responses**:

- **200**: Chữ ký và thông tin upload
  - Data Schema: [UploadSignatureResult](#smart-wardrobe-beinternalsharedapplicationdtouploadsignatureresult)
    **Properties**:
    - `apiKey` (string)
    - `folder` (string)
    - `publicId` (string)
    - `signature` (string)
    - `timestamp` (integer)

---

### `GET` `/api/v1/wardrobe-items/{id}`

**Summary**: Xem chi tiết trang phục

**Description**: Lấy thông tin chi tiết của một trang phục theo ID, tự động chặn nếu trang phục nằm trong vùng bị khóa

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID trang phục |

**Responses**:

- **200**: Chi tiết trang phục
  - Data Schema: [WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)
    **Properties**:
    - `category` (ref: CategoryRes)
    - `color` (string)
    - `colorHex` (string)
    - `colorHue` (number)
    - `colorLightness` (number)
    - `colorSaturation` (number)
    - `createdAt` (string)
    - `fit` (string)
    - `id` (string)
    - `imagePublicId` (string)
    - `imageUrl` (string)
    - `isLocked` (boolean)
    - `material` (string)
    - `pattern` (string)
    - `price` (number)
    - `processingErrorReason` (string)
    - `reviewReason` (string)
    - `seasonality` (string)
    - `status` (ref: WardrobeItemStatus)
    - `style` (string)
    - `userId` (string)

---

### `POST` `/api/v1/wardrobe-items/{id}/clone`

**Summary**: Nhân bản trang phục

**Description**: Sao chép nhanh một trang phục có sẵn trong tủ đồ, tối đa 5 bản sao

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID trang phục gốc |

**Request Body**:

Số lượng nhân bản

- Schema: [CloneWardrobeItemReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtoclonewardrobeitemreq)
    **Properties**:
    - `quantity` (integer) **(Required)**

**Responses**:

- **201**: Danh sách trang phục được nhân bản
  - Data Schema: Array<[WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)>
    **Properties**:
    - `category` (ref: CategoryRes)
    - `color` (string)
    - `colorHex` (string)
    - `colorHue` (number)
    - `colorLightness` (number)
    - `colorSaturation` (number)
    - `createdAt` (string)
    - `fit` (string)
    - `id` (string)
    - `imagePublicId` (string)
    - `imageUrl` (string)
    - `isLocked` (boolean)
    - `material` (string)
    - `pattern` (string)
    - `price` (number)
    - `processingErrorReason` (string)
    - `reviewReason` (string)
    - `seasonality` (string)
    - `status` (ref: WardrobeItemStatus)
    - `style` (string)
    - `userId` (string)

---

### `PUT` `/api/v1/wardrobe-items/{id}/manual-classify`

**Summary**: Tự phân loại trang phục thủ công

**Description**: Cho phép người dùng tự điền tay thông tin cho trang phục phân tích lỗi hoặc cần rà soát, hệ thống dùng Text Embedding cập nhật vector và duyệt vào tủ đồ

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID trang phục |

**Request Body**:

Thông tin phân loại thủ công

- Schema: [ManualClassifyReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtomanualclassifyreq)
    **Properties**:
    - `categoryId` (string) **(Required)**
    - `color` (string) **(Required)**
    - `fit` (string) **(Required)**
    - `material` (string) **(Required)**
    - `pattern` (string) **(Required)**
    - `price` (number)
    - `seasonality` (string) **(Required)**
    - `style` (string) **(Required)**

**Responses**:

- **200**: Chi tiết trang phục sau khi cập nhật
  - Data Schema: [WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)
    **Properties**:
    - `category` (ref: CategoryRes)
    - `color` (string)
    - `colorHex` (string)
    - `colorHue` (number)
    - `colorLightness` (number)
    - `colorSaturation` (number)
    - `createdAt` (string)
    - `fit` (string)
    - `id` (string)
    - `imagePublicId` (string)
    - `imageUrl` (string)
    - `isLocked` (boolean)
    - `material` (string)
    - `pattern` (string)
    - `price` (number)
    - `processingErrorReason` (string)
    - `reviewReason` (string)
    - `seasonality` (string)
    - `status` (ref: WardrobeItemStatus)
    - `style` (string)
    - `userId` (string)

---

### `POST` `/api/v1/wardrobe-items/{id}/retry-analysis`

**Summary**: Thử phân tích lại trang phục

**Description**: Cho phép người dùng gửi lại yêu cầu phân tích AI cho trang phục đang lỗi hoặc cần rà soát

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | path | string | Yes | ID trang phục |

**Responses**:

- **200**: Chi tiết trang phục sau khi đưa lại vào hàng đợi xử lý
  - Data Schema: [WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)
    **Properties**:
    - `category` (ref: CategoryRes)
    - `color` (string)
    - `colorHex` (string)
    - `colorHue` (number)
    - `colorLightness` (number)
    - `colorSaturation` (number)
    - `createdAt` (string)
    - `fit` (string)
    - `id` (string)
    - `imagePublicId` (string)
    - `imageUrl` (string)
    - `isLocked` (boolean)
    - `material` (string)
    - `pattern` (string)
    - `price` (number)
    - `processingErrorReason` (string)
    - `reviewReason` (string)
    - `seasonality` (string)
    - `status` (ref: WardrobeItemStatus)
    - `style` (string)
    - `userId` (string)

---

## Community

### `GET` `/api/v1/posts`

**Summary**: Lấy danh sách bài đăng cộng đồng

**Description**: Lấy feed danh sách bài đăng của cộng đồng sắp xếp theo thứ tự mới nhất hoặc hot nhất

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |
| `postType` | query | string | No |  |
| `sort` | query | string | No |  |
| `username` | query | string | No |  |

**Responses**:

- **200**: Lấy feed thành công
  - Data Schema: [GetFeedRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtogetfeedres)
    **Properties**:
    - `items` (Array<PostRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `POST` `/api/v1/posts`

**Summary**: Tạo bài đăng cộng đồng mới

**Description**: Đăng bài bán đồ hoặc khoe outfit lên bảng tin cộng đồng

**Request Body**:

Nội dung bài đăng

- Schema: [CreatePostReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtocreatepostreq)
    **Properties**:
    - `contactInfo` (string)
    - `content` (string) **(Required)**
    - `items` (Array<PostItemInputReq>)
    - `media` (Array<PostMediaReq>)
    - `postType` (object) **(Required)**
    - `title` (string)

**Responses**:

- **201**: Tạo bài đăng thành công
  - Data Schema: [PostRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostres)
    **Properties**:
    - `avatarUrl` (string)
    - `commentCount` (integer)
    - `contactInfo` (string)
    - `content` (string)
    - `createdAt` (string)
    - `finalFeedScore` (number)
    - `firstName` (string)
    - `globalHotnessScore` (number)
    - `id` (string)
    - `isDeleted` (boolean)
    - `isLiked` (boolean)
    - `items` (Array<PostItemRes>)
    - `lastName` (string)
    - `likeCount` (integer)
    - `media` (Array<PostMediaRes>)
    - `postType` (ref: PostType)
    - `publicId` (string)
    - `sharePath` (string)
    - `title` (string)
    - `totalPrice` (number)
    - `updatedAt` (string)
    - `userId` (string)
    - `username` (string)

---

### `GET` `/api/v1/posts/upload-signature`

**Summary**: Lấy chữ ký tải media bài đăng

**Description**: Lấy chữ ký bảo mật từ Cloudinary để client tải trực tiếp media bài đăng cộng đồng lên

**Responses**:

- **200**: Chữ ký và thông tin upload
  - Data Schema: [UploadSignatureResult](#smart-wardrobe-beinternalsharedapplicationdtouploadsignatureresult)
    **Properties**:
    - `apiKey` (string)
    - `folder` (string)
    - `publicId` (string)
    - `signature` (string)
    - `timestamp` (integer)

---

### `GET` `/api/v1/posts/{postPublicID}`

**Summary**: Lấy chi tiết bài đăng

**Description**: Lấy thông tin chi tiết của một bài đăng cụ thể không bao gồm danh sách bình luận và danh sách người thích

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |

**Responses**:

- **200**: Lấy chi tiết bài đăng thành công
  - Data Schema: [PostRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostres)
    **Properties**:
    - `avatarUrl` (string)
    - `commentCount` (integer)
    - `contactInfo` (string)
    - `content` (string)
    - `createdAt` (string)
    - `finalFeedScore` (number)
    - `firstName` (string)
    - `globalHotnessScore` (number)
    - `id` (string)
    - `isDeleted` (boolean)
    - `isLiked` (boolean)
    - `items` (Array<PostItemRes>)
    - `lastName` (string)
    - `likeCount` (integer)
    - `media` (Array<PostMediaRes>)
    - `postType` (ref: PostType)
    - `publicId` (string)
    - `sharePath` (string)
    - `title` (string)
    - `totalPrice` (number)
    - `updatedAt` (string)
    - `userId` (string)
    - `username` (string)

---

### `PUT` `/api/v1/posts/{postPublicID}`

**Summary**: Cập nhật bài đăng cộng đồng

**Description**: Cập nhật nội dung, media và danh sách món đồ của bài đăng

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |

**Request Body**:

Nội dung bài đăng

- Schema: [UpdatePostReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtoupdatepostreq)
    **Properties**:
    - `contactInfo` (string)
    - `content` (string) **(Required)**
    - `items` (Array<PostItemInputReq>)
    - `media` (Array<PostMediaReq>)
    - `title` (string)

**Responses**:

- **200**: Cập nhật bài đăng thành công
  - Data Schema: [PostRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostres)
    **Properties**:
    - `avatarUrl` (string)
    - `commentCount` (integer)
    - `contactInfo` (string)
    - `content` (string)
    - `createdAt` (string)
    - `finalFeedScore` (number)
    - `firstName` (string)
    - `globalHotnessScore` (number)
    - `id` (string)
    - `isDeleted` (boolean)
    - `isLiked` (boolean)
    - `items` (Array<PostItemRes>)
    - `lastName` (string)
    - `likeCount` (integer)
    - `media` (Array<PostMediaRes>)
    - `postType` (ref: PostType)
    - `publicId` (string)
    - `sharePath` (string)
    - `title` (string)
    - `totalPrice` (number)
    - `updatedAt` (string)
    - `userId` (string)
    - `username` (string)

---

### `DELETE` `/api/v1/posts/{postPublicID}`

**Summary**: Xóa bài đăng

**Description**: Xóa bài đăng của chính người dùng hiện tại

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |

**Responses**:

- **200**: Xóa bài đăng thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/posts/{postPublicID}/comments`

**Summary**: Lấy bình luận cấp đầu của bài đăng

**Description**: Lấy danh sách bình luận F0 của bài đăng cụ thể

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |

**Responses**:

- **200**: Lấy danh sách bình luận thành công
  - Data Schema: Array<[CommentRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtocommentres)>
    **Properties**:
    - `avatarUrl` (string)
    - `content` (string)
    - `createdAt` (string)
    - `firstName` (string)
    - `id` (string)
    - `lastName` (string)
    - `parentCommentId` (string)
    - `userId` (string)
    - `username` (string)

---

### `POST` `/api/v1/posts/{postPublicID}/comments`

**Summary**: Thêm bình luận vào bài viết

**Description**: Tạo bình luận mới hoặc phản hồi trực tiếp vào bình luận cấp đầu của bài viết cộng đồng

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |

**Request Body**:

Nội dung bình luận

- Schema: [AddCommentReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtoaddcommentreq)
    **Properties**:
    - `content` (string) **(Required)**
    - `parentCommentId` (string)

**Responses**:

- **201**: Thêm bình luận thành công
  - Data Schema: [CommentRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtocommentres)
    **Properties**:
    - `avatarUrl` (string)
    - `content` (string)
    - `createdAt` (string)
    - `firstName` (string)
    - `id` (string)
    - `lastName` (string)
    - `parentCommentId` (string)
    - `userId` (string)
    - `username` (string)

---

### `PUT` `/api/v1/posts/{postPublicID}/comments/{commentID}`

**Summary**: Cập nhật bình luận của bài viết

**Description**: Chỉnh sửa nội dung bình luận thuộc bài viết cộng đồng

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |
| `commentID` | path | string | Yes | ID bình luận |

**Request Body**:

Nội dung bình luận mới

- Schema: [UpdateCommentReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtoupdatecommentreq)
    **Properties**:
    - `content` (string) **(Required)**

**Responses**:

- **200**: Cập nhật bình luận thành công
  - Data Schema: [CommentRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtocommentres)
    **Properties**:
    - `avatarUrl` (string)
    - `content` (string)
    - `createdAt` (string)
    - `firstName` (string)
    - `id` (string)
    - `lastName` (string)
    - `parentCommentId` (string)
    - `userId` (string)
    - `username` (string)

---

### `DELETE` `/api/v1/posts/{postPublicID}/comments/{commentID}`

**Summary**: Xóa bình luận của bài viết

**Description**: Xóa bình luận thuộc bài viết cộng đồng của chính người dùng hiện tại

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |
| `commentID` | path | string | Yes | ID bình luận |

**Responses**:

- **200**: Xóa bình luận thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/posts/{postPublicID}/comments/{commentID}/replies`

**Summary**: Lấy phản hồi của một bình luận cấp đầu

**Description**: Lấy danh sách bình luận F1 của một bình luận F0 cụ thể

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |
| `commentID` | path | string | Yes | ID bình luận cấp đầu |

**Responses**:

- **200**: Lấy danh sách phản hồi thành công
  - Data Schema: Array<[CommentRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtocommentres)>
    **Properties**:
    - `avatarUrl` (string)
    - `content` (string)
    - `createdAt` (string)
    - `firstName` (string)
    - `id` (string)
    - `lastName` (string)
    - `parentCommentId` (string)
    - `userId` (string)
    - `username` (string)

---

### `DELETE` `/api/v1/posts/{postPublicID}/items`

**Summary**: Gỡ món đồ khỏi bài đăng

**Description**: Gỡ một hoặc nhiều món đồ ra khỏi danh sách bán trong bài đăng

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |

**Request Body**:

Danh sách ID các món đồ cần gỡ

- Schema: [RemovePostItemsReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtoremovepostitemsreq)
    **Properties**:
    - `postItemIds` (Array<string>) **(Required)**

**Responses**:

- **200**: Gỡ món đồ thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `PUT` `/api/v1/posts/{postPublicID}/like`

**Summary**: Thích / Bỏ thích bài đăng

**Description**: Like hoặc unlike một bài viết trên cộng đồng bằng cách gửi trạng thái rõ ràng

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |

**Request Body**:

Trạng thái thích

- Schema: [LikePostReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtolikepostreq)
    **Properties**:
    - `isLiked` (boolean) **(Required)**

**Responses**:

- **200**: Cập nhật like thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/posts/{postPublicID}/likes`

**Summary**: Lấy danh sách người thích bài đăng

**Description**: Lấy danh sách người dùng đã thích bài đăng để hiển thị kiểu Facebook

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postPublicID` | path | string | Yes | Mã công khai bài đăng |

**Responses**:

- **200**: Lấy danh sách người thích thành công
  - Data Schema: Array<[PostLikeUserRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostlikeuserres)>
    **Properties**:
    - `avatarUrl` (string)
    - `firstName` (string)
    - `id` (string)
    - `lastName` (string)
    - `username` (string)

---

## Subscription

### `GET` `/api/v1/subscriptions/me`

**Summary**: Lấy thông tin gói hội viên hiện tại

**Description**: Lấy thông tin chi tiết gói hội viên đang kích hoạt của người dùng hiện tại.
Định nghĩa enum PlanKind:
- 0: DefaultFree (Gói miễn phí mặc định)
- 1: Finite (Gói giới hạn số ngày sử dụng)
- 2: Lifetime (Gói trọn đời không giới hạn thời gian)
Định nghĩa TierRank (Cấp độ gói):
- 0: Cấp Free
- 1: Cấp Premium (Gói có cấp Premium lớn hơn sẽ được ưu tiên kích hoạt trước)

**Responses**:

- **200**: Thông tin gói hội viên hiện tại
  - Data Schema: [UserSubscriptionOverviewDTO](#smart-wardrobe-beinternalmodulessubscriptioncontractusersubscriptionoverviewdto)
    **Properties**:
    - `aiChatDailyQuota` (integer)
    - `aiOutfitDailyQuota` (integer)
    - `expiresAt` (string)
    - `fallbackPlanCode` (string)
    - `fallbackPlanKind` (ref: PlanKind)
    - `fallbackTierRank` (integer)
    - `isAutoRenewEnabled` (boolean)
    - `maxOutfits` (integer)
    - `maxWardrobeItems` (integer)
    - `planID` (string)
    - `planKind` (ref: PlanKind)
    - `planName` (string)
    - `planSlug` (string)
    - `tierRank` (integer)

---

### `PUT` `/api/v1/subscriptions/me/auto-renew`

**Summary**: Thiết lập tự động gia hạn gói cước

**Description**: Thiết lập bật hoặc tắt tính năng tự động gia hạn gói cước qua ví nội bộ khi hết hạn

**Request Body**:

Trạng thái thiết lập tự động gia hạn

- Schema: [SetAutoRenewReq](#smart-wardrobe-beinternalmodulessubscriptionpresentationdtosetautorenewreq)
    **Properties**:
    - `enabled` (boolean) **(Required)**

**Responses**:

- **200**: Trạng thái tự động gia hạn mới
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/subscriptions/me/daily-quota`

**Summary**: Lấy hạn ngạch sử dụng hàng ngày

**Description**: Lấy hạn ngạch chi tiết và trạng thái sử dụng của người dùng trong ngày.
Định nghĩa enum PlanKind:
- 0: DefaultFree (Gói miễn phí mặc định)
- 1: Finite (Gói giới hạn số ngày sử dụng)
- 2: Lifetime (Gói trọn đời không giới hạn thời gian)
Định nghĩa TierRank (Cấp độ gói):
- 0: Cấp Free
- 1: Cấp Premium (Gói có cấp Premium lớn hơn sẽ được ưu tiên kích hoạt trước)

**Responses**:

- **200**: Hạn ngạch sử dụng và thông tin gói hiện tại
  - Data Schema: [UserSubscriptionDTO](#smart-wardrobe-beinternalmodulessubscriptioncontractusersubscriptiondto)
    **Properties**:
    - `aiChatDailyQuota` (integer)
    - `aiOutfitDailyQuota` (integer)
    - `aiUsageCount` (integer)
    - `expiresAt` (string)
    - `fallbackPlanCode` (string)
    - `fallbackPlanKind` (ref: PlanKind)
    - `fallbackTierRank` (integer)
    - `isAutoRenewEnabled` (boolean)
    - `lastResetDate` (string)
    - `maxOutfits` (integer)
    - `maxWardrobeItems` (integer)
    - `outfitRecommendCount` (integer)
    - `planID` (string)
    - `planKind` (ref: PlanKind)
    - `planName` (string)
    - `planSlug` (string)
    - `tierRank` (integer)

---

### `GET` `/api/v1/subscriptions/plans`

**Summary**: Lấy danh sách các gói Premium

**Description**: Lấy danh sách tất cả các gói đăng ký Premium hiện có.
Định nghĩa enum PlanKind:
- 0: DefaultFree (Gói miễn phí mặc định)
- 1: Finite (Gói giới hạn số ngày sử dụng)
- 2: Lifetime (Gói trọn đời không giới hạn thời gian)
Định nghĩa TierRank (Cấp độ gói):
- 0: Cấp Free
- 1: Cấp Premium (Gói có cấp Premium lớn hơn sẽ được ưu tiên kích hoạt trước)

**Responses**:

- **200**: Danh sách gói cước
  - Data Schema: Array<[SubscriptionPlanDTO](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtosubscriptionplandto)>
    **Properties**:
    - `aiChatDailyQuota` (integer)
    - `aiOutfitDailyQuota` (integer)
    - `durationDays` (integer)
    - `id` (string)
    - `maxOutfits` (integer)
    - `maxWardrobeItems` (integer)
    - `name` (string)
    - `planKind` (ref: PlanKind)
    - `price` (number)
    - `slug` (string)
    - `tierRank` (integer)

---

## Billing

### `POST` `/api/v1/subscriptions/me/purchase`

**Summary**: Đăng ký mua gói cước trực tiếp

**Description**: Khởi tạo link thanh toán VietQR qua cổng PayOS để đăng ký gói cước trực tiếp.
Định nghĩa enum DepositStatus (Trạng thái thanh toán):
- 0: Pending (Chờ thanh toán)
- 1: Success (Thanh toán thành công)
- 2: FailedLegacy (Thất bại cũ)
- 3: Creating (Đang tạo link)
- 4: ReconciliationRequired (Cần đối soát thủ công)
- 5: Reconciling (Đang đối soát)
- 6: CreationFailed (Tạo link thất bại)
- 7: Cancelled (Đã hủy thanh toán)
- 8: Expired (Giao dịch hết hạn)
- 9: InvestigationRequired (Cần điều tra)

**Request Body**:

Thông tin gói cước

- Schema: [DirectPurchaseReq](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtodirectpurchasereq)
    **Properties**:
    - `cancelUrl` (string)
    - `planSlug` (string) **(Required)**
    - `returnUrl` (string)

**Responses**:

- **200**: Link thanh toán
  - Data Schema: [PaymentLinkDTO](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtopaymentlinkdto)
    **Properties**:
    - `expiresAt` (string)
    - `nextReconciliationAt` (string)
    - `orderCode` (integer)
    - `paymentStatus` (ref: DepositStatus)
    - `paymentUrl` (string)

---

### `POST` `/api/v1/subscriptions/me/purchase-with-wallet`

**Summary**: Đăng ký mua gói cước bằng ví nội bộ

**Description**: Thực hiện mua gói cước bằng cách trừ số dư ví nội bộ của người dùng

**Request Body**:

Thông tin gói cước (chỉ cần planSlug)

- Schema: [DirectPurchaseReq](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtodirectpurchasereq)
    **Properties**:
    - `cancelUrl` (string)
    - `planSlug` (string) **(Required)**
    - `returnUrl` (string)

**Responses**:

- **200**: Kết quả đăng ký
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/subscriptions/me/wallet`

**Summary**: Lấy số dư ví người dùng

**Description**: Lấy số dư hiện có trong ví nội bộ của người dùng

**Responses**:

- **200**: Số dư ví
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/subscriptions/me/wallet/statements`

**Summary**: Lấy lịch sử giao dịch ví nội bộ

**Description**: Lấy nhật ký biến động số dư ví nội bộ của người dùng

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |

**Responses**:

- **200**: Danh sách lịch sử giao dịch
  - Data Schema: [PaginationResult-smart-wardrobe-be_internal_modules_subscription_application_dto_WalletStatementDTO](#smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmodulessubscriptionapplicationdtowalletstatementdto)
    **Properties**:
    - `items` (Array<WalletStatementDTO>)
    - `metadata` (ref: PaginationMetadata)

---

### `POST` `/api/v1/subscriptions/me/wallet/topup`

**Summary**: Tạo yêu cầu nạp tiền vào ví nội bộ

**Description**: Khởi tạo link thanh toán VietQR qua cổng PayOS để nạp tiền vào ví.
Định nghĩa enum DepositStatus (Trạng thái thanh toán):
- 0: Pending (Chờ thanh toán)
- 1: Success (Thanh toán thành công)
- 2: FailedLegacy (Thất bại cũ)
- 3: Creating (Đang tạo link)
- 4: ReconciliationRequired (Cần đối soát thủ công)
- 5: Reconciling (Đang đối soát)
- 6: CreationFailed (Tạo link thất bại)
- 7: Cancelled (Đã hủy thanh toán)
- 8: Expired (Giao dịch hết hạn)
- 9: InvestigationRequired (Cần điều tra)

**Request Body**:

Thông tin nạp tiền

- Schema: [WalletTopUpReq](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtowallettopupreq)
    **Properties**:
    - `amount` (number) **(Required)**
    - `cancelUrl` (string)
    - `returnUrl` (string)

**Responses**:

- **200**: Link thanh toán
  - Data Schema: [PaymentLinkDTO](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtopaymentlinkdto)
    **Properties**:
    - `expiresAt` (string)
    - `nextReconciliationAt` (string)
    - `orderCode` (integer)
    - `paymentStatus` (ref: DepositStatus)
    - `paymentUrl` (string)

---

### `POST` `/api/v1/subscriptions/payos-webhook`

**Summary**: Xử lý Webhook thông báo thanh toán từ PayOS

**Description**: Tiếp nhận và xác thực thông báo IPN từ PayOS khi người dùng thanh toán thành công

**Request Body**:

Dữ liệu Webhook

- Schema: [PayOSWebhookReq](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtopayoswebhookreq)
    **Properties**:
    - `code` (string)
    - `data` (ref: PayOSWebhookData)
    - `desc` (string)
    - `signature` (string)

**Responses**:

- **200**: Kết quả xử lý
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

## Transfers

### `POST` `/api/v1/transfers/accept`

**Summary**: Chấp nhận nhận bàn giao danh sách trang phục

**Description**: Đồng ý nhận danh sách trang phục đã mua về tủ đồ cá nhân

**Request Body**:

Danh sách sản phẩm bàn giao

- Schema: [AcceptTransfersReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtoaccepttransfersreq)
    **Properties**:
    - `postItemIds` (Array<string>) **(Required)**

**Responses**:

- **200**: Nhận món đồ vào tủ thành công
  - Data Schema: Array<[WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)>
    **Properties**:
    - `category` (ref: CategoryRes)
    - `color` (string)
    - `colorHex` (string)
    - `colorHue` (number)
    - `colorLightness` (number)
    - `colorSaturation` (number)
    - `createdAt` (string)
    - `fit` (string)
    - `id` (string)
    - `imagePublicId` (string)
    - `imageUrl` (string)
    - `isLocked` (boolean)
    - `material` (string)
    - `pattern` (string)
    - `price` (number)
    - `processingErrorReason` (string)
    - `reviewReason` (string)
    - `seasonality` (string)
    - `status` (ref: WardrobeItemStatus)
    - `style` (string)
    - `userId` (string)

---

### `POST` `/api/v1/transfers/decline`

**Summary**: Từ chối nhận bàn giao danh sách trang phục

**Description**: Từ chối nhận bàn giao danh sách trang phục mua từ bài đăng cộng đồng

**Request Body**:

Danh sách sản phẩm bàn giao

- Schema: [AcceptTransfersReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtoaccepttransfersreq)
    **Properties**:
    - `postItemIds` (Array<string>) **(Required)**

**Responses**:

- **200**: Từ chối nhận món đồ thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/transfers/items/{postItemID}/requests`

**Summary**: Lấy danh sách người xin mua của một sản phẩm

**Description**: Người bán xem danh sách những người mua đã gửi yêu cầu xin mua cho món đồ cụ thể

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `postItemID` | path | string | Yes | ID chi tiết món đồ trong bài đăng |

**Responses**:

- **200**: Lấy danh sách người xin mua thành công
  - Data Schema: Array<[TransferRequestRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtotransferrequestres)>
    **Properties**:
    - `avatarUrl` (string)
    - `buyerId` (string)
    - `createdAt` (string)
    - `id` (string)
    - `status` (ref: RequestStatus)
    - `username` (string)

---

### `POST` `/api/v1/transfers/mark-sold`

**Summary**: Đánh dấu các món đồ đã bán (Bulk)

**Description**: Đánh dấu danh sách các trang phục đã được bán cho một người dùng khác (qua buyerId) và kích hoạt trạng thái bàn giao

**Request Body**:

Thông tin người mua và danh sách sản phẩm

- Schema: [MarkPostItemsSoldReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtomarkpostitemssoldreq)
    **Properties**:
    - `buyerId` (string) **(Required)**
    - `postItemIds` (Array<string>) **(Required)**

**Responses**:

- **200**: Đánh dấu đã bán thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `GET` `/api/v1/transfers/me/pending`

**Summary**: Danh sách trang phục đang chờ nhận bàn giao

**Description**: Lấy danh sách các trang phục do người khác đánh dấu bán cho bạn đang chờ xác nhận

**Responses**:

- **200**: Lấy danh sách đang chờ nhận thành công
  - Data Schema: Array<[PendingTransferRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtopendingtransferres)>
    **Properties**:
    - `item` (ref: WardrobeItemRes)
    - `postItemId` (string)
    - `sellerName` (string)

---

### `GET` `/api/v1/transfers/me/posts`

**Summary**: Danh sách bài đăng bàn giao của người bán

**Description**: Lấy danh sách các bài đăng của người bán có món đồ đang chờ, được chấp nhận, bị từ chối hoặc đã bán trong luồng bàn giao

**Responses**:

- **200**: Lấy danh sách bài đăng bàn giao thành công
  - Data Schema: Array<[SellerTransferPostRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtosellertransferpostres)>
    **Properties**:
    - `createdAt` (string)
    - `items` (Array<SellerTransferPostItemRes>)
    - `postId` (string)
    - `postType` (ref: PostType)
    - `title` (string)
    - `updatedAt` (string)

---

### `POST` `/api/v1/transfers/requests`

**Summary**: Gửi yêu cầu xin mua trang phục (Bulk)

**Description**: Người mua đăng ký muốn mua một hoặc nhiều món đồ trong bài đăng của người bán

**Request Body**:

Danh sách sản phẩm xin mua

- Schema: [CreateTransferRequestsReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtocreatetransferrequestsreq)
    **Properties**:
    - `postItemIds` (Array<string>) **(Required)**

**Responses**:

- **200**: Gửi yêu cầu xin mua thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

## Models (Definitions)

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtoaccepttransfersreq"></a>`AcceptTransfersReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `postItemIds` | Array<string> | Yes |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtoaddcommentreq"></a>`AddCommentReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | string | Yes |  |
| `parentCommentId` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtoadminpostitemlistres"></a>`AdminPostItemListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[PostItemRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostitemres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtoadminpostlistres"></a>`AdminPostListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[PostRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtocommentres"></a>`CommentRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `avatarUrl` | string | No |  |
| `content` | string | No |  |
| `createdAt` | string | No |  |
| `firstName` | string | No |  |
| `id` | string | No |  |
| `lastName` | string | No |  |
| `parentCommentId` | string | No |  |
| `userId` | string | No |  |
| `username` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtocreatepostreq"></a>`CreatePostReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `contactInfo` | string | No |  |
| `content` | string | Yes |  |
| `items` | Array<[PostItemInputReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostiteminputreq)> | No |  |
| `media` | Array<[PostMediaReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostmediareq)> | No |  |
| `postType` | object | Yes |  |
| `title` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtocreatetransferrequestsreq"></a>`CreateTransferRequestsReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `postItemIds` | Array<string> | Yes |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtogetfeedres"></a>`GetFeedRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[PostRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtolikepostreq"></a>`LikePostReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `isLiked` | boolean | Yes |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtomarkpostitemssoldreq"></a>`MarkPostItemsSoldReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `buyerId` | string | Yes |  |
| `postItemIds` | Array<string> | Yes |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtopendingtransferres"></a>`PendingTransferRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `item` | [WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres) | No |  |
| `postItemId` | string | No |  |
| `sellerName` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtopostiteminputreq"></a>`PostItemInputReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `itemCondition` | [ItemCondition](#smart-wardrobe-beinternalshareddomainconstantsitemconditionitemcondition) | No |  |
| `itemId` | string | Yes |  |
| `price` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtopostitemres"></a>`PostItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `buyerUserId` | string | No |  |
| `declinedAt` | string | No |  |
| `id` | string | No |  |
| `item` | [WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres) | No |  |
| `itemCondition` | [ItemCondition](#smart-wardrobe-beinternalshareddomainconstantsitemconditionitemcondition) | No |  |
| `price` | number | No |  |
| `soldAt` | string | No |  |
| `status` | [PostItemStatus](#smart-wardrobe-beinternalshareddomainconstantspostitemstatuspostitemstatus) | No |  |
| `transferState` | [TransferState](#smart-wardrobe-beinternalshareddomainconstantstransferstatetransferstate) | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtopostlikeuserres"></a>`PostLikeUserRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `avatarUrl` | string | No |  |
| `firstName` | string | No |  |
| `id` | string | No |  |
| `lastName` | string | No |  |
| `username` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtopostmediareq"></a>`PostMediaReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `mediaType` | string | Yes |  |
| `mediaUrl` | string | Yes |  |
| `publicId` | string | No |  |
| `sortOrder` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtopostmediares"></a>`PostMediaRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | No |  |
| `mediaType` | string | No |  |
| `mediaUrl` | string | No |  |
| `publicId` | string | No |  |
| `sortOrder` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtopostres"></a>`PostRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `avatarUrl` | string | No |  |
| `commentCount` | integer | No |  |
| `contactInfo` | string | No |  |
| `content` | string | No |  |
| `createdAt` | string | No |  |
| `finalFeedScore` | number | No |  |
| `firstName` | string | No |  |
| `globalHotnessScore` | number | No |  |
| `id` | string | No |  |
| `isDeleted` | boolean | No |  |
| `isLiked` | boolean | No |  |
| `items` | Array<[PostItemRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostitemres)> | No |  |
| `lastName` | string | No |  |
| `likeCount` | integer | No |  |
| `media` | Array<[PostMediaRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostmediares)> | No |  |
| `postType` | [PostType](#smart-wardrobe-beinternalshareddomainconstantsposttypeposttype) | No |  |
| `publicId` | string | No |  |
| `sharePath` | string | No |  |
| `title` | string | No |  |
| `totalPrice` | number | No |  |
| `updatedAt` | string | No |  |
| `userId` | string | No |  |
| `username` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtoremovepostitemsreq"></a>`RemovePostItemsReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `postItemIds` | Array<string> | Yes |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtosellertransferpostitemres"></a>`SellerTransferPostItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `buyer` | [TransferBuyerSummaryRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtotransferbuyersummaryres) | No |  |
| `declinedAt` | string | No |  |
| `item` | [WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres) | No |  |
| `itemCondition` | [ItemCondition](#smart-wardrobe-beinternalshareddomainconstantsitemconditionitemcondition) | No |  |
| `postItemId` | string | No |  |
| `price` | number | No |  |
| `soldAt` | string | No |  |
| `status` | [PostItemStatus](#smart-wardrobe-beinternalshareddomainconstantspostitemstatuspostitemstatus) | No |  |
| `transferState` | [TransferState](#smart-wardrobe-beinternalshareddomainconstantstransferstatetransferstate) | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtosellertransferpostres"></a>`SellerTransferPostRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `createdAt` | string | No |  |
| `items` | Array<[SellerTransferPostItemRes](#smart-wardrobe-beinternalmodulescommunityapplicationdtosellertransferpostitemres)> | No |  |
| `postId` | string | No |  |
| `postType` | [PostType](#smart-wardrobe-beinternalshareddomainconstantsposttypeposttype) | No |  |
| `title` | string | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtotransferbuyersummaryres"></a>`TransferBuyerSummaryRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `avatarUrl` | string | No |  |
| `id` | string | No |  |
| `username` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtotransferrequestres"></a>`TransferRequestRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `avatarUrl` | string | No |  |
| `buyerId` | string | No |  |
| `createdAt` | string | No |  |
| `id` | string | No |  |
| `status` | [RequestStatus](#smart-wardrobe-beinternalshareddomainconstantsrequeststatusrequeststatus) | No |  |
| `username` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtoupdatecommentreq"></a>`UpdateCommentReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulescommunityapplicationdtoupdatepostreq"></a>`UpdatePostReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `contactInfo` | string | No |  |
| `content` | string | Yes |  |
| `items` | Array<[PostItemInputReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostiteminputreq)> | No |  |
| `media` | Array<[PostMediaReq](#smart-wardrobe-beinternalmodulescommunityapplicationdtopostmediareq)> | No |  |
| `title` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoadminuserlistres"></a>`AdminUserListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[UserRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtouserres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtochangepasswordreq"></a>`ChangePasswordReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `confirmPassword` | string | Yes |  |
| `logoutAllDevices` | boolean | No |  |
| `newPassword` | string | Yes |  |
| `oldPassword` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoconfirmforgotpasswordotpreq"></a>`ConfirmForgotPasswordOtpReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | Yes |  |
| `otpCode` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoconfirmregisterotpreq"></a>`ConfirmRegisterOtpReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | Yes |  |
| `otpCode` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoinferredbodyprofilereq"></a>`InferredBodyProfileReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `bodyShape` | string | Yes |  |
| `confidenceScore` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtologinreq"></a>`LoginReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `loginName` | string | Yes |  |
| `password` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoregisterreq"></a>`RegisterReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `address` | string | Yes |  |
| `confirmPassword` | string | Yes |  |
| `dateOfBirth` | string | Yes |  |
| `email` | string | Yes |  |
| `firstName` | string | Yes |  |
| `gender` | object | No |  |
| `lastName` | string | No |  |
| `password` | string | Yes |  |
| `username` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoresetpasswordreq"></a>`ResetPasswordReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `confirmPassword` | string | Yes |  |
| `logoutAllDevices` | boolean | No |  |
| `newPassword` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtosendforgotpasswordotpreq"></a>`SendForgotPasswordOtpReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoupdateavatarreq"></a>`UpdateAvatarReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `avatarPublicId` | string | Yes |  |
| `avatarUrl` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoupdatebodymeasurementsreq"></a>`UpdateBodyMeasurementsReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `chestCm` | number | No |  |
| `hipCm` | number | No |  |
| `waistCm` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoupdatebodyprofilereq"></a>`UpdateBodyProfileReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `bodyShape` | string | Yes |  |
| `heightCm` | number | Yes |  |
| `inferredByAi` | [InferredBodyProfileReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoinferredbodyprofilereq) | No |  |
| `measurements` | [UpdateBodyMeasurementsReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoupdatebodymeasurementsreq) | No |  |
| `verifiedByUser` | boolean | No |  |
| `weightKg` | number | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoupdateprofilereq"></a>`UpdateProfileReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `address` | string | No |  |
| `dateOfBirth` | string | No |  |
| `firstName` | string | Yes |  |
| `gender` | object | No |  |
| `lastName` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoupdateuserstatusreq"></a>`UpdateUserStatusReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | object | No |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtouserbodymeasurementsres"></a>`UserBodyMeasurementsRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `chestCm` | number | No |  |
| `hipCm` | number | No |  |
| `waistCm` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtouserbodyprofileres"></a>`UserBodyProfileRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `bodyShape` | string | No |  |
| `heightCm` | number | No |  |
| `inferredByAi` | [UserInferredBodyRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtouserinferredbodyres) | No |  |
| `lastUpdatedAt` | string | No |  |
| `measurements` | [UserBodyMeasurementsRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtouserbodymeasurementsres) | No |  |
| `verifiedByUser` | boolean | No |  |
| `weightKg` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtouserinferredbodyres"></a>`UserInferredBodyRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `bodyShape` | string | No |  |
| `confidenceScore` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtouserres"></a>`UserRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `address` | string | No |  |
| `avatarPublicId` | string | No |  |
| `avatarUrl` | string | No |  |
| `bodyProfile` | [UserBodyProfileRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtouserbodyprofileres) | No |  |
| `createdAt` | string | No |  |
| `dateOfBirth` | string | No |  |
| `email` | string | No |  |
| `firstName` | string | No |  |
| `gender` | [Gender](#smart-wardrobe-beinternalshareddomainconstantsgendergender) | No |  |
| `id` | string | No |  |
| `lastName` | string | No |  |
| `roleSlug` | [RoleSlug](#smart-wardrobe-beinternalshareddomainconstantsroleslugroleslug) | No |  |
| `status` | [UserStatus](#smart-wardrobe-beinternalshareddomainconstantsuserstatususerstatus) | No |  |
| `subscription` | [UserSubscriptionRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtousersubscriptionres) | No |  |
| `username` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtousersubscriptionres"></a>`UserSubscriptionRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `aiChatDailyQuota` | integer | No |  |
| `aiOutfitDailyQuota` | integer | No |  |
| `expiresAt` | string | No |  |
| `maxOutfits` | integer | No |  |
| `maxWardrobeItems` | integer | No |  |
| `planId` | string | No |  |
| `planName` | string | No |  |
| `planSlug` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionapplicationdtodirectpurchasereq"></a>`DirectPurchaseReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `cancelUrl` | string | No |  |
| `planSlug` | string | Yes |  |
| `returnUrl` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionapplicationdtopayoswebhookdata"></a>`PayOSWebhookData`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `accountNumber` | string | No |  |
| `amount` | integer | No |  |
| `code` | string | No |  |
| `desc` | string | No |  |
| `description` | string | No |  |
| `orderCode` | integer | No |  |
| `paymentLinkId` | string | No |  |
| `reference` | string | No |  |
| `transactionDateTime` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionapplicationdtopayoswebhookreq"></a>`PayOSWebhookReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | No |  |
| `data` | [PayOSWebhookData](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtopayoswebhookdata) | No |  |
| `desc` | string | No |  |
| `signature` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionapplicationdtopaymentlinkdto"></a>`PaymentLinkDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `expiresAt` | string | No |  |
| `nextReconciliationAt` | string | No |  |
| `orderCode` | integer | No |  |
| `paymentStatus` | [DepositStatus](#smart-wardrobe-beinternalshareddomainconstantsdepositstatusdepositstatus) | No |  |
| `paymentUrl` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionapplicationdtosubscriptionplandto"></a>`SubscriptionPlanDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `aiChatDailyQuota` | integer | No |  |
| `aiOutfitDailyQuota` | integer | No |  |
| `durationDays` | integer | No |  |
| `id` | string | No |  |
| `maxOutfits` | integer | No |  |
| `maxWardrobeItems` | integer | No |  |
| `name` | string | No |  |
| `planKind` | [PlanKind](#smart-wardrobe-beinternalshareddomainconstantsplankindplankind) | No |  |
| `price` | number | No |  |
| `slug` | string | No |  |
| `tierRank` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionapplicationdtowalletstatementdto"></a>`WalletStatementDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `amount` | number | No |  |
| `createdAt` | string | No |  |
| `description` | string | No |  |
| `id` | string | No |  |
| `newBalance` | number | No |  |
| `previousBalance` | number | No |  |
| `transactionType` | [WalletStatementType](#smart-wardrobe-beinternalshareddomainconstantswalletstatementtypewalletstatementtype) | No |  |
| `userID` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionapplicationdtowallettopupreq"></a>`WalletTopUpReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `amount` | number | Yes |  |
| `cancelUrl` | string | No |  |
| `returnUrl` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptioncontractusersubscriptiondto"></a>`UserSubscriptionDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `aiChatDailyQuota` | integer | No |  |
| `aiOutfitDailyQuota` | integer | No |  |
| `aiUsageCount` | integer | No |  |
| `expiresAt` | string | No |  |
| `fallbackPlanCode` | string | No |  |
| `fallbackPlanKind` | [PlanKind](#smart-wardrobe-beinternalshareddomainconstantsplankindplankind) | No |  |
| `fallbackTierRank` | integer | No |  |
| `isAutoRenewEnabled` | boolean | No |  |
| `lastResetDate` | string | No |  |
| `maxOutfits` | integer | No |  |
| `maxWardrobeItems` | integer | No |  |
| `outfitRecommendCount` | integer | No |  |
| `planID` | string | No |  |
| `planKind` | [PlanKind](#smart-wardrobe-beinternalshareddomainconstantsplankindplankind) | No |  |
| `planName` | string | No |  |
| `planSlug` | string | No |  |
| `tierRank` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptioncontractusersubscriptionoverviewdto"></a>`UserSubscriptionOverviewDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `aiChatDailyQuota` | integer | No |  |
| `aiOutfitDailyQuota` | integer | No |  |
| `expiresAt` | string | No |  |
| `fallbackPlanCode` | string | No |  |
| `fallbackPlanKind` | [PlanKind](#smart-wardrobe-beinternalshareddomainconstantsplankindplankind) | No |  |
| `fallbackTierRank` | integer | No |  |
| `isAutoRenewEnabled` | boolean | No |  |
| `maxOutfits` | integer | No |  |
| `maxWardrobeItems` | integer | No |  |
| `planID` | string | No |  |
| `planKind` | [PlanKind](#smart-wardrobe-beinternalshareddomainconstantsplankindplankind) | No |  |
| `planName` | string | No |  |
| `planSlug` | string | No |  |
| `tierRank` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionpresentationdtosetautorenewreq"></a>`SetAutoRenewReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | boolean | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtobatchuploadwardrobeitemsreq"></a>`BatchUploadWardrobeItemsReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[WardrobeBatchUploadItemReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobebatchuploaditemreq)> | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtobulkdeleteitemsreq"></a>`BulkDeleteItemsReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `ids` | Array<string> | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres"></a>`CategoryRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | No |  |
| `name` | string | No |  |
| `slug` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtochatmessageres"></a>`ChatMessageRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | string | No |  |
| `createdAt` | string | No |  |
| `id` | string | No |  |
| `sender` | [MessageSender](#smart-wardrobe-beinternalshareddomainconstantsmessagesendermessagesender) | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtochatsessionres"></a>`ChatSessionRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `contextSummary` | string | No |  |
| `createdAt` | string | No |  |
| `id` | string | No |  |
| `isArchived` | boolean | No |  |
| `title` | string | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtoclonewardrobeitemreq"></a>`CloneWardrobeItemReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `quantity` | integer | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtocreatecategoryreq"></a>`CreateCategoryReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes |  |
| `slug` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtocreatechatsessionreq"></a>`CreateChatSessionReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtoinitclosetfromcatalogreq"></a>`InitClosetFromCatalogReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `catalogItemIds` | Array<string> | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtomanualclassifyreq"></a>`ManualClassifyReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `categoryId` | string | Yes |  |
| `color` | string | Yes |  |
| `fit` | string | Yes |  |
| `material` | string | Yes |  |
| `pattern` | string | Yes |  |
| `price` | number | No |  |
| `seasonality` | string | Yes |  |
| `style` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfititemres"></a>`OutfitItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | No |  |
| `layerOrder` | integer | No |  |
| `positionX` | number | No |  |
| `positionY` | number | No |  |
| `scale` | number | No |  |
| `wardrobeItem` | [WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres) | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfitres"></a>`OutfitRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `coverImageUrl` | string | No |  |
| `coverPublicId` | string | No |  |
| `createdAt` | string | No |  |
| `description` | string | No |  |
| `id` | string | No |  |
| `items` | Array<[OutfitItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfititemres)> | No |  |
| `name` | string | No |  |
| `status` | [OutfitStatus](#smart-wardrobe-beinternalshareddomainconstantsoutfitstatusoutfitstatus) | No |  |
| `updatedAt` | string | No |  |
| `userId` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtorecommendoutfitreq"></a>`RecommendOutfitReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `colorTone` | string | No | Tông màu phối đồ (Gợi ý: light, dark, pastel, earthy, neon... hoặc nhập tông màu tùy ý) |
| `details` | string | No | Ghi chú thêm bằng tay (free text) |
| `occasion` | string | No | Dịp phối đồ (Gợi ý: casual, work, date, party, sport, hoặc nhập dịp tùy ý) |
| `season` | string | No | Mùa phối đồ @enums spring,summer,autumn,winter,all |
| `styleTarget` | string | No | Phong cách hướng tới (Gợi ý: minimalist, vintage, streetwear, preppy, sporty, elegant, hoặc nhập phong cách tùy ý) |
| `weather` | string | No | Thời tiết hiện tại (Gợi ý: hot, cold, warm, cool, rainy, hoặc nhập thời tiết cụ thể) |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtorecommendeditemgroup"></a>`RecommendedItemGroup`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `alternatives` | Array<[WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)> | No |  |
| `primary` | [WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres) | No |  |
| `role` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtorecommendedoutfitres"></a>`RecommendedOutfitRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `explanation` | string | No |  |
| `isFallback` | boolean | No |  |
| `items` | Array<[RecommendedItemGroup](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtorecommendeditemgroup)> | No |  |
| `remainingQuota` | integer | No |  |
| `title` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtosaveoutfititemreq"></a>`SaveOutfitItemReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `layerOrder` | integer | Yes |  |
| `positionX` | number | No |  |
| `positionY` | number | No |  |
| `scale` | number | Yes |  |
| `wardrobeItemId` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtosaveoutfitreq"></a>`SaveOutfitReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `coverImageUrl` | string | No |  |
| `coverPublicId` | string | No |  |
| `description` | string | No |  |
| `items` | Array<[SaveOutfitItemReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtosaveoutfititemreq)> | Yes |  |
| `name` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtosearchwardrobeitemres"></a>`SearchWardrobeItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `category` | [CategoryRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres) | No |  |
| `color` | string | No |  |
| `colorHex` | string | No |  |
| `colorHue` | number | No |  |
| `colorLightness` | number | No |  |
| `colorSaturation` | number | No |  |
| `fit` | string | No |  |
| `id` | string | No |  |
| `imagePublicId` | string | No |  |
| `imageUrl` | string | No |  |
| `isSystem` | boolean | No |  |
| `material` | string | No |  |
| `pattern` | string | No |  |
| `price` | number | No |  |
| `seasonality` | string | No |  |
| `style` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtosendchatmessagereq"></a>`SendChatMessageReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtoupdatecategoryreq"></a>`UpdateCategoryReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes |  |
| `slug` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtoupdatesystemcatalogitemreq"></a>`UpdateSystemCatalogItemReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `categoryId` | string | No |  |
| `color` | string | No |  |
| `fit` | string | No |  |
| `material` | string | No |  |
| `pattern` | string | No |  |
| `price` | number | No |  |
| `seasonality` | string | No |  |
| `style` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobebatchuploaditemreq"></a>`WardrobeBatchUploadItemReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `categoryId` | string | No |  |
| `imagePublicId` | string | Yes |  |
| `imageUrl` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres"></a>`WardrobeItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `category` | [CategoryRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres) | No |  |
| `color` | string | No |  |
| `colorHex` | string | No |  |
| `colorHue` | number | No |  |
| `colorLightness` | number | No |  |
| `colorSaturation` | number | No |  |
| `createdAt` | string | No |  |
| `fit` | string | No |  |
| `id` | string | No |  |
| `imagePublicId` | string | No |  |
| `imageUrl` | string | No |  |
| `isLocked` | boolean | No |  |
| `material` | string | No |  |
| `pattern` | string | No |  |
| `price` | number | No |  |
| `processingErrorReason` | string | No |  |
| `reviewReason` | string | No |  |
| `seasonality` | string | No |  |
| `status` | [WardrobeItemStatus](#smart-wardrobe-beinternalshareddomainconstantswardrobestatuswardrobeitemstatus) | No |  |
| `style` | string | No |  |
| `userId` | string | No |  |

### <a id="smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata"></a>`PaginationMetadata`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | integer | No |  |
| `page` | integer | No |  |
| `totalItems` | integer | No |  |
| `totalPages` | integer | No |  |

### <a id="smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmodulessubscriptionapplicationdtowalletstatementdto"></a>`PaginationResult-smart-wardrobe-be_internal_modules_subscription_application_dto_WalletStatementDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[WalletStatementDTO](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtowalletstatementdto)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmoduleswardrobeapplicationdtochatmessageres"></a>`PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_ChatMessageRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[ChatMessageRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtochatmessageres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfitres"></a>`PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_OutfitRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[OutfitRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfitres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmoduleswardrobeapplicationdtosearchwardrobeitemres"></a>`PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_SearchWardrobeItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[SearchWardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtosearchwardrobeitemres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres"></a>`PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_WardrobeItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalsharedapplicationdtouploadsignatureresult"></a>`UploadSignatureResult`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | string | No |  |
| `folder` | string | No |  |
| `publicId` | string | No |  |
| `signature` | string | No |  |
| `timestamp` | integer | No |  |

### <a id="smart-wardrobe-beinternalshareddomainconstantsdepositstatusdepositstatus"></a>`DepositStatus`

*Enum values:*

- `0` (**Pending**)
- `1` (**Success**)
- `2` (**FailedLegacy**)
- `3` (**Creating**)
- `4` (**ReconciliationRequired**)
- `5` (**Reconciling**)
- `6` (**CreationFailed**)
- `7` (**Cancelled**)
- `8` (**Expired**)
- `9` (**InvestigationRequired**)

### <a id="smart-wardrobe-beinternalshareddomainconstantsgendergender"></a>`Gender`

*Enum values:*

- `0` (**Unknown**)
- `1` (**Male**)
- `2` (**Female**)
- `3` (**Other**)

### <a id="smart-wardrobe-beinternalshareddomainconstantsitemconditionitemcondition"></a>`ItemCondition`

*Enum values:*

- `1` (**Standard**) - Default

### <a id="smart-wardrobe-beinternalshareddomainconstantsmessagesendermessagesender"></a>`MessageSender`

*Enum values:*

- `user` (**User**)
- `ai` (**AI**)

### <a id="smart-wardrobe-beinternalshareddomainconstantsoutfitstatusoutfitstatus"></a>`OutfitStatus`

*Enum values:*

- `0` (**Draft**)
- `1` (**Active**)

### <a id="smart-wardrobe-beinternalshareddomainconstantsplankindplankind"></a>`PlanKind`

*Enum values:*

- `0` (**DefaultFree**)
- `1` (**Finite**)
- `2` (**Lifetime**)

### <a id="smart-wardrobe-beinternalshareddomainconstantspostitemstatuspostitemstatus"></a>`PostItemStatus`

*Enum values:*

- `0` (**Hidden**)
- `1` (**Available**)
- `2` (**Sold**)

### <a id="smart-wardrobe-beinternalshareddomainconstantsposttypeposttype"></a>`PostType`

*Enum values:*

- `SALE` (**Sale**)
- `OUTFIT` (**Outfit**)

### <a id="smart-wardrobe-beinternalshareddomainconstantsrequeststatusrequeststatus"></a>`RequestStatus`

*Enum values:*

- `0` (**Pending**)
- `1` (**Accepted**)
- `2` (**Rejected**)
- `3` (**Canceled**)

### <a id="smart-wardrobe-beinternalshareddomainconstantsroleslugroleslug"></a>`RoleSlug`

*Enum values:*

- `admin` (**Admin**)
- `user` (**User**)

### <a id="smart-wardrobe-beinternalshareddomainconstantstransferstatetransferstate"></a>`TransferState`

*Enum values:*

- `0` (**None**) - Not transferred yet
- `1` (**Pending**) - Pending receipt of item
- `2` (**Accepted**) - Accepted receipt of item
- `3` (**Declined**) - Declined receipt of item

### <a id="smart-wardrobe-beinternalshareddomainconstantsuserstatususerstatus"></a>`UserStatus`

*Enum values:*

- `0` (**Active**)
- `1` (**Inactive**)

### <a id="smart-wardrobe-beinternalshareddomainconstantswalletstatementtypewalletstatementtype"></a>`WalletStatementType`

*Enum values:*

- `TOPUP` (**Topup**)
- `SUBSCRIPTION_PURCHASE` (**SubscriptionPurchase**)
- `SUBSCRIPTION_RENEWAL` (**SubscriptionRenewal**)
- `LOWER_TIER_PAYMENT_CREDIT` (**LowerTierPaymentCredit**)
- `SAME_LIFETIME_PAYMENT_CREDIT` (**SameLifetimePaymentCredit**)

### <a id="smart-wardrobe-beinternalshareddomainconstantswardrobestatuswardrobeitemstatus"></a>`WardrobeItemStatus`

*Enum values:*

- `0` (**InWardrobe**)
- `1` (**Selling**)
- `2` (**Sold**)
- `3` (**Processing**) - AI processing in background
- `4` (**Failed**) - AI processing failed
- `5` (**NeedsReview**) - AI requires user review before the item becomes usable

### <a id="smart-wardrobe-beinternalsharedpresentationapiresponse"></a>`APIResponse`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | object | No |  |
| `message` | string | No |  |

