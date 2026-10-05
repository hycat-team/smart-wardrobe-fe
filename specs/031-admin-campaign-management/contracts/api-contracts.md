# Phase 1: API Contracts - Admin Campaign Management & Eligibility Lookup

**Feature**: `031-admin-campaign-management`  
**Date**: 2026-10-05  
**Spec Reference**: [spec.md](../spec.md) | **Base Path**: `/api/v1/admin/campaigns`

---

## 1. Overview of Endpoints

All 8 endpoints require authenticated user with `Admin` role. Responses are wrapped in `APIResponse<T>`:
```typescript
interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
```

| # | Method | Path | Purpose | State / Notes |
|---|--------|------|---------|---------------|
| 1 | `GET` | `/admin/campaigns` | List campaigns + derived budget | Read, 21 fields, pagination |
| 2 | `GET` | `/admin/campaigns/{code}` | Single campaign detail | Read, 21 fields, authoritative |
| 3 | `GET` | `/admin/campaigns/{code}/claims` | Claims list for a campaign | Read, filtered by `from`/`to` |
| 4 | `GET` | `/admin/campaigns/{code}/eligibility/{userId}` | Check account eligibility | Customer support core lookup |
| 5 | `POST` | `/admin/campaigns` | Create new campaign | Write (201). **Must refetch GET /{code}** |
| 6 | `PATCH` | `/admin/campaigns/{code}` | Edit campaign | Write (200). `version` required. **Must refetch** |
| 7 | `POST` | `/admin/campaigns/{code}/close` | Force close campaign | Write (200). Irreversible. **Must refetch** |
| 8 | `GET` | `/admin/campaigns/{code}/audit` | Campaign audit trail | Read, async log items |

---

## 2. API Contract Specifications

### 2.1 `GET /admin/campaigns`
- **Query Params**:
  - `page?: number` (default 1)
  - `limit?: number` (default 20)
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "items": [
      {
        "code": "launch-2026-10",
        "planSlug": "premium-monthly",
        "planName": "Premium Tháng",
        "quota": 50,
        "reserve": 5,
        "grantedMainCount": 23,
        "grantedCompensationCount": 0,
        "grantedTotalCount": 23,
        "remainingMain": 27,
        "remainingCompensation": 5,
        "hardCap": 55,
        "startsAt": "2026-10-02T00:00:00+07:00",
        "endsAt": null,
        "watermarkAt": null,
        "status": "running",
        "degraded": false,
        "degradedReason": "",
        "lastSweepAt": "2026-10-02T20:31:12+07:00",
        "closedAt": null,
        "budgetLocked": true,
        "version": 1
      }
    ],
    "metadata": { "page": 1, "limit": 20, "totalItems": 1, "totalPages": 1 }
  }
}
```

---

### 2.2 `GET /admin/campaigns/{code}`
- **Path Params**: `code: string`
- **Response `200 OK`**: Same schema as individual item above.
- **Error Responses**:
  - `404 Not Found`: `{ "success": false, "message": "Không tìm thấy chiến dịch với mã đã nhận: <code>." }`

---

### 2.3 `GET /admin/campaigns/{code}/claims`
- **Path Params**: `code: string`
- **Query Params**:
  - `page?: number`
  - `limit?: number`
  - `from?: string` (RFC3339 with timezone, e.g. `2026-10-02T00:00:00+07:00`)
  - `to?: string` (RFC3339 with timezone)
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "items": [
      {
        "userId": "b1c2d3e4-aaaa-bbbb-cccc-111122223333",
        "username": "nguyenvana",
        "planSlug": "premium-monthly",
        "expiresAt": "2026-11-01T00:00:05+07:00",
        "grantedAt": "2026-10-02T00:00:05+07:00",
        "registeredAt": "2026-10-02T00:00:03+07:00",
        "source": "main"
      }
    ],
    "metadata": { "page": 1, "limit": 20, "totalItems": 1, "totalPages": 1 }
  }
}
```
- **Error Responses**:
  - `400 Bad Request`: When `from` or `to` lacks timezone.
  - `404 Not Found`: When campaign code not found.

---

### 2.4 `GET /admin/campaigns/{code}/eligibility/{userId}`
- **Path Params**: `code: string`, `userId: string`
- **Response `200 OK` (Pending)**:
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "campaignCode": "launch-2026-10",
    "userId": "b1c2d3e4-aaaa-bbbb-cccc-111122223333",
    "eligibility": "eligible_pending",
    "granted": false,
    "watermarkAt": null,
    "userRegisteredAt": "2026-10-02T00:31:40+07:00"
  }
}
```
- **Response `200 OK` (Not Eligible with reason)**:
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "campaignCode": "launch-2026-10",
    "userId": "b1c2d3e4-aaaa-bbbb-cccc-111122223333",
    "eligibility": "not_eligible",
    "granted": false,
    "reason": "outside_window",
    "watermarkAt": null,
    "userRegisteredAt": "2026-09-01T00:00:00+07:00"
  }
}
```
- **Error Responses**:
  - `404 Not Found` (Campaign): "Không tìm thấy chiến dịch với mã đã nhận: `<code>`."
  - `404 Not Found` (User): "Không tìm thấy tài khoản."

---

### 2.5 `POST /admin/campaigns`
- **Request Body**:
```json
{
  "code": "tet-2027",
  "planSlug": "premium-monthly",
  "quota": 100,
  "reserve": 10,
  "startsAt": "2027-01-20T00:00:00+07:00",
  "endsAt": "2027-02-05T00:00:00+07:00"
}
```
- **Response `201 Created`**:
  - Returns `CampaignSummaryRes` with `version: 1`.
  - ⚠️ Counter fields are 0/uncomputed. **FE must immediately invoke `GET /admin/campaigns/{code}`**.
- **Error Responses**:
  - `400 Bad Request`: Code regex failure or timezone missing.
  - `409 Conflict`: "Đã tồn tại chiến dịch với mã `<code>`. Vui lòng chọn một mã khác."
  - `422 Unprocessable Entity`: `quota < 1`, `planSlug` empty.

---

### 2.6 `PATCH /admin/campaigns/{code}`
- **Path Params**: `code: string`
- **Request Body**:
```json
{
  "version": 1,
  "quota": 120,
  "startsAt": "2027-01-20T00:00:00+07:00",
  "endsAt": null
}
```
- **Response `200 OK`**:
  - Returns updated summary.
  - ⚠️ **FE must immediately invoke `GET /admin/campaigns/{code}`**.
- **Error Responses**:
  - `412 Precondition Failed`: Version mismatch.
  - `422 Unprocessable Entity`: Modifying `quota`/`reserve`/`planSlug` when `budgetLocked = true`.

---

### 2.7 `POST /admin/campaigns/{code}/close`
- **Path Params**: `code: string`
- **Request Body**:
```json
{
  "version": 3,
  "reason": "Hết ngân sách khuyến mãi tháng 11"
}
```
- **Response `200 OK`**:
  - Status becomes `closed`, `closedAt` populated.
  - Idempotent: Subsequent calls return `200 OK` without error.
  - ⚠️ **FE must invoke `GET /admin/campaigns/{code}`**.
- **Error Responses**:
  - `412 Precondition Failed`: Version mismatch on active campaign.
  - `422 Unprocessable Entity`: `reason` empty.

---

### 2.8 `GET /admin/campaigns/{code}/audit`
- **Path Params**: `code: string`
- **Query Params**: `page?: number`, `limit?: number`
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Đã xử lý yêu cầu tra cứu nhật ký chiến dịch.",
  "data": {
    "items": [
      {
        "id": "9f1c-aaaa-bbbb-cccc-1111",
        "actorUserId": "5a2b-aaaa-bbbb-cccc-2222",
        "action": "campaign.update",
        "targetType": "campaign",
        "targetId": null,
        "payload": {
          "campaignCode": "launch-2026-10",
          "before": { "version": 1, "quota": 50, "reserve": 5 },
          "after":  { "version": 2, "quota": 60, "reserve": 5 }
        },
        "requestIp": "203.0.113.7",
        "createdAt": "2026-10-03T10:15:00+07:00"
      }
    ],
    "metadata": { "page": 1, "limit": 20, "totalItems": 1, "totalPages": 1 }
  }
}
```
- **Error Responses**:
  - `404 Not Found`: Campaign code does not exist.
