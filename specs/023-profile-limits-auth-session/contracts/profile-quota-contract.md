# API Contract: Hạn mức Profile & Thống kê Tủ đồ

**Feature**: `023-profile-limits-auth-session`  
**Base URL**: `/api/v1` (Proxied to `https://api.closy.hycat.online/api/v1`)  

---

## 1. Lấy Hạn mức Sử dụng Hàng ngày & Giới hạn Gói (`daily-quota`)

- **Endpoint**: `GET /api/v1/subscriptions/me/daily-quota`
- **Authentication**: Bắt buộc (`accessToken` cookie)
- **Response Format**: `JSON`

### Response Mẫu (200 OK)

```json
{
  "success": true,
  "message": "Lấy hạn ngạch sử dụng thành công",
  "data": {
    "planID": "3f2a1b9c-8d7e-4f5a-b6c7-d8e9f0a1b2c3",
    "planName": "Premium",
    "planSlug": "premium",
    "expiresAt": "2026-12-31T23:59:59Z",
    "isAutoRenewEnabled": true,
    "maxWardrobeItems": 500,
    "maxOutfits": 50,
    "aiOutfitDailyQuota": 20,
    "aiChatDailyQuota": 100,
    "outfitRecommendCount": 3,
    "aiUsageCount": 7,
    "lastResetDate": "2026-09-26T00:00:00Z"
  }
}
```

### Ý nghĩa các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả |
|---|---|---|
| `maxWardrobeItems` | `number` | Số món đồ tối đa được phép thêm vào tủ đồ. Giá trị `0` = Không giới hạn |
| `maxOutfits` | `number` | Số bộ outfit tối đa được phép tạo. Giá trị `0` = Không giới hạn |
| `aiOutfitDailyQuota` | `number` | Số lượt AI gợi ý phối đồ được cấp mỗi ngày. `0` = Không giới hạn |
| `aiChatDailyQuota` | `number` | Số lượt trò chuyện cùng AI Stylist mỗi ngày. `0` = Không giới hạn |
| `outfitRecommendCount` | `number` | Số lượt gợi ý phối đồ AI đã sử dụng trong ngày hôm nay |
| `aiUsageCount` | `number` | Số lượt chat AI đã sử dụng trong ngày hôm nay |

---

## 2. Lấy Thống kê Số lượng Thực tế của Tủ đồ (`wardrobe stats`)

- **Endpoint**: `GET /api/v1/me/wardrobe-items/stats`
- **Authentication**: Bắt buộc (`accessToken` cookie)
- **Response Format**: `JSON`

### Response Mẫu (200 OK)

```json
{
  "success": true,
  "message": "Lấy thống kê tủ đồ thành công",
  "data": {
    "activeItemsCount": 128,
    "outfitsCount": 12
  }
}
```

### Ý nghĩa các trường dữ liệu

| Trường | Kiểu dữ liệu | Mô tả |
|---|---|---|
| `activeItemsCount` | `number` | Tổng số lượng món đồ thời trang hiện đang có trong tủ đồ của người dùng |
| `outfitsCount` | `number` | Tổng số bộ phối đồ mà người dùng đã tạo và lưu trữ |

---

## 3. Khế ước Tích hợp trên Frontend (Frontend Client Usage)

- Hook gọi `daily-quota`: `useDailyQuota()` trong `@/features/subscription/queries/subscription.queries.ts`.
  - Khóa cache: `['subscription', 'daily-quota']`.
- Hook gọi `stats`: `useWardrobeStats()` trong `@/features/wardrobe/queries/wardrobe.queries.ts`.
  - Khóa cache: `['wardrobe', 'stats']`.
- Thẻ giao diện tiếp nhận:
  ```tsx
  <CurrentPlanCard
    subscription={mySubscription}
    quota={dailyQuota}
    stats={wardrobeStats}
  />
  ```
