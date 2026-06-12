# Smart Wardrobe API Routes

## Admin

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **DELETE** | `/api/v1/admin/comments/{commentID}` | Xóa bình luận community | Params: commentID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **PATCH** | `/api/v1/admin/comments/{commentID}/restore` | Khôi phục bình luận community | Params: commentID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/admin/post-items` | Lấy danh sách listing (Admin) | Params: status (query), transferState (query), page (query), limit (query) | `smart-wardrobe-be_internal_modules_community_application_dto.AdminPostItemListRes` |
| **DELETE** | `/api/v1/admin/post-items/{postItemID}` | Xóa listing community | Params: postItemID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **PATCH** | `/api/v1/admin/post-items/{postItemID}/hide` | Ẩn listing community | Params: postItemID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/admin/posts` | Lấy danh sách bài đăng (Admin) | Params: postType (query), isDeleted (query), q (query), page (query), limit (query) | `smart-wardrobe-be_internal_modules_community_application_dto.AdminPostListRes` |
| **DELETE** | `/api/v1/admin/posts/{postPublicID}` | Xóa bài đăng community | Params: postPublicID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **PATCH** | `/api/v1/admin/posts/{postPublicID}/restore` | Khôi phục bài đăng community | Params: postPublicID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/admin/users` | Lấy danh sách người dùng | Params: roleSlug (query), isActive (query), q (query), page (query), limit (query) | `smart-wardrobe-be_internal_modules_identity_application_dto.AdminUserListRes` |
| **PATCH** | `/api/v1/admin/users/{id}/status` | Cập nhật trạng thái tài khoản người dùng | Params: id (path, required)<br>Body: `smart-wardrobe-be_internal_modules_identity_application_dto.UpdateUserStatusReq` | `smart-wardrobe-be_internal_modules_identity_application_dto.UserRes` |
| **GET** | `/api/v1/admin/wardrobe-items` | Lấy danh sách trang phục mẫu (Admin) | Params: page (query), limit (query), q (query), category_slug (query) | `smart-wardrobe-be_internal_shared_application_dto.PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_WardrobeItemRes` |
| **PUT** | `/api/v1/admin/wardrobe-items/{id}` | Cập nhật trang phục mẫu (Admin) | Params: id (path, required)<br>Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.UpdateSystemCatalogItemReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |
| **DELETE** | `/api/v1/admin/wardrobe-items/{id}` | Xóa trang phục mẫu (Admin) | Params: id (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |

## Wardrobe AI

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/ai/chat/sessions` | Lấy danh sách cuộc trò chuyện AI |  | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.ChatSessionRes[]` |
| **POST** | `/api/v1/ai/chat/sessions` | Tạo cuộc trò chuyện AI mới | Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.CreateChatSessionReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.ChatSessionRes` |
| **PATCH** | `/api/v1/ai/chat/sessions/{contextID}/archive` | Lưu trữ cuộc trò chuyện AI | Params: contextID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/ai/chat/sessions/{contextID}/messages` | Lấy lịch sử tin nhắn AI | Params: contextID (path, required), page (query), limit (query) | `smart-wardrobe-be_internal_shared_application_dto.PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_ChatMessageRes` |
| **POST** | `/api/v1/ai/chat/sessions/{contextID}/messages/stream` | Nhắn tin với stylist AI (Stream SSE) | Params: contextID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.SendChatMessageReq` | N/A |
| **POST** | `/api/v1/ai/outfit-recommendations` | Gợi ý phối đồ từ tủ đồ | Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.RecommendOutfitReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.RecommendedOutfitRes` |

## Auth

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **POST** | `/api/v1/auth/forgot-password` | Yêu cầu khôi phục mật khẩu | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.SendForgotPasswordOtpReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/auth/forgot-password/confirm-otp` | Xác thực OTP khôi phục mật khẩu | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.ConfirmForgotPasswordOtpReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/auth/login` | Đăng nhập | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.LoginReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/auth/logout` | Đăng xuất |  | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/auth/refresh-token` | Xoay vòng token (Refresh Token) |  | N/A |
| **POST** | `/api/v1/auth/register` | Đăng ký tài khoản | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.RegisterReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/auth/register/confirm-otp` | Xác thực OTP đăng ký | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.ConfirmRegisterOtpReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/auth/reset-password` | Đặt lại mật khẩu | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.ResetPasswordReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |

## Category

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/categories` | Lấy tất cả danh mục trang phục |  | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.CategoryRes[]` |

## Me

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/me` | Lấy thông tin cá nhân |  | `smart-wardrobe-be_internal_modules_identity_application_dto.UserRes` |
| **PUT** | `/api/v1/me` | Cập nhật thông tin cá nhân | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.UpdateProfileReq` | `smart-wardrobe-be_internal_modules_identity_application_dto.UserRes` |
| **PUT** | `/api/v1/me/avatar` | Cập nhật ảnh đại diện | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.UpdateAvatarReq` | `smart-wardrobe-be_internal_modules_identity_application_dto.UserRes` |
| **GET** | `/api/v1/me/avatar-signature` | Lấy chữ ký tải ảnh đại diện |  | `smart-wardrobe-be_internal_shared_application_dto.UploadSignatureResult` |
| **PUT** | `/api/v1/me/body-profile` | Cập nhật hồ sơ cơ thể | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.UpdateBodyProfileReq` | `smart-wardrobe-be_internal_modules_identity_application_dto.UserRes` |
| **PUT** | `/api/v1/me/change-password` | Đổi mật khẩu | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.ChangePasswordReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |

## Outfits

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/me/outfits` | Lấy danh sách bộ phối đồ của tôi | Params: page (query), limit (query) | `smart-wardrobe-be_internal_shared_application_dto.PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_OutfitRes` |
| **POST** | `/api/v1/outfits` | Tạo bộ phối đồ mới | Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.SaveOutfitReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.OutfitRes` |
| **GET** | `/api/v1/outfits/upload-signature` | Lấy chữ ký tải ảnh bìa bộ phối đồ |  | `smart-wardrobe-be_internal_shared_application_dto.UploadSignatureResult` |
| **GET** | `/api/v1/outfits/{id}` | Chi tiết bộ phối đồ và tọa độ canvas | Params: id (path, required) | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.OutfitRes` |
| **PUT** | `/api/v1/outfits/{id}` | Cập nhật bộ phối đồ | Params: id (path, required)<br>Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.SaveOutfitReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.OutfitRes` |
| **DELETE** | `/api/v1/outfits/{id}` | Xóa bộ phối đồ tự thiết kế | Params: id (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |

## Wardrobe

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/me/wardrobe-items` | Lấy danh sách trang phục | Params: page (query), limit (query), category_slug (query) | `smart-wardrobe-be_internal_shared_application_dto.PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_WardrobeItemRes` |
| **POST** | `/api/v1/wardrobe-items/batch-upload` | Số hóa trang phục hàng loạt | Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.BatchUploadWardrobeItemsReq` | N/A |
| **DELETE** | `/api/v1/wardrobe-items/bulk` | Xóa hàng loạt trang phục | Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.BulkDeleteItemsReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/wardrobe-items/catalog-init` | Khởi tạo nhanh tủ đồ cá nhân | Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.InitClosetFromCatalogReq` | N/A |
| **DELETE** | `/api/v1/wardrobe-items/locked` | Xóa toàn bộ trang phục bị khóa |  | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/wardrobe-items/search` | Tìm kiếm trang phục có sẵn của hệ thống (Elasticsearch CQRS) | Params: page (query), limit (query), q (query), category_slug (query) | `smart-wardrobe-be_internal_shared_application_dto.PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_SearchWardrobeItemRes` |
| **GET** | `/api/v1/wardrobe-items/upload-signature` | Lấy chữ ký tải ảnh trang phục |  | `smart-wardrobe-be_internal_shared_application_dto.UploadSignatureResult` |
| **GET** | `/api/v1/wardrobe-items/{id}` | Xem chi tiết trang phục | Params: id (path, required) | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |
| **POST** | `/api/v1/wardrobe-items/{id}/clone` | Nhân bản trang phục | Params: id (path, required)<br>Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.CloneWardrobeItemReq` | N/A |
| **PUT** | `/api/v1/wardrobe-items/{id}/manual-classify` | Tự phân loại trang phục thủ công | Params: id (path, required)<br>Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.ManualClassifyReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |

## Community

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/posts` | Lấy danh sách bài đăng cộng đồng | Params: sort (query), page (query), limit (query), username (query), postType (query) | `smart-wardrobe-be_internal_modules_community_application_dto.GetFeedRes` |
| **POST** | `/api/v1/posts` | Tạo bài đăng cộng đồng mới | Body: `smart-wardrobe-be_internal_modules_community_application_dto.CreatePostReq` | `smart-wardrobe-be_internal_modules_community_application_dto.PostRes` |
| **GET** | `/api/v1/posts/upload-signature` | Lấy chữ ký tải media bài đăng |  | `smart-wardrobe-be_internal_shared_application_dto.UploadSignatureResult` |
| **GET** | `/api/v1/posts/{postPublicID}` | Lấy chi tiết bài đăng | Params: postPublicID (path, required) | `smart-wardrobe-be_internal_modules_community_application_dto.PostRes` |
| **PUT** | `/api/v1/posts/{postPublicID}` | Cập nhật bài đăng cộng đồng | Params: postPublicID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_community_application_dto.UpdatePostReq` | `smart-wardrobe-be_internal_modules_community_application_dto.PostRes` |
| **DELETE** | `/api/v1/posts/{postPublicID}` | Xóa bài đăng | Params: postPublicID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/posts/{postPublicID}/comments` | Lấy bình luận cấp đầu của bài đăng | Params: postPublicID (path, required) | `smart-wardrobe-be_internal_modules_community_application_dto.CommentRes[]` |
| **POST** | `/api/v1/posts/{postPublicID}/comments` | Thêm bình luận vào bài viết | Params: postPublicID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_community_application_dto.AddCommentReq` | `smart-wardrobe-be_internal_modules_community_application_dto.CommentRes` |
| **PUT** | `/api/v1/posts/{postPublicID}/comments/{commentID}` | Cập nhật bình luận của bài viết | Params: postPublicID (path, required), commentID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_community_application_dto.UpdateCommentReq` | `smart-wardrobe-be_internal_modules_community_application_dto.CommentRes` |
| **DELETE** | `/api/v1/posts/{postPublicID}/comments/{commentID}` | Xóa bình luận của bài viết | Params: postPublicID (path, required), commentID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/posts/{postPublicID}/comments/{commentID}/replies` | Lấy phản hồi của một bình luận cấp đầu | Params: postPublicID (path, required), commentID (path, required) | `smart-wardrobe-be_internal_modules_community_application_dto.CommentRes[]` |
| **DELETE** | `/api/v1/posts/{postPublicID}/items` | Gỡ món đồ khỏi bài đăng | Params: postPublicID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_community_application_dto.RemovePostItemsReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **PUT** | `/api/v1/posts/{postPublicID}/like` | Thích / Bỏ thích bài đăng | Params: postPublicID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_community_application_dto.LikePostReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/posts/{postPublicID}/likes` | Lấy danh sách người thích bài đăng | Params: postPublicID (path, required) | `smart-wardrobe-be_internal_modules_community_application_dto.PostLikeUserRes[]` |

## Subscription

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/subscriptions/me` | Lấy thông tin gói hội viên hiện tại |  | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **PUT** | `/api/v1/subscriptions/me/auto-renew` | Thiết lập tự động gia hạn gói cước | Body: `smart-wardrobe-be_internal_modules_subscription_presentation_dto.SetAutoRenewReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/subscriptions/me/daily-quota` | Lấy hạn ngạch sử dụng hàng ngày |  | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/subscriptions/plans` | Lấy danh sách các gói Premium |  | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |

## Billing

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **POST** | `/api/v1/subscriptions/me/purchase` | Đăng ký mua gói cước trực tiếp | Body: `smart-wardrobe-be_internal_modules_subscription_application_dto.DirectPurchaseReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/subscriptions/me/purchase-with-wallet` | Đăng ký mua gói cước bằng ví nội bộ | Body: `smart-wardrobe-be_internal_modules_subscription_application_dto.DirectPurchaseReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/subscriptions/me/wallet` | Lấy số dư ví người dùng |  | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/subscriptions/me/wallet/statements` | Lấy lịch sử giao dịch ví nội bộ | Params: page (query), limit (query) | `smart-wardrobe-be_internal_shared_application_dto.PaginationResult-smart-wardrobe-be_internal_modules_subscription_application_dto_WalletStatementDTO` |
| **POST** | `/api/v1/subscriptions/me/wallet/topup` | Tạo yêu cầu nạp tiền vào ví nội bộ | Body: `smart-wardrobe-be_internal_modules_subscription_application_dto.WalletTopUpReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/subscriptions/payos-webhook` | Xử lý Webhook thông báo thanh toán từ PayOS | Body: `smart-wardrobe-be_internal_modules_subscription_application_dto.PayOSWebhookReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |

## Transfers

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **POST** | `/api/v1/transfers/accept` | Chấp nhận nhận bàn giao danh sách trang phục | Body: `smart-wardrobe-be_internal_modules_community_application_dto.AcceptTransfersReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes[]` |
| **POST** | `/api/v1/transfers/decline` | Từ chối nhận bàn giao danh sách trang phục | Body: `smart-wardrobe-be_internal_modules_community_application_dto.AcceptTransfersReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/transfers/items/{postItemID}/requests` | Lấy danh sách người xin mua của một sản phẩm | Params: postItemID (path, required) | `smart-wardrobe-be_internal_modules_community_application_dto.TransferRequestRes[]` |
| **POST** | `/api/v1/transfers/mark-sold` | Đánh dấu các món đồ đã bán (Bulk) | Body: `smart-wardrobe-be_internal_modules_community_application_dto.MarkPostItemsSoldReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/transfers/me/pending` | Danh sách trang phục đang chờ nhận bàn giao |  | `smart-wardrobe-be_internal_modules_community_application_dto.PendingTransferRes[]` |
| **GET** | `/api/v1/transfers/me/posts` | Danh sách bài đăng bàn giao của người bán |  | `smart-wardrobe-be_internal_modules_community_application_dto.SellerTransferPostRes[]` |
| **POST** | `/api/v1/transfers/requests` | Gửi yêu cầu xin mua trang phục (Bulk) | Body: `smart-wardrobe-be_internal_modules_community_application_dto.CreateTransferRequestsReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |


## Definitions (Models)

### `AcceptTransfersReq`

| Property | Type | Description |
| --- | --- | --- |
| **postItemIds** | array of string |  |

### `AddCommentReq`

| Property | Type | Description |
| --- | --- | --- |
| **content** | string |  |
| **parentCommentId** | string |  |

### `AdminPostItemListRes`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostItemRes` |  |
| **metadata** | ref: `smart-wardrobe-be_internal_shared_application_dto.PaginationMetadata` |  |

### `AdminPostListRes`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostRes` |  |
| **metadata** | ref: `smart-wardrobe-be_internal_shared_application_dto.PaginationMetadata` |  |

### `CommentRes`

| Property | Type | Description |
| --- | --- | --- |
| **avatarUrl** | string |  |
| **content** | string |  |
| **createdAt** | string |  |
| **firstName** | string |  |
| **id** | string |  |
| **lastName** | string |  |
| **parentCommentId** | string |  |
| **userId** | string |  |
| **username** | string |  |

### `CreatePostReq`

| Property | Type | Description |
| --- | --- | --- |
| **contactInfo** | string |  |
| **content** | string |  |
| **items** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostItemInputReq` |  |
| **media** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostMediaReq` |  |
| **postType** | object |  |
| **title** | string |  |

### `CreateTransferRequestsReq`

| Property | Type | Description |
| --- | --- | --- |
| **postItemIds** | array of string |  |

### `GetFeedRes`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostRes` |  |
| **metadata** | ref: `smart-wardrobe-be_internal_shared_application_dto.PaginationMetadata` |  |

### `LikePostReq`

| Property | Type | Description |
| --- | --- | --- |
| **isLiked** | boolean |  |

### `MarkPostItemsSoldReq`

| Property | Type | Description |
| --- | --- | --- |
| **buyerId** | string |  |
| **postItemIds** | array of string |  |

### `PendingTransferRes`

| Property | Type | Description |
| --- | --- | --- |
| **item** | ref: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |  |
| **postItemId** | string |  |
| **sellerName** | string |  |

### `PostItemInputReq`

| Property | Type | Description |
| --- | --- | --- |
| **itemCondition** | ref: `smart-wardrobe-be_internal_shared_domain_constants_itemcondition.ItemCondition` |  |
| **itemId** | string |  |
| **price** | number |  |

### `PostItemRes`

| Property | Type | Description |
| --- | --- | --- |
| **buyerUserId** | string |  |
| **declinedAt** | string |  |
| **id** | string |  |
| **item** | ref: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |  |
| **itemCondition** | ref: `smart-wardrobe-be_internal_shared_domain_constants_itemcondition.ItemCondition` |  |
| **price** | number |  |
| **soldAt** | string |  |
| **status** | ref: `smart-wardrobe-be_internal_shared_domain_constants_postitemstatus.PostItemStatus` |  |
| **transferState** | ref: `smart-wardrobe-be_internal_shared_domain_constants_transferstate.TransferState` |  |

### `PostLikeUserRes`

| Property | Type | Description |
| --- | --- | --- |
| **avatarUrl** | string |  |
| **firstName** | string |  |
| **id** | string |  |
| **lastName** | string |  |
| **username** | string |  |

### `PostMediaReq`

| Property | Type | Description |
| --- | --- | --- |
| **mediaType** | string |  |
| **mediaUrl** | string |  |
| **publicId** | string |  |
| **sortOrder** | integer |  |

### `PostMediaRes`

| Property | Type | Description |
| --- | --- | --- |
| **id** | string |  |
| **mediaType** | string |  |
| **mediaUrl** | string |  |
| **publicId** | string |  |
| **sortOrder** | integer |  |

### `PostRes`

| Property | Type | Description |
| --- | --- | --- |
| **avatarUrl** | string |  |
| **commentCount** | integer |  |
| **contactInfo** | string |  |
| **content** | string |  |
| **createdAt** | string |  |
| **finalFeedScore** | number |  |
| **firstName** | string |  |
| **globalHotnessScore** | number |  |
| **id** | string |  |
| **isDeleted** | boolean |  |
| **isLiked** | boolean |  |
| **items** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostItemRes` |  |
| **lastName** | string |  |
| **likeCount** | integer |  |
| **media** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostMediaRes` |  |
| **postType** | ref: `smart-wardrobe-be_internal_shared_domain_constants_posttype.PostType` |  |
| **publicId** | string |  |
| **sharePath** | string |  |
| **title** | string |  |
| **totalPrice** | number |  |
| **updatedAt** | string |  |
| **userId** | string |  |
| **username** | string |  |

### `RemovePostItemsReq`

| Property | Type | Description |
| --- | --- | --- |
| **postItemIds** | array of string |  |

### `SellerTransferPostItemRes`

| Property | Type | Description |
| --- | --- | --- |
| **buyer** | ref: `smart-wardrobe-be_internal_modules_community_application_dto.TransferBuyerSummaryRes` |  |
| **declinedAt** | string |  |
| **item** | ref: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |  |
| **itemCondition** | ref: `smart-wardrobe-be_internal_shared_domain_constants_itemcondition.ItemCondition` |  |
| **postItemId** | string |  |
| **price** | number |  |
| **soldAt** | string |  |
| **status** | ref: `smart-wardrobe-be_internal_shared_domain_constants_postitemstatus.PostItemStatus` |  |
| **transferState** | ref: `smart-wardrobe-be_internal_shared_domain_constants_transferstate.TransferState` |  |

### `SellerTransferPostRes`

| Property | Type | Description |
| --- | --- | --- |
| **createdAt** | string |  |
| **items** | array of `smart-wardrobe-be_internal_modules_community_application_dto.SellerTransferPostItemRes` |  |
| **postId** | string |  |
| **postType** | ref: `smart-wardrobe-be_internal_shared_domain_constants_posttype.PostType` |  |
| **title** | string |  |
| **updatedAt** | string |  |

### `TransferBuyerSummaryRes`

| Property | Type | Description |
| --- | --- | --- |
| **avatarUrl** | string |  |
| **id** | string |  |
| **username** | string |  |

### `TransferRequestRes`

| Property | Type | Description |
| --- | --- | --- |
| **avatarUrl** | string |  |
| **buyerId** | string |  |
| **createdAt** | string |  |
| **id** | string |  |
| **status** | ref: `smart-wardrobe-be_internal_shared_domain_constants_requeststatus.RequestStatus` |  |
| **username** | string |  |

### `UpdateCommentReq`

| Property | Type | Description |
| --- | --- | --- |
| **content** | string |  |

### `UpdatePostReq`

| Property | Type | Description |
| --- | --- | --- |
| **contactInfo** | string |  |
| **content** | string |  |
| **items** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostItemInputReq` |  |
| **media** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostMediaReq` |  |
| **title** | string |  |

### `AdminUserListRes`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_identity_application_dto.UserRes` |  |
| **metadata** | ref: `smart-wardrobe-be_internal_shared_application_dto.PaginationMetadata` |  |

### `ChangePasswordReq`

| Property | Type | Description |
| --- | --- | --- |
| **confirmPassword** | string |  |
| **logoutAllDevices** | boolean |  |
| **newPassword** | string |  |
| **oldPassword** | string |  |

### `ConfirmForgotPasswordOtpReq`

| Property | Type | Description |
| --- | --- | --- |
| **email** | string |  |
| **otpCode** | string |  |

### `ConfirmRegisterOtpReq`

| Property | Type | Description |
| --- | --- | --- |
| **email** | string |  |
| **otpCode** | string |  |

### `InferredBodyProfileReq`

| Property | Type | Description |
| --- | --- | --- |
| **bodyShape** | string |  |
| **confidenceScore** | number |  |

### `LoginReq`

| Property | Type | Description |
| --- | --- | --- |
| **loginName** | string |  |
| **password** | string |  |

### `RegisterReq`

| Property | Type | Description |
| --- | --- | --- |
| **address** | string |  |
| **confirmPassword** | string |  |
| **dateOfBirth** | string |  |
| **email** | string |  |
| **firstName** | string |  |
| **gender** | object |  |
| **lastName** | string |  |
| **password** | string |  |
| **username** | string |  |

### `ResetPasswordReq`

| Property | Type | Description |
| --- | --- | --- |
| **confirmPassword** | string |  |
| **logoutAllDevices** | boolean |  |
| **newPassword** | string |  |

### `SendForgotPasswordOtpReq`

| Property | Type | Description |
| --- | --- | --- |
| **email** | string |  |

### `UpdateAvatarReq`

| Property | Type | Description |
| --- | --- | --- |
| **avatarPublicId** | string |  |
| **avatarUrl** | string |  |

### `UpdateBodyMeasurementsReq`

| Property | Type | Description |
| --- | --- | --- |
| **chestCm** | number |  |
| **hipCm** | number |  |
| **waistCm** | number |  |

### `UpdateBodyProfileReq`

| Property | Type | Description |
| --- | --- | --- |
| **bodyShape** | string |  |
| **heightCm** | number |  |
| **inferredByAi** | ref: `smart-wardrobe-be_internal_modules_identity_application_dto.InferredBodyProfileReq` |  |
| **measurements** | ref: `smart-wardrobe-be_internal_modules_identity_application_dto.UpdateBodyMeasurementsReq` |  |
| **verifiedByUser** | boolean |  |
| **weightKg** | number |  |

### `UpdateProfileReq`

| Property | Type | Description |
| --- | --- | --- |
| **address** | string |  |
| **dateOfBirth** | string |  |
| **firstName** | string |  |
| **gender** | object |  |
| **lastName** | string |  |

### `UpdateUserStatusReq`

| Property | Type | Description |
| --- | --- | --- |
| **status** | object |  |

### `UserBodyMeasurementsRes`

| Property | Type | Description |
| --- | --- | --- |
| **chestCm** | number |  |
| **hipCm** | number |  |
| **waistCm** | number |  |

### `UserBodyProfileRes`

| Property | Type | Description |
| --- | --- | --- |
| **bodyShape** | string |  |
| **heightCm** | number |  |
| **inferredByAi** | ref: `smart-wardrobe-be_internal_modules_identity_application_dto.UserInferredBodyRes` |  |
| **lastUpdatedAt** | string |  |
| **measurements** | ref: `smart-wardrobe-be_internal_modules_identity_application_dto.UserBodyMeasurementsRes` |  |
| **verifiedByUser** | boolean |  |
| **weightKg** | number |  |

### `UserInferredBodyRes`

| Property | Type | Description |
| --- | --- | --- |
| **bodyShape** | string |  |
| **confidenceScore** | number |  |

### `UserRes`

| Property | Type | Description |
| --- | --- | --- |
| **address** | string |  |
| **avatarPublicId** | string |  |
| **avatarUrl** | string |  |
| **bodyProfile** | ref: `smart-wardrobe-be_internal_modules_identity_application_dto.UserBodyProfileRes` |  |
| **createdAt** | string |  |
| **dateOfBirth** | string |  |
| **email** | string |  |
| **firstName** | string |  |
| **gender** | ref: `smart-wardrobe-be_internal_shared_domain_constants_gender.Gender` |  |
| **id** | string |  |
| **lastName** | string |  |
| **roleSlug** | ref: `smart-wardrobe-be_internal_shared_domain_constants_roleslug.RoleSlug` |  |
| **status** | ref: `smart-wardrobe-be_internal_shared_domain_constants_userstatus.UserStatus` |  |
| **subscription** | ref: `smart-wardrobe-be_internal_modules_identity_application_dto.UserSubscriptionRes` |  |
| **username** | string |  |

### `UserSubscriptionRes`

| Property | Type | Description |
| --- | --- | --- |
| **aiChatDailyQuota** | integer |  |
| **aiOutfitDailyQuota** | integer |  |
| **expiresAt** | string |  |
| **maxOutfits** | integer |  |
| **maxWardrobeItems** | integer |  |
| **planId** | string |  |
| **planName** | string |  |
| **planSlug** | string |  |

### `DirectPurchaseReq`

| Property | Type | Description |
| --- | --- | --- |
| **cancelUrl** | string |  |
| **planSlug** | string |  |
| **returnUrl** | string |  |

### `PayOSWebhookData`

| Property | Type | Description |
| --- | --- | --- |
| **accountNumber** | string |  |
| **amount** | integer |  |
| **code** | string |  |
| **desc** | string |  |
| **description** | string |  |
| **orderCode** | integer |  |
| **paymentLinkId** | string |  |
| **reference** | string |  |
| **transactionDateTime** | string |  |

### `PayOSWebhookReq`

| Property | Type | Description |
| --- | --- | --- |
| **code** | string |  |
| **data** | ref: `smart-wardrobe-be_internal_modules_subscription_application_dto.PayOSWebhookData` |  |
| **desc** | string |  |
| **signature** | string |  |

### `WalletStatementDTO`

| Property | Type | Description |
| --- | --- | --- |
| **amount** | number |  |
| **createdAt** | string |  |
| **description** | string |  |
| **id** | string |  |
| **newBalance** | number |  |
| **previousBalance** | number |  |
| **transactionType** | ref: `smart-wardrobe-be_internal_shared_domain_constants_walletstatementtype.WalletStatementType` |  |
| **userID** | string |  |

### `WalletTopUpReq`

| Property | Type | Description |
| --- | --- | --- |
| **amount** | number |  |
| **cancelUrl** | string |  |
| **returnUrl** | string |  |

### `SetAutoRenewReq`

| Property | Type | Description |
| --- | --- | --- |
| **enabled** | boolean |  |

### `BatchUploadWardrobeItemsReq`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeBatchUploadItemReq` |  |

### `BulkDeleteItemsReq`

| Property | Type | Description |
| --- | --- | --- |
| **ids** | array of string |  |

### `CategoryRes`

| Property | Type | Description |
| --- | --- | --- |
| **id** | string |  |
| **name** | string |  |
| **slug** | string |  |

### `ChatMessageRes`

| Property | Type | Description |
| --- | --- | --- |
| **content** | string |  |
| **createdAt** | string |  |
| **id** | string |  |
| **sender** | ref: `smart-wardrobe-be_internal_shared_domain_constants_messagesender.MessageSender` |  |

### `ChatSessionRes`

| Property | Type | Description |
| --- | --- | --- |
| **contextSummary** | string |  |
| **createdAt** | string |  |
| **id** | string |  |
| **isArchived** | boolean |  |
| **title** | string |  |
| **updatedAt** | string |  |

### `CloneWardrobeItemReq`

| Property | Type | Description |
| --- | --- | --- |
| **quantity** | integer |  |

### `CreateChatSessionReq`

| Property | Type | Description |
| --- | --- | --- |
| **title** | string |  |

### `InitClosetFromCatalogReq`

| Property | Type | Description |
| --- | --- | --- |
| **catalogItemIds** | array of string |  |

### `ManualClassifyReq`

| Property | Type | Description |
| --- | --- | --- |
| **categoryId** | string |  |
| **color** | string |  |
| **fit** | string |  |
| **material** | string |  |
| **pattern** | string |  |
| **price** | number |  |
| **seasonality** | string |  |
| **style** | string |  |

### `OutfitItemRes`

| Property | Type | Description |
| --- | --- | --- |
| **id** | string |  |
| **layer_order** | integer |  |
| **position_x** | number |  |
| **position_y** | number |  |
| **scale** | number |  |
| **wardrobe_item** | ref: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |  |

### `OutfitRes`

| Property | Type | Description |
| --- | --- | --- |
| **cover_image_url** | string |  |
| **cover_public_id** | string |  |
| **created_at** | string |  |
| **description** | string |  |
| **id** | string |  |
| **items** | array of `smart-wardrobe-be_internal_modules_wardrobe_application_dto.OutfitItemRes` |  |
| **name** | string |  |
| **status** | ref: `smart-wardrobe-be_internal_shared_domain_constants_outfitstatus.OutfitStatus` |  |
| **updated_at** | string |  |
| **user_id** | string |  |

### `RecommendOutfitReq`

| Property | Type | Description |
| --- | --- | --- |
| **colorTone** | string | Tông màu phối đồ (Gợi ý: light, dark, pastel, earthy, neon... hoặc nhập tông màu tùy ý) |
| **details** | string | Ghi chú thêm bằng tay (free text) |
| **occasion** | string | Dịp phối đồ (Gợi ý: casual, work, date, party, sport, hoặc nhập dịp tùy ý) |
| **season** | string | Mùa phối đồ
@enums spring,summer,autumn,winter,all |
| **styleTarget** | string | Phong cách hướng tới (Gợi ý: minimalist, vintage, streetwear, preppy, sporty, elegant, hoặc nhập phong cách tùy ý) |
| **weather** | string | Thời tiết hiện tại (Gợi ý: hot, cold, warm, cool, rainy, hoặc nhập thời tiết cụ thể) |

### `RecommendedItemGroup`

| Property | Type | Description |
| --- | --- | --- |
| **alternatives** | array of `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |  |
| **primary** | ref: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |  |
| **role** | string |  |

### `RecommendedOutfitRes`

| Property | Type | Description |
| --- | --- | --- |
| **explanation** | string |  |
| **isFallback** | boolean |  |
| **items** | array of `smart-wardrobe-be_internal_modules_wardrobe_application_dto.RecommendedItemGroup` |  |
| **remainingQuota** | integer |  |
| **title** | string |  |

### `SaveOutfitItemReq`

| Property | Type | Description |
| --- | --- | --- |
| **layer_order** | integer |  |
| **position_x** | number |  |
| **position_y** | number |  |
| **scale** | number |  |
| **wardrobe_item_id** | string |  |

### `SaveOutfitReq`

| Property | Type | Description |
| --- | --- | --- |
| **cover_image_url** | string |  |
| **cover_public_id** | string |  |
| **description** | string |  |
| **items** | array of `smart-wardrobe-be_internal_modules_wardrobe_application_dto.SaveOutfitItemReq` |  |
| **name** | string |  |

### `SearchWardrobeItemRes`

| Property | Type | Description |
| --- | --- | --- |
| **category** | ref: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.CategoryRes` |  |
| **color** | string |  |
| **colorHex** | string |  |
| **colorHue** | number |  |
| **colorLightness** | number |  |
| **colorSaturation** | number |  |
| **fit** | string |  |
| **id** | string |  |
| **imagePublicId** | string |  |
| **imageUrl** | string |  |
| **isSystem** | boolean |  |
| **material** | string |  |
| **pattern** | string |  |
| **price** | number |  |
| **seasonality** | string |  |
| **style** | string |  |

### `SendChatMessageReq`

| Property | Type | Description |
| --- | --- | --- |
| **content** | string |  |

### `UpdateSystemCatalogItemReq`

| Property | Type | Description |
| --- | --- | --- |
| **categoryId** | string |  |
| **color** | string |  |
| **fit** | string |  |
| **material** | string |  |
| **pattern** | string |  |
| **price** | number |  |
| **seasonality** | string |  |
| **style** | string |  |

### `WardrobeBatchUploadItemReq`

| Property | Type | Description |
| --- | --- | --- |
| **categoryId** | string |  |
| **imagePublicId** | string |  |
| **imageUrl** | string |  |

### `WardrobeItemRes`

| Property | Type | Description |
| --- | --- | --- |
| **category** | ref: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.CategoryRes` |  |
| **color** | string |  |
| **colorHex** | string |  |
| **colorHue** | number |  |
| **colorLightness** | number |  |
| **colorSaturation** | number |  |
| **createdAt** | string |  |
| **fit** | string |  |
| **id** | string |  |
| **imagePublicId** | string |  |
| **imageUrl** | string |  |
| **isLocked** | boolean |  |
| **material** | string |  |
| **pattern** | string |  |
| **price** | number |  |
| **seasonality** | string |  |
| **status** | ref: `smart-wardrobe-be_internal_shared_domain_constants_wardrobestatus.WardrobeItemStatus` |  |
| **style** | string |  |
| **userId** | string |  |

### `PaginationMetadata`

| Property | Type | Description |
| --- | --- | --- |
| **limit** | integer |  |
| **page** | integer |  |
| **totalItems** | integer |  |
| **totalPages** | integer |  |

### `PaginationResult-smart-wardrobe-be_internal_modules_subscription_application_dto_WalletStatementDTO`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_subscription_application_dto.WalletStatementDTO` |  |
| **metadata** | ref: `smart-wardrobe-be_internal_shared_application_dto.PaginationMetadata` |  |

### `PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_ChatMessageRes`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_wardrobe_application_dto.ChatMessageRes` |  |
| **metadata** | ref: `smart-wardrobe-be_internal_shared_application_dto.PaginationMetadata` |  |

### `PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_OutfitRes`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_wardrobe_application_dto.OutfitRes` |  |
| **metadata** | ref: `smart-wardrobe-be_internal_shared_application_dto.PaginationMetadata` |  |

### `PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_SearchWardrobeItemRes`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_wardrobe_application_dto.SearchWardrobeItemRes` |  |
| **metadata** | ref: `smart-wardrobe-be_internal_shared_application_dto.PaginationMetadata` |  |

### `PaginationResult-smart-wardrobe-be_internal_modules_wardrobe_application_dto_WardrobeItemRes`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |  |
| **metadata** | ref: `smart-wardrobe-be_internal_shared_application_dto.PaginationMetadata` |  |

### `UploadSignatureResult`

| Property | Type | Description |
| --- | --- | --- |
| **apiKey** | string |  |
| **folder** | string |  |
| **publicId** | string |  |
| **signature** | string |  |
| **timestamp** | integer |  |

### `Gender`

| Property | Type | Description |
| --- | --- | --- |

### `ItemCondition`

| Property | Type | Description |
| --- | --- | --- |

### `MessageSender`

| Property | Type | Description |
| --- | --- | --- |

### `OutfitStatus`

| Property | Type | Description |
| --- | --- | --- |

### `PostItemStatus`

| Property | Type | Description |
| --- | --- | --- |

### `PostType`

| Property | Type | Description |
| --- | --- | --- |

### `RequestStatus`

| Property | Type | Description |
| --- | --- | --- |

### `RoleSlug`

| Property | Type | Description |
| --- | --- | --- |

### `TransferState`

| Property | Type | Description |
| --- | --- | --- |

### `UserStatus`

| Property | Type | Description |
| --- | --- | --- |

### `WalletStatementType`

| Property | Type | Description |
| --- | --- | --- |

### `WardrobeItemStatus`

| Property | Type | Description |
| --- | --- | --- |

### `APIResponse`

| Property | Type | Description |
| --- | --- | --- |
| **data** | object |  |
| **message** | string |  |

