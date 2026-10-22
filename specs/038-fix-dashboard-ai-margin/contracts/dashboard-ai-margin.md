# Interface Contract: Phân Tích Kinh Tế AI Theo Kỳ (Dashboard AI Margin)

**Date**: 2026-10-21  
**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md)

---

## 1. REST API Contract (Backend Integration)

### Endpoint
`GET /admin/dashboard/ai-margin`

### Query Parameters
| Tham số | Kiểu | Bắt buộc | Mô tả | Ví dụ |
| :--- | :--- | :---: | :--- | :--- |
| `fromDate` | `string` (YYYY-MM-DD) | Có | Ngày bắt đầu khoảng phân tích | `2026-10-01` |
| `toDate` | `string` (YYYY-MM-DD) | Có | Ngày kết thúc khoảng phân tích | `2026-10-21` |

### Response Headers
- `Content-Type: application/json`

### Success Response Body (HTTP 200)
```json
{
  "fromDate": "2026-10-01",
  "toDate": "2026-10-21",
  "subscriptionRevenueVnd": 85000000,
  "aiCostVnd": 12450000,
  "netMarginVnd": 72550000,
  "marginPercent": 85.35,
  "tokenBreakdown": {
    "virtualTryOn": {
      "inputTokens": 450000,
      "outputTokens": 150000,
      "costVnd": 7200000,
      "requestCount": 1200
    },
    "outfitSuggestion": {
      "inputTokens": 200000,
      "outputTokens": 80000,
      "costVnd": 2800000,
      "requestCount": 850
    },
    "itemAnalysis": {
      "inputTokens": 150000,
      "outputTokens": 45000,
      "costVnd": 1950000,
      "requestCount": 600
    },
    "styleQuiz": {
      "inputTokens": 50000,
      "outputTokens": 15000,
      "costVnd": 500000,
      "requestCount": 300
    }
  }
}
```

---

## 2. Component Contract: `AIMarginPanel`

### Props
```typescript
interface AIMarginPanelProps {
  data: AIMarginAnalytics | null | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  onRetry: () => void;
}
```

### Behavior Contract
1. Khi `isLoading = true` và chưa có `data`: Hiển thị Skeleton loading card.
2. Khi `error !== null` và không có `data`: Hiển thị Alert báo lỗi cục bộ và nút "Thử lại" gọi `onRetry()`.
3. Khi có `data`:
   - Tiêu đề phụ hiển thị: `Kỳ: {formatVNDateString(data.fromDate)} – {formatVNDateString(data.toDate)}`.
   - Hiển thị 4 thẻ chỉ số: Doanh thu đăng ký, Chi phí token AI, Lợi nhuận ròng, Tỷ suất biên lợi nhuận.
   - Thẻ hiển thị cảnh báo đỏ (`text-destructive`) khi `netMarginVnd < 0`.
   - Bảng phân rã theo tác vụ hiển thị cơ cấu token và chi phí.
4. Khi `isFetching = true` (đang làm mới ngầm hoặc đổi kỳ): Giữ nguyên giao diện dữ liệu trước đó, gán thuộc tính accessibility `aria-busy="true"` và hiển thị hiệu ứng mờ nhẹ.
