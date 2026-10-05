# Quickstart & Verification Guide - Admin Campaign Management & Eligibility Lookup

**Feature**: `031-admin-campaign-management`  
**Date**: 2026-10-05  
**Spec Reference**: [spec.md](./spec.md) | **API Contracts**: [api-contracts.md](./contracts/api-contracts.md)

---

## 1. Prerequisites & Setup

1. **User Role**: Log in with an account having `Admin` privileges.
2. **Backend Services**: Ensure the backend services for `smart-wardrobe-be` (running specs 025 and 026) are active at `/api/v1/admin/campaigns`.
3. **Environment**:
   ```bash
   cd c:\FPT\Project\smart-wardrobe\smart-wardrobe-fe
   npm run dev
   ```
   Access the admin portal at `http://localhost:3000/admin`.

---

## 2. End-to-End Validation Scenarios

### Scenario 1: Navigation & Campaign Overview
1. Open the left sidebar (`AdminSidebar`).
2. Verify that **"Chiến dịch tặng gói"** is present and active under `/admin/campaigns`.
3. Check the campaigns table:
   - Observe campaign codes, plan names, quota, reserve, granted counts, and remaining counts.
   - Verify that 6 statuses are rendered cleanly: `not_started`, `running`, `compensation`, `exhausted`, `expired`, `closed`.
   - Verify that `budgetLocked` chips are displayed for campaigns that have claims.
4. **Degraded State Check**:
   - If any campaign has `degraded: true`, verify the red warning banner appears at the top of the dashboard with `degradedReason`.

---

### Scenario 2: Create a New Campaign
1. Click the **"Mở chiến dịch mới"** button.
2. Fill in the form:
   - `code`: `summer-2027` (Test invalid formats like `Summer_2027` or short codes; observe instant validation).
   - `planSlug`: `premium-monthly`
   - `quota`: `100`
   - `reserve`: `10`
   - `startsAt`: Choose a future date/time.
   - `endsAt`: Choose a later date/time or leave empty.
3. Submit form:
   - Test submitting duplicate code to verify HTTP 409 error message: *"Đã tồn tại chiến dịch với mã summer-2027. Vui lòng chọn một mã khác."*
   - Submit valid code: Verify HTTP 201 response, automatic redirection to `/admin/campaigns/summer-2027`, and immediate re-fetch of fresh data.

---

### Scenario 3: Inspect Detail & Verify Budget Locking
1. Navigate to `/admin/campaigns/launch-2026-10`.
2. Observe the budget progress bar:
   - Main quota vs Compensation reserve.
   - `hardCap` calculation.
   - `watermarkAt` and `lastSweepAt` timestamps.
3. Click **"Sửa chiến dịch"**:
   - For an active campaign with claims (`budgetLocked = true`):
     - Verify `quota`, `reserve`, and `planSlug` inputs are **disabled**.
     - Verify the explanation note is displayed: *"Chiến dịch đã cấp — hãy đóng và mở mã mới"*.
     - Verify `startsAt` and `endsAt` remain **editable**.
     - Clear `endsAt` and save; verify `endsAt: null` is sent to the server.

---

### Scenario 4: Concurrency Version Conflict (HTTP 412)
1. Open the Edit modal for a campaign (holding `version: 1`).
2. Simulate another user updating the campaign in the background (or execute a PATCH in another tab to bump version to 2).
3. Click "Lưu thay đổi" on the original form:
   - Verify HTTP 412 is intercepted.
   - Verify Sonner toast: *"Dữ liệu chiến dịch đã thay đổi bởi thao tác khác. Đang tải lại thông tin mới nhất..."*.
   - Verify the form re-synchronizes with `version: 2` without crashing.

---

### Scenario 5: Force Close Campaign (Irreversible)
1. In the campaign detail view, click **"Đóng chiến dịch"**.
2. Verify the red destructive dialog warns: *"Thao tác đóng là một chiều, không thể mở lại sau khi đóng."*
3. Try clicking confirm without a reason; verify the button is disabled.
4. Enter reason: `"Hết ngân sách thử nghiệm quý 4"` and submit.
5. Verify:
   - Campaign status immediately changes to `closed` with badge "Đã đóng" and timestamp `closedAt`.
   - Campaign detail query is re-fetched.
   - Subsequent clicks on close handle idempotency smoothly.

---

### Scenario 6: Customer Eligibility Lookup
1. In the "Tra cứu điều kiện khách hàng" widget:
   - Enter `campaignCode`: `launch-2026-10`
   - Enter `userId`:
     - Test an eligible pending user: Verify result shows `eligible_pending` with text: *"Bạn đủ điều kiện, hệ thống đang xử lý — thường chưa tới 1 phút"*. (Ensure it is **NOT** labeled as exhausted).
     - Test a granted user: Verify result shows `granted` with expiry date.
     - Test an outside-window user: Verify result shows `outside_window` translation.
     - Test non-existent campaign code: Verify error says *"Không tìm thấy chiến dịch với mã đã nhận"*.
     - Test non-existent user ID: Verify error says *"Không tìm thấy tài khoản người dùng"*.

---

### Scenario 7: Claims List & Time-Range Filtering
1. On the campaign detail page, switch to the **"Lượt cấp gói"** tab.
2. Verify claims table columns: `userId`, `username`, `planSlug`, `source` (`"Hạn mức chính"` or `"Suất dự phòng"`), `registeredAt`, `grantedAt`, `expiresAt`.
3. Pick a date filter range (`from` and `to`):
   - Verify outgoing request includes timezone offset in RFC3339 format.
   - Verify pagination controls function correctly.

---

### Scenario 8: Audit Log & Diff Viewer
1. Switch to the **"Nhật ký kiểm toán"** tab.
2. Check recent audit entries:
   - Verify `actorUserId`, IP, and timestamp are displayed.
   - For `campaign.update`: Verify the diff viewer highlights before/after values and versions.
   - For `campaign.close`: Verify the closing reason is clearly presented.
   - Confirm note: *"Nhật ký thay đổi được ghi nhận bất đồng bộ..."*.
