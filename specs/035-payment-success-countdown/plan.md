# Implementation Plan: 035 Payment Success Countdown Redirect

**Branch**: `035-payment-success-countdown` | **Date**: 2026-10-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/035-payment-success-countdown/spec.md`.

---

## Summary

Bổ sung cơ chế đếm ngược thời gian trực quan (5 giây) và tự động chuyển hướng người dùng về đúng trang đích sau khi thanh toán thành công trên trang kết quả `/payment/result`.

**Vấn đề & Nhu cầu**:
- Người dùng sau khi thanh toán thành công (nạp ví hoặc mua gói) thường có xu hướng chờ đợi thay vì chủ động bấm nút "Tiếp tục".
- Cần tự động đưa người dùng về trang đích mong muốn sau một khoảng thời gian chờ hợp lý (5 giây) để tạo trải nghiệm liền mạch, không bắt buộc người dùng thực hiện thao tác thừa.
- Đích đến tự động phải **tuyệt đối đồng nhất** với đích đến khi người dùng bấm nút thủ công.
- Đảm bảo dữ liệu tài khoản (số dư ví, gói hội viên) đã được hoàn tất làm mới trước khi kích hoạt bộ đếm ngược chuyển trang.

**Phương án kỹ thuật**:
1. Trong client component `src/app/payment/result/components/PaymentResultClient.tsx`:
   - Quản lý trạng thái `countdown` (khởi tạo 5 giây).
   - Kích hoạt timer đếm ngược 1 giây/lần khi `isSuccess && !isUpdating`.
   - Hiển thị trực quan số giây còn lại trên nút hành động: `Tiếp tục (${countdown}s)`.
   - Khi `countdown === 0`, tự động điều hướng thông qua `router.replace(getTargetUrl())`.
   - Sử dụng chung hàm `getTargetUrl()` để bảo đảm trang đích chuyển hướng tự động và thủ công trùng khớp 100% và bảo vệ chống Open Redirect.
   - Thêm cờ bảo vệ `hasRedirectedRef` ngăn chặn race condition / chuyển hướng lặp lại khi người dùng bấm nút lúc timer chạm 0.
   - Dọn dẹp `clearInterval` an toàn khi unmount.
2. Cập nhật và mở rộng bộ kiểm thử tự động tại `src/app/payment/result/components/PaymentResultClient.test.tsx` với Jest fake timers để kiểm chứng toàn bộ các luồng: tự động chuyển trang, click thủ công sớm, và kịch bản hủy/thất bại không đếm ngược.

---

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16 (App Router)

**Primary Dependencies**:
- `@tanstack/react-query`: Quản lý bộ nhớ đệm và polling refetch dữ liệu tài khoản.
- `next/navigation`: `useRouter`, `useSearchParams`.
- `lucide-react`: Biểu tượng trạng thái (`CheckCircle2`, `XCircle`, `AlertCircle`, `ArrowRight`, `Loader2`).
- `shadcn/ui` components: `Card`, `Button`.

**Storage/State**:
- Client component state: `useState` (`countdown`, `isUpdating`).
- Component ref: `useRef` (`hasRedirectedRef`).
- URL search params.

**Testing**:
- Jest & `@testing-library/react` (`npm test src/app/payment/result/components/PaymentResultClient.test.tsx`).
- TypeScript compiler (`npx tsc --noEmit`).
- ESLint (`npm run lint`).

**Target Platform**: Web Browsers (Chrome, Edge, Safari, Firefox, Mobile Browsers).

**Project Type**: Next.js Web Application (Frontend-only).

**Performance Goals**:
- Phản hồi chuyển trang tức thời (< 300ms) khi click thủ công.
- Tần số đếm ngược chính xác (mỗi 1000ms giảm 1 giây).
- Dọn dẹp timer triệt để, không rò rỉ bộ nhớ (zero memory leak).

**Constraints**:
- TUYỆT ĐỐI không sửa đổi backend (`smart-wardrobe-be`).
- Không phá vỡ các chức năng hiện có của trang kết quả thanh toán (vốn đã sửa trong feature 033).
- Bảo vệ an toàn chống Open Redirect: `next.startsWith('/') && !next.startsWith('//')`.
- Chỉ đếm ngược khi thanh toán thành công (`isSuccess`); không tự động chuyển trang khi giao dịch bị hủy hoặc thất bại.

---

## Constitution Check

| Nguyên tắc | Đánh giá | Trạng thái |
|---|---|---|
| **I. Non-Invasive Backend Guarantee** | Giải quyết 100% tại client component frontend, không đụng chạm backend hay API contracts. | **PASS** |
| **II. Zero Security Compromise** | Kế thừa trọn vẹn cơ chế kiểm tra tính an toàn của URL đích (`getTargetUrl`), ngăn chặn mọi nguy cơ Open Redirect. | **PASS** |
| **III. Seamless User Experience** | Tự động chuyển hướng sau khi đã hoàn tất đồng bộ dữ liệu tài khoản, giúp người dùng thấy ngay số dư mới mà không phải bấm nút. Cho phép bấm sớm nếu muốn. | **PASS** |
| **IV. Idempotency & Clean Memory** | Có cờ chặn `hasRedirectedRef` chống chuyển trang kép và dọn dẹp timer khi unmount. | **PASS** |

---

## Project Structure

### Documentation (this feature)

```text
specs/035-payment-success-countdown/
├── spec.md                                         # Đặc tả yêu cầu tính năng
├── plan.md                                         # Kế hoạch triển khai kỹ thuật (File này)
├── research.md                                     # Phân tích kỹ thuật & các quyết định kiến trúc
├── data-model.md                                   # Mô hình trạng thái & vòng đời chuyển trạng thái
├── quickstart.md                                   # Hướng dẫn xác thực & kịch bản kiểm thử
├── checklists/
│   └── requirements.md                             # Danh mục kiểm tra chất lượng đặc tả
└── contracts/
    └── payment-result-countdown-contract.md        # Hợp đồng giao diện & quy tắc phân giải URL
```

### Source Code Changes

```text
src/
└── app/
    └── payment/
        └── result/
            └── components/
                ├── PaymentResultClient.tsx         # [MODIFY] Thêm countdown state, timer effect, hiển thị số giây và auto redirect
                └── PaymentResultClient.test.tsx    # [MODIFY] Bổ sung các ca kiểm thử fake timer cho hành vi đếm ngược & điều hướng
```

**Structure Decision**: Tính năng thuộc phạm vi nâng cấp trải nghiệm người dùng tại client component `PaymentResultClient.tsx`, không phát sinh thêm thư mục hay API mới, tái sử dụng các abstraction và components sẵn có.

---

## Complexity Tracking

> Không có vi phạm kiến trúc nào cần theo dõi (0 violations). Thiết kế tối giản, sạch sẽ và an toàn.
