# Contract: Dashboard Observability API

Tất cả 7 endpoint theo kỳ nhận tham số `fromDate` và `toDate` dạng `YYYY-MM-DD` (giờ lịch Việt Nam +07:00). Trả về HTTP 400 nếu sai định dạng hoặc `fromDate > toDate`.

## 1. `GET /api/v1/admin/dashboard/payos-reconciliation`
- **Params**: `fromDate`, `toDate` (mặc định hôm nay VN nếu không gửi)
- **Response 200**:
  ```json
  {
    "message": "Lấy thông tin đối soát PayOS thành công",
    "data": {
      "totalTransactions": 320,
      "successCount": 298,
      "failedCount": 6,
      "pendingCount": 11,
      "voidedCount": 5,
      "totalSuccessValue": 187500000.0
    }
  }
  ```

## 2. `GET /api/v1/admin/dashboard/ai-margin`
- **Params**: `fromDate`, `toDate` (mặc định 30 ngày)
- **Response 200**:
  ```json
  {
    "message": "Lấy thông tin biên lợi nhuận AI thành công",
    "data": {
      "fromDate": "2026-10-01T00:00:00+07:00",
      "toDate": "2026-10-15T00:00:00+07:00",
      "totalSubscriptionRevVnd": 125000000.0,
      "totalAiActualCostVnd": 37500000.0,
      "netAiMarginVnd": 87500000.0,
      "marginPercentage": 70.0,
      "totalAiPaidTokens": 12500000,
      "aiRequestsCount": 43000,
      "aiErrorCount": 215
    }
  }
  ```

## 3. `GET /api/v1/admin/dashboard/subscriptions/distribution`
- **Params**: `fromDate`, `toDate` (mặc định hiện trạng nếu không gửi)
- **Response 200**:
  ```json
  {
    "message": "Lấy phân bổ subscription thành công",
    "data": {
      "distribution": [
        { "planCode": "free", "userCount": 1200, "percentage": 80.0 },
        { "planCode": "premium-monthly", "userCount": 300, "percentage": 20.0 }
      ],
      "totalUsers": 1500
    }
  }
  ```

## 4. `GET /api/v1/admin/dashboard/subscriptions/revenue-breakdown`
- **Params**: `fromDate`, `toDate` (mặc định 6 tháng gần nhất)
- **Response 200**:
  ```json
  {
    "message": "Lấy doanh thu subscription thành công",
    "data": {
      "fromDate": "2026-10-01",
      "toDate": "2026-10-15",
      "breakdown": [
        { "planCode": "premium-monthly", "month": "2026-10", "transactionCount": 42, "revenueVnd": 10500000.0 }
      ],
      "totalRevenueVnd": 10500000.0
    }
  }
  ```

## 5. `GET /api/v1/admin/dashboard/subscriptions/renewal-stats`
- **Params**: `fromDate`, `toDate` (mặc định toàn thời gian)
- **Response 200**:
  ```json
  {
    "message": "Lấy thống kê gia hạn subscription thành công",
    "data": {
      "totalAttempts": 85,
      "successCount": 70,
      "failedCount": 5,
      "successRate": 93.33,
      "avgRetryCount": 1.24
    }
  }
  ```

## 6. `GET /api/v1/admin/dashboard/ai/usage-by-operation`
- **Params**: `fromDate`, `toDate`
- **Response 200**:
  ```json
  {
    "message": "Lấy thống kê sử dụng AI thành công",
    "data": {
      "fromDate": "2026-10-01",
      "toDate": "2026-10-15",
      "operations": [
        {
          "operation": "outfit-recommend",
          "logicalRoute": "normal",
          "requestCount": 12000,
          "totalCostVnd": 850000.0,
          "totalPromptTokens": 5400000,
          "totalOutputTokens": 1800000
        }
      ]
    }
  }
  ```

## 7. `GET /api/v1/admin/dashboard/ai/error-breakdown`
- **Params**: `fromDate`, `toDate`
- **Response 200**:
  ```json
  {
    "message": "Lấy thống kê lỗi AI thành công",
    "data": {
      "totalErrors": 215,
      "totalRequests": 43000,
      "errorRate": 0.5,
      "breakdown": [
        { "errorCode": "rate_limit_exceeded", "provider": "openai", "model": "gpt-4", "errorCount": 120 }
      ]
    }
  }
  ```
