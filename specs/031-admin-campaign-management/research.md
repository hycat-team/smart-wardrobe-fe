# Phase 0: Outline & Research - Admin Campaign Management & Eligibility Lookup

**Feature**: `031-admin-campaign-management`  
**Date**: 2026-10-05  
**Spec Reference**: [spec.md](./spec.md)

---

## 1. Technical Context & Unknowns

The feature requires creating a comprehensive administrative module in `smart-wardrobe-fe` for managing promotion campaigns and looking up customer signup grant eligibility based on backend specs `025-signup-campaign-grant` and `026-campaign-registry-db`.

### Key Technical Challenges & Research Questions:

1. **Architecture & Routing**: Where should the campaign screens reside in Next.js App Router, and how should navigation be integrated into `AdminSidebar`?
2. **Real-time Budget Metrics & Write-Response Divergence**: The backend documentation explicitly warns that 3 write endpoints (`POST`, `PATCH`, `POST .../close`) return 0 or placeholder budget counters. How should the frontend guarantee fresh, accurate budget metrics without display flicker?
3. **Optimistic Concurrency & Versioning (`version` / HTTP 412)**: How should the client handle version mismatch during edit and close operations?
4. **Budget Locking Rules (`budgetLocked`)**: How to structure form controls and validations to dynamically freeze budget-critical fields when claims exist?
5. **Timezone Preservation (RFC3339)**: Backend strictly validates RFC3339 timestamps with timezones (rejecting naive datetime with HTTP 400). How to handle date inputs seamlessly in the browser?
6. **Customer Eligibility & Reason Code Mapping**: How to design an ergonomic lookup UI for support staff that handles 6 eligibility states and 12 Vietnamese-translated reason codes accurately?
7. **Audit Log Diff Visualization**: Backend audit records store polymorphic `before` and `after` objects in `payload` with `targetId: null`. How should the frontend render changes cleanly?

---

## 2. Research Findings & Architectural Decisions

### Decision 1: Next.js App Router Structure & Admin Navigation
- **Decision**: 
  - Main listing and customer eligibility lookup: `src/app/admin/campaigns/page.tsx`
  - Campaign creation page/modal: Modal dialog or sub-component inside campaigns dashboard (with route support if needed).
  - Campaign detail view with tabs (Overview/Progress, Claims, Audit): `src/app/admin/campaigns/[code]/page.tsx`
  - Feature module code: `src/features/admin/campaigns/` containing `api/`, `queries/`, `components/`, and `types/`.
  - Add `{ href: '/admin/campaigns', label: 'Chiến dịch tặng gói', icon: GiftIcon }` to `AdminSidebar.tsx`.
- **Rationale**: Follows existing feature-sliced architecture in `src/features/admin/` and App Router conventions used in `/admin/community` and `/admin/users`.
- **Alternatives Considered**: 
  - Keeping everything in a single page with modals: Would make the detail view, claims table with date filters, and audit log overly cramped and harder to bookmark/share deep links.

### Decision 2: TanStack Query Cache & Post-Mutation Re-fetch Strategy
- **Decision**: 
  - Maintain specific query keys: `['admin-campaigns', 'list']`, `['admin-campaigns', 'detail', code]`, `['admin-campaigns', 'claims', code, params]`, `['admin-campaigns', 'audit', code, params]`, `['admin-campaigns', 'eligibility', code, userId]`.
  - In `useCreateCampaign`, `useUpdateCampaign`, and `useCloseCampaign` mutations:
    - Never use the mutation response to populate the budget counters or status.
    - Automatically call `queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] })` and immediately trigger an explicit `await queryClient.fetchQuery` or refetch on the target campaign detail query.
- **Rationale**: Backend R7 and 026 explicitly state that write handlers bypass the claims ledger (`campaign_claims`), returning zeroes for `grantedMainCount`, `grantedCompensationCount`, and `grantedTotalCount`. Re-fetching `GET /api/v1/admin/campaigns/{code}` guarantees true, real-time ledger counts.
- **Alternatives Considered**:
  - Guessing local budget counts optimistically: Rejected as dangerous because multiple server workers and background claim processes run concurrently.

### Decision 3: Form State, Zod Schema & RFC3339 Timestamp Formatting
- **Decision**:
  - Use `react-hook-form` with `@hookform/resolvers/zod` for type-safe forms.
  - Campaign code validation schema: `z.string().regex(/^[a-z0-9][a-z0-9-]{2,63}$/, 'Mã chiến dịch từ 3-64 ký tự, chỉ gồm chữ thường, số và dấu gạch ngang')`.
  - Date inputs: Use HTML5 datetime-local or Radix Popover with date picker; convert selected dates to RFC3339 strings including timezone offset (e.g., using `date-fns` `format(date, "yyyy-MM-dd'T'HH:mm:ssXXX")`).
  - Dates for `PATCH`: Send `endsAt: null` when the user clears the end date (indicating an open-ended campaign).
- **Rationale**: Backend parser strictly demands RFC3339 with timezone and returns 400 Bad Request if missing. Sending explicit timezone strings prevents backend rejection.

### Decision 4: Concurrency Conflict Handling (HTTP 412 Precondition Failed)
- **Decision**:
  - Every `PATCH` and `POST /close` request includes the latest known `version: number`.
  - If backend returns HTTP 412, intercept via mutation error handler:
    1. Display warning toast via Sonner: *"Dữ liệu chiến dịch đã thay đổi bởi thao tác khác. Đang tải lại thông tin mới nhất..."*
    2. Invalidate and re-fetch `['admin-campaigns', 'detail', code]`.
    3. Update form values with the newly fetched `version` and changed fields so the admin can review the latest state.
- **Rationale**: Prevents accidental overwriting of campaign budgets or dates modified by another admin.

### Decision 5: Budget Locking UI Guard (`budgetLocked: true`)
- **Decision**:
  - When `campaign.budgetLocked === true`, disable the `quota`, `reserve`, and `planSlug` form fields.
  - Display an amber callout banner: *"Chiến dịch đã cấp — hãy đóng và mở mã mới"* directly beneath the locked inputs.
  - Keep `startsAt` and `endsAt` editable as per backend spec 026 US4.
- **Rationale**: Backend returns 422 Unprocessable Entity if any locked budget fields are submitted. Enforcing this at the UI level eliminates user frustration.

### Decision 6: Customer Eligibility Lookup UX & Reason Dictionary
- **Decision**:
  - Create a dedicated quick-lookup card/drawer accessible directly from the campaigns list and detail pages.
  - Render an interactive search with `campaignCode` (dropdown of active campaigns or text input) and `userId` (UUID/string).
  - Explicit visual mapping for 6 eligibility states:
    - `granted`: Green badge with expiration date.
    - `eligible_pending`: Amber/blue processing badge with *"Bạn đủ điều kiện, hệ thống đang xử lý — thường chưa tới 1 phút"*.
    - `eligible_but_exhausted`: Neutral badge *"Chiến dịch đã hết suất"*.
    - `not_eligible`, `already_claimed_other_campaign`, `created_by_admin`: Status badges with respective Vietnamese translations.
  - Reason code dictionary: A pure TypeScript mapping table converting the 12 backend codes to concise Vietnamese explanations, gracefully handling empty strings for `granted` and `eligible_pending`.
  - Error separation: Catch 404 and inspect response message to distinguish between non-existent campaign code and non-existent user account.

### Decision 7: Audit Log Parser & Diff Table
- **Decision**:
  - Audit DTO has `targetId: null` always, with campaign code in `payload.campaignCode`. The UI will ignore `targetId` and use `payload.campaignCode`.
  - Component `CampaignAuditDiffViewer`:
    - For `campaign.create`: List initialized parameters.
    - For `campaign.update`: Render side-by-side comparison (Before vs After) for modified keys (`quota`, `reserve`, `planSlug`, `startsAt`, `endsAt`), showing `version` change.
    - For `campaign.close`: Highlight reason string and `closedAt`.
- **Rationale**: Clean, readable inspection without raw JSON dumps for operations staff.

---

## 3. Best Practices & Design Enforcements

1. **Design System & Taste**:
   - Clean, minimalist aesthetic matching Closy Admin.
   - High visual contrast for the `degraded` state (pulsing red dot + persistent warning banner).
   - Crisp progress bars for main quota and compensation reserve.
2. **Accessibility & Safety**:
   - Double-confirmation dialog (`AlertDialog`) with required reason input for destructive `close` action.
   - All interactive buttons have clear loading spinners and disabled states during network calls.
