# Research & Architecture Decisions: Hiển thị Hạn mức Profile & Chuẩn hoá Quản lý Phiên Cookie Auth

**Feature**: `023-profile-limits-auth-session`  
**Date**: 2026-09-26  
**Status**: Completed  
**Author**: Antigravity  

---

## 1. Tổng quan Nghiên cứu

Tính năng này giải quyết 2 bài toán lớn trong ứng dụng web Closy (`smart-wardrobe-fe`):
1. **Minh bạch hóa dung lượng và hạn mức người dùng trên `/profile`**: Tách bạch nguồn dữ liệu cho "Hạn mức tối đa theo gói" và "Số lượng đã sử dụng thực tế", hiển thị chính xác các trường hợp biên (`0` món, gói không giới hạn `∞`, progress bar chuẩn xác).
2. **Chuẩn hoá vòng đời phiên xác thực (Single Source of Truth cho Cookie Auth)**: Xóa bỏ hoàn toàn hiện tượng "4 token / 2 domain" gây ra do tầng BFF Next.js re-set cookie host-only; đưa quyền sở hữu và kiểm soát cookie auth về máy chủ backend duy nhất.

---

## 2. Các Quyết định Kỹ thuật Cốt lõi (Decisions & Rationale)

### Quyết định 1: Phân tách 2 nguồn dữ liệu cho Hạn mức & Thống kê Tủ đồ

- **Bối cảnh**:
  - Trước đây, trang `/profile` lấy hạn mức từ `GET /subscriptions/me` (hoặc `daily-quota` nhưng thiếu field nên rơi về `∞`), đồng thời không truy vấn số lượng món đồ và outfit thực tế đang có.
  - Backend đã cập nhật endpoint `GET /api/v1/subscriptions/me/daily-quota` bổ sung 2 trường: `maxWardrobeItems` và `maxOutfits`.
- **Quyết định**:
  - **Hạn mức tối đa**: Đọc từ `GET /api/v1/subscriptions/me/daily-quota` (`maxWardrobeItems`, `maxOutfits`, `aiOutfitDailyQuota`, `aiChatDailyQuota`).
  - **Số lượng hiện tại**: Đọc từ `GET /api/v1/me/wardrobe-items/stats` (`activeItemsCount`, `outfitsCount`).
  - **Khóa Cache React Query**: Thống nhất dùng `useDailyQuota()` với query key `['subscription', 'daily-quota']` tại `ProfileClient.tsx`, thay thế cho key lẻ `['subscription', 'quota']`.
  - **Tái sử dụng Hook**: Sử dụng lại hook sẵn có `useWardrobeStats()` từ `wardrobe.queries.ts` (query key `['wardrobe', 'stats']`) và truyền xuống `CurrentPlanCard`.
- **Lý do**:
  - Đảm bảo tính nhất quán trên toàn bộ ứng dụng (cache sharing), tránh duplicate requests.
  - Không tính toán đếm số lượng thủ công trên client (tránh tải toàn bộ danh sách đồ).
- **Phương án khác đã xem xét**:
  - *Gọi `GET /subscriptions/me`*: Bị loại vì API này không chứa thông tin hạn ngạch ngày của AI, đồng thời các trường hạn mức đã được hợp nhất vào `daily-quota`.

---

### Quyết định 2: Quy tắc Hiển thị Giao diện & Xử lý Giá trị Biên

- **Bối cảnh**:
  - Thẻ `CurrentPlanCard.tsx` dòng 89 bị lặp biểu thức logic: `quota.maxWardrobeItems || quota.maxWardrobeItems || '∞'`.
  - Khi `max = 0` (nghĩa là Không giới hạn / Unlimited), nếu dùng toán tử `||` sẽ biến `0` thành falsy và hiển thị `'∞'`. Nhưng nếu số lượng thực tế bằng `0`, `0 || ...` sẽ hiển thị sai.
  - Khi `max = 0`, phép tính `(current / max) * 100` gây ra lỗi `Infinity%` hoặc `NaN%` trên giao diện.
- **Quyết định**:
  - Định dạng chuỗi hiển thị:
    - Tủ đồ: `{activeItemsCount ?? 0} / {isUnlimited(maxWardrobeItems) ? '∞' : maxWardrobeItems} món`
    - Outfit: `{outfitsCount ?? 0} / {isUnlimited(maxOutfits) ? '∞' : maxOutfits} bộ`
    - AI Outfit: `{outfitRecommendCount ?? 0} / {isUnlimited(aiOutfitDailyQuota) ? '∞' : aiOutfitDailyQuota}`
    - AI Chat: `{aiUsageCount ?? 0} / {isUnlimited(aiChatDailyQuota) ? '∞' : aiChatDailyQuota}`
  - Hàm kiểm tra không giới hạn: `isUnlimited(val) = val === 0 || val === undefined || val === null`.
  - Thanh tiến trình (Progress Bar):
    - Nếu không giới hạn (`max === 0`): Ẩn thanh tiến trình hoặc hiển thị mức an toàn `0%`.
    - Nếu có giới hạn: `Math.min(100, Math.max(0, ((current ?? 0) / max) * 100))`.
  - Luôn sử dụng Nullish Coalescing `?? 0` cho các biến số đếm.
- **Lý do**:
  - Đảm bảo giao diện không bao giờ gặp lỗi tính toán số học của JavaScript.
  - Thể hiện sự chuyên nghiệp và đúng logic nghiệp vụ cho gói Unlimited.

---

### Quyết định 3: Kiến trúc Phiên Auth — Lựa chọn Phương án B (Same-Origin Proxy Rewrite)

- **Bối cảnh**:
  - Vấn đề "4 token / 2 domain":
    1. Backend set cookie với thuộc tính `Domain=closy.hycat.online`. Trình duyệt lưu cookie ở phạm vi domain `.closy.hycat.online`.
    2. BFF Next.js (`src/app/api/auth/*` và `src/app/api/v1/auth/*`) re-set cookie nhưng không truyền thuộc tính `Domain` → Trình duyệt tạo thêm 1 cookie host-only `closy.hycat.online`.
    3. Hậu quả: 2 cookie `accessToken` và 2 cookie `refreshToken`. Khi logout/refresh, BFF chỉ xóa nhánh host-only, nhánh domain vẫn còn nguyên; hoặc middleware đọc nhầm cookie cũ.
- **Đánh giá 2 phương án từ tài liệu hướng dẫn**:
  - **Phương án A (Gọi trực tiếp backend qua CORS)**: Client gọi thẳng `https://api.closy.hycat.online` với `credentials: 'include'`.
    - *Ưu điểm*: Bỏ hoàn toàn tầng proxy.
    - *Nhược điểm*: Phụ thuộc vào CORS cấu hình đúng cho từng môi trường (localhost dev, staging, preview deployments, production); phải duy trì 2 URL gốc khác nhau trong client code.
  - **Phương án B (Proxy Rewrite Next.js thuần túy — KHUYẾN NGHỊ TỐI ƯU)**:
    - Tận dụng cấu hình sẵn có trong `next.config.ts`:
      ```ts
      {
        source: '/api/v1/:path*',
        destination: `${backendBase}/:path*`
      }
      ```
    - **Xóa bỏ toàn bộ các route handler BFF can thiệp cookie**:
      - `src/app/api/v1/auth/{login,logout,refresh-token,status}/route.ts`
      - `src/app/api/auth/{login,logout,refresh-token,status}/route.ts`
      - `src/lib/auth-cookies.ts` (không dùng để set/delete auth cookie nữa)
    - Khi các route handler trên bị xóa, mọi request gửi tới `/api/v1/auth/*` sẽ tự động rơi vào Next.js rewrite. Next.js đóng vai trò reverse proxy mức thấp:
      - **Forward nguyên vẹn header `Set-Cookie`** từ backend trả về (bao gồm `Domain=closy.hycat.online`, `SameSite=Strict/Lax`, `HttpOnly`, `Max-Age`).
      - Không can thiệp, không parse rồi re-set bằng `NextResponse.cookies.set()`.
- **Quyết định**: Chọn **Phương án B**.
- **Lý do**:
  - Giải quyết tận gốc nguyên nhân sinh ra cookie host-only.
  - Giữ vững cấu trúc same-origin `/api/v1/*` hiện tại của client, không ảnh hưởng đến axios instance hay cấu hình CORS phức tạp.
  - Đúng chuẩn kiến trúc: Backend là single source of truth cho cookie xác thực.

---

### Quyết định 4: Trung hòa Middleware (`src/middleware.ts`)

- **Bối cảnh**:
  - Trong `src/middleware.ts`:
    - Dòng 158-170: `cookies.delete('accessToken')`, `cookies.delete('refreshToken')`.
    - Dòng 189-207: `finalResponse.cookies.set('accessToken', ...)`, `finalResponse.cookies.set('refreshToken', ...)`.
    - Dòng 72-148: Tự động gọi backend để refresh token khi phát hiện token hết hạn trên các page request.
  - Việc middleware gọi `set` và `delete` cookie trên `NextResponse` vô tình tạo ra hoặc cố xóa cookie host-only (vì không có `Domain`), làm trầm trọng thêm vấn đề lệch cookie jar.
- **Quyết định**:
  - **Gỡ bỏ hoàn toàn việc set và delete auth cookie trong `src/middleware.ts`**.
  - **Loại bỏ khối refresh token trong middleware**: Việc làm mới token đã được quản lý tập trung và an toàn bởi `axios interceptor` trên Client (kèm queue xử lý đồng thời, chống race-condition).
  - Middleware chỉ thực hiện nhiệm vụ:
    - Đọc cookie `accessToken` để kiểm tra trạng thái đăng nhập cho SSR hoặc bảo vệ các private route.
    - Forward headers phục vụ Server Components.
- **Lý do**: Tránh race-condition khi có nhiều tab/request cùng lúc, tránh sinh cookie host-only ngoài ý muốn.

---

### Quyết định 5: Chiến lược Dọn dẹp Cookie Host-only Tồn dư (One-Time Cleanup)

- **Bối cảnh**:
  - Người dùng từng truy cập hệ thống trước đợt cập nhật có thể vẫn còn lưu cookie host-only trong trình duyệt.
  - Do cookie auth là `HttpOnly`, JavaScript phía client (`document.cookie`) không thể xóa trực tiếp các cookie `HttpOnly` này.
- **Quyết định**:
  - Khi người dùng thực hiện Đăng xuất (`logout`) hoặc khi phát hiện lỗi xác thực 401:
    - Ngoài việc backend gửi `Set-Cookie` xóa cookie domain (`Domain=closy.hycat.online; Max-Age=0`), ứng dụng sẽ đảm bảo dọn sạch nhánh host-only bằng cách:
    - Tại response đăng xuất hoặc qua một route dọn dẹp chuyên biệt (nếu cần), phát ra header `Set-Cookie` với `Max-Age=0` không kèm `Domain` cho cả `accessToken` và `refreshToken`.
    - Đồng thời dọn dẹp các cookie non-HttpOnly (nếu có) qua client-side script.
  - Đảm bảo sau khi đăng nhập mới, trình duyệt chỉ còn duy nhất 1 entry cho mỗi cookie trên domain chính.

---

## 3. Tóm tắt Ma trận Xử lý Tập tin

| STT | Tập tin | Trạng thái hiện tại | Giải pháp triển khai |
|---|---|---|---|
| 1 | `src/app/(user)/profile/components/ProfileClient.tsx` | Dùng query key `['subscription','quota']`, thiếu stats | Đổi sang `useDailyQuota()`, bổ sung `useWardrobeStats()`, truyền `stats` xuống `CurrentPlanCard` |
| 2 | `src/features/subscription/components/CurrentPlanCard.tsx` | Lặp logic dòng 89, chỉ hiển thị max, thiếu progress bar | Cập nhật render `{current} / {max}`, xử lý `max = 0` thành `∞`, tính progress bar an toàn, fix dòng 89 |
| 3 | `src/lib/auth-cookies.ts` | Chứa options set/clear cookie không domain | Deprecate/xóa các options set cookie auth; giữ lại hàm tiện ích nếu cần cho cookie khác |
| 4 | `src/app/api/auth/login/route.ts` | Re-set cookie host-only | Xóa bỏ hoặc chuyển hướng rewrite |
| 5 | `src/app/api/auth/refresh-token/route.ts` | Re-set cookie host-only | Xóa bỏ hoặc chuyển hướng rewrite |
| 6 | `src/app/api/auth/logout/route.ts` | Clear cookie không domain | Xóa bỏ hoặc chuyển hướng rewrite |
| 7 | `src/app/api/auth/status/route.ts` | Chỉ kiểm tra cookie | Chuyển sang dùng profile query `/api/v1/me` |
| 8 | `src/app/api/v1/auth/{login,logout,refresh-token,status}/route.ts` | Wrapper re-export BFF | Xóa toàn bộ thư mục này để Next.js rewrite trực tiếp sang backend |
| 9 | `src/middleware.ts` | Set/delete cookie auth tại 158-207 | Bỏ hoàn toàn các lệnh set/delete cookie auth |
| 10 | `src/lib/axios.ts` | Interceptor refresh token | Đảm bảo gọi `/api/v1/auth/refresh-token` với `withCredentials: true` |
| 11 | `src/features/auth/api/auth.api.ts` | Gọi qua các route cũ | Thống nhất gọi chuẩn `/auth/login`, `/auth/logout`, `/auth/refresh-token` qua axios proxy |
