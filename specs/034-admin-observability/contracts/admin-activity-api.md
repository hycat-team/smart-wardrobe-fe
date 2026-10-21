# Contract: Admin Activity Events API

## `GET /api/v1/admin/activity-events`

Lấy danh sách nhật ký hoạt động xác thực người dùng (đăng nhập / làm mới phiên) có phân trang và lọc theo điều kiện.

### Request

- **Method**: `GET`
- **Path**: `/api/v1/admin/activity-events`
- **Headers**:
  - `Authorization: Bearer <admin_access_token>`
- **Query Parameters**:

| Tham số | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `userId` | string (UUID) | Không | Lọc theo mã người dùng. Sai định dạng UUID -> HTTP 400 |
| `activityType` | string | Không | `login` hoặc `refresh`. Khác giá trị này -> HTTP 400 |
| `fromDate` | string (`YYYY-MM-DD`) | Không | Ngày bắt đầu theo giờ Việt Nam (+07:00) |
| `toDate` | string (`YYYY-MM-DD`) | Không | Ngày kết thúc theo giờ Việt Nam (+07:00); `fromDate > toDate` -> HTTP 400 |
| `page` | integer | Không | Số trang (mặc định 1) |
| `limit` | integer | Không | Số bản ghi mỗi trang (mặc định 20, trần 100) |

### Response 200 OK

```json
{
  "message": "Lấy danh sách hoạt động người dùng thành công",
  "data": {
    "items": [
      {
        "id": "9f0b6a3e-4c5d-4e6f-8a9b-0c1d2e3f4a5b",
        "userId": "1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e5f",
        "activityType": "login",
        "occurredAt": "2026-10-15T08:31:02+07:00",
        "createdAt": "2026-10-15T08:31:02+07:00",
        "userEmail": "an.nguyen@example.com",
        "userFirstName": "An",
        "userLastName": "Nguyễn"
      }
    ],
    "metadata": {
      "page": 1,
      "limit": 20,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

### Response 400 Bad Request

```json
{
  "status": 400,
  "title": "Thao tác không thành công",
  "message": "Loại hoạt động (activityType) không hợp lệ. Chỉ chấp nhận: login, refresh."
}
```
hoặc:
```json
{
  "status": 400,
  "title": "Thao tác không thành công",
  "message": "Ngày bắt đầu (fromDate) không được sau ngày kết thúc (toDate)."
}
```
