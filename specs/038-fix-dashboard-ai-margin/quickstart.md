# Quickstart & Verification Guide: Đồng Bộ Kỳ Báo Cáo Cho Bảng Hiệu Quả Chi Phí AI (038-fix-dashboard-ai-margin)

**Date**: 2026-10-21  
**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## 1. Prerequisites & Environment Setup

- Node.js >= 18.x
- Mã nguồn chạy trên nhánh `dev`
- Đảm bảo dependencies đã cài đặt:
  ```bash
  npm install
  ```

---

## 2. Automated Test Execution

Chạy toàn bộ các bộ kiểm thử tự động liên quan trực tiếp đến Dashboard Admin:

```bash
npm test -- src/app/admin/dashboard/components/DashboardClient.test.tsx
```

Chạy lint kiểm tra chất lượng mã nguồn:

```bash
npm run lint
```

Chạy toàn bộ test suite để đảm bảo không có regression:

```bash
npm test
```

---

## 3. Manual Verification Scenarios

### Kịch bản 1: Kiểm tra kỳ mặc định "Tháng này"
1. Mở trình duyệt, đăng nhập với tài khoản Quản trị viên (Admin).
2. Điều hướng tới `/admin/dashboard` (không kèm query param).
3. Quan sát bộ điều hướng kỳ: Thấy preset **Tháng này** đang được chọn (ví dụ: `01/10 – 21/10/2026`).
4. Quan sát bảng **Hiệu quả chi phí AI**:
   - Tiêu đề phụ hiển thị đúng: `Kỳ: 01/10/2026 – 21/10/2026`.
   - Mở tab Network trong DevTools: Thấy có request `GET /api/v1/admin/dashboard/ai-margin?fromDate=2026-10-01&toDate=2026-10-21` trả về 200.
   - Thẻ KPI "Biên lợi nhuận AI" phía trên có ghi chú "30 ngày" (phản ánh 30 ngày gần nhất của tổng quan).

### Kịch bản 2: Kiểm tra thao tác "Làm mới" (Refresh)
1. Tại Dashboard, nhấn nút **Làm mới** (Refresh) trên thanh công cụ.
2. Bảng **Hiệu quả chi phí AI** hiển thị trạng thái đang cập nhật đồng thời với các khối khác.
3. Tab Network ghi nhận request `GET /api/v1/admin/dashboard/ai-margin?...` được gọi lại thành công.

### Kịch bản 3: Kiểm tra chuyển đổi sang kỳ khác
1. Nhấn chuyển sang preset **Tuần này** hoặc **Hôm nay**.
2. URL cập nhật `fromDate` và `toDate` mới.
3. Bảng **Hiệu quả chi phí AI** tự động truy vấn và cập nhật số liệu theo đúng khoảng ngày của tuần này/hôm nay.
