# Interface Contract: Payment Result Countdown & Redirect

## Overview

Tài liệu này định nghĩa hợp đồng giao diện giữa các tham số điều hướng trả về từ cổng thanh toán, cơ chế đếm ngược thời gian và hành vi điều hướng tại trang kết quả `/payment/result`.

---

## 1. Input Contract: URL Search Parameters

Trang `/payment/result` nhận các tham số truy vấn qua chuỗi URL:

| Tham số | Kiểu | Bắt buộc | Mô tả | Ví dụ |
|---|:---:|:---:|---|---|
| `code` | `string` | Có | Mã phản hồi kết quả giao dịch ('00' là thành công) | `'00'`, `'09'` |
| `cancel` | `string` | Không | Cờ biểu thị giao dịch bị người dùng hủy ('true' hoặc 'false') | `'false'`, `'true'` |
| `status` | `string` | Không | Trạng thái giao dịch văn bản từ cổng PayOS | `'PAID'`, `'CANCELLED'` |
| `orderCode`| `string` | Không | Mã định danh số của đơn hàng | `'12345678'` |
| `flow` | `string` | Không | Loại giao dịch: nạp tiền ví hoặc mua gói | `'topup'`, `'purchase'` |
| `next` | `string` | Không | Đường dẫn nội bộ chuyển tiếp mong muốn sau khi hoàn tất | `'/profile?tab=wallet'`, `'/pricing'` |

---

## 2. Navigation Destination Contract (`getTargetUrl`)

Quy tắc giải quyết đích đến **BẮT BUỘC** áp dụng chung cho cả hai sự kiện:
- Khi người dùng click nút **"Tiếp tục"**
- Khi đồng hồ đếm ngược chạm mốc `0` giây

### Contract Rules:

```typescript
function getTargetUrl(flow: string | null, next: string | null): string {
  // Quy tắc 1: Kiểm tra an toàn tham số `next` (chặn Open Redirect)
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    return next;
  }

  // Quy tắc 2: Phân luồng mặc định nếu không có `next` hợp lệ
  if (flow === 'purchase') {
    return '/pricing';
  }

  // Quy tắc 3: Fallback mặc định cho luồng nạp ví hoặc các luồng khác
  return '/profile?tab=wallet';
}
```

### Destination Mapping Matrix:

| Kịch bản | `flow` | `next` | Đích đến kết quả (`targetUrl`) |
|---|---|---|---|
| Nạp ví thông thường | `'topup'` | `'/profile?tab=wallet'` | `'/profile?tab=wallet'` |
| Mua gói từ bảng giá | `'purchase'` | `'/pricing'` | `'/pricing'` |
| Chuyển hướng trang tuỳ chọn hợp lệ | Bất kỳ | `'/dashboard'` | `'/dashboard'` |
| Ngăn chặn Open Redirect | Bất kỳ | `'https://attacker.com'` | Fallback theo `flow` (`/pricing` hoặc `/profile?tab=wallet`) |
| Ngăn chặn Schema-relative URL | Bất kỳ | `'//malicious.com'` | Fallback theo `flow` (`/pricing` hoặc `/profile?tab=wallet`) |

---

## 3. UI State & Countdown Contract

### State Transitions & Timers:

| Giai đoạn | Trạng thái hiển thị | Trạng thái nút "Tiếp tục" | Thời gian đếm ngược | Hành vi chuyển hướng |
|---|---|---|:---:|---|
| **Đang cập nhật** (`isUpdating = true`) | Hiện spinner: `Đang cập nhật dữ liệu tài khoản...` | `disabled`, nhãn `Đang cập nhật...` | Chưa bắt đầu | Không cho phép chuyển trang |
| **Bắt đầu đếm ngược** (`isUpdating = false`) | Ẩn spinner cập nhật, hiện bộ đếm | `enabled`, nhãn `Tiếp tục (${countdown}s)` | Bắt đầu từ 5 | Đếm lùi mỗi 1000ms |
| **Đếm ngược kết thúc** (`countdown === 0`) | Chuyển trang tức thì | `disabled` hoặc thực thi điều hướng | 0 | Tự động gọi `router.replace(getTargetUrl())` |
| **Người dùng click sớm** (`countdown > 0`) | Chuyển trang tức thì | Kích hoạt `onClick` | Dừng timer | Lập tức gọi `router.replace(getTargetUrl())` |
| **Giao dịch bị hủy/lỗi** (`!isSuccess`) | Hiện thông báo hủy/lỗi | `enabled`, nhãn `Tiếp tục` (không có giây) | Không kích hoạt | Không tự động chuyển trang |

---

## 4. Invariants & Guarantees

1. **Parity Guarantee**: `targetUrl(manual_click) === targetUrl(auto_countdown_redirect)`.
2. **Exclusivity Guarantee**: Chỉ có tối đa 1 lần điều hướng được thực hiện trong suốt vòng đời component.
3. **Safety Guarantee**: Không có bộ đếm ngược nào được phép kích hoạt nếu `code !== '00'` hoặc `cancel === 'true'`.
