# Phase 1: UI Component Contracts - Admin Campaign Management & Eligibility Lookup

**Feature**: `031-admin-campaign-management`  
**Date**: 2026-10-05  
**Spec Reference**: [spec.md](../spec.md)

---

## 1. Page & Container Architecture

### 1.1 Routes & Hierarchy
- `/admin/campaigns` (`src/app/admin/campaigns/page.tsx`):
  - `CampaignDashboardHeader`: Title, Stats Summary, "Mở chiến dịch" CTA.
  - `CampaignUrgentBanner`: Displays prominent red alert if any running campaign has `degraded: true`.
  - `CampaignTable`: List of campaigns with status badges, budget locked chips, progress indicators.
  - `CustomerEligibilityCard`: Dedicated card/drawer for checking customer eligibility by `userId`.
  - `CreateCampaignModal`: Form dialog for starting a new campaign.
- `/admin/campaigns/[code]` (`src/app/admin/campaigns/[code]/page.tsx`):
  - `CampaignDetailHeader`: Code, Plan Name, Status Badge, `degraded` alert, Actions ("Sửa", "Đóng").
  - `CampaignBudgetProgressBar`: Visual bar showing Main Quota vs Compensation Reserve vs Claimed.
  - `CampaignDetailTabs`:
    - Tab 1: **Tổng quan & Ngân sách** (`CampaignOverviewTab`): Detailed key-value grid, timestamps, watermark, sweep time.
    - Tab 2: **Lượt cấp gói** (`CampaignClaimsTab`): Claims table with `from`/`to` date filters and pagination.
    - Tab 3: **Nhật ký kiểm toán** (`CampaignAuditTab`): Audit trail with diff viewer.
  - `EditCampaignModal`: Modal dialog with conditional disabling when `budgetLocked: true`.
  - `CloseCampaignDialog`: Destructive confirmation dialog with mandatory reason textarea.

---

## 2. Component Specifications & Props Contracts

### 2.1 `CampaignStatusBadge`
Renders the 6 lifecycle states with strict priority mapping.
```typescript
interface CampaignStatusBadgeProps {
  status: CampaignStatus | string;
  closedAt?: string | null;
  className?: string;
}
```
**Render Rules**:
- `closed`: Red badge `"Đã đóng"` (tooltip shows `closedAt`).
- `exhausted`: Gray/neutral badge `"Đã hết suất"`.
- `expired`: Muted badge `"Đã kết thúc"`.
- `compensation`: Amber/yellow badge `"Đang chạy — chỉ còn dự phòng"`.
- `running`: Emerald/green badge `"Đang chạy"`.
- `not_started`: Blue/info badge `"Sắp mở"`.
- Default: Muted badge with fallback text for unknown values.

---

### 2.2 `CampaignDegradedAlert`
Urgent callout when `degraded === true`.
```typescript
interface CampaignDegradedAlertProps {
  degraded: boolean;
  degradedReason?: string;
  campaignCode?: string;
  lastSweepAt?: string | null;
}
```
**Render Rules**:
- Hidden if `degraded === false`.
- If `true`: High-priority red callout with pulsing alert icon, warning that background workers failed to grant subscriptions. Displays `degradedReason` (or fallback message if empty).

---

### 2.3 `CampaignBudgetProgressBar`
Visual progress indicator for quota and compensation reserve.
```typescript
interface CampaignBudgetProgressBarProps {
  quota: number;
  reserve: number;
  grantedMainCount: number;
  grantedCompensationCount: number;
  hardCap: number;
}
```
**Render Rules**:
- Shows two-segmented progress bar or dual bars (Main: `grantedMainCount / quota`, Reserve: `grantedCompensationCount / reserve`).
- Displays numbers clearly: e.g. "Đã cấp: 23 / 50 chính (46%) + 0 / 5 dự phòng (0%) | Trần cứng: 55".

---

### 2.4 `CustomerEligibilityLookup`
Customer support interactive query tool.
```typescript
interface CustomerEligibilityLookupProps {
  defaultCampaignCode?: string;
  campaigns?: Array<{ code: string; planName: string }>;
}
```
**User Interactions**:
1. Select campaign from dropdown or type campaign code.
2. Enter `userId` (with trim/clean up).
3. Click "Tra cứu điều kiện" (triggers TanStack Query fetch).
4. Displays formatted result card:
   - Status badge (e.g., `eligible_pending` with bright note: *"Bạn đủ điều kiện, hệ thống đang xử lý — thường chưa tới 1 phút"*).
   - If `granted`: Expiry date badge.
   - If not eligible: Vietnamese translated reason message.
   - Accurate 404 message (campaign not found vs user not found).

---

### 2.5 `CampaignAuditDiffViewer`
Visualizer for polymorphic audit payloads.
```typescript
interface CampaignAuditDiffViewerProps {
  action: CampaignAuditAction;
  payload: CampaignAuditPayload;
}
```
**Render Rules**:
- `campaign.create`: Grid showing initial `planSlug`, `quota`, `reserve`, `startsAt`, `endsAt`.
- `campaign.update`: Side-by-side table (`Trường`, `Trước`, `Sau`) highlighting only modified values.
- `campaign.close`: Callout displaying the reason text and `closedAt` timestamp.

---

### 2.6 `EditCampaignModal` & Budget Locking
```typescript
interface EditCampaignModalProps {
  campaign: CampaignSummaryRes;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```
**Field Locking Behavior**:
- If `campaign.budgetLocked === true`:
  - `quota`: `disabled`, tooltip/note: *"Chiến dịch đã cấp — hãy đóng và mở mã mới"*.
  - `reserve`: `disabled`.
  - `planSlug`: `disabled`.
  - `startsAt`: `enabled`.
  - `endsAt`: `enabled` (clearing input sends `endsAt: null`).
- On submit: sends `version: campaign.version`.
- On 412: Sonner toast notification, triggers automatic reload of campaign data.

---

### 2.7 `CloseCampaignDialog`
```typescript
interface CloseCampaignDialogProps {
  campaignCode: string;
  version: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```
**Interaction Rules**:
- Red destructive CTA button.
- Mandatory textarea for `reason` (submit button disabled until `reason.trim().length > 0`).
- Warning text: *"Thao tác đóng là một chiều, không thể mở lại sau khi đóng."*
