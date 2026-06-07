# Smart Wardrobe API Routes

## Admin

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **DELETE** | `/api/v1/admin/community/comments/{commentID}` | Xóa bình luận community | Params: commentID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **DELETE** | `/api/v1/admin/community/post-items/{postItemID}` | Ẩn listing community | Params: postItemID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **DELETE** | `/api/v1/admin/community/posts/{postID}` | Xóa bài đăng community | Params: postID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **PATCH** | `/api/v1/admin/users/{id}/status` | Cập nhật trạng thái tài khoản người dùng | Params: id (path, required)<br>Body: `smart-wardrobe-be_internal_modules_identity_application_dto.UpdateUserStatusReq` | `smart-wardrobe-be_internal_modules_identity_application_dto.UserRes` |

## Wardrobe AI

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/ai/chat/sessions` | Lấy danh sách cuộc trò chuyện AI |  | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.ChatSessionRes[]` |
| **POST** | `/api/v1/ai/chat/sessions` | Tạo cuộc trò chuyện AI mới | Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.CreateChatSessionReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.ChatSessionRes` |
| **PATCH** | `/api/v1/ai/chat/sessions/{contextID}/archive` | Lưu trữ cuộc trò chuyện AI | Params: contextID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/ai/chat/sessions/{contextID}/messages` | Lấy lịch sử tin nhắn AI | Params: contextID (path, required) | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.ChatMessageRes[]` |
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

## Community

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/community/me/pending-transfers` | Danh sách trang phục đang chờ nhận bàn giao |  | `smart-wardrobe-be_internal_modules_community_application_dto.PendingTransferRes[]` |
| **GET** | `/api/v1/community/me/transfer-posts` | Danh sách bài đăng bàn giao của người bán |  | `smart-wardrobe-be_internal_modules_community_application_dto.SellerTransferPostRes[]` |
| **POST** | `/api/v1/community/post-items/{postItemID}/accept` | Chấp nhận nhận bàn giao trang phục | Params: postItemID (path, required) | `smart-wardrobe-be_internal_modules_community_application_dto.PostItemRes` |
| **POST** | `/api/v1/community/post-items/{postItemID}/decline` | Từ chối nhận bàn giao trang phục | Params: postItemID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/community/post-items/{postItemID}/mark-sold` | Đánh dấu món đồ đã bán | Params: postItemID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_community_application_dto.UpdatePostItemsBuyerReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **GET** | `/api/v1/posts` | Lấy danh sách bài đăng cộng đồng |  | `smart-wardrobe-be_internal_modules_community_application_dto.GetFeedRes` |
| **POST** | `/api/v1/posts` | Tạo bài đăng cộng đồng mới | Body: `smart-wardrobe-be_internal_modules_community_application_dto.CreatePostReq` | `smart-wardrobe-be_internal_modules_community_application_dto.PostRes` |
| **GET** | `/api/v1/posts/upload-signature` | Lấy chữ ký tải media bài đăng |  | `smart-wardrobe-be_internal_modules_community_application_dto.UploadSignatureResult` |
| **GET** | `/api/v1/posts/{postID}` | Lấy chi tiết bài đăng | Params: postID (path, required) | `smart-wardrobe-be_internal_modules_community_application_dto.PostRes` |
| **DELETE** | `/api/v1/posts/{postID}` | Xóa bài đăng | Params: postID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/posts/{postID}/comments` | Thêm bình luận vào bài viết | Params: postID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_community_application_dto.AddCommentReq` | `smart-wardrobe-be_internal_modules_community_application_dto.CommentRes` |
| **PUT** | `/api/v1/posts/{postID}/comments/{commentID}` | Cập nhật bình luận của bài viết | Params: postID (path, required), commentID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_community_application_dto.UpdateCommentReq` | `smart-wardrobe-be_internal_modules_community_application_dto.CommentRes` |
| **DELETE** | `/api/v1/posts/{postID}/comments/{commentID}` | Xóa bình luận của bài viết | Params: postID (path, required), commentID (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **DELETE** | `/api/v1/posts/{postID}/items` | Gỡ món đồ khỏi bài đăng | Params: postID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_community_application_dto.RemovePostItemsReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **PUT** | `/api/v1/posts/{postID}/like` | Thích / Bỏ thích bài đăng | Params: postID (path, required)<br>Body: `smart-wardrobe-be_internal_modules_community_application_dto.LikePostReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |

## Me

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/me` | Lấy thông tin cá nhân |  | `smart-wardrobe-be_internal_modules_identity_application_dto.UserRes` |
| **PUT** | `/api/v1/me` | Cập nhật thông tin cá nhân | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.UpdateProfileReq` | `smart-wardrobe-be_internal_modules_identity_application_dto.UserRes` |
| **PUT** | `/api/v1/me/avatar` | Cập nhật ảnh đại diện | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.UpdateAvatarReq` | `smart-wardrobe-be_internal_modules_identity_application_dto.UserRes` |
| **GET** | `/api/v1/me/avatar-signature` | Lấy chữ ký tải ảnh đại diện |  | `smart-wardrobe-be_internal_shared_application_dto.UploadSignatureResult` |
| **PUT** | `/api/v1/me/change-password` | Đổi mật khẩu | Body: `smart-wardrobe-be_internal_modules_identity_application_dto.ChangePasswordReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |

## Outfits

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/me/outfits` | Lấy danh sách bộ phối đồ của tôi |  | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.OutfitRes[]` |
| **POST** | `/api/v1/outfits` | Tạo bộ phối đồ mới | Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.SaveOutfitReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.OutfitRes` |
| **GET** | `/api/v1/outfits/upload-signature` | Lấy chữ ký tải ảnh bìa bộ phối đồ |  | `smart-wardrobe-be_internal_shared_application_dto.UploadSignatureResult` |
| **GET** | `/api/v1/outfits/{id}` | Chi tiết bộ phối đồ và tọa độ canvas | Params: id (path, required) | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.OutfitRes` |
| **PUT** | `/api/v1/outfits/{id}` | Cập nhật bộ phối đồ | Params: id (path, required)<br>Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.SaveOutfitReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.OutfitRes` |
| **DELETE** | `/api/v1/outfits/{id}` | Xóa bộ phối đồ tự thiết kế | Params: id (path, required) | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |

## Wardrobe

| Method | Endpoint | Summary | Req Body/Params | Response Schema |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v1/me/wardrobe-items` | Lấy danh sách trang phục |  | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes[]` |
| **POST** | `/api/v1/wardrobe-items/batch-upload` | Số hóa trang phục hàng loạt | Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.BatchUploadWardrobeItemsReq` | N/A |
| **POST** | `/api/v1/wardrobe-items/catalog-init` | Khởi tạo nhanh tủ đồ cá nhân | Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.InitClosetFromCatalogReq` | N/A |
| **GET** | `/api/v1/wardrobe-items/search` | Tìm kiếm trang phục có sẵn của hệ thống (Elasticsearch CQRS) | Params: q (query) | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.SearchWardrobeItemRes[]` |
| **GET** | `/api/v1/wardrobe-items/upload-signature` | Lấy chữ ký tải ảnh trang phục |  | `smart-wardrobe-be_internal_shared_application_dto.UploadSignatureResult` |
| **GET** | `/api/v1/wardrobe-items/{id}` | Xem chi tiết trang phục | Params: id (path, required) | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |
| **POST** | `/api/v1/wardrobe-items/{id}/clone` | Nhân bản trang phục | Params: id (path, required)<br>Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.CloneWardrobeItemReq` | N/A |
| **PUT** | `/api/v1/wardrobe-items/{id}/manual-classify` | Tự phân loại trang phục thủ công | Params: id (path, required)<br>Body: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.ManualClassifyReq` | `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |

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
| **GET** | `/api/v1/subscriptions/me/wallet/statements` | Lấy lịch sử giao dịch ví nội bộ |  | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/subscriptions/me/wallet/topup` | Tạo yêu cầu nạp tiền vào ví nội bộ | Body: `smart-wardrobe-be_internal_modules_subscription_application_dto.WalletTopUpReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |
| **POST** | `/api/v1/subscriptions/payos-webhook` | Xử lý Webhook thông báo thanh toán từ PayOS | Body: `smart-wardrobe-be_internal_modules_subscription_application_dto.PayOSWebhookReq` | `smart-wardrobe-be_internal_shared_presentation.APIResponse` |


## Definitions (Models)

### `AddCommentReq`

| Property | Type | Description |
| --- | --- | --- |
| **content** | string |  |

### `CommentRes`

| Property | Type | Description |
| --- | --- | --- |
| **content** | string |  |
| **createdAt** | string |  |
| **id** | string |  |
| **userId** | string |  |

### `CreatePostReq`

| Property | Type | Description |
| --- | --- | --- |
| **contactInfo** | string |  |
| **content** | string |  |
| **itemIds** | array of string |  |
| **media** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostMediaReq` |  |
| **postType** | string |  |
| **title** | string |  |
| **totalPrice** | number |  |

### `GetFeedRes`

| Property | Type | Description |
| --- | --- | --- |
| **items** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostRes` |  |
| **metadata** | ref: `smart-wardrobe-be_internal_shared_application_dto.PaginationMetadata` |  |

### `LikePostReq`

| Property | Type | Description |
| --- | --- | --- |
| **isLiked** | boolean |  |

### `PendingTransferRes`

| Property | Type | Description |
| --- | --- | --- |
| **item** | ref: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |  |
| **postItemId** | string |  |
| **sellerName** | string |  |

### `PostItemRes`

| Property | Type | Description |
| --- | --- | --- |
| **buyerUserId** | string |  |
| **declinedAt** | string |  |
| **id** | string |  |
| **item** | ref: `smart-wardrobe-be_internal_modules_wardrobe_application_dto.WardrobeItemRes` |  |
| **itemCondition** | integer |  |
| **price** | number |  |
| **soldAt** | string |  |
| **status** | integer |  |
| **transferState** | integer |  |

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
| **commentCount** | integer |  |
| **comments** | array of `smart-wardrobe-be_internal_modules_community_application_dto.CommentRes` |  |
| **contactInfo** | string |  |
| **content** | string |  |
| **createdAt** | string |  |
| **finalFeedScore** | number |  |
| **globalHotnessScore** | number |  |
| **id** | string |  |
| **isLiked** | boolean |  |
| **items** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostItemRes` |  |
| **likeCount** | integer |  |
| **media** | array of `smart-wardrobe-be_internal_modules_community_application_dto.PostMediaRes` |  |
| **postType** | string |  |
| **title** | string |  |
| **totalPrice** | number |  |
| **updatedAt** | string |  |
| **userId** | string |  |

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
| **itemCondition** | integer |  |
| **postItemId** | string |  |
| **price** | number |  |
| **soldAt** | string |  |
| **status** | integer |  |
| **transferState** | integer |  |

### `SellerTransferPostRes`

| Property | Type | Description |
| --- | --- | --- |
| **createdAt** | string |  |
| **items** | array of `smart-wardrobe-be_internal_modules_community_application_dto.SellerTransferPostItemRes` |  |
| **postId** | string |  |
| **postType** | string |  |
| **title** | string |  |
| **updatedAt** | string |  |

### `TransferBuyerSummaryRes`

| Property | Type | Description |
| --- | --- | --- |
| **avatarUrl** | string |  |
| **id** | string |  |
| **username** | string |  |

### `UpdateCommentReq`

| Property | Type | Description |
| --- | --- | --- |
| **content** | string |  |

### `UpdatePostItemsBuyerReq`

| Property | Type | Description |
| --- | --- | --- |
| **buyerUserId** | string |  |

### `UploadSignatureResult`

| Property | Type | Description |
| --- | --- | --- |
| **apiKey** | string |  |
| **folder** | string |  |
| **publicId** | string |  |
| **signature** | string |  |
| **timestamp** | integer |  |

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

### `UserBodyProfileRes`

| Property | Type | Description |
| --- | --- | --- |
| **bodyType** | string |  |
| **estimatedBodyShape** | string |  |
| **fitPreference** | string |  |
| **height** | number |  |
| **recommendedSize** | string |  |
| **skinTone** | string |  |
| **stylingNotes** | string |  |
| **weight** | number |  |

### `UserRes`

| Property | Type | Description |
| --- | --- | --- |
| **address** | string |  |
| **avatarPublicId** | string |  |
| **avatarUrl** | string |  |
| **bodyProfile** | object | Quota        *UserQuotaRes       `json:"quota,omitempty"` |
| **createdAt** | string |  |
| **email** | string |  |
| **firstName** | string |  |
| **gender** | ref: `smart-wardrobe-be_internal_shared_domain_constants_gender.Gender` |  |
| **id** | string |  |
| **lastName** | string |  |
| **roleSlug** | ref: `smart-wardrobe-be_internal_shared_domain_constants_roleslug.RoleSlug` |  |
| **status** | integer |  |
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
| **sender** | string |  |

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
| **status** | integer |  |
| **updated_at** | string |  |
| **user_id** | string |  |

### `RecommendOutfitReq`

| Property | Type | Description |
| --- | --- | --- |
| **details** | string |  |
| **occasion** | string |  |
| **season** | string |  |
| **styleTarget** | string |  |
| **weather** | string |  |

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
| **items** | array of `smart-wardrobe-be_internal_modules_wardrobe_application_dto.RecommendedItemGroup` |  |
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
| **fit** | string |  |
| **id** | string |  |
| **imagePublicId** | string |  |
| **imageUrl** | string |  |
| **isSystem** | boolean |  |
| **material** | string |  |
| **pattern** | string |  |
| **seasonality** | string |  |
| **style** | string |  |

### `SendChatMessageReq`

| Property | Type | Description |
| --- | --- | --- |
| **content** | string |  |

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
| **createdAt** | string |  |
| **fit** | string |  |
| **id** | string |  |
| **imagePublicId** | string |  |
| **imageUrl** | string |  |
| **isLocked** | boolean |  |
| **material** | string |  |
| **pattern** | string |  |
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

### `RoleSlug`

| Property | Type | Description |
| --- | --- | --- |

### `UserStatus`

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

