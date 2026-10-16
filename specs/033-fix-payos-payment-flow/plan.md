# Implementation Plan: 033 Fix PayOS Payment Flow

**Branch**: `033-fix-payos-payment-flow` | **Date**: 2026-10-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/033-fix-payos-payment-flow/spec.md`.

---

## Summary

Khắc phục toàn diện lỗi điều hướng và mất phiên đăng nhập sau khi thanh toán hoặc hủy trên cổng PayOS cho cả hai luồng nạp tiền vào ví và mua gói dịch vụ trực tiếp.

**Nguyên nhân gốc rễ**:
1. Cookie phiên `accessToken`/`refreshToken` có thuộc tính `SameSite=Strict`. Khi PayOS redirect trở lại (cross-site top-level navigation), trình duyệt không đính kèm cookie Strict trong request GET ban đầu. Do đó server component `/profile` gọi `serverFetch('/me')` bị 401 và đẩy sang `/auth/login`.
2. Luồng mua gói trực tiếp tại `PricingCard.tsx` không truyền `returnUrl`/`cancelUrl`, khiến backend fallback về root domain `https://closy.hycat.online/`.
3. Không có trang giao diện thông báo kết quả (thành công/hủy), không tự động làm mới số dư ví hoặc trạng thái gói đăng ký sau khi quay về.

**Giải pháp (Frontend-Only)**:
1. Mở rộng TypeScript interface tại `src/features/billing/types/index.ts` để hỗ trợ `returnUrl`, `cancelUrl` và `orderCode`.
2. Tạo trang kết quả thanh toán công khai `src/app/payment/result/page.tsx` và client component `src/app/payment/result/components/PaymentResultClient.tsx` (nằm ngoài route group `(user)` để không dính SSR auth guard).
3. Đọc các tham số phản hồi (`code`, `cancel`, `status`, `orderCode`, `flow`, `next`), xác định trạng thái giao dịch, tự động refetch cache (profile, wallet, subscription) với cơ chế polling 5 lần x 2s để chờ webhook backend hoàn tất.
4. Điều hướng an toàn bằng nút "Tiếp tục" (chống open redirect) trở về đúng trang đích (`/pricing` hoặc `/profile?tab=wallet`).
5. Cập nhật `PricingCard.tsx`, `TopUpModal.tsx`, `billing/TopupModal.tsx`, `billing.queries.ts` để truyền `returnUrl` và `cancelUrl` sử dụng `window.location.origin`.
6. Đồng bộ trạng thái tab ví trên trang Profile thông qua tham số `?tab=wallet` tại `ProfileClient.tsx`.

---

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16 (App Router)

**Primary Dependencies**:
- `@tanstack/react-query`: Quản lý bộ nhớ đệm, invalidate và refetch dữ liệu ví, gói dịch vụ và người dùng.
- `lucide-react`: Biểu tượng trạng thái (CheckCircle, XCircle, Clock, AlertTriangle, ArrowRight, Loader2).
- `sonner`: Thông báo toast.
- `framer-motion`: Hiệu ứng chuyển động mượt mà cho thẻ thông báo kết quả.
- `next/navigation`: `useSearchParams`, `useRouter`, `usePathname`.

**Storage/State**:
- React Query cache: query keys `['me']`, `['wallet', 'balance']`, `['wallet', 'statements']`, `['subscription', 'me']`, `['subscription', 'quota']`.
- Client URL search params.

**Testing**:
- Jest (`npm test`)
- TypeScript compiler (`npx tsc --noEmit`)
- ESLint (`npm run lint`)

**Target Platform**: Web Browsers (Chrome, Edge, Safari, Firefox).

**Constraints**:
- TUYỆT ĐỐI không sửa đổi backend (`smart-wardrobe-be`).
- Không hardcode domain; dùng `window.location.origin` ở client.
- Bảo mật chặn Open Redirect: `next.startsWith('/') && !next.startsWith('//')`.
- Tuân thủ quy ước repo: không thêm comment không cần thiết, giữ nguyên kiểu code hiện tại.

---

## Constitution Check

| Nguyên tắc | Đánh giá | Trạng thái |
|---|---|---|
| **I. Non-Invasive Backend Guarantee** | Giải quyết 100% phía frontend mà không thay đổi bất kỳ file nào trong `smart-wardrobe-be`. | **PASS** |
| **II. Zero Security Compromise** | Không hạ cấp cookie SameSite từ backend. Bảo vệ người dùng với xác thực chống Open Redirect trên client. | **PASS** |
| **III. Seamless User Experience** | Loại bỏ hiện tượng văng phiên đăng nhập, cung cấp phản hồi trực quan rõ ràng và tự động cập nhật số dư/gói. | **PASS** |
| **IV. Clean Architecture & Route Isolation** | Tách biệt route công khai `/payment/result` ra khỏi route group có SSR auth guard `(user)`. | **PASS** |

---

## Project Structure

### Documentation

```text
specs/033-fix-payos-payment-flow/
├── spec.md                              # Đặc tả yêu cầu tính năng
├── plan.md                              # Kế hoạch triển khai (File này)
├── research.md                          # Phân tích nguyên nhân & các quyết định kỹ thuật
├── data-model.md                        # Cấu trúc dữ liệu & kiểu TypeScript
├── quickstart.md                        # Kịch bản kiểm thử kiểm tra luồng
├── checklists/
│   └── requirements.md                  # Kiểm định chất lượng yêu cầu
└── contracts/
    └── payment-result-contract.md       # Hợp đồng tham số URL & trạng thái giao dịch
```

### Source Code Changes

```text
src/
├── app/
│   ├── (user)/
│   │   └── profile/
│   │       └── components/
│   │           └── ProfileClient.tsx              # [MODIFY] Đọc và sync ?tab=wallet vào activeTab & router
│   └── payment/
│       └── result/
│           ├── page.tsx                           # [NEW] Server component bọc Suspense cho trang kết quả công khai
│           └── components/
│               └── PaymentResultClient.tsx        # [NEW] Client component xử lý tham số, hiển thị UI và polling refetch
├── features/
│   ├── billing/
│   │   ├── components/
│   │   │   └── TopupModal.tsx                     # [MODIFY] Truyền returnUrl & cancelUrl
│   │   ├── queries/
│   │   │   └── billing.queries.ts                 # [MODIFY] Xử lý tham số returnUrl & cancelUrl
│   │   └── types/
│   │       └── index.ts                           # [MODIFY] Bổ sung returnUrl, cancelUrl, orderCode
│   ├── subscription/
│   │   └── components/
│   │       └── PricingCard.tsx                    # [MODIFY] Build resultUrl cho luồng purchase và gọi mutate
│   └── wallet/
│       └── components/
│           └── TopUpModal.tsx                     # [MODIFY] Thay window.location.href bằng resultUrl cho luồng topup
```
