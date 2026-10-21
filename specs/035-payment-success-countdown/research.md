# Technical Research: 035 Payment Success Countdown Redirect

## Context & Objectives

Trang kết quả thanh toán `/payment/result` hiện tại đã giải quyết được vấn đề cookie phiên SameSite=Strict và cơ chế refetch đồng bộ dữ liệu (Feature 033). Tuy nhiên, sau khi thanh toán thành công và dữ liệu tài khoản đã được làm mới, người dùng vẫn phải bấm thủ công nút "Tiếp tục" để quay lại trang đích.

Mục tiêu kỹ thuật của tính năng 035 là:
1. Thêm bộ đếm ngược trực quan (5 giây) khi thanh toán thành công.
2. Tự động điều hướng về đúng trang đích khi bộ đếm kết thúc (nếu người dùng không bấm thủ công).
3. Đảm bảo trang đích tự động chuyển hướng phải **trùng khớp 100%** với trang đích khi người dùng bấm nút "Tiếp tục" thủ công.
4. Xử lý an toàn bộ đếm: dọn dẹp timer khi unmount, ngăn chặn chuyển hướng kép (race condition / double navigation), không kích hoạt đếm ngược khi giao dịch bị hủy hoặc lỗi.

---

## Technical Decisions

### Decision 1: Thời điểm kích hoạt bộ đếm ngược (Activation Timing)

- **Decision**: Bộ đếm ngược chuyển trang CHỈ bắt đầu đếm lùi sau khi quá trình làm mới dữ liệu tài khoản (`isUpdating === false`) hoàn tất thành công.
- **Rationale**:
  - Khi thanh toán thành công trên PayOS, ứng dụng cần một khoảng thời gian ngắn (polling 5 lần x 2s) để webhook từ PayOS cập nhật số dư ví hoặc gói hội viên trong cơ sở dữ liệu và React Query cache được refetch.
  - Nếu kích hoạt đếm ngược ngay khi vừa mở trang kết quả, người dùng có thể bị chuyển trang trước khi số dư mới kịp cập nhật vào cache, dẫn tới khi về trang `/profile?tab=wallet` người dùng vẫn thấy số dư cũ.
  - Việc chờ `isUpdating` chuyển sang `false` rồi mới kích hoạt đếm ngược (từ 5s về 0s) đảm bảo 100% người dùng khi quay về trang đích sẽ nhìn thấy số liệu mới nhất.
- **Alternatives considered**:
  - *Chạy đếm ngược ngay khi load trang (bất kể `isUpdating`)*: Bị từ chối vì nếu webhook chậm, người dùng có thể bị chuyển hướng trước khi dữ liệu kịp cập nhật, vi phạm FR-006.
  - *Chỉ chạy đếm ngược sau 1 lần refetch đầu tiên*: Bị từ chối vì webhook bên thứ ba có thể mất 1-3 giây để xử lý, cần giữ nguyên cơ chế hoàn tất polling để đảm bảo tính nhất quán dữ liệu.

### Decision 2: Quản lý bộ đếm ngược trong React Component

- **Decision**: Sử dụng `useState` cho `countdown` (khởi tạo 5) kết hợp `useEffect` với `setInterval` 1 giây để giảm dần `countdown`, kèm cơ chế cleanup `clearInterval` khi unmount hoặc khi trạng thái thay đổi.
- **Rationale**:
  - Đảm bảo UI phản hồi mượt mà từng giây (5s -> 4s -> 3s -> 2s -> 1s -> 0s).
  - Clean up tự nhiên khi component unmount hoặc khi người dùng chủ động điều hướng trước.
  - Dễ dàng viết unit test với Jest fake timers (`jest.useFakeTimers()` và `jest.advanceTimersByTime()`).
- **Alternatives considered**:
  - *Sử dụng `setTimeout(..., 5000)` duy nhất*: Bị từ chối vì người dùng sẽ không thấy số giây đếm lùi trực quan trên giao diện (vi phạm FR-001 và FR-008).
  - *Sử dụng thư viện ngoài (như `react-countdown`)*: Bị từ chối vì việc quản lý bộ đếm 5 giây thuần túy trong React hook rất đơn giản (~15 dòng code), không cần thêm dependency làm phình bundle.

### Decision 3: Chia sẻ logic xác định trang đích (Single Source of Truth cho Target URL)

- **Decision**: Tập trung logic phân giải trang đích an toàn vào một hàm duy nhất `getTargetUrl()`, được sử dụng bởi cả sự kiện tự động chuyển trang khi hết giờ và sự kiện bấm nút "Tiếp tục" thủ công.
- **Rationale**:
  - Đảm bảo tuyệt đối tuân thủ yêu cầu: "quay về trang theo trang khi người dùng nhấn tiếp tục".
  - Kế thừa trọn vẹn kiểm tra an toàn chống Open Redirect:
    ```typescript
    const getTargetUrl = () => {
      if (next && next.startsWith('/') && !next.startsWith('//')) {
        return next;
      }
      return flow === 'purchase' ? '/pricing' : '/profile?tab=wallet';
    };
    ```
  - Nếu logic phân giải trang đích thay đổi trong tương lai, cả 2 luồng tự động và thủ công đều đồng bộ tự động.
- **Alternatives considered**:
  - *Viết 2 hàm điều hướng riêng*: Bị từ chối vì dễ gây lệch logic (drift) giữa chuyển trang tự động và thủ công.

### Decision 4: Ngăn chặn chuyển hướng kép & Race Condition

- **Decision**: Sử dụng một React ref (`hasRedirectedRef = useRef(false)`) hoặc hàm điều hướng bọc kiểm tra cờ để đảm bảo chỉ có tối đa 1 lệnh `router.replace` được thực thi.
- **Rationale**:
  - Người dùng có thể bấm nút "Tiếp tục" đúng vào khoảnh khắc đồng hồ đếm ngược chạm mốc 0 giây.
  - Nếu không có cờ chặn, cả sự kiện `onClick` và callback của `countdown === 0` đều có thể gọi `router.replace(targetUrl)`, gây giật lag hoặc lỗi navigation stack của Next.js App Router.
- **Alternatives considered**:
  - *Dùng state `hasRedirected`*: Bị từ chối vì state cập nhật bất đồng bộ, có thể để lọt race condition trong cùng 1 tick event loop. Ref cập nhật đồng bộ tức thì.

### Decision 5: Thiết kế giao diện hiển thị đếm ngược (UX Visuals)

- **Decision**:
  - Hiển thị thông điệp đếm ngược trực tiếp trên nút thao tác:
    - Khi đang cập nhật: `Đang cập nhật...` (nút disabled)
    - Khi đã cập nhật xong và đang đếm ngược: `Tiếp tục (${countdown}s)` kèm icon `ArrowRight` (nút active, người dùng bấm được ngay).
  - Đồng thời bổ sung một dòng phụ chú nhẹ nhàng bên dưới nút hoặc trong CardContent:
    `Tự động chuyển tiếp sau ${countdown} giây...`
- **Rationale**:
  - Người dùng nhìn ngay vào nút hành động chính (call-to-action) là biết có thể bấm ngay hoặc chờ đếm ngược tự chuyển tiếp.
  - Thiết kế đồng bộ với hệ thống theme hiện tại (shadcn UI, Tailwind CSS, Lucide icons), không làm vỡ layout thẻ kết quả.
- **Alternatives considered**:
  - *Thay thế hoàn toàn nút bằng thanh progress bar*: Bị từ chối vì mất đi nút bấm chủ động "Tiếp tục", người dùng không thể chuyển trang ngay lập tức nếu muốn.

---

## Best Practices & Patterns

1. **Next.js App Router Navigation**:
   - Sử dụng `router.replace(targetUrl)` thay vì `router.push(targetUrl)` trên trang kết quả thanh toán để tránh việc người dùng bấm nút "Back" trên trình duyệt bị quay trở lại trang kết quả và kích hoạt lại vòng lặp đếm ngược.
2. **Timer Hygiene in React 19**:
   - Khởi tạo interval chỉ khi `isSuccess && !isUpdating`.
   - Clear interval trong return cleanup của `useEffect`.
   - Nếu `countdown === 0`, kích hoạt chuyển trang và dọn dẹp interval.
