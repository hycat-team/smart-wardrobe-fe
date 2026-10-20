# Quickstart & Validation Guide: Bộ Chọn Kỳ Dùng Chung (037-admin-period-navigator)

**Feature**: `037-admin-period-navigator` | **Date**: 2026-10-20 | **Status**: Approved

## 1. Điều Kiện Tiên Quyết (Prerequisites)

- Đang ở nhánh `dev` của repository `smart-wardrobe-fe`:
  ```bash
  git checkout dev && git pull origin dev
  ```
- Node.js version 20+ và npm version 10+.
- Cài đặt đầy đủ packages:
  ```bash
  npm install
  ```

---

## 2. Kịch Bản Kiểm Thử Đơn Vị & Tự Động Hóa (Automated Tests)

Chạy bộ kiểm thử Jest cho tiện ích kỳ thời gian và bộ điều hướng:

```bash
# Chạy toàn bộ unit tests cho period utilities và components
npm test src/features/admin/utils/__tests__/period.test.ts

# Chạy kiểm tra quy chuẩn mã nguồn (Linting)
npm run lint
```

Các ca kiểm thử tự động bắt buộc bao quát:
1. `getDefaultPeriod()` trả về preset `'this_month'` với `fromDate = 01 của tháng` và `toDate = hôm nay`.
2. Preset `'this_week'` bắt đầu chính xác từ Thứ Hai đến ngày hôm nay.
3. Nhấn ◀ từ *Hôm nay* lùi chính xác 1 ngày.
4. Nhấn ◀ từ *Tuần này* lùi về tuần trước đủ 7 ngày (Thứ 2 đến Chủ Nhật).
5. Nhấn ◀ từ *Tháng này* lùi về tháng trước đủ ngày (ngày 01 đến ngày cuối tháng).
6. Nhấn ◀ từ *Năm này* lùi về năm trước đủ từ 01/01 đến 31/12.
7. Nhấn ▶ tiến về tuần/tháng/năm hiện tại: Kẹp `toDate = hôm nay` và trả về `isAtCurrent = true` (vô hiệu hóa nút ▶).
8. Preset *Tuỳ chọn*: Dịch chuyển lùi/tiến đúng số ngày của khoảng thời gian ($D$ ngày); kẹp không vượt quá hôm nay.
9. Kiểm tra nhãn hiển thị `formatPeriodLabel()` lấy từ chính giá trị ngày đã gửi.
10. Kiểm tra đồng bộ URL params và reset `page = 1`.

---

## 3. Kịch Bản Kiểm Thử Thủ Công Trên Giao Diện (Manual UI Verification)

### Kịch bản 1: Kiểm tra Mặc định "Tháng này"
1. Mở trình duyệt và truy cập trang Dashboard: `http://localhost:3000/admin/dashboard` (không truyền param).
2. **Kỳ vọng**: 
   - Preset "Tháng này" được kích hoạt (active pill).
   - Nhãn hiển thị dạng: `"Tháng 10/2026 · 01/10 – 20/10/2026"` (theo ngày thực tế).
   - Nút ▶ ở trạng thái `disabled`.
3. Lặp lại bước 1 cho trang Hoạt động người dùng (`/admin/activity-events`) và Giao dịch payOS (`/admin/transactions`).
4. **Kỳ vọng**: Cả 3 trang đều hiển thị đồng bộ mặc định "Tháng này".

---

### Kịch bản 2: Kiểm tra Di Chuyển Tiến/Lùi Kỳ Với Đơn Vị Đầy Đủ & Kẹp Hiện Tại
1. Tại Dashboard, nhấn nút ◀.
2. **Kỳ vọng**:
   - Khoảng ngày chuyển thành trọn vẹn tháng trước (ví dụ 01/09/2026 – 30/09/2026).
   - Nhãn hiển thị `"Tháng 09/2026 · 01/09 – 30/09/2026"`.
   - Nút ▶ được kích hoạt (enabled).
   - Bảng biểu và số liệu cập nhật theo tháng 9; không nháy trắng skeleton toàn trang.
3. Nhấn nút ▶.
4. **Kỳ vọng**:
   - Khoảng ngày quay về tháng 10/2026, kẹp kết thúc tại ngày hôm nay (01/10/2026 – 20/10/2026).
   - Nút ▶ tự động chuyển sang `disabled`.

---

### Kịch bản 3: Kiểm tra Preset "Tuần này" và Tuần Bắt Đầu Thứ Hai
1. Bấm vào preset "Tuần này".
2. **Kỳ vọng**:
   - Bộ lọc áp dụng ngay lập tức mà không cần bấm thêm nút nào.
   - Khoảng ngày bắt đầu từ Thứ Hai của tuần hiện tại đến ngày hôm nay.
   - Nút ▶ bị `disabled`.
3. Nhấn nút ◀.
4. **Kỳ vọng**:
   - Lùi về tuần trước với đủ 7 ngày từ Thứ Hai đến Chủ Nhật.
   - Nút ▶ được kích hoạt.

---

### Kịch bản 4: Kiểm tra Preset "Tuỳ chọn" & Chặn Ngày Tương Lai
1. Bấm vào preset "Tuỳ chọn". Bảng lịch mở ra.
2. Kiểm tra các ngày sau ngày hôm nay trên lịch.
3. **Kỳ vọng**: Mọi ngày trong tương lai đều bị làm mờ, không thể click chọn.
4. Chọn một khoảng 5 ngày trong quá khứ (ví dụ 05/10 đến 09/10).
5. Nhấn nút "Áp dụng".
6. **Kỳ vọng**: URL cập nhật `?preset=custom&fromDate=2026-10-05&toDate=2026-10-09`, dữ liệu được tải lại.
7. Nhấn nút ◀.
8. **Kỳ vọng**: Khoảng ngày dịch lùi đúng 5 ngày thành 30/09 đến 04/10.

---

### Kịch bản 5: Kiểm tra Lưu URL, Khôi phục Back/Forward & Reset Page
1. Trên trang Giao dịch payOS (`/admin/transactions`), chuyển sang trang 2 (`page=2`).
2. Nhấn nút preset "Hôm nay".
3. **Kỳ vọng**: URL cập nhật `preset=today`, `fromDate` và `toDate` bằng hôm nay, và `page` tự động reset về `1`.
4. Nhấn nút Back trên trình duyệt.
5. **Kỳ vọng**: Toàn bộ kỳ trước đó và số trang `page=2` được khôi phục chính xác.
6. Sao chép URL dán sang tab mới: Mở ra đúng chính xác preset và dữ liệu đã lọc.

---

### Kịch bản 6: Kiểm tra Trải Nghiệm Mượt Mà (Smooth Transition)
1. Cuộn trang Dashboard xuống phần Biểu đồ xu hướng hoặc Phân tích lỗi AI.
2. Nhấn nút ◀ để lùi 1 tháng.
3. **Kỳ vọng**:
   - Dữ liệu cũ vẫn hiển thị trên màn hình với chỉ báo tải nhẹ (không nháy skeleton toàn trang).
   - Vị trí cuộn trang không bị trượt hay nhảy lên đầu trang.
   - Khi dữ liệu mới phản hồi, số liệu cập nhật mượt mà.
