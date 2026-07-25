# Smart Wardrobe API Routes

This document is auto-generated from `swagger.json` to provide comprehensive details about API requests and responses.

## Admin

### `GET` `/api/v1/admin/brands`

**Summary**: Lấy danh sách brand (Admin)

**Description**: Cho phép admin lấy danh sách brand phân trang, tìm kiếm theo tên/slug và lọc theo trạng thái của brand.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |
| `q` | query | string | No |  |
| `status` | query | string | No |  |

**Responses**:

- **200**: Lấy danh sách brand thành công
  - Data Schema: [AdminBrandListRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoadminbrandlistres)
    **Properties**:
    - `items` (Array<BrandRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `POST` `/api/v1/admin/brands`

**Summary**: Tạo brand active trực tiếp (Admin)

**Request Body**:

Thông tin brand

- Schema: [CreateBrandReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtocreatebrandreq)
    **Properties**:
    - `description` (string)
    - `logoPublicId` (string)
    - `logoUrl` (string)
    - `name` (string) **(Required)**
    - `slug` (string) **(Required)**

**Responses**:

- **201**: Created
  - Data Schema: [BrandRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandres)
    **Properties**:
    - `approvedAt` (string)
    - `approvedByUserId` (string)
    - `backgroundUrl` (string)
    - `createdAt` (string)
    - `createdByUserId` (string)
    - `description` (string)
    - `id` (string)
    - `logoUrl` (string)
    - `name` (string)
    - `slug` (string)
    - `status` (ref: BrandStatus)
    - `totalCustomer` (integer)
    - `updatedAt` (string)

---

### `PATCH` `/api/v1/admin/brands/{brandId}/status`

**Summary**: Cập nhật trạng thái brand (Admin)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Request Body**:

Trạng thái mới

- Schema: [UpdateBrandStatusReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtoupdatebrandstatusreq)
    **Properties**:
    - `status` (ref: BrandStatus) **(Required)**

**Responses**:

- **200**: OK
  - Data Schema: [BrandRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandres)
    **Properties**:
    - `approvedAt` (string)
    - `approvedByUserId` (string)
    - `backgroundUrl` (string)
    - `createdAt` (string)
    - `createdByUserId` (string)
    - `description` (string)
    - `id` (string)
    - `logoUrl` (string)
    - `name` (string)
    - `slug` (string)
    - `status` (ref: BrandStatus)
    - `totalCustomer` (integer)
    - `updatedAt` (string)

---

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
    - `sortOrder` (integer)

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
    - `sortOrder` (integer)

**Responses**:

- **201**: Thông tin danh mục sau khi tạo
  - Data Schema: [CategoryRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres)
    **Properties**:
    - `id` (string)
    - `name` (string)
    - `slug` (string)
    - `sortOrder` (integer)

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
    - `sortOrder` (integer)

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
    - `sortOrder` (integer)

**Responses**:

- **200**: Thông tin danh mục sau khi cập nhật
  - Data Schema: [CategoryRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres)
    **Properties**:
    - `id` (string)
    - `name` (string)
    - `slug` (string)
    - `sortOrder` (integer)

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
    - `brandItem` (ref: BrandItemBriefRes)
    - `createdAt` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `id` (string)
    - `isDeleted` (boolean)
    - `isLocked` (boolean)
    - `itemContext` (string)
    - `lastUsedAt` (string)
    - `price` (number)
    - `status` (ref: WardrobeItemStatus)
    - `taskId` (string)
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

## Dashboard Admin

### `GET` `/api/v1/admin/dashboard/ai-margin`

**Summary**: Phân tích biên lợi nhuận AI Token

**Description**: Thống kê doanh thu subscription, chi phí thực tế tiêu thụ AI Token (ai_usage_period_ledgers), lợi nhuận ròng AI (net_ai_margin) và phần trăm biên lợi nhuận.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `fromDate` | query | string | No | Ngày bắt đầu (định dạng YYYY-MM-DD) |
| `toDate` | query | string | No | Ngày kết thúc (định dạng YYYY-MM-DD) |

**Responses**:

- **200**: Lấy thông tin biên lợi nhuận AI thành công
  - Data Schema: [AIMarginAnalyticsRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtoaimarginanalyticsres)
    **Properties**:
    - `aiErrorCount` (integer)
    - `aiRequestsCount` (integer)
    - `fromDate` (string)
    - `marginPercentage` (number)
    - `netAiMarginVnd` (number)
    - `toDate` (string)
    - `totalAiActualCostVnd` (number)
    - `totalAiPaidTokens` (integer)
    - `totalSubscriptionRevVnd` (number)

---

### `GET` `/api/v1/admin/dashboard/ai/error-breakdown`

**Summary**: Thống kê lỗi AI theo mã lỗi, nhà cung cấp và mô hình

**Description**: Thống kê số lượng lỗi, tổng số request và tỷ lệ lỗi AI, phân nhóm theo error_code, provider và model

**Responses**:

- **200**: Lấy thống kê lỗi AI thành công
  - Data Schema: [AIErrorBreakdownRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtoaierrorbreakdownres)
    **Properties**:
    - `breakdown` (Array<AIErrorBreakdownDTO>)
    - `errorRate` (number)
    - `totalErrors` (integer)
    - `totalRequests` (integer)

---

### `GET` `/api/v1/admin/dashboard/ai/usage-by-operation`

**Summary**: Thống kê sử dụng AI theo tác vụ

**Description**: Thống kê số lượng request, chi phí và token AI theo từng loại tác vụ (operation) và tuyến xử lý (logical_route), hỗ trợ lọc khoảng thời gian

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `fromDate` | query | string | No | Ngày bắt đầu (định dạng YYYY-MM-DD) |
| `toDate` | query | string | No | Ngày kết thúc (định dạng YYYY-MM-DD) |

**Responses**:

- **200**: Lấy thống kê sử dụng AI thành công
  - Data Schema: [AIUsageByOperationRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtoaiusagebyoperationres)
    **Properties**:
    - `fromDate` (string)
    - `operations` (Array<AIUsageByOperationDTO>)
    - `toDate` (string)

---

### `GET` `/api/v1/admin/dashboard/drilldown/ai-events`

**Summary**: Truy vết chi tiết các sự kiện lỗi AI (Drill-down Admin)

**Description**: Lấy danh sách phân trang các sự kiện lỗi AI token với thông tin provider, model, status code.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `status` | query | string | No | Trạng thái lỗi (ví dụ: FAILED) |
| `page` | query | integer | No | Số trang |
| `limit` | query | integer | No | Số lượng phần tử mỗi trang |

**Responses**:

- **200**: Lấy chi tiết sự kiện AI thành công
  - Data Schema: [DrillDownAIEventListRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtodrilldownaieventlistres)
    **Properties**:
    - `items` (Array<DrillDownAIEventDTO>)
    - `metadata` (ref: PaginationMetadata)

---

### `GET` `/api/v1/admin/dashboard/kpi-cards`

**Summary**: Lấy các thẻ chỉ số KPI tổng quan Admin

**Description**: Lấy thông tin tổng số lượng người dùng, chỉ số DAU, số nhãn hàng active, số nhãn hàng chờ duyệt, doanh thu subscription và biên lợi nhuận AI net margin.

**Responses**:

- **200**: Lấy danh sách thẻ KPI Admin thành công
  - Data Schema: [AdminKPICardsRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtoadminkpicardsres)
    **Properties**:
    - `activeUsersDau` (integer)
    - `netAiMarginVnd` (number)
    - `payOSSuccessCount` (integer)
    - `pendingReviewBrands` (integer)
    - `subscriptionRevenueVnd` (number)
    - `totalBrands` (integer)
    - `totalUsers` (integer)
    - `updatedAt` (string)

---

### `GET` `/api/v1/admin/dashboard/overview`

**Summary**: Báo cáo tổng quan Admin Dashboard

**Description**: Tổng hợp tất cả dữ liệu từ KPI Cards, AI Margin Analytics và PayOS Reconciliation trong 1 kết quả duy nhất.

**Responses**:

- **200**: Lấy thông tin tổng quan hệ thống thành công
  - Data Schema: [AdminOverviewRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtoadminoverviewres)
    **Properties**:
    - `aiMargin` (ref: AIMarginAnalyticsRes)
    - `kpiCards` (ref: AdminKPICardsRes)
    - `payosReconcile` (ref: PayOSReconciliationRes)

---

### `GET` `/api/v1/admin/dashboard/payos-reconciliation`

**Summary**: Thống kê đối soát giao dịch PayOS

**Description**: Báo cáo đối soát số lượng giao dịch thanh toán PayOS, tỷ lệ thành công/thất bại và tổng số tiền thanh toán thực tế.

**Responses**:

- **200**: Lấy thông tin đối soát PayOS thành công
  - Data Schema: [PayOSReconciliationRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtopayosreconciliationres)
    **Properties**:
    - `failedCount` (integer)
    - `successCount` (integer)
    - `totalSuccessValue` (number)
    - `totalTransactions` (integer)

---

### `GET` `/api/v1/admin/dashboard/subscriptions/distribution`

**Summary**: Phân bổ người dùng theo gói subscription

**Description**: Thống kê số lượng người dùng và tỷ lệ phần trăm theo từng gói subscription (FREE, PREMIUM_MONTHLY, PREMIUM_YEARLY, v.v.)

**Responses**:

- **200**: Lấy phân bổ subscription thành công
  - Data Schema: [SubscriptionDistributionRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtosubscriptiondistributionres)
    **Properties**:
    - `distribution` (Array<SubscriptionDistributionDTO>)
    - `totalUsers` (integer)

---

### `GET` `/api/v1/admin/dashboard/subscriptions/renewal-stats`

**Summary**: Thống kê gia hạn subscription

**Description**: Thống kê tổng số lần gia hạn, số thành công, số thất bại, tỷ lệ thành công và số lần thử lại trung bình

**Responses**:

- **200**: Lấy thống kê gia hạn subscription thành công
  - Data Schema: [RenewalStatsRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtorenewalstatsres)
    **Properties**:
    - `avgRetryCount` (number)
    - `failedCount` (integer)
    - `successCount` (integer)
    - `successRate` (number)
    - `totalAttempts` (integer)

---

### `GET` `/api/v1/admin/dashboard/subscriptions/revenue-breakdown`

**Summary**: Doanh thu subscription theo gói và thời gian

**Description**: Thống kê doanh thu subscription theo từng plan_code và theo tháng, hỗ trợ lọc khoảng thời gian

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `fromDate` | query | string | No | Ngày bắt đầu (định dạng YYYY-MM-DD) |
| `toDate` | query | string | No | Ngày kết thúc (định dạng YYYY-MM-DD) |

**Responses**:

- **200**: Lấy doanh thu subscription thành công
  - Data Schema: [RevenueBreakdownRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtorevenuebreakdownres)
    **Properties**:
    - `breakdown` (Array<RevenueBreakdownDTO>)
    - `fromDate` (string)
    - `toDate` (string)
    - `totalRevenueVnd` (number)

---

## Wardrobe AI

### `GET` `/api/v1/ai/chat/sessions`

**Summary**: Lấy danh sách cuộc trò chuyện AI

**Description**: Lấy tất cả các phiên trò chuyện của người dùng hiện tại với stylist AI

**Responses**:

- **200**: Lấy danh sách cuộc trò chuyện thành công
  - Data Schema: Array<[ChatSessionRes](#smart-wardrobe-beinternalmodulesfashionapplicationdtochatsessionres)>
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

- Schema: [CreateChatSessionReq](#smart-wardrobe-beinternalmodulesfashionapplicationdtocreatechatsessionreq)
    **Properties**:
    - `title` (string)

**Responses**:

- **201**: Tạo cuộc trò chuyện thành công
  - Data Schema: [ChatSessionRes](#smart-wardrobe-beinternalmodulesfashionapplicationdtochatsessionres)
    **Properties**:
    - `contextSummary` (string)
    - `createdAt` (string)
    - `id` (string)
    - `isArchived` (boolean)
    - `title` (string)
    - `updatedAt` (string)

---

### `DELETE` `/api/v1/ai/chat/sessions/{contextID}`

**Summary**: Xóa cuộc trò chuyện AI

**Description**: Xóa vĩnh viễn cuộc trò chuyện với stylist AI và toàn bộ lịch sử tin nhắn liên quan

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `contextID` | path | string | Yes | ID cuộc trò chuyện |

**Responses**:

- **200**: Xóa cuộc trò chuyện thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

---

### `PATCH` `/api/v1/ai/chat/sessions/{contextID}`

**Summary**: Cập nhật thông tin cuộc trò chuyện AI

**Description**: Cập nhật thông tin chi tiết của phiên trò chuyện với stylist AI (ví dụ: đổi tiêu đề)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `contextID` | path | string | Yes | ID cuộc trò chuyện |

**Request Body**:

Thông tin cập nhật cuộc trò chuyện

- Schema: [UpdateChatSessionReq](#smart-wardrobe-beinternalmodulesfashionapplicationdtoupdatechatsessionreq)
    **Properties**:
    - `title` (string)

**Responses**:

- **200**: Cập nhật cuộc trò chuyện thành công
  - Data Schema: [ChatSessionRes](#smart-wardrobe-beinternalmodulesfashionapplicationdtochatsessionres)
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
  - Data Schema: [PaginationResult-smart-wardrobe-be_internal_modules_fashion_application_dto_ChatMessageRes](#smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmodulesfashionapplicationdtochatmessageres)
    **Properties**:
    - `items` (Array<ChatMessageRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `POST` `/api/v1/ai/chat/sessions/{contextID}/messages/stream`

**Summary**: Nhắn tin với stylist AI (Stream SSE)

**Description**: Gửi tin nhắn cho stylist AI và nhận phản hồi dạng stream sự kiện (Server-Sent Events).
Nội dung tin nhắn được giới hạn tối đa 2.000 ký tự Unicode sau khi chuẩn hóa NFC. Frontend nên kiểm tra giới hạn trước khi gửi để đảm bảo trải nghiệm người dùng.
Nếu mô hình AI phát hiện người dùng yêu cầu phối đồ từ tủ đồ cá nhân, nó sẽ thêm token '[ACTION:REDIRECT_OUTFIT]' vào cuối phản hồi stream.
- CHÚ Ý: Token '[ACTION:REDIRECT_OUTFIT]' có thể bị phân mảnh (split) thành nhiều chunk nhỏ khi truyền tải stream (ví dụ: chunk 1 nhận '[ACTION:RE', chunk 2 nhận 'DIRECT_OUTFIT]').
- Frontend cần tích luỹ toàn bộ chuỗi (accumulated string) hoặc ghép các chunk lại trước khi kiểm tra sự tồn tại của token này để hiển thị nút/card điều hướng sang tính năng Phối đồ chuyên dụng, thay vì chỉ kiểm tra đơn lẻ trên từng chunk nhận được.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `contextID` | path | string | Yes | ID cuộc trò chuyện |

**Request Body**:

Nội dung tin nhắn gửi đi

- Schema: [SendChatMessageReq](#smart-wardrobe-beinternalmodulesfashionapplicationdtosendchatmessagereq)
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
- details (Ghi chú thêm bằng tay, tối đa 1.000 ký tự Unicode sau khi chuẩn hóa NFC. Frontend nên kiểm tra giới hạn trước khi gửi để đảm bảo trải nghiệm người dùng.)

**Request Body**:

Yêu cầu gợi ý phối đồ

- Schema: [RecommendOutfitReq](#smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendoutfitreq)
    **Properties**:
    - `colorTone` (string) - Tông màu phối đồ (Gợi ý: light, dark, pastel, earthy, neon... hoặc nhập tông màu tùy ý)
    - `details` (string) - Ghi chú thêm bằng tay (free text)
    - `includeBrandItems` (boolean) - Cho phép phối đồ của brand (tỷ lệ tối đa 30%)
    - `occasion` (string) - Dịp phối đồ (Gợi ý: casual, work, date, party, sport, hoặc nhập dịp tùy ý)
    - `season` (string) - Mùa phối đồ @enums spring,summer,autumn,winter,all
    - `styleTarget` (string) - Phong cách hướng tới (Gợi ý: minimalist, vintage, streetwear, preppy, sporty, elegant, hoặc nhập phong cách tùy ý)
    - `weather` (string) - Thời tiết hiện tại (Gợi ý: hot, cold, warm, cool, rainy, hoặc nhập thời tiết cụ thể)

**Responses**:

- **200**: Gợi ý phối đồ thành công
  - Data Schema: [RecommendedOutfitRes](#smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendedoutfitres)
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

### `POST` `/api/v1/auth/forgot-password/resend-otp`

**Summary**: Gửi lại OTP khôi phục mật khẩu

**Description**: Gửi lại mã OTP xác thực khôi phục mật khẩu qua email dựa vào địa chỉ email đã gửi yêu cầu trước đó

**Request Body**:

Email nhận lại OTP

- Schema: [ResendOtpReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoresendotpreq)
    **Properties**:
    - `email` (string) **(Required)**

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
    - `address` (string)
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

### `POST` `/api/v1/auth/register/resend-otp`

**Summary**: Gửi lại OTP đăng ký

**Description**: Gửi lại mã OTP xác thực đăng ký qua email dựa vào địa chỉ email đã đăng ký trước đó

**Request Body**:

Email nhận lại OTP

- Schema: [ResendOtpReq](#smart-wardrobe-beinternalmodulesidentityapplicationdtoresendotpreq)
    **Properties**:
    - `email` (string) **(Required)**

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

## Brand Benefit

### `GET` `/api/v1/brand-benefits/{benefitId}`

**Summary**: Lấy chi tiết quyền lợi brand đang hoạt động

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `benefitId` | path | string | Yes | ID benefit |

**Responses**:

- **200**: OK
  - Data Schema: [BrandBenefitRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandbenefitres)
    **Properties**:
    - `benefitType` (string)
    - `brandId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `featureCode` (string)
    - `featureConfig` (object)
    - `id` (string)
    - `name` (string)
    - `requiredPoints` (integer)
    - `requiredTierId` (string)
    - `requiredTierName` (string)
    - `status` (string)
    - `unlockType` (string)
    - `updatedAt` (string)

---

### `POST` `/api/v1/brand-benefits/{benefitId}/redeem`

**Summary**: Đổi quyền lợi brand (User)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `benefitId` | path | string | Yes | ID quyền lợi |

**Responses**:

- **201**: Created
  - Data Schema: [BenefitRedemptionRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobenefitredemptionres)
    **Properties**:
    - `benefitId` (string)
    - `brandCustomerId` (string)
    - `brandId` (string)
    - `createdAt` (string)
    - `expiresAt` (string)
    - `id` (string)
    - `pointsSpent` (integer)
    - `redeemedAt` (string)
    - `status` (string)
    - `updatedAt` (string)
    - `usedAt` (string)
    - `userId` (string)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/benefits`

**Summary**: Lấy danh sách quyền lợi cho brand staff

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: Array<[BrandBenefitRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandbenefitres)>
    **Properties**:
    - `benefitType` (string)
    - `brandId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `featureCode` (string)
    - `featureConfig` (object)
    - `id` (string)
    - `name` (string)
    - `requiredPoints` (integer)
    - `requiredTierId` (string)
    - `requiredTierName` (string)
    - `status` (string)
    - `unlockType` (string)
    - `updatedAt` (string)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/benefits`

**Summary**: Tạo quyền lợi cho brand (Staff)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Request Body**:

Thông tin quyền lợi

- Schema: [CreateBrandBenefitReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtocreatebrandbenefitreq)
    **Properties**:
    - `benefitType` (string) **(Required)**
    - `description` (string)
    - `featureCode` (string)
    - `featureConfig` (object)
    - `name` (string) **(Required)**
    - `requiredPoints` (integer)
    - `requiredTierId` (string)
    - `unlockType` (string) **(Required)**

**Responses**:

- **201**: Created
  - Data Schema: [BrandBenefitRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandbenefitres)
    **Properties**:
    - `benefitType` (string)
    - `brandId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `featureCode` (string)
    - `featureConfig` (object)
    - `id` (string)
    - `name` (string)
    - `requiredPoints` (integer)
    - `requiredTierId` (string)
    - `requiredTierName` (string)
    - `status` (string)
    - `unlockType` (string)
    - `updatedAt` (string)

---

### `PATCH` `/api/v1/brand-portal/brands/{brandId}/benefits/{benefitId}/status`

**Summary**: Cập nhật trạng thái quyền lợi (Staff)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `benefitId` | path | string | Yes | ID quyền lợi |

**Request Body**:

Trạng thái mới

- Schema: [UpdateBenefitStatusReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtoupdatebenefitstatusreq)
    **Properties**:
    - `status` (string) **(Required)**

**Responses**:

- **200**: OK
  - Data Schema: [BrandBenefitRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandbenefitres)
    **Properties**:
    - `benefitType` (string)
    - `brandId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `featureCode` (string)
    - `featureConfig` (object)
    - `id` (string)
    - `name` (string)
    - `requiredPoints` (integer)
    - `requiredTierId` (string)
    - `requiredTierName` (string)
    - `status` (string)
    - `unlockType` (string)
    - `updatedAt` (string)

---

### `GET` `/api/v1/brands/{brandId}/benefits`

**Summary**: Lấy danh sách quyền lợi đang hoạt động của brand (Public)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: Array<[BrandBenefitRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandbenefitres)>
    **Properties**:
    - `benefitType` (string)
    - `brandId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `featureCode` (string)
    - `featureConfig` (object)
    - `id` (string)
    - `name` (string)
    - `requiredPoints` (integer)
    - `requiredTierId` (string)
    - `requiredTierName` (string)
    - `status` (string)
    - `unlockType` (string)
    - `updatedAt` (string)

---

### `GET` `/api/v1/me/benefit-redemptions`

**Summary**: Lấy danh sách quyền lợi đã nhận của tôi

**Responses**:

- **200**: OK
  - Data Schema: Array<[BenefitRedemptionRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobenefitredemptionres)>
    **Properties**:
    - `benefitId` (string)
    - `brandCustomerId` (string)
    - `brandId` (string)
    - `createdAt` (string)
    - `expiresAt` (string)
    - `id` (string)
    - `pointsSpent` (integer)
    - `redeemedAt` (string)
    - `status` (string)
    - `updatedAt` (string)
    - `usedAt` (string)
    - `userId` (string)

---

## Brand

### `GET` `/api/v1/brand-items/{itemId}`

**Summary**: Lấy chi tiết sản phẩm/mẫu thử brand (product public, sample yêu cầu auth)

**Description**: Product public hoàn toàn (không cần đăng nhập). Sample yêu cầu user đã đăng nhập và có quyền sample_mix_access, nếu không đủ quyền trả về 403.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `itemId` | path | string | Yes | ID item |

**Responses**:

- **200**: OK
  - Data Schema: [BrandItemRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemres)
    **Properties**:
    - `brandId` (string)
    - `brandName` (string)
    - `createdAt` (string)
    - `description` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `fashionItemId` (string)
    - `id` (string)
    - `itemType` (ref: BrandItemType)
    - `name` (string)
    - `price` (number)
    - `productCode` (string)
    - `status` (ref: BrandItemStatus)
    - `taskId` (string)
    - `updatedAt` (string)

---

### `POST` `/api/v1/brand-items/{itemId}/feedbacks`

**Summary**: [User] Gửi phản hồi, đánh giá mẫu thử kỹ thuật số

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `itemId` | path | string | Yes | ID sản phẩm mẫu thử |

**Request Body**:

Nội dung phản hồi

- Schema: [SubmitSampleFeedbackReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtosubmitsamplefeedbackreq)
    **Properties**:
    - `feedbackText` (string)
    - `outfitId` (string)
    - `rating` (integer)
    - `voteType` (string)

**Responses**:

- **201**: Created
  - Data Schema: [DigitalSampleResponseRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtodigitalsampleresponseres)
    **Properties**:
    - `brandItemId` (string)
    - `createdAt` (string)
    - `feedbackText` (string)
    - `id` (string)
    - `outfitId` (string)
    - `rating` (integer)
    - `userId` (string)
    - `voteType` (string)

---

### `GET` `/api/v1/brands`

**Summary**: Lấy danh sách brand đang active

**Description**: Supports pagination and search by brand name or slug.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `limit` | query | integer | No |  |
| `page` | query | integer | No |  |
| `q` | query | string | No |  |

**Responses**:

- **200**: OK
  - Data Schema: [PublicBrandListRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtopublicbrandlistres)
    **Properties**:
    - `items` (Array<BrandRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `GET` `/api/v1/brands/{brandId}`

**Summary**: Lấy chi tiết brand active

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: [BrandRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandres)
    **Properties**:
    - `approvedAt` (string)
    - `approvedByUserId` (string)
    - `backgroundUrl` (string)
    - `createdAt` (string)
    - `createdByUserId` (string)
    - `description` (string)
    - `id` (string)
    - `logoUrl` (string)
    - `name` (string)
    - `slug` (string)
    - `status` (ref: BrandStatus)
    - `totalCustomer` (integer)
    - `updatedAt` (string)

---

### `GET` `/api/v1/brands/{brandId}/items`

**Summary**: Lấy danh sách sản phẩm brand (public)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `brandId` | path | string | Yes | ID brand |
| `page` | query | integer | No | Trang |
| `limit` | query | integer | No | Số lượng |

**Responses**:

- **200**: OK
  - Data Schema: [BrandItemListRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemlistres)
    **Properties**:
    - `items` (Array<BrandItemRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `GET` `/api/v1/brands/{brandId}/items/samples`

**Summary**: Lấy danh sách mẫu thử brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `page` | query | integer | No | Trang |
| `limit` | query | integer | No | Số lượng |

**Responses**:

- **200**: OK
  - Data Schema: [BrandItemListRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemlistres)
    **Properties**:
    - `items` (Array<BrandItemRes>)
    - `metadata` (ref: PaginationMetadata)

---

## Brand Portal

### `POST` `/api/v1/brand-portal/brands`

**Summary**: Gửi yêu cầu tạo brand

**Request Body**:

Thông tin brand

- Schema: [CreateBrandReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtocreatebrandreq)
    **Properties**:
    - `description` (string)
    - `logoPublicId` (string)
    - `logoUrl` (string)
    - `name` (string) **(Required)**
    - `slug` (string) **(Required)**

**Responses**:

- **201**: Created
  - Data Schema: [BrandRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandres)
    **Properties**:
    - `approvedAt` (string)
    - `approvedByUserId` (string)
    - `backgroundUrl` (string)
    - `createdAt` (string)
    - `createdByUserId` (string)
    - `description` (string)
    - `id` (string)
    - `logoUrl` (string)
    - `name` (string)
    - `slug` (string)
    - `status` (ref: BrandStatus)
    - `totalCustomer` (integer)
    - `updatedAt` (string)

---

### `GET` `/api/v1/brand-portal/brands/profile-images/upload-signature`

**Summary**: Lấy chữ ký upload logo/ảnh nền brand

**Responses**:

- **200**: OK
  - Data Schema: [UploadSignatureResult](#smart-wardrobe-beinternalmodulesbrandapplicationdtouploadsignatureresult)
    **Properties**:
    - `apiKey` (string)
    - `folder` (string)
    - `publicId` (string)
    - `signature` (string)
    - `timestamp` (integer)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}`

**Summary**: Lấy thông tin brand portal

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: [PortalBrandRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoportalbrandres)
    **Properties**:
    - `approvedAt` (string)
    - `approvedByUserId` (string)
    - `backgroundUrl` (string)
    - `createdAt` (string)
    - `createdByUserId` (string)
    - `description` (string)
    - `id` (string)
    - `logoUrl` (string)
    - `memberId` (string)
    - `memberRole` (ref: BrandMemberRole)
    - `memberStatus` (ref: BrandMemberStatus)
    - `name` (string)
    - `slug` (string)
    - `status` (ref: BrandStatus)
    - `totalCustomer` (integer)
    - `updatedAt` (string)

---

### `PATCH` `/api/v1/brand-portal/brands/{brandId}/profile-images`

**Summary**: Cập nhật logo/ảnh nền brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Request Body**:

Thông tin logo và ảnh nền

- Schema: [UpdateBrandImagesReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtoupdatebrandimagesreq)
    **Properties**:
    - `backgroundPublicId` (string)
    - `backgroundUrl` (string)
    - `logoPublicId` (string)
    - `logoUrl` (string)

**Responses**:

- **200**: OK
  - Data Schema: [BrandRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandres)
    **Properties**:
    - `approvedAt` (string)
    - `approvedByUserId` (string)
    - `backgroundUrl` (string)
    - `createdAt` (string)
    - `createdByUserId` (string)
    - `description` (string)
    - `id` (string)
    - `logoUrl` (string)
    - `name` (string)
    - `slug` (string)
    - `status` (ref: BrandStatus)
    - `totalCustomer` (integer)
    - `updatedAt` (string)

---

### `GET` `/api/v1/brand-portal/me/brands`

**Summary**: Lấy danh sách brand của staff hiện tại

**Responses**:

- **200**: OK
  - Data Schema: Array<[PortalBrandRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoportalbrandres)>
    **Properties**:
    - `approvedAt` (string)
    - `approvedByUserId` (string)
    - `backgroundUrl` (string)
    - `createdAt` (string)
    - `createdByUserId` (string)
    - `description` (string)
    - `id` (string)
    - `logoUrl` (string)
    - `memberId` (string)
    - `memberRole` (ref: BrandMemberRole)
    - `memberStatus` (ref: BrandMemberStatus)
    - `name` (string)
    - `slug` (string)
    - `status` (ref: BrandStatus)
    - `totalCustomer` (integer)
    - `updatedAt` (string)

---

## Brand Chat

### `GET` `/api/v1/brand-portal/brands/{brandId}/conversations`

**Summary**: Lấy danh sách các cuộc hội thoại của brand (Staff)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: Array<[BrandConversationRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationres)>
    **Properties**:
    - `brandId` (string)
    - `createdAt` (string)
    - `customerId` (string)
    - `customerName` (string)
    - `id` (string)
    - `lastMessageAt` (string)
    - `staffLastReadAt` (string)
    - `staffUnreadCount` (integer)
    - `status` (string)
    - `updatedAt` (string)
    - `userDisplayName` (string)
    - `userId` (string)
    - `userLastReadAt` (string)
    - `userUnreadCount` (integer)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/conversations/{conversationId}/close`

**Summary**: Đóng hội thoại brand (Staff)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `conversationId` | path | string | Yes | ID hội thoại |

**Responses**:

- **200**: OK
  - Data Schema: [BrandConversationRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationres)
    **Properties**:
    - `brandId` (string)
    - `createdAt` (string)
    - `customerId` (string)
    - `customerName` (string)
    - `id` (string)
    - `lastMessageAt` (string)
    - `staffLastReadAt` (string)
    - `staffUnreadCount` (integer)
    - `status` (string)
    - `updatedAt` (string)
    - `userDisplayName` (string)
    - `userId` (string)
    - `userLastReadAt` (string)
    - `userUnreadCount` (integer)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/conversations/{conversationId}/messages`

**Summary**: Lấy danh sách tin nhắn trong cuộc hội thoại (Staff)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `conversationId` | path | string | Yes | ID cuộc hội thoại |
| `page` | query | integer | No | Trang hiện tại (mặc định: 1) |
| `limit` | query | integer | No | Số lượng tin nhắn mỗi trang (mặc định: 20) |

**Responses**:

- **200**: OK
  - Data Schema: [BrandConversationMessageListRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationmessagelistres)
    **Properties**:
    - `items` (Array<BrandConversationMessageRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/conversations/{conversationId}/messages`

**Summary**: Gửi phản hồi của brand staff (Staff)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `conversationId` | path | string | Yes | ID cuộc hội thoại |

**Request Body**:

Nội dung phản hồi

- Schema: [SendBrandChatMessageReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtosendbrandchatmessagereq)
    **Properties**:
    - `message` (string) **(Required)**

**Responses**:

- **201**: Created
  - Data Schema: [BrandConversationMessageRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationmessageres)
    **Properties**:
    - `conversationId` (string)
    - `createdAt` (string)
    - `id` (string)
    - `message` (string)
    - `senderRole` (string)
    - `senderUserId` (string)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/conversations/{conversationId}/read`

**Summary**: Đánh dấu đã đọc hội thoại brand (Staff)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `conversationId` | path | string | Yes | ID hội thoại |

**Responses**:

- **200**: OK
  - Data Schema: [BrandConversationRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationres)
    **Properties**:
    - `brandId` (string)
    - `createdAt` (string)
    - `customerId` (string)
    - `customerName` (string)
    - `id` (string)
    - `lastMessageAt` (string)
    - `staffLastReadAt` (string)
    - `staffUnreadCount` (integer)
    - `status` (string)
    - `updatedAt` (string)
    - `userDisplayName` (string)
    - `userId` (string)
    - `userLastReadAt` (string)
    - `userUnreadCount` (integer)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/conversations/{conversationId}/reopen`

**Summary**: Mở lại hội thoại brand (Staff)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `conversationId` | path | string | Yes | ID hội thoại |

**Responses**:

- **200**: OK
  - Data Schema: [BrandConversationRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationres)
    **Properties**:
    - `brandId` (string)
    - `createdAt` (string)
    - `customerId` (string)
    - `customerName` (string)
    - `id` (string)
    - `lastMessageAt` (string)
    - `staffLastReadAt` (string)
    - `staffUnreadCount` (integer)
    - `status` (string)
    - `updatedAt` (string)
    - `userDisplayName` (string)
    - `userId` (string)
    - `userLastReadAt` (string)
    - `userUnreadCount` (integer)

---

### `GET` `/api/v1/brands/{brandId}/conversation`

**Summary**: Lấy cuộc hội thoại hiện tại (User)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `page` | query | integer | No | Trang hiện tại (mặc định: 1) |
| `limit` | query | integer | No | Số lượng tin nhắn mỗi trang (mặc định: 20) |

**Responses**:

- **200**: OK
  - Data Schema: [BrandConversationDetailRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationdetailres)
    **Properties**:
    - `brandId` (string)
    - `createdAt` (string)
    - `customerId` (string)
    - `customerName` (string)
    - `id` (string)
    - `lastMessageAt` (string)
    - `messages` (Array<BrandConversationMessageRes>)
    - `metadata` (ref: PaginationMetadata)
    - `staffLastReadAt` (string)
    - `staffUnreadCount` (integer)
    - `status` (string)
    - `updatedAt` (string)
    - `userDisplayName` (string)
    - `userId` (string)
    - `userLastReadAt` (string)
    - `userUnreadCount` (integer)

---

### `POST` `/api/v1/brands/{brandId}/conversation/messages`

**Summary**: Gửi tin nhắn đến brand (User)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Request Body**:

Nội dung tin nhắn

- Schema: [SendBrandChatMessageReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtosendbrandchatmessagereq)
    **Properties**:
    - `message` (string) **(Required)**

**Responses**:

- **201**: Created
  - Data Schema: [BrandConversationMessageRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationmessageres)
    **Properties**:
    - `conversationId` (string)
    - `createdAt` (string)
    - `id` (string)
    - `message` (string)
    - `senderRole` (string)
    - `senderUserId` (string)

---

### `POST` `/api/v1/brands/{brandId}/conversation/read`

**Summary**: Đánh dấu đã đọc hội thoại brand (User)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: [BrandConversationRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationres)
    **Properties**:
    - `brandId` (string)
    - `createdAt` (string)
    - `customerId` (string)
    - `customerName` (string)
    - `id` (string)
    - `lastMessageAt` (string)
    - `staffLastReadAt` (string)
    - `staffUnreadCount` (integer)
    - `status` (string)
    - `updatedAt` (string)
    - `userDisplayName` (string)
    - `userId` (string)
    - `userLastReadAt` (string)
    - `userUnreadCount` (integer)

---

## Brand Loyalty

### `GET` `/api/v1/brand-portal/brands/{brandId}/customers`

**Summary**: Lấy danh sách khách hàng của brand

**Description**: Lấy danh sách các khách hàng đã liên kết với brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `page` | query | integer | No | Trang hiện tại (mặc định: 1) |
| `limit` | query | integer | No | Số lượng bản ghi trên mỗi trang (mặc định: 20) |
| `q` | query | string | No | Từ khóa tìm kiếm (tên, SĐT, mã KH) |
| `status` | query | string | No | Trạng thái khách hàng (ACTIVE, INACTIVE) |

**Responses**:

- **200**: OK
  - Data Schema: [BrandCustomerListRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandcustomerlistres)
    **Properties**:
    - `items` (Array<BrandCustomerRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/customers/offline-purchase`

**Summary**: Tạo khách hàng offline cho brand

**Description**: Cho phép nhân viên/chủ brand ghi nhận thông tin khách hàng mua hàng offline

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Request Body**:

Thông tin khách hàng mua offline

- Schema: [CreateOfflineBrandCustomerReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtocreateofflinebrandcustomerreq)
    **Properties**:
    - `customerName` (string)
    - `externalCustomerCode` (string)
    - `phoneE164` (string) **(Required)**

**Responses**:

- **201**: Created
  - Data Schema: [BrandCustomerRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandcustomerres)
    **Properties**:
    - `brandId` (string)
    - `claimedAt` (string)
    - `createdAt` (string)
    - `createdByMemberId` (string)
    - `customerName` (string)
    - `externalCustomerCode` (string)
    - `id` (string)
    - `joinedAt` (string)
    - `joinedSource` (ref: BrandCustomerJoinedSource)
    - `loyaltyAccount` (ref: CustomerLoyaltyAccountRes)
    - `phoneE164` (string)
    - `status` (ref: BrandCustomerStatus)
    - `updatedAt` (string)
    - `user` (ref: BrandCustomerUserRes)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/customers/{customerId}`

**Summary**: Lấy chi tiết khách hàng brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `customerId` | path | string | Yes | ID customer |

**Responses**:

- **200**: OK
  - Data Schema: [BrandCustomerRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandcustomerres)
    **Properties**:
    - `brandId` (string)
    - `claimedAt` (string)
    - `createdAt` (string)
    - `createdByMemberId` (string)
    - `customerName` (string)
    - `externalCustomerCode` (string)
    - `id` (string)
    - `joinedAt` (string)
    - `joinedSource` (ref: BrandCustomerJoinedSource)
    - `loyaltyAccount` (ref: CustomerLoyaltyAccountRes)
    - `phoneE164` (string)
    - `status` (ref: BrandCustomerStatus)
    - `updatedAt` (string)
    - `user` (ref: BrandCustomerUserRes)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/customers/{customerId}/claim-token`

**Summary**: Tạo mã claim cho khách hàng offline

**Description**: Tạo một mã claim ngẫu nhiên dùng để liên kết tài khoản offline của khách hàng với tài khoản online của người dùng. Hạn dùng 24 giờ.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID của Brand |
| `customerId` | path | string | Yes | ID của khách hàng cần tạo mã claim |

**Responses**:

- **200**: OK
  - Data Schema: [CreateClaimTokenRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtocreateclaimtokenres)
    **Properties**:
    - `claimToken` (string)
    - `expiresAt` (string)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/customers/{customerId}/claim-tokens`

**Summary**: Lấy danh sách mã claim của khách hàng offline

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID của Brand |
| `customerId` | path | string | Yes | ID của khách hàng |

**Responses**:

- **200**: OK
  - Data Schema: Array<[ClaimTokenRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoclaimtokenres)>
    **Properties**:
    - `brandCustomerId` (string)
    - `consumedAt` (string)
    - `createdAt` (string)
    - `expiresAt` (string)
    - `id` (string)
    - `revokedAt` (string)
    - `revokedByUserId` (string)
    - `revokedReason` (string)
    - `status` (string)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/customers/{customerId}/claim-tokens/{claimId}/revoke`

**Summary**: Thu hồi mã claim của khách hàng offline

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID của Brand |
| `customerId` | path | string | Yes | ID của khách hàng |
| `claimId` | path | string | Yes | ID của mã claim |

**Request Body**:

Thông tin thu hồi

- Schema: [RevokeClaimTokenReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtorevokeclaimtokenreq)
    **Properties**:
    - `reason` (string)

**Responses**:

- **200**: OK
  - Data Schema: [ClaimTokenRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoclaimtokenres)
    **Properties**:
    - `brandCustomerId` (string)
    - `consumedAt` (string)
    - `createdAt` (string)
    - `expiresAt` (string)
    - `id` (string)
    - `revokedAt` (string)
    - `revokedByUserId` (string)
    - `revokedReason` (string)
    - `status` (string)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/loyalty/accounts/{accountId}/lots`

**Summary**: Lấy danh sách lô điểm của loyalty account

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `accountId` | path | string | Yes | ID loyalty account |
| `status` | query | string | No | Trạng thái lô điểm |
| `expiresAt` | query | string | No | Ngày hết hạn tối đa |
| `page` | query | integer | No | Trang |
| `limit` | query | integer | No | Số lượng |

**Responses**:

- **200**: OK
  - Data Schema: Array<[LoyaltyPointLotRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltypointlotres)>
    **Properties**:
    - `createdAt` (string)
    - `earnTransactionId` (string)
    - `earnedPoints` (integer)
    - `expiresAt` (string)
    - `id` (string)
    - `remainingPoints` (integer)
    - `status` (string)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/loyalty/accounts/{accountId}/transactions`

**Summary**: Lấy lịch sử điểm của loyalty account

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `page` | query | integer | No | Trang hiện tại (mặc định: 1) |
| `limit` | query | integer | No | Số lượng bản ghi trên mỗi trang (mặc định: 20) |
| `brandId` | path | string | Yes | ID brand |
| `accountId` | path | string | Yes | ID loyalty account |

**Responses**:

- **200**: OK
  - Data Schema: [LoyaltyTransactionListRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltytransactionlistres)
    **Properties**:
    - `items` (Array<LoyaltyPointTransactionDetailRes>)
    - `metadata` (ref: PaginationMetadata)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/loyalty/points`

**Summary**: Ghi nhận cộng/trừ điểm loyalty cho brand customer

**Description**: API thống nhất để brand staff ghi nhận điểm bằng userId, phone hoặc externalCustomerCode

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Request Body**:

Thông tin giao dịch điểm

- Schema: [GrantLoyaltyPointsReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtograntloyaltypointsreq)
    **Properties**:
    - `customerName` (string)
    - `externalCustomerCode` (string)
    - `idempotencyKey` (string)
    - `phone` (string)
    - `pointsDelta` (integer)
    - `purchaseAmount` (number)
    - `reason` (string)
    - `referenceId` (string)
    - `referenceType` (string)
    - `transactionType` (ref: LoyaltyTransactionType) **(Required)**
    - `userId` (string)

**Responses**:

- **201**: Created
  - Data Schema: [LoyaltyPointsTransactionRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltypointstransactionres)
    **Properties**:
    - `balanceAfter` (integer)
    - `brandCustomerId` (string)
    - `brandId` (string)
    - `currentTier` (ref: LoyaltyTierBriefRes)
    - `customerStatus` (ref: BrandCustomerStatus)
    - `pointsDelta` (integer)
    - `totalSpend` (number)
    - `transactionId` (string)
    - `userId` (string)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/loyalty/program`

**Summary**: Lấy chương trình loyalty hoạt động của brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: [LoyaltyProgramRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltyprogramres)
    **Properties**:
    - `amountPerPoint` (number)
    - `brandId` (string)
    - `createdAt` (string)
    - `id` (string)
    - `isActive` (boolean)
    - `name` (string)
    - `pointExpiryDays` (integer)
    - `roundingMode` (string)
    - `updatedAt` (string)

---

### `PUT` `/api/v1/brand-portal/brands/{brandId}/loyalty/program`

**Summary**: Tạo/Cập nhật chương trình loyalty (Owner)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Request Body**:

Thông tin cấu hình

- Schema: [UpsertLoyaltyProgramReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtoupsertloyaltyprogramreq)
    **Properties**:
    - `amountPerPoint` (number) **(Required)**
    - `isActive` (boolean)
    - `name` (string) **(Required)**
    - `pointExpiryDays` (integer)
    - `roundingMode` (object) **(Required)**

**Responses**:

- **200**: OK
  - Data Schema: [LoyaltyProgramRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltyprogramres)
    **Properties**:
    - `amountPerPoint` (number)
    - `brandId` (string)
    - `createdAt` (string)
    - `id` (string)
    - `isActive` (boolean)
    - `name` (string)
    - `pointExpiryDays` (integer)
    - `roundingMode` (string)
    - `updatedAt` (string)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/loyalty/tiers`

**Summary**: Lấy danh sách hạng loyalty của brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: Array<[LoyaltyTierRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltytierres)>
    **Properties**:
    - `brandId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `id` (string)
    - `minTotalSpend` (number)
    - `name` (string)
    - `rank` (integer)
    - `updatedAt` (string)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/loyalty/tiers`

**Summary**: Tạo hạng thành viên cho brand (Owner)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Request Body**:

Thông tin hạng thành viên

- Schema: [CreateLoyaltyTierReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtocreateloyaltytierreq)
    **Properties**:
    - `description` (string)
    - `minTotalSpend` (number) **(Required)**
    - `name` (string) **(Required)**
    - `rank` (integer) **(Required)**

**Responses**:

- **201**: Created
  - Data Schema: [LoyaltyTierRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltytierres)
    **Properties**:
    - `brandId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `id` (string)
    - `minTotalSpend` (number)
    - `name` (string)
    - `rank` (integer)
    - `updatedAt` (string)

---

### `PUT` `/api/v1/brand-portal/brands/{brandId}/loyalty/tiers/{tierId}`

**Summary**: Cập nhật hạng thành viên (Owner)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `tierId` | path | string | Yes | ID hạng thành viên |

**Request Body**:

Thông tin cập nhật hạng thành viên

- Schema: [UpdateLoyaltyTierReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtoupdateloyaltytierreq)
    **Properties**:
    - `description` (string)
    - `minTotalSpend` (number)
    - `name` (string)
    - `rank` (integer)

**Responses**:

- **200**: OK
  - Data Schema: [LoyaltyTierRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltytierres)
    **Properties**:
    - `brandId` (string)
    - `createdAt` (string)
    - `description` (string)
    - `id` (string)
    - `minTotalSpend` (number)
    - `name` (string)
    - `rank` (integer)
    - `updatedAt` (string)

---

### `POST` `/api/v1/brands/claim`

**Summary**: Liên kết tài khoản khách hàng offline

**Description**: Người dùng nhập mã claim nhận được để liên kết hồ sơ mua hàng offline của họ với tài khoản online.

**Request Body**:

Mã claim

- Schema: [ClaimOfflineAccountReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtoclaimofflineaccountreq)
    **Properties**:
    - `claimToken` (string) **(Required)**

**Responses**:

- **200**: OK
  - Data Schema: [BrandCustomerRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandcustomerres)
    **Properties**:
    - `brandId` (string)
    - `claimedAt` (string)
    - `createdAt` (string)
    - `createdByMemberId` (string)
    - `customerName` (string)
    - `externalCustomerCode` (string)
    - `id` (string)
    - `joinedAt` (string)
    - `joinedSource` (ref: BrandCustomerJoinedSource)
    - `loyaltyAccount` (ref: CustomerLoyaltyAccountRes)
    - `phoneE164` (string)
    - `status` (ref: BrandCustomerStatus)
    - `updatedAt` (string)
    - `user` (ref: BrandCustomerUserRes)

---

### `POST` `/api/v1/brands/{brandId}/join-loyalty`

**Summary**: Tham gia chương trình khách hàng thân thiết

**Description**: Đăng ký người dùng hiện tại tham gia chương trình loyalty của brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **201**: Created
  - Data Schema: [BrandCustomerRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandcustomerres)
    **Properties**:
    - `brandId` (string)
    - `claimedAt` (string)
    - `createdAt` (string)
    - `createdByMemberId` (string)
    - `customerName` (string)
    - `externalCustomerCode` (string)
    - `id` (string)
    - `joinedAt` (string)
    - `joinedSource` (ref: BrandCustomerJoinedSource)
    - `loyaltyAccount` (ref: CustomerLoyaltyAccountRes)
    - `phoneE164` (string)
    - `status` (ref: BrandCustomerStatus)
    - `updatedAt` (string)
    - `user` (ref: BrandCustomerUserRes)

---

### `GET` `/api/v1/me/brand-loyalties`

**Summary**: Lấy danh sách loyalty brand của tôi

**Responses**:

- **200**: OK
  - Data Schema: Array<[BrandLoyaltyRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandloyaltyres)>
    **Properties**:
    - `brand` (ref: BrandRes)
    - `brandCustomerId` (string)
    - `brandId` (string)
    - `currentPoints` (integer)
    - `currentTier` (ref: LoyaltyTierBriefRes)
    - `lifetimePoints` (integer)
    - `loyaltyAccountId` (string)
    - `nearestExpiringPointLot` (ref: LoyaltyPointLotRes)
    - `totalSpend` (number)

---

### `GET` `/api/v1/me/brand-loyalties/{brandId}`

**Summary**: Lấy chi tiết điểm loyalty của tôi theo brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: [BrandLoyaltyRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandloyaltyres)
    **Properties**:
    - `brand` (ref: BrandRes)
    - `brandCustomerId` (string)
    - `brandId` (string)
    - `currentPoints` (integer)
    - `currentTier` (ref: LoyaltyTierBriefRes)
    - `lifetimePoints` (integer)
    - `loyaltyAccountId` (string)
    - `nearestExpiringPointLot` (ref: LoyaltyPointLotRes)
    - `totalSpend` (number)

---

### `GET` `/api/v1/me/brand-loyalties/{brandId}/lots`

**Summary**: Lấy danh sách lô điểm loyalty của tôi theo brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `status` | query | string | No | Trạng thái lô điểm |
| `expiresAt` | query | string | No | Ngày hết hạn tối đa |
| `page` | query | integer | No | Trang |
| `limit` | query | integer | No | Số lượng |

**Responses**:

- **200**: OK
  - Data Schema: Array<[LoyaltyPointLotRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltypointlotres)>
    **Properties**:
    - `createdAt` (string)
    - `earnTransactionId` (string)
    - `earnedPoints` (integer)
    - `expiresAt` (string)
    - `id` (string)
    - `remainingPoints` (integer)
    - `status` (string)

---

### `GET` `/api/v1/me/brand-loyalties/{brandId}/transactions`

**Summary**: Lấy lịch sử điểm loyalty của tôi theo brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: Array<[LoyaltyPointTransactionDetailRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltypointtransactiondetailres)>
    **Properties**:
    - `balanceAfter` (integer)
    - `brandCustomerId` (string)
    - `brandId` (string)
    - `createdAt` (string)
    - `createdByUserId` (string)
    - `expiresAt` (string)
    - `id` (string)
    - `idempotencyKey` (string)
    - `loyaltyAccountId` (string)
    - `pointsDelta` (integer)
    - `reason` (string)
    - `referenceId` (string)
    - `referenceType` (string)
    - `spendAmount` (number)
    - `transactionType` (string)
    - `userId` (string)

---

## Brand Item

### `GET` `/api/v1/brand-portal/brands/{brandId}/items`

**Summary**: [Staff] Lấy danh sách sản phẩm hoặc mẫu thử của Brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: Array<[BrandItemRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemres)>
    **Properties**:
    - `brandId` (string)
    - `brandName` (string)
    - `createdAt` (string)
    - `description` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `fashionItemId` (string)
    - `id` (string)
    - `itemType` (ref: BrandItemType)
    - `name` (string)
    - `price` (number)
    - `productCode` (string)
    - `status` (ref: BrandItemStatus)
    - `taskId` (string)
    - `updatedAt` (string)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/items`

**Summary**: [Staff] Tạo sản phẩm hoặc mẫu thử của Brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Request Body**:

Thông tin sản phẩm

- Schema: [CreateBrandItemReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtocreatebranditemreq)
    **Properties**:
    - `categoryId` (string)
    - `description` (string)
    - `imagePublicId` (string) **(Required)**
    - `imageUrl` (string) **(Required)**
    - `itemType` (string) **(Required)**
    - `name` (string) **(Required)**
    - `price` (number)
    - `productCode` (string)
    - `status` (string)

**Responses**:

- **202**: Accepted
  - Data Schema: [BrandItemRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemres)
    **Properties**:
    - `brandId` (string)
    - `brandName` (string)
    - `createdAt` (string)
    - `description` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `fashionItemId` (string)
    - `id` (string)
    - `itemType` (ref: BrandItemType)
    - `name` (string)
    - `price` (number)
    - `productCode` (string)
    - `status` (ref: BrandItemStatus)
    - `taskId` (string)
    - `updatedAt` (string)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/items/tasks/{taskId}/sse`

**Summary**: Đăng ký nhận thông báo realtime cho Brand Item Task ID qua SSE

**Description**: Mở kết nối SSE để lắng nghe các cập nhật trạng thái phân tích ảnh của Brand Item Task ID

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `taskId` | path | string | Yes | Mã Task ID |

**Responses**:


---

### `GET` `/api/v1/brand-portal/brands/{brandId}/items/upload-signature`

**Summary**: Lấy chữ ký upload ảnh sản phẩm brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: [UploadSignatureResult](#smart-wardrobe-beinternalmodulesbrandapplicationdtouploadsignatureresult)
    **Properties**:
    - `apiKey` (string)
    - `folder` (string)
    - `publicId` (string)
    - `signature` (string)
    - `timestamp` (integer)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/items/{itemId}`

**Summary**: Lấy chi tiết sản phẩm brand cho staff

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `itemId` | path | string | Yes | ID item |

**Responses**:

- **200**: OK
  - Data Schema: [BrandItemRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemres)
    **Properties**:
    - `brandId` (string)
    - `brandName` (string)
    - `createdAt` (string)
    - `description` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `fashionItemId` (string)
    - `id` (string)
    - `itemType` (ref: BrandItemType)
    - `name` (string)
    - `price` (number)
    - `productCode` (string)
    - `status` (ref: BrandItemStatus)
    - `taskId` (string)
    - `updatedAt` (string)

---

### `PUT` `/api/v1/brand-portal/brands/{brandId}/items/{itemId}`

**Summary**: [Staff] Cập nhật sản phẩm hoặc mẫu thử của Brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `itemId` | path | string | Yes | ID sản phẩm |

**Request Body**:

Thông tin cập nhật

- Schema: [UpdateBrandItemReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtoupdatebranditemreq)
    **Properties**:
    - `description` (string)
    - `name` (string) **(Required)**
    - `price` (number)
    - `productCode` (string)
    - `status` (string) **(Required)**

**Responses**:

- **200**: OK
  - Data Schema: [BrandItemRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemres)
    **Properties**:
    - `brandId` (string)
    - `brandName` (string)
    - `createdAt` (string)
    - `description` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `fashionItemId` (string)
    - `id` (string)
    - `itemType` (ref: BrandItemType)
    - `name` (string)
    - `price` (number)
    - `productCode` (string)
    - `status` (ref: BrandItemStatus)
    - `taskId` (string)
    - `updatedAt` (string)

---

### `GET` `/api/v1/brand-portal/brands/{brandId}/items/{itemId}/feedbacks`

**Summary**: [Staff] Lấy phản hồi/đóng góp ý kiến mẫu thử kỹ thuật số

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `itemId` | path | string | Yes | ID sản phẩm mẫu thử |

**Responses**:

- **200**: OK
  - Data Schema: Array<[DigitalSampleResponseRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtodigitalsampleresponseres)>
    **Properties**:
    - `brandItemId` (string)
    - `createdAt` (string)
    - `feedbackText` (string)
    - `id` (string)
    - `outfitId` (string)
    - `rating` (integer)
    - `userId` (string)
    - `voteType` (string)

---

### `PATCH` `/api/v1/brand-portal/brands/{brandId}/items/{itemId}/status`

**Summary**: Cập nhật trạng thái sản phẩm brand

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |
| `itemId` | path | string | Yes | ID item |

**Request Body**:

Trang thai moi

- Schema: [UpdateBrandItemStatusReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtoupdatebranditemstatusreq)
    **Properties**:
    - `status` (ref: BrandItemStatus) **(Required)**

**Responses**:

- **200**: OK
  - Data Schema: [BrandItemRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemres)
    **Properties**:
    - `brandId` (string)
    - `brandName` (string)
    - `createdAt` (string)
    - `description` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `fashionItemId` (string)
    - `id` (string)
    - `itemType` (ref: BrandItemType)
    - `name` (string)
    - `price` (number)
    - `productCode` (string)
    - `status` (ref: BrandItemStatus)
    - `taskId` (string)
    - `updatedAt` (string)

---

## Brand Member

### `GET` `/api/v1/brand-portal/brands/{brandId}/members`

**Summary**: Lấy danh sách thành viên của brand

**Description**: Lấy danh sách tất cả các thành viên trực thuộc brand này

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Responses**:

- **200**: OK
  - Data Schema: Array<[BrandMemberRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandmemberres)>
    **Properties**:
    - `brandId` (string)
    - `createdAt` (string)
    - `id` (string)
    - `role` (ref: BrandMemberRole)
    - `status` (ref: BrandMemberStatus)
    - `updatedAt` (string)
    - `userId` (string)

---

### `POST` `/api/v1/brand-portal/brands/{brandId}/members`

**Summary**: Thêm thành viên vào brand

**Description**: Cho phép owner thêm nhiều thành viên với vai trò staff bằng email hoặc tên đăng nhập. API này không tạo owner mới.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | path | string | Yes | ID brand |

**Request Body**:

Danh sách thành viên cần thêm

- Schema: [AddBrandMembersReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtoaddbrandmembersreq)
    **Properties**:
    - `members` (Array<AddBrandMemberItemReq>) **(Required)**

**Responses**:

- **201**: Created
  - Data Schema: [AddBrandMembersRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoaddbrandmembersres)
    **Properties**:
    - `created` (Array<AddBrandMemberItemResult>)
    - `failed` (Array<AddBrandMemberItemResult>)
    - `updated` (Array<AddBrandMemberItemResult>)

---

## Dashboard Brand

### `GET` `/api/v1/brand/dashboard/benefits/redemption-analytics`

**Summary**: Thống kê đổi benefit

**Description**: Thống kê top benefit được đổi nhiều nhất và xu hướng đổi benefit theo thời gian

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | query | string | Yes | ID Nhãn hàng |

**Responses**:

- **200**: Lấy thống kê đổi benefit thành công
  - Data Schema: [BenefitRedemptionAnalyticsRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtobenefitredemptionanalyticsres)
    **Properties**:
    - `brandId` (string)
    - `topBenefits` (Array<BenefitRedemptionDTO>)
    - `totalRedemptions` (integer)
    - `trend` (Array<RedemptionTrendDTO>)

---

### `GET` `/api/v1/brand/dashboard/customers/acquisition`

**Summary**: Thống kê kênh thu hút khách hàng

**Description**: Thống kê số lượng khách hàng và tỷ lệ phần trăm theo từng kênh thu hút (joined_source)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | query | string | Yes | ID Nhãn hàng |

**Responses**:

- **200**: Lấy thống kê kênh thu hút khách hàng thành công
  - Data Schema: [CustomerAcquisitionRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtocustomeracquisitionres)
    **Properties**:
    - `brandId` (string)
    - `sources` (Array<CustomerAcquisitionDTO>)
    - `totalCustomers` (integer)

---

### `GET` `/api/v1/brand/dashboard/customers/spend-segmentation`

**Summary**: Phân khúc chi tiêu khách hàng

**Description**: Thống kê số lượng khách hàng theo các nhóm chi tiêu (low, medium, high, premium)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | query | string | Yes | ID Nhãn hàng |

**Responses**:

- **200**: Lấy phân khúc chi tiêu thành công
  - Data Schema: [SpendSegmentationRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtospendsegmentationres)
    **Properties**:
    - `brandId` (string)
    - `segments` (Array<SpendSegmentDTO>)
    - `totalCustomers` (integer)

---

### `GET` `/api/v1/brand/dashboard/drilldown/sample-lab-feedbacks`

**Summary**: Truy vết chi tiết đánh giá mẫu thử 3D (Drill-down Brand)

**Description**: Lấy danh sách phân trang chi tiết các nhận xét và lượt bình chọn của mẫu thử sản phẩm.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `itemId` | query | string | Yes | ID Sản phẩm mẫu thử |
| `page` | query | integer | No | Số trang |
| `limit` | query | integer | No | Số lượng phần tử mỗi trang |

**Responses**:

- **200**: Lấy chi tiết đánh giá mẫu thử thành công
  - Data Schema: [DrillDownSampleFeedbackListRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtodrilldownsamplefeedbacklistres)
    **Properties**:
    - `items` (Array<DrillDownSampleFeedbackDTO>)
    - `metadata` (ref: PaginationMetadata)

---

### `GET` `/api/v1/brand/dashboard/financials/points-liability`

**Summary**: Phân tích nợ điểm hết hạn trong 30 ngày (Column-Level RBAC)

**Description**: Thống kê số điểm hết hạn trong 30 ngày tới & giá trị quy đổi VND tương ứng. Giá trị VND sẽ bị ẩn (redacted) đối với tài khoản cấp Staff.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | query | string | Yes | ID Nhãn hàng |

**Responses**:

- **200**: Lấy báo cáo nghĩa vụ điểm quy đổi thành công
  - Data Schema: [BrandPointsLiabilityRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtobrandpointsliabilityres)
    **Properties**:
    - `brandId` (string)
    - `pointsExpiring30d` (integer)
    - `pointsLiabilityValueVnd` (number)

---

### `GET` `/api/v1/brand/dashboard/kpi-cards`

**Summary**: Lấy thẻ KPI tổng quan B2B Brand Portal

**Description**: Lấy thống kê số hội viên, điểm phát hành, điểm quy đổi, số voucher active/quy đổi của nhãn hàng.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | query | string | Yes | ID Nhãn hàng |

**Responses**:

- **200**: Lấy thẻ KPI nhãn hàng thành công
  - Data Schema: [BrandKPICardsRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtobrandkpicardsres)
    **Properties**:
    - `activeVouchers` (integer)
    - `brandId` (string)
    - `csFirstResponseAvgSeconds` (integer)
    - `digitalSampleAvgRating` (number)
    - `digitalSampleVotesCount` (integer)
    - `openCsTickets` (integer)
    - `pointsIssued` (integer)
    - `pointsRedeemed` (integer)
    - `totalMembers` (integer)
    - `updatedAt` (string)
    - `vouchersRedeemed` (integer)

---

### `GET` `/api/v1/brand/dashboard/loyalty/point-expiry-forecast`

**Summary**: Dự báo điểm loyalty sắp hết hạn

**Description**: Dự báo số điểm sắp hết hạn theo từng tháng dựa trên dữ liệu loyalty_point_lots

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | query | string | Yes | ID Nhãn hàng |

**Responses**:

- **200**: Lấy dự báo điểm hết hạn thành công
  - Data Schema: [PointExpiryForecastRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtopointexpiryforecastres)
    **Properties**:
    - `brandId` (string)
    - `forecast` (Array<PointExpiryForecastDTO>)

---

### `GET` `/api/v1/brand/dashboard/loyalty/tier-distribution`

**Summary**: Phân bổ hạng loyalty thành viên

**Description**: Thống kê số lượng thành viên theo từng hạng loyalty (Bronze, Silver, Gold, v.v.)

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | query | string | Yes | ID Nhãn hàng |

**Responses**:

- **200**: Lấy phân bổ hạng loyalty thành công
  - Data Schema: [TierDistributionRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtotierdistributionres)
    **Properties**:
    - `brandId` (string)
    - `tiers` (Array<TierDistributionDTO>)
    - `totalMembers` (integer)

---

### `GET` `/api/v1/brand/dashboard/operations/catalog-stats`

**Summary**: Thống kê catalog sản phẩm

**Description**: Thống kê tổng số sản phẩm trong catalog, phân bổ theo trạng thái và loại sản phẩm

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | query | string | Yes | ID Nhãn hàng |

**Responses**:

- **200**: Lấy thống kê catalog thành công
  - Data Schema: [CatalogStatsRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtocatalogstatsres)
    **Properties**:
    - `brandId` (string)
    - `byStatus` (Array<CatalogStatGroupDTO>)
    - `byType` (Array<CatalogStatGroupDTO>)
    - `totalItems` (integer)

---

### `GET` `/api/v1/brand/dashboard/operations/digital-sample-lab/{itemId}`

**Summary**: Phân tích đánh giá mẫu thử Digital Sample Lab

**Description**: Thống kê số lượt bình chọn, rating trung bình, sentiment phản hồi và danh sách danh mục trang phục thường phối kèm nhiều nhất.

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `brandId` | query | string | Yes | ID Nhãn hàng |
| `itemId` | path | string | Yes | ID Sản phẩm mẫu thử |

**Responses**:

- **200**: Lấy phân tích mẫu thử thành công
  - Data Schema: [DigitalSampleLabAnalyticsRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtodigitalsamplelabanalyticsres)
    **Properties**:
    - `avgRating` (number)
    - `feedbackSentiment` (ref: FeedbackSentiment)
    - `itemId` (string)
    - `topPairedCategories` (Array<PairedCategoryStat>)
    - `votesCount` (integer)

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
    - `sortOrder` (integer)

---

## Dashboard Analytics

### `POST` `/api/v1/dashboard/analytics/query`

**Summary**: Truy vấn tổng hợp linh hoạt đa chiều (Dynamic Query Engine)

**Description**: Gửi các chỉ số (metrics), khoảng thời gian (timeframe), độ mịn (granularity) và bộ lọc để nhận dữ liệu Time-Series linh hoạt. Kiểm tra quyền truy cập theo TargetDashboard.

**Request Body**:

Thông số truy vấn động

- Schema: [DynamicQueryReq](#smart-wardrobe-beinternalmodulesdashboardapplicationdtodynamicqueryreq)
    **Properties**:
    - `brandId` (string)
    - `compareWithPrevious` (boolean)
    - `granularity` (object) - "day" | "week" | "month" | "year"
    - `metrics` (Array<MetricKey>)
    - `targetDashboard` (object) - "admin" | "brand" | "user"
    - `timeframe` (ref: DynamicQueryTimeframeDTO)

**Responses**:

- **200**: Truy vấn dữ liệu tổng hợp thành công
  - Data Schema: [DynamicQueryRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtodynamicqueryres)
    **Properties**:
    - `comparison` (ref: ComparisonDTO)
    - `granularity` (ref: Granularity)
    - `series` (Array<TimeSeriesPointDTO>)
    - `targetDashboard` (ref: TargetDashboard)

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

## Dashboard User

### `GET` `/api/v1/me/dashboard/wardrobe-insights`

**Summary**: Thống kê phân tích tủ đồ cá nhân

**Description**: Lấy tổng giá trị tài chính tủ đồ, giá trị trung bình mỗi món đồ (tổng giá trị / số món), tổng số đồ lãng phí chưa mặc > 30 ngày và danh sách đề xuất.

**Responses**:

- **200**: Lấy phân tích tủ đồ cá nhân thành công
  - Data Schema: [UserWardrobeInsightsRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtouserwardrobeinsightsres)
    **Properties**:
    - `expiringVouchersCount` (integer)
    - `totalItems` (integer)
    - `totalWardrobeValueVnd` (number)
    - `underutilizedItems` (Array<UnderutilizedItemDTO>)
    - `underutilizedItemsCount` (integer)

---

### `GET` `/api/v1/me/dashboard/wardrobe/category-distribution`

**Summary**: Phân bổ danh mục tủ đồ

**Description**: Thống kê số lượng và tỷ lệ phần trăm item trong tủ đồ theo từng danh mục thời trang

**Responses**:

- **200**: Lấy phân bổ danh mục tủ đồ thành công
  - Data Schema: [WardrobeCategoryDistributionRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtowardrobecategorydistributionres)
    **Properties**:
    - `categories` (Array<CategoryDistributionDTO>)
    - `totalItems` (integer)

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

### `GET` `/api/v1/me/wardrobe-items/stats`

**Summary**: Lấy số liệu thống kê tủ đồ

**Description**: Trả về số lượng active items và outfits đã lưu của user

**Responses**:

- **200**: Lấy số liệu thống kê tủ đồ thành công
  - Schema: [APIResponse](#smart-wardrobe-beinternalsharedpresentationapiresponse)
    **Properties**:
    - `data` (object)
    - `message` (string)

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

- **202**: Danh sách trang phục đang được xử lý ngầm với Task ID
  - Data Schema: Array<[WardrobeItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobeitemres)>
    **Properties**:
    - `brandItem` (ref: BrandItemBriefRes)
    - `createdAt` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `id` (string)
    - `isDeleted` (boolean)
    - `isLocked` (boolean)
    - `itemContext` (string)
    - `lastUsedAt` (string)
    - `price` (number)
    - `status` (ref: WardrobeItemStatus)
    - `taskId` (string)
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
    - `brandItem` (ref: BrandItemBriefRes)
    - `createdAt` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `id` (string)
    - `isDeleted` (boolean)
    - `isLocked` (boolean)
    - `itemContext` (string)
    - `lastUsedAt` (string)
    - `price` (number)
    - `status` (ref: WardrobeItemStatus)
    - `taskId` (string)
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

### `GET` `/api/v1/wardrobe-items/tasks/{taskId}/sse`

**Summary**: Đăng ký nhận thông báo realtime cho Task ID qua SSE

**Description**: Mở kết nối SSE để lắng nghe các cập nhật trạng thái phân tích ảnh của Task ID

**Request Parameters**:

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `taskId` | path | string | Yes | Mã Task ID |

**Responses**:


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
    - `brandItem` (ref: BrandItemBriefRes)
    - `createdAt` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `id` (string)
    - `isDeleted` (boolean)
    - `isLocked` (boolean)
    - `itemContext` (string)
    - `lastUsedAt` (string)
    - `price` (number)
    - `status` (ref: WardrobeItemStatus)
    - `taskId` (string)
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
    - `brandItem` (ref: BrandItemBriefRes)
    - `createdAt` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `id` (string)
    - `isDeleted` (boolean)
    - `isLocked` (boolean)
    - `itemContext` (string)
    - `lastUsedAt` (string)
    - `price` (number)
    - `status` (ref: WardrobeItemStatus)
    - `taskId` (string)
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
    - `brandItem` (ref: BrandItemBriefRes)
    - `createdAt` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `id` (string)
    - `isDeleted` (boolean)
    - `isLocked` (boolean)
    - `itemContext` (string)
    - `lastUsedAt` (string)
    - `price` (number)
    - `status` (ref: WardrobeItemStatus)
    - `taskId` (string)
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
    - `brandItem` (ref: BrandItemBriefRes)
    - `createdAt` (string)
    - `fashionItem` (ref: FashionItemRes)
    - `id` (string)
    - `isDeleted` (boolean)
    - `isLocked` (boolean)
    - `itemContext` (string)
    - `lastUsedAt` (string)
    - `price` (number)
    - `status` (ref: WardrobeItemStatus)
    - `taskId` (string)
    - `userId` (string)

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
  - Data Schema: [UserSubscriptionOverviewDTO](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtousersubscriptionoverviewdto)
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
  - Data Schema: [UserSubscriptionDTO](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtousersubscriptiondto)
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

## Models (Definitions)

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoaddbrandmemberitemreq"></a>`AddBrandMemberItemReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `emailOrUsername` | string | Yes |  |
| `role` | [BrandMemberRole](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandmemberrolebrandmemberrole) | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoaddbrandmemberitemresult"></a>`AddBrandMemberItemResult`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `emailOrUsername` | string | No |  |
| `member` | [BrandMemberRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandmemberres) | No |  |
| `message` | string | No |  |
| `reasonCode` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoaddbrandmembersreq"></a>`AddBrandMembersReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `members` | Array<[AddBrandMemberItemReq](#smart-wardrobe-beinternalmodulesbrandapplicationdtoaddbrandmemberitemreq)> | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoaddbrandmembersres"></a>`AddBrandMembersRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `created` | Array<[AddBrandMemberItemResult](#smart-wardrobe-beinternalmodulesbrandapplicationdtoaddbrandmemberitemresult)> | No |  |
| `failed` | Array<[AddBrandMemberItemResult](#smart-wardrobe-beinternalmodulesbrandapplicationdtoaddbrandmemberitemresult)> | No |  |
| `updated` | Array<[AddBrandMemberItemResult](#smart-wardrobe-beinternalmodulesbrandapplicationdtoaddbrandmemberitemresult)> | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoadminbrandlistres"></a>`AdminBrandListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[BrandRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobenefitredemptionres"></a>`BenefitRedemptionRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `benefitId` | string | No |  |
| `brandCustomerId` | string | No |  |
| `brandId` | string | No |  |
| `createdAt` | string | No |  |
| `expiresAt` | string | No |  |
| `id` | string | No |  |
| `pointsSpent` | integer | No |  |
| `redeemedAt` | string | No |  |
| `status` | string | No |  |
| `updatedAt` | string | No |  |
| `usedAt` | string | No |  |
| `userId` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandbenefitres"></a>`BrandBenefitRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `benefitType` | string | No |  |
| `brandId` | string | No |  |
| `createdAt` | string | No |  |
| `description` | string | No |  |
| `featureCode` | string | No |  |
| `featureConfig` | object | No |  |
| `id` | string | No |  |
| `name` | string | No |  |
| `requiredPoints` | integer | No |  |
| `requiredTierId` | string | No |  |
| `requiredTierName` | string | No |  |
| `status` | string | No |  |
| `unlockType` | string | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationdetailres"></a>`BrandConversationDetailRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `createdAt` | string | No |  |
| `customerId` | string | No |  |
| `customerName` | string | No |  |
| `id` | string | No |  |
| `lastMessageAt` | string | No |  |
| `messages` | Array<[BrandConversationMessageRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationmessageres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |
| `staffLastReadAt` | string | No |  |
| `staffUnreadCount` | integer | No |  |
| `status` | string | No |  |
| `updatedAt` | string | No |  |
| `userDisplayName` | string | No |  |
| `userId` | string | No |  |
| `userLastReadAt` | string | No |  |
| `userUnreadCount` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationmessagelistres"></a>`BrandConversationMessageListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[BrandConversationMessageRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationmessageres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationmessageres"></a>`BrandConversationMessageRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `conversationId` | string | No |  |
| `createdAt` | string | No |  |
| `id` | string | No |  |
| `message` | string | No |  |
| `senderRole` | string | No |  |
| `senderUserId` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandconversationres"></a>`BrandConversationRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `createdAt` | string | No |  |
| `customerId` | string | No |  |
| `customerName` | string | No |  |
| `id` | string | No |  |
| `lastMessageAt` | string | No |  |
| `staffLastReadAt` | string | No |  |
| `staffUnreadCount` | integer | No |  |
| `status` | string | No |  |
| `updatedAt` | string | No |  |
| `userDisplayName` | string | No |  |
| `userId` | string | No |  |
| `userLastReadAt` | string | No |  |
| `userUnreadCount` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandcustomerlistres"></a>`BrandCustomerListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[BrandCustomerRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandcustomerres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandcustomerres"></a>`BrandCustomerRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `claimedAt` | string | No |  |
| `createdAt` | string | No |  |
| `createdByMemberId` | string | No |  |
| `customerName` | string | No |  |
| `externalCustomerCode` | string | No |  |
| `id` | string | No |  |
| `joinedAt` | string | No |  |
| `joinedSource` | [BrandCustomerJoinedSource](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandcustomerjoinedsourcebrandcustomerjoinedsource) | No |  |
| `loyaltyAccount` | [CustomerLoyaltyAccountRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtocustomerloyaltyaccountres) | No |  |
| `phoneE164` | string | No |  |
| `status` | [BrandCustomerStatus](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandcustomerstatusbrandcustomerstatus) | No |  |
| `updatedAt` | string | No |  |
| `user` | [BrandCustomerUserRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandcustomeruserres) | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandcustomeruserres"></a>`BrandCustomerUserRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `avatarUrl` | string | No |  |
| `firstName` | string | No |  |
| `gender` | [Gender](#smart-wardrobe-beinternalshareddomainconstantssharedgendergender) | No |  |
| `id` | string | No |  |
| `lastName` | string | No |  |
| `username` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemlistres"></a>`BrandItemListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[BrandItemRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobranditemres"></a>`BrandItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `brandName` | string | No |  |
| `createdAt` | string | No |  |
| `description` | string | No |  |
| `fashionItem` | [FashionItemRes](#smart-wardrobe-beinternalmodulesfashionapplicationdtofashionitemres) | No |  |
| `fashionItemId` | string | No |  |
| `id` | string | No |  |
| `itemType` | [BrandItemType](#smart-wardrobe-beinternalmodulesbranddomainconstantsbranditembranditemtypebranditemtype) | No |  |
| `name` | string | No |  |
| `price` | number | No |  |
| `productCode` | string | No |  |
| `status` | [BrandItemStatus](#smart-wardrobe-beinternalmodulesbranddomainconstantsbranditembranditemstatusbranditemstatus) | No |  |
| `taskId` | string | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandloyaltyres"></a>`BrandLoyaltyRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brand` | [BrandRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandres) | No |  |
| `brandCustomerId` | string | No |  |
| `brandId` | string | No |  |
| `currentPoints` | integer | No |  |
| `currentTier` | [LoyaltyTierBriefRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltytierbriefres) | No |  |
| `lifetimePoints` | integer | No |  |
| `loyaltyAccountId` | string | No |  |
| `nearestExpiringPointLot` | [LoyaltyPointLotRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltypointlotres) | No |  |
| `totalSpend` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandmemberres"></a>`BrandMemberRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `createdAt` | string | No |  |
| `id` | string | No |  |
| `role` | [BrandMemberRole](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandmemberrolebrandmemberrole) | No |  |
| `status` | [BrandMemberStatus](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandmemberstatusbrandmemberstatus) | No |  |
| `updatedAt` | string | No |  |
| `userId` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtobrandres"></a>`BrandRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `approvedAt` | string | No |  |
| `approvedByUserId` | string | No |  |
| `backgroundUrl` | string | No |  |
| `createdAt` | string | No |  |
| `createdByUserId` | string | No |  |
| `description` | string | No |  |
| `id` | string | No |  |
| `logoUrl` | string | No |  |
| `name` | string | No |  |
| `slug` | string | No |  |
| `status` | [BrandStatus](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandstatusbrandstatus) | No |  |
| `totalCustomer` | integer | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoclaimofflineaccountreq"></a>`ClaimOfflineAccountReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `claimToken` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoclaimtokenres"></a>`ClaimTokenRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandCustomerId` | string | No |  |
| `consumedAt` | string | No |  |
| `createdAt` | string | No |  |
| `expiresAt` | string | No |  |
| `id` | string | No |  |
| `revokedAt` | string | No |  |
| `revokedByUserId` | string | No |  |
| `revokedReason` | string | No |  |
| `status` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtocreatebrandbenefitreq"></a>`CreateBrandBenefitReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `benefitType` | string | Yes |  |
| `description` | string | No |  |
| `featureCode` | string | No |  |
| `featureConfig` | object | No |  |
| `name` | string | Yes |  |
| `requiredPoints` | integer | No |  |
| `requiredTierId` | string | No |  |
| `unlockType` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtocreatebranditemreq"></a>`CreateBrandItemReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `categoryId` | string | No |  |
| `description` | string | No |  |
| `imagePublicId` | string | Yes |  |
| `imageUrl` | string | Yes |  |
| `itemType` | string | Yes |  |
| `name` | string | Yes |  |
| `price` | number | No |  |
| `productCode` | string | No |  |
| `status` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtocreatebrandreq"></a>`CreateBrandReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `description` | string | No |  |
| `logoPublicId` | string | No |  |
| `logoUrl` | string | No |  |
| `name` | string | Yes |  |
| `slug` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtocreateclaimtokenres"></a>`CreateClaimTokenRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `claimToken` | string | No |  |
| `expiresAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtocreateloyaltytierreq"></a>`CreateLoyaltyTierReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `description` | string | No |  |
| `minTotalSpend` | number | Yes |  |
| `name` | string | Yes |  |
| `rank` | integer | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtocreateofflinebrandcustomerreq"></a>`CreateOfflineBrandCustomerReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `customerName` | string | No |  |
| `externalCustomerCode` | string | No |  |
| `phoneE164` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtocustomerloyaltyaccountres"></a>`CustomerLoyaltyAccountRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `currentPoints` | integer | No |  |
| `currentTier` | [LoyaltyTierBriefRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltytierbriefres) | No |  |
| `id` | string | No |  |
| `lifetimePoints` | integer | No |  |
| `totalSpend` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtodigitalsampleresponseres"></a>`DigitalSampleResponseRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandItemId` | string | No |  |
| `createdAt` | string | No |  |
| `feedbackText` | string | No |  |
| `id` | string | No |  |
| `outfitId` | string | No |  |
| `rating` | integer | No |  |
| `userId` | string | No |  |
| `voteType` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtograntloyaltypointsreq"></a>`GrantLoyaltyPointsReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `customerName` | string | No |  |
| `externalCustomerCode` | string | No |  |
| `idempotencyKey` | string | No |  |
| `phone` | string | No |  |
| `pointsDelta` | integer | No |  |
| `purchaseAmount` | number | No |  |
| `reason` | string | No |  |
| `referenceId` | string | No |  |
| `referenceType` | string | No |  |
| `transactionType` | [LoyaltyTransactionType](#smart-wardrobe-beinternalmodulesbranddomainconstantsloyaltytransactiontypeloyaltytransactiontype) | Yes |  |
| `userId` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltypointlotres"></a>`LoyaltyPointLotRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `createdAt` | string | No |  |
| `earnTransactionId` | string | No |  |
| `earnedPoints` | integer | No |  |
| `expiresAt` | string | No |  |
| `id` | string | No |  |
| `remainingPoints` | integer | No |  |
| `status` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltypointtransactiondetailres"></a>`LoyaltyPointTransactionDetailRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `balanceAfter` | integer | No |  |
| `brandCustomerId` | string | No |  |
| `brandId` | string | No |  |
| `createdAt` | string | No |  |
| `createdByUserId` | string | No |  |
| `expiresAt` | string | No |  |
| `id` | string | No |  |
| `idempotencyKey` | string | No |  |
| `loyaltyAccountId` | string | No |  |
| `pointsDelta` | integer | No |  |
| `reason` | string | No |  |
| `referenceId` | string | No |  |
| `referenceType` | string | No |  |
| `spendAmount` | number | No |  |
| `transactionType` | string | No |  |
| `userId` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltypointstransactionres"></a>`LoyaltyPointsTransactionRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `balanceAfter` | integer | No |  |
| `brandCustomerId` | string | No |  |
| `brandId` | string | No |  |
| `currentTier` | [LoyaltyTierBriefRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltytierbriefres) | No |  |
| `customerStatus` | [BrandCustomerStatus](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandcustomerstatusbrandcustomerstatus) | No |  |
| `pointsDelta` | integer | No |  |
| `totalSpend` | number | No |  |
| `transactionId` | string | No |  |
| `userId` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltyprogramres"></a>`LoyaltyProgramRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `amountPerPoint` | number | No |  |
| `brandId` | string | No |  |
| `createdAt` | string | No |  |
| `id` | string | No |  |
| `isActive` | boolean | No |  |
| `name` | string | No |  |
| `pointExpiryDays` | integer | No |  |
| `roundingMode` | string | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltytierbriefres"></a>`LoyaltyTierBriefRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | No |  |
| `name` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltytierres"></a>`LoyaltyTierRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `createdAt` | string | No |  |
| `description` | string | No |  |
| `id` | string | No |  |
| `minTotalSpend` | number | No |  |
| `name` | string | No |  |
| `rank` | integer | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltytransactionlistres"></a>`LoyaltyTransactionListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[LoyaltyPointTransactionDetailRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtoloyaltypointtransactiondetailres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoportalbrandres"></a>`PortalBrandRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `approvedAt` | string | No |  |
| `approvedByUserId` | string | No |  |
| `backgroundUrl` | string | No |  |
| `createdAt` | string | No |  |
| `createdByUserId` | string | No |  |
| `description` | string | No |  |
| `id` | string | No |  |
| `logoUrl` | string | No |  |
| `memberId` | string | No |  |
| `memberRole` | [BrandMemberRole](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandmemberrolebrandmemberrole) | No |  |
| `memberStatus` | [BrandMemberStatus](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandmemberstatusbrandmemberstatus) | No |  |
| `name` | string | No |  |
| `slug` | string | No |  |
| `status` | [BrandStatus](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandstatusbrandstatus) | No |  |
| `totalCustomer` | integer | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtopublicbrandlistres"></a>`PublicBrandListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[BrandRes](#smart-wardrobe-beinternalmodulesbrandapplicationdtobrandres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtorevokeclaimtokenreq"></a>`RevokeClaimTokenReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `reason` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtosendbrandchatmessagereq"></a>`SendBrandChatMessageReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `message` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtosubmitsamplefeedbackreq"></a>`SubmitSampleFeedbackReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `feedbackText` | string | No |  |
| `outfitId` | string | No |  |
| `rating` | integer | No |  |
| `voteType` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoupdatebenefitstatusreq"></a>`UpdateBenefitStatusReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoupdatebrandimagesreq"></a>`UpdateBrandImagesReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `backgroundPublicId` | string | No |  |
| `backgroundUrl` | string | No |  |
| `logoPublicId` | string | No |  |
| `logoUrl` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoupdatebranditemreq"></a>`UpdateBrandItemReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `description` | string | No |  |
| `name` | string | Yes |  |
| `price` | number | No |  |
| `productCode` | string | No |  |
| `status` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoupdatebranditemstatusreq"></a>`UpdateBrandItemStatusReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | [BrandItemStatus](#smart-wardrobe-beinternalmodulesbranddomainconstantsbranditembranditemstatusbranditemstatus) | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoupdatebrandstatusreq"></a>`UpdateBrandStatusReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | [BrandStatus](#smart-wardrobe-beinternalmodulesbranddomainconstantsbrandstatusbrandstatus) | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoupdateloyaltytierreq"></a>`UpdateLoyaltyTierReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `description` | string | No |  |
| `minTotalSpend` | number | No |  |
| `name` | string | No |  |
| `rank` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtouploadsignatureresult"></a>`UploadSignatureResult`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | string | No |  |
| `folder` | string | No |  |
| `publicId` | string | No |  |
| `signature` | string | No |  |
| `timestamp` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesbrandapplicationdtoupsertloyaltyprogramreq"></a>`UpsertLoyaltyProgramReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `amountPerPoint` | number | Yes |  |
| `isActive` | boolean | No |  |
| `name` | string | Yes |  |
| `pointExpiryDays` | integer | No |  |
| `roundingMode` | object | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesbranddomainconstantsbrandcustomerjoinedsourcebrandcustomerjoinedsource"></a>`BrandCustomerJoinedSource`

*Enum values:*

- `self_join` (**SelfJoin**)
- `offline_purchase` (**OfflinePurchase**)
- `import` (**Import**)

### <a id="smart-wardrobe-beinternalmodulesbranddomainconstantsbrandcustomerstatusbrandcustomerstatus"></a>`BrandCustomerStatus`

*Enum values:*

- `active` (**Active**)
- `blocked` (**Blocked**)
- `left` (**Left**)

### <a id="smart-wardrobe-beinternalmodulesbranddomainconstantsbranditembranditemstatusbranditemstatus"></a>`BrandItemStatus`

*Enum values:*

- `draft` (**Draft**)
- `active` (**Active**)
- `archived` (**Archived**)

### <a id="smart-wardrobe-beinternalmodulesbranddomainconstantsbranditembranditemtypebranditemtype"></a>`BrandItemType`

*Enum values:*

- `product` (**Product**)
- `sample` (**Sample**)

### <a id="smart-wardrobe-beinternalmodulesbranddomainconstantsbrandmemberrolebrandmemberrole"></a>`BrandMemberRole`

*Enum values:*

- `owner` (**Owner**)
- `staff` (**Staff**)

### <a id="smart-wardrobe-beinternalmodulesbranddomainconstantsbrandmemberstatusbrandmemberstatus"></a>`BrandMemberStatus`

*Enum values:*

- `active` (**Active**)
- `invited` (**Invited**)
- `disabled` (**Disabled**)

### <a id="smart-wardrobe-beinternalmodulesbranddomainconstantsbrandstatusbrandstatus"></a>`BrandStatus`

*Enum values:*

- `pending_review` (**PendingReview**)
- `active` (**Active**)
- `suspended` (**Suspended**)
- `archived` (**Archived**)

### <a id="smart-wardrobe-beinternalmodulesbranddomainconstantsloyaltyroundingmodeloyaltyroundingmode"></a>`LoyaltyRoundingMode`

*Enum values:*

- `floor` (**Floor**)
- `round` (**Round**)
- `ceil` (**Ceil**)

### <a id="smart-wardrobe-beinternalmodulesbranddomainconstantsloyaltytransactiontypeloyaltytransactiontype"></a>`LoyaltyTransactionType`

*Enum values:*

- `earn` (**Earn**)
- `redeem` (**Redeem**)
- `adjust` (**Adjust**)
- `expire` (**Expire**)
- `refund` (**Refund**)

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtoaierrorbreakdowndto"></a>`AIErrorBreakdownDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `errorCode` | string | No |  |
| `errorCount` | integer | No |  |
| `model` | string | No |  |
| `provider` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtoaierrorbreakdownres"></a>`AIErrorBreakdownRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `breakdown` | Array<[AIErrorBreakdownDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtoaierrorbreakdowndto)> | No |  |
| `errorRate` | number | No |  |
| `totalErrors` | integer | No |  |
| `totalRequests` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtoaimarginanalyticsres"></a>`AIMarginAnalyticsRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `aiErrorCount` | integer | No |  |
| `aiRequestsCount` | integer | No |  |
| `fromDate` | string | No |  |
| `marginPercentage` | number | No |  |
| `netAiMarginVnd` | number | No |  |
| `toDate` | string | No |  |
| `totalAiActualCostVnd` | number | No |  |
| `totalAiPaidTokens` | integer | No |  |
| `totalSubscriptionRevVnd` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtoaiusagebyoperationdto"></a>`AIUsageByOperationDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `logicalRoute` | string | No |  |
| `operation` | string | No |  |
| `requestCount` | integer | No |  |
| `totalCostVnd` | number | No |  |
| `totalOutputTokens` | integer | No |  |
| `totalPromptTokens` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtoaiusagebyoperationres"></a>`AIUsageByOperationRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `fromDate` | string | No |  |
| `operations` | Array<[AIUsageByOperationDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtoaiusagebyoperationdto)> | No |  |
| `toDate` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtoadminkpicardsres"></a>`AdminKPICardsRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `activeUsersDau` | integer | No |  |
| `netAiMarginVnd` | number | No |  |
| `payOSSuccessCount` | integer | No |  |
| `pendingReviewBrands` | integer | No |  |
| `subscriptionRevenueVnd` | number | No |  |
| `totalBrands` | integer | No |  |
| `totalUsers` | integer | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtoadminoverviewres"></a>`AdminOverviewRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `aiMargin` | [AIMarginAnalyticsRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtoaimarginanalyticsres) | No |  |
| `kpiCards` | [AdminKPICardsRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtoadminkpicardsres) | No |  |
| `payosReconcile` | [PayOSReconciliationRes](#smart-wardrobe-beinternalmodulesdashboardapplicationdtopayosreconciliationres) | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtobenefitredemptionanalyticsres"></a>`BenefitRedemptionAnalyticsRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `topBenefits` | Array<[BenefitRedemptionDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtobenefitredemptiondto)> | No |  |
| `totalRedemptions` | integer | No |  |
| `trend` | Array<[RedemptionTrendDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtoredemptiontrenddto)> | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtobenefitredemptiondto"></a>`BenefitRedemptionDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `benefitId` | string | No |  |
| `benefitName` | string | No |  |
| `benefitType` | string | No |  |
| `percentage` | number | No |  |
| `redemptionCount` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtobrandkpicardsres"></a>`BrandKPICardsRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `activeVouchers` | integer | No |  |
| `brandId` | string | No |  |
| `csFirstResponseAvgSeconds` | integer | No |  |
| `digitalSampleAvgRating` | number | No |  |
| `digitalSampleVotesCount` | integer | No |  |
| `openCsTickets` | integer | No |  |
| `pointsIssued` | integer | No |  |
| `pointsRedeemed` | integer | No |  |
| `totalMembers` | integer | No |  |
| `updatedAt` | string | No |  |
| `vouchersRedeemed` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtobrandpointsliabilityres"></a>`BrandPointsLiabilityRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `pointsExpiring30d` | integer | No |  |
| `pointsLiabilityValueVnd` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtocatalogstatgroupdto"></a>`CatalogStatGroupDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | integer | No |  |
| `label` | string | No |  |
| `percentage` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtocatalogstatsres"></a>`CatalogStatsRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `byStatus` | Array<[CatalogStatGroupDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtocatalogstatgroupdto)> | No |  |
| `byType` | Array<[CatalogStatGroupDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtocatalogstatgroupdto)> | No |  |
| `totalItems` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtocategorydistributiondto"></a>`CategoryDistributionDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `categoryId` | string | No |  |
| `categoryName` | string | No |  |
| `itemCount` | integer | No |  |
| `percentage` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtocomparisondto"></a>`ComparisonDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `metricDeltaPercentages` | object | No |  |
| `previousPeriodFrom` | string | No |  |
| `previousPeriodTo` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtocustomeracquisitiondto"></a>`CustomerAcquisitionDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `customerCount` | integer | No |  |
| `percentage` | number | No |  |
| `source` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtocustomeracquisitionres"></a>`CustomerAcquisitionRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `sources` | Array<[CustomerAcquisitionDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtocustomeracquisitiondto)> | No |  |
| `totalCustomers` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtodigitalsamplelabanalyticsres"></a>`DigitalSampleLabAnalyticsRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `avgRating` | number | No |  |
| `feedbackSentiment` | [FeedbackSentiment](#smart-wardrobe-beinternalmodulesdashboarddomainconstantsfeedbacksentimentfeedbacksentiment) | No |  |
| `itemId` | string | No |  |
| `topPairedCategories` | Array<[PairedCategoryStat](#smart-wardrobe-beinternalmodulesdashboardapplicationdtopairedcategorystat)> | No |  |
| `votesCount` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtodrilldownaieventdto"></a>`DrillDownAIEventDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `createdAt` | string | No |  |
| `errorMessage` | string | No |  |
| `model` | string | No |  |
| `provider` | string | No |  |
| `requestId` | string | No |  |
| `statusCode` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtodrilldownaieventlistres"></a>`DrillDownAIEventListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[DrillDownAIEventDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtodrilldownaieventdto)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtodrilldownsamplefeedbackdto"></a>`DrillDownSampleFeedbackDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `comment` | string | No |  |
| `createdAt` | string | No |  |
| `feedbackId` | string | No |  |
| `itemId` | string | No |  |
| `rating` | number | No |  |
| `userId` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtodrilldownsamplefeedbacklistres"></a>`DrillDownSampleFeedbackListRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[DrillDownSampleFeedbackDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtodrilldownsamplefeedbackdto)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtodynamicqueryreq"></a>`DynamicQueryReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `compareWithPrevious` | boolean | No |  |
| `granularity` | object | No | "day" | "week" | "month" | "year" |
| `metrics` | Array<[MetricKey](#smart-wardrobe-beinternalmodulesdashboarddomainconstantsmetrickeymetrickey)> | No |  |
| `targetDashboard` | object | No | "admin" | "brand" | "user" |
| `timeframe` | [DynamicQueryTimeframeDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtodynamicquerytimeframedto) | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtodynamicqueryres"></a>`DynamicQueryRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `comparison` | [ComparisonDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtocomparisondto) | No |  |
| `granularity` | [Granularity](#smart-wardrobe-beinternalmodulesdashboarddomainconstantsgranularitygranularity) | No |  |
| `series` | Array<[TimeSeriesPointDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtotimeseriespointdto)> | No |  |
| `targetDashboard` | [TargetDashboard](#smart-wardrobe-beinternalmodulesdashboarddomainconstantstargetdashboardtargetdashboard) | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtodynamicquerytimeframedto"></a>`DynamicQueryTimeframeDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `fromDate` | string | No |  |
| `toDate` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtopairedcategorystat"></a>`PairedCategoryStat`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `categoryName` | string | No |  |
| `pairCount` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtopayosreconciliationres"></a>`PayOSReconciliationRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `failedCount` | integer | No |  |
| `successCount` | integer | No |  |
| `totalSuccessValue` | number | No |  |
| `totalTransactions` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtopointexpiryforecastdto"></a>`PointExpiryForecastDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `month` | string | No |  |
| `pointsExpiring` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtopointexpiryforecastres"></a>`PointExpiryForecastRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `forecast` | Array<[PointExpiryForecastDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtopointexpiryforecastdto)> | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtoredemptiontrenddto"></a>`RedemptionTrendDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `month` | string | No |  |
| `redemptionCount` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtorenewalstatsres"></a>`RenewalStatsRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `avgRetryCount` | number | No |  |
| `failedCount` | integer | No |  |
| `successCount` | integer | No |  |
| `successRate` | number | No |  |
| `totalAttempts` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtorevenuebreakdowndto"></a>`RevenueBreakdownDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `month` | string | No |  |
| `planCode` | string | No |  |
| `revenueVnd` | number | No |  |
| `transactionCount` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtorevenuebreakdownres"></a>`RevenueBreakdownRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `breakdown` | Array<[RevenueBreakdownDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtorevenuebreakdowndto)> | No |  |
| `fromDate` | string | No |  |
| `toDate` | string | No |  |
| `totalRevenueVnd` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtospendsegmentdto"></a>`SpendSegmentDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `customerCount` | integer | No |  |
| `maxVnd` | number | No |  |
| `minVnd` | number | No |  |
| `percentage` | number | No |  |
| `segment` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtospendsegmentationres"></a>`SpendSegmentationRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `segments` | Array<[SpendSegmentDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtospendsegmentdto)> | No |  |
| `totalCustomers` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtosubscriptiondistributiondto"></a>`SubscriptionDistributionDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `percentage` | number | No |  |
| `planCode` | string | No |  |
| `userCount` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtosubscriptiondistributionres"></a>`SubscriptionDistributionRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `distribution` | Array<[SubscriptionDistributionDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtosubscriptiondistributiondto)> | No |  |
| `totalUsers` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtotierdistributiondto"></a>`TierDistributionDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `memberCount` | integer | No |  |
| `percentage` | number | No |  |
| `tierId` | string | No |  |
| `tierName` | string | No |  |
| `tierRank` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtotierdistributionres"></a>`TierDistributionRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `tiers` | Array<[TierDistributionDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtotierdistributiondto)> | No |  |
| `totalMembers` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtotimeseriespointdto"></a>`TimeSeriesPointDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `metrics` | object | No |  |
| `timestamp` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtounderutilizeditemdto"></a>`UnderutilizedItemDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `categoryName` | string | No |  |
| `imageUrl` | string | No |  |
| `itemId` | string | No |  |
| `lastWornDaysAgo` | integer | No |  |
| `name` | string | No |  |
| `purchasePriceVnd` | number | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtouserwardrobeinsightsres"></a>`UserWardrobeInsightsRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `expiringVouchersCount` | integer | No |  |
| `totalItems` | integer | No |  |
| `totalWardrobeValueVnd` | number | No |  |
| `underutilizedItems` | Array<[UnderutilizedItemDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtounderutilizeditemdto)> | No |  |
| `underutilizedItemsCount` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboardapplicationdtowardrobecategorydistributionres"></a>`WardrobeCategoryDistributionRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `categories` | Array<[CategoryDistributionDTO](#smart-wardrobe-beinternalmodulesdashboardapplicationdtocategorydistributiondto)> | No |  |
| `totalItems` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulesdashboarddomainconstantsfeedbacksentimentfeedbacksentiment"></a>`FeedbackSentiment`

*Enum values:*

- `positive` (**Positive**)
- `neutral` (**Neutral**)
- `negative` (**Negative**)

### <a id="smart-wardrobe-beinternalmodulesdashboarddomainconstantsgranularitygranularity"></a>`Granularity`

*Enum values:*

- `day` (**Day**)
- `week` (**Week**)
- `month` (**Month**)
- `year` (**Year**)

### <a id="smart-wardrobe-beinternalmodulesdashboarddomainconstantsmetrickeymetrickey"></a>`MetricKey`

*Enum values:*

- `total_users` (**TotalUsers**)
- `active_users_dau` (**ActiveUsersDau**)
- `total_brands` (**TotalBrands**)
- `pending_review_brands` (**PendingReviewBrands**)
- `ai_requests_count` (**AIRequestsCount**)
- `subscription_revenue_vnd` (**SubscriptionRevenueVND**)
- `net_ai_margin_vnd` (**NetAIMarginVND**)
- `total_members` (**TotalMembers**)
- `points_issued` (**PointsIssued**)
- `points_redeemed` (**PointsRedeemed**)
- `active_vouchers` (**ActiveVouchers**)
- `total_wardrobe_items` (**TotalWardrobeItems**)
- `total_wardrobe_value_vnd` (**TotalWardrobeValueVND**)
- `vouchers_redeemed` (**VouchersRedeemed**)
- `digital_sample_votes_count` (**DigitalSampleVotesCount**)
- `digital_sample_avg_rating` (**DigitalSampleAvgRating**)
- `open_cs_tickets` (**OpenCSTickets**)
- `cs_first_response_avg_seconds` (**CSFirstResponseAvgSeconds**)
- `points_expiring_30d` (**PointsExpiring30d**)
- `points_liability_value_vnd` (**PointsLiabilityValueVND**)
- `new_users` (**NewUsers**)
- `ai_error_count` (**AIErrorCount**)
- `ai_error_rate` (**AIErrorRate**)
- `new_customers` (**NewCustomers**)
- `customer_claim_rate` (**CustomerClaimRate**)
- `benefit_redemption_count` (**BenefitRedemptionCount**)
- `brand_item_count` (**BrandItemCount**)
- `brand_item_count_by_type` (**BrandItemCountByType**)

### <a id="smart-wardrobe-beinternalmodulesdashboarddomainconstantstargetdashboardtargetdashboard"></a>`TargetDashboard`

*Enum values:*

- `admin` (**Admin**)
- `brand` (**Brand**)
- `user` (**User**)

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtocategorybriefres"></a>`CategoryBriefRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | No |  |
| `name` | string | No |  |
| `slug` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtochatmessageres"></a>`ChatMessageRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | string | No |  |
| `createdAt` | string | No |  |
| `id` | string | No |  |
| `sender` | [MessageSender](#smart-wardrobe-beinternalmodulesfashiondomainconstantsmessagesendermessagesender) | No |  |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtochatsessionres"></a>`ChatSessionRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `contextSummary` | string | No |  |
| `createdAt` | string | No |  |
| `id` | string | No |  |
| `isArchived` | boolean | No |  |
| `title` | string | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtocreatechatsessionreq"></a>`CreateChatSessionReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtofashionitemres"></a>`FashionItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `category` | [CategoryBriefRes](#smart-wardrobe-beinternalmodulesfashionapplicationdtocategorybriefres) | No |  |
| `color` | string | No |  |
| `colorHex` | string | No |  |
| `colorHue` | number | No |  |
| `colorLightness` | number | No |  |
| `colorSaturation` | number | No |  |
| `createdAt` | string | No |  |
| `description` | string | No |  |
| `fit` | string | No |  |
| `id` | string | No |  |
| `imageUrl` | string | No |  |
| `material` | string | No |  |
| `pattern` | string | No |  |
| `seasonality` | string | No |  |
| `style` | string | No |  |
| `updatedAt` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendoutfitreq"></a>`RecommendOutfitReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `colorTone` | string | No | Tông màu phối đồ (Gợi ý: light, dark, pastel, earthy, neon... hoặc nhập tông màu tùy ý) |
| `details` | string | No | Ghi chú thêm bằng tay (free text) |
| `includeBrandItems` | boolean | No | Cho phép phối đồ của brand (tỷ lệ tối đa 30%) |
| `occasion` | string | No | Dịp phối đồ (Gợi ý: casual, work, date, party, sport, hoặc nhập dịp tùy ý) |
| `season` | string | No | Mùa phối đồ @enums spring,summer,autumn,winter,all |
| `styleTarget` | string | No | Phong cách hướng tới (Gợi ý: minimalist, vintage, streetwear, preppy, sporty, elegant, hoặc nhập phong cách tùy ý) |
| `weather` | string | No | Thời tiết hiện tại (Gợi ý: hot, cold, warm, cool, rainy, hoặc nhập thời tiết cụ thể) |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendedfashionitemres"></a>`RecommendedFashionItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `category` | [CategoryBriefRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategorybriefres) | No |  |
| `color` | string | No |  |
| `colorHex` | string | No |  |
| `fit` | string | No |  |
| `id` | string | No |  |
| `imageUrl` | string | No |  |
| `material` | string | No |  |
| `pattern` | string | No |  |
| `style` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendeditemgroup"></a>`RecommendedItemGroup`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `alternatives` | Array<[RecommendedItemRes](#smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendeditemres)> | No |  |
| `primary` | [RecommendedItemRes](#smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendeditemres) | No |  |
| `role` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendeditemres"></a>`RecommendedItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandItem` | [BrandItemBriefRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtobranditembriefres) | No |  |
| `fashionItem` | [RecommendedFashionItemRes](#smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendedfashionitemres) | No |  |
| `id` | string | No |  |
| `itemContext` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendedoutfitres"></a>`RecommendedOutfitRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `explanation` | string | No |  |
| `isFallback` | boolean | No |  |
| `items` | Array<[RecommendedItemGroup](#smart-wardrobe-beinternalmodulesfashionapplicationdtorecommendeditemgroup)> | No |  |
| `remainingQuota` | integer | No |  |
| `title` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtosendchatmessagereq"></a>`SendChatMessageReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesfashionapplicationdtoupdatechatsessionreq"></a>`UpdateChatSessionReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulesfashiondomainconstantsmessagesendermessagesender"></a>`MessageSender`

*Enum values:*

- `user` (**User**)
- `ai` (**AI**)

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
| `address` | string | No |  |
| `confirmPassword` | string | Yes |  |
| `dateOfBirth` | string | Yes |  |
| `email` | string | Yes |  |
| `firstName` | string | Yes |  |
| `gender` | object | No |  |
| `lastName` | string | No |  |
| `password` | string | Yes |  |
| `username` | string | Yes |  |

### <a id="smart-wardrobe-beinternalmodulesidentityapplicationdtoresendotpreq"></a>`ResendOtpReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | Yes |  |

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
| `avatarUrl` | string | No |  |
| `bodyProfile` | [UserBodyProfileRes](#smart-wardrobe-beinternalmodulesidentityapplicationdtouserbodyprofileres) | No |  |
| `createdAt` | string | No |  |
| `dateOfBirth` | string | No |  |
| `email` | string | No |  |
| `firstName` | string | No |  |
| `gender` | [Gender](#smart-wardrobe-beinternalshareddomainconstantssharedgendergender) | No |  |
| `id` | string | No |  |
| `lastName` | string | No |  |
| `roleSlug` | [RoleSlug](#smart-wardrobe-beinternalshareddomainconstantsroleslugroleslug) | No |  |
| `status` | [UserStatus](#smart-wardrobe-beinternalmodulesidentitydomainconstantsuserstatususerstatus) | No |  |
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

### <a id="smart-wardrobe-beinternalmodulesidentitydomainconstantsuserstatususerstatus"></a>`UserStatus`

*Enum values:*

- `0` (**Active**)
- `1` (**Inactive**)

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
| `paymentStatus` | [DepositStatus](#smart-wardrobe-beinternalmodulessubscriptiondomainconstantsdepositstatusdepositstatus) | No |  |
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
| `planKind` | [PlanKind](#smart-wardrobe-beinternalmodulessubscriptiondomainconstantsplankindplankind) | No |  |
| `price` | number | No |  |
| `slug` | string | No |  |
| `tierRank` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionapplicationdtousersubscriptiondto"></a>`UserSubscriptionDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `aiChatDailyQuota` | integer | No |  |
| `aiOutfitDailyQuota` | integer | No |  |
| `aiUsageCount` | integer | No |  |
| `expiresAt` | string | No |  |
| `fallbackPlanCode` | string | No |  |
| `fallbackPlanKind` | [PlanKind](#smart-wardrobe-beinternalmodulessubscriptiondomainconstantsplankindplankind) | No |  |
| `fallbackTierRank` | integer | No |  |
| `isAutoRenewEnabled` | boolean | No |  |
| `lastResetDate` | string | No |  |
| `maxOutfits` | integer | No |  |
| `maxWardrobeItems` | integer | No |  |
| `outfitRecommendCount` | integer | No |  |
| `planID` | string | No |  |
| `planKind` | [PlanKind](#smart-wardrobe-beinternalmodulessubscriptiondomainconstantsplankindplankind) | No |  |
| `planName` | string | No |  |
| `planSlug` | string | No |  |
| `tierRank` | integer | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionapplicationdtousersubscriptionoverviewdto"></a>`UserSubscriptionOverviewDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `aiChatDailyQuota` | integer | No |  |
| `aiOutfitDailyQuota` | integer | No |  |
| `expiresAt` | string | No |  |
| `fallbackPlanCode` | string | No |  |
| `fallbackPlanKind` | [PlanKind](#smart-wardrobe-beinternalmodulessubscriptiondomainconstantsplankindplankind) | No |  |
| `fallbackTierRank` | integer | No |  |
| `isAutoRenewEnabled` | boolean | No |  |
| `maxOutfits` | integer | No |  |
| `maxWardrobeItems` | integer | No |  |
| `planID` | string | No |  |
| `planKind` | [PlanKind](#smart-wardrobe-beinternalmodulessubscriptiondomainconstantsplankindplankind) | No |  |
| `planName` | string | No |  |
| `planSlug` | string | No |  |
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
| `transactionType` | [WalletStatementType](#smart-wardrobe-beinternalmodulessubscriptiondomainconstantswalletstatementtypewalletstatementtype) | No |  |
| `userID` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptionapplicationdtowallettopupreq"></a>`WalletTopUpReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `amount` | number | Yes |  |
| `cancelUrl` | string | No |  |
| `returnUrl` | string | No |  |

### <a id="smart-wardrobe-beinternalmodulessubscriptiondomainconstantsdepositstatusdepositstatus"></a>`DepositStatus`

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

### <a id="smart-wardrobe-beinternalmodulessubscriptiondomainconstantsplankindplankind"></a>`PlanKind`

*Enum values:*

- `0` (**DefaultFree**)
- `1` (**Finite**)
- `2` (**Lifetime**)

### <a id="smart-wardrobe-beinternalmodulessubscriptiondomainconstantswalletstatementtypewalletstatementtype"></a>`WalletStatementType`

*Enum values:*

- `topup` (**Topup**)
- `subscription_purchase` (**SubscriptionPurchase**)
- `subscription_renewal` (**SubscriptionRenewal**)
- `lower_tier_payment_credit` (**LowerTierPaymentCredit**)
- `same_lifetime_payment_credit` (**SameLifetimePaymentCredit**)

### <a id="smart-wardrobe-beinternalmodulessubscriptionpresentationdtosetautorenewreq"></a>`SetAutoRenewReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | boolean | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtobatchuploadwardrobeitemsreq"></a>`BatchUploadWardrobeItemsReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[WardrobeBatchUploadItemReq](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtowardrobebatchuploaditemreq)> | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtobranditembriefres"></a>`BrandItemBriefRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `brandId` | string | No |  |
| `brandName` | string | No |  |
| `id` | string | No |  |
| `itemType` | string | No |  |
| `name` | string | No |  |
| `price` | number | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtobulkdeleteitemsreq"></a>`BulkDeleteItemsReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `ids` | Array<string> | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategorybriefres"></a>`CategoryBriefRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | No |  |
| `name` | string | No |  |
| `slug` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategoryres"></a>`CategoryRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | No |  |
| `name` | string | No |  |
| `slug` | string | No |  |
| `sortOrder` | integer | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtoclonewardrobeitemreq"></a>`CloneWardrobeItemReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `quantity` | integer | Yes |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtocreatecategoryreq"></a>`CreateCategoryReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes |  |
| `slug` | string | Yes |  |
| `sortOrder` | integer | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtofashionitembriefres"></a>`FashionItemBriefRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `category` | [CategoryBriefRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategorybriefres) | No |  |
| `colorHex` | string | No |  |
| `id` | string | No |  |
| `imageUrl` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtofashionitemres"></a>`FashionItemRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `category` | [CategoryBriefRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtocategorybriefres) | No |  |
| `color` | string | No |  |
| `colorHex` | string | No |  |
| `colorHue` | number | No |  |
| `colorLightness` | number | No |  |
| `colorSaturation` | number | No |  |
| `createdAt` | string | No |  |
| `description` | string | No |  |
| `fit` | string | No |  |
| `id` | string | No |  |
| `imageUrl` | string | No |  |
| `material` | string | No |  |
| `pattern` | string | No |  |
| `seasonality` | string | No |  |
| `style` | string | No |  |
| `updatedAt` | string | No |  |

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
| `fashionItem` | [FashionItemBriefRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtofashionitembriefres) | No |  |
| `id` | string | No |  |
| `isAvailable` | boolean | No |  |
| `itemContext` | string | No |  |
| `layerOrder` | integer | No |  |
| `positionX` | number | No |  |
| `positionY` | number | No |  |
| `scale` | number | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfitres"></a>`OutfitRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `coverImageUrl` | string | No |  |
| `createdAt` | string | No |  |
| `description` | string | No |  |
| `id` | string | No |  |
| `items` | Array<[OutfitItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtooutfititemres)> | No |  |
| `name` | string | No |  |
| `status` | [OutfitStatus](#smart-wardrobe-beinternalmoduleswardrobedomainconstantsoutfitstatusoutfitstatus) | No |  |
| `updatedAt` | string | No |  |
| `userId` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtosaveoutfititemreq"></a>`SaveOutfitItemReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `fashionItemId` | string | Yes |  |
| `layerOrder` | integer | Yes |  |
| `positionX` | number | No |  |
| `positionY` | number | No |  |
| `scale` | number | Yes |  |

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
| `fashionItem` | [FashionItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtofashionitemres) | No |  |
| `id` | string | No |  |
| `isSystem` | boolean | No |  |
| `price` | number | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobeapplicationdtoupdatecategoryreq"></a>`UpdateCategoryReq`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes |  |
| `slug` | string | Yes |  |
| `sortOrder` | integer | No |  |

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
| `brandItem` | [BrandItemBriefRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtobranditembriefres) | No |  |
| `createdAt` | string | No |  |
| `fashionItem` | [FashionItemRes](#smart-wardrobe-beinternalmoduleswardrobeapplicationdtofashionitemres) | No |  |
| `id` | string | No |  |
| `isDeleted` | boolean | No |  |
| `isLocked` | boolean | No |  |
| `itemContext` | string | No |  |
| `lastUsedAt` | string | No |  |
| `price` | number | No |  |
| `status` | [WardrobeItemStatus](#smart-wardrobe-beinternalmoduleswardrobedomainconstantswardrobestatuswardrobeitemstatus) | No |  |
| `taskId` | string | No |  |
| `userId` | string | No |  |

### <a id="smart-wardrobe-beinternalmoduleswardrobedomainconstantsoutfitstatusoutfitstatus"></a>`OutfitStatus`

*Enum values:*

- `0` (**Draft**)
- `1` (**Active**)

### <a id="smart-wardrobe-beinternalmoduleswardrobedomainconstantswardrobestatuswardrobeitemstatus"></a>`WardrobeItemStatus`

*Enum values:*

- `0` (**InWardrobe**)
- `1` (**Selling**)
- `2` (**Sold**)
- `3` (**Processing**) - AI processing in background
- `4` (**Failed**) - AI processing failed
- `5` (**NeedsReview**) - AI requires user review before the item becomes usable

### <a id="smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata"></a>`PaginationMetadata`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | integer | No |  |
| `page` | integer | No |  |
| `totalItems` | integer | No |  |
| `totalPages` | integer | No |  |

### <a id="smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmodulesfashionapplicationdtochatmessageres"></a>`PaginationResult-smart-wardrobe-be_internal_modules_fashion_application_dto_ChatMessageRes`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[ChatMessageRes](#smart-wardrobe-beinternalmodulesfashionapplicationdtochatmessageres)> | No |  |
| `metadata` | [PaginationMetadata](#smart-wardrobe-beinternalsharedapplicationdtopaginationmetadata) | No |  |

### <a id="smart-wardrobe-beinternalsharedapplicationdtopaginationresult-smart-wardrobe-beinternalmodulessubscriptionapplicationdtowalletstatementdto"></a>`PaginationResult-smart-wardrobe-be_internal_modules_subscription_application_dto_WalletStatementDTO`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | Array<[WalletStatementDTO](#smart-wardrobe-beinternalmodulessubscriptionapplicationdtowalletstatementdto)> | No |  |
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

### <a id="smart-wardrobe-beinternalshareddomainconstantsroleslugroleslug"></a>`RoleSlug`

*Enum values:*

- `admin` (**Admin**)
- `user` (**User**)

### <a id="smart-wardrobe-beinternalshareddomainconstantssharedgendergender"></a>`Gender`

*Enum values:*

- `0` (**Unknown**)
- `1` (**Male**)
- `2` (**Female**)
- `3` (**Other**)

### <a id="smart-wardrobe-beinternalsharedpresentationapiresponse"></a>`APIResponse`

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | object | No |  |
| `message` | string | No |  |

