# Danh sách các Route trong Smart Wardrobe Frontend

Tài liệu này tổng hợp toàn bộ các route (đường dẫn URL) hiện có trong dự án Next.js App Router (nằm trong thư mục `src/app`).

*(Lưu ý: Các phần trong ngoặc đơn như `(guest)` hay `(user)` là Route Groups của Next.js, chúng không xuất hiện trên đường dẫn URL thực tế).*

---

## 1. Nhóm Route cho Khách / Công khai (Guest & Public)
Các trang không yêu cầu xác thực hoặc các trang trong luồng đăng nhập, đăng ký tài khoản.

| Đường dẫn URL | File mã nguồn | Mô tả / Chức năng |
| :--- | :--- | :--- |
| `/` | [page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/page.tsx) | Trang chủ (Landing Page) |
| `/auth/login` | [login/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/auth/login/page.tsx) | Trang đăng nhập |
| `/auth/register` | [register/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/auth/register/page.tsx) | Trang đăng ký tài khoản |
| `/auth/register/preferences` | [preferences/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/auth/register/preferences/page.tsx) | Thiết lập sở thích cá nhân khi đăng ký |
| `/auth/forgot-password` | [forgot-password/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/auth/forgot-password/page.tsx) | Yêu cầu khôi phục mật khẩu |

---

## 2. Nhóm Route cho Người dùng (User / Customer)
Các tính năng cốt lõi dành cho người dùng cá nhân để quản lý tủ đồ, phối đồ, mua sắm và tương tác cộng đồng.

### Trang cá nhân & Mua sắm
| Đường dẫn URL | File mã nguồn | Mô tả / Chức năng |
| :--- | :--- | :--- |
| `/dashboard` | [dashboard/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/dashboard/page.tsx) | Bảng điều khiển người dùng |
| `/profile` | [profile/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/profile/page.tsx) | Trang thông tin cá nhân |
| `/profile/update` | [update/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/profile/update/page.tsx) | Cập nhật thông tin cá nhân |
| `/profile/purchases` | [purchases/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/profile/purchases/page.tsx) | Danh sách đơn hàng đã mua |
| `/cart` | [cart/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/cart/page.tsx) | Giỏ hàng mua sắm |
| `/checkout` | [checkout/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/checkout/page.tsx) | Trang thanh toán |
| `/returns/request/[orderId]` | [returns/request/[orderId]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/returns/request/[orderId]/page.tsx) | Yêu cầu đổi trả đơn hàng |
| `/settings/wallet` | [wallet/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/settings/wallet/page.tsx) | Quản lý ví cá nhân |

### Quản lý Tủ đồ (Wardrobe)
| Đường dẫn URL | File mã nguồn | Mô tả / Chức năng |
| :--- | :--- | :--- |
| `/wardrobe` | [wardrobe/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/page.tsx) | Tủ đồ cá nhân |
| `/wardrobe/explore` | [explore/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/explore/page.tsx) | Khám phá & gợi ý đồ |
| `/wardrobe/upload` | [upload/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/upload/page.tsx) | Tải sản phẩm lên tủ đồ |
| `/wardrobe/item/[id]` | [wardrobe/item/[id]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/item/[id]/page.tsx) | Chi tiết một món đồ thời trang |
| `/wardrobe/item/[id]/edit` | [edit/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/item/[id]/edit/page.tsx) | Sửa thông tin món đồ |
| `/wardrobe/item/[id]/sell` | [sell/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/item/[id]/sell/page.tsx) | Đăng bán món đồ lên chợ |

### Phối đồ & Gợi ý AI (Outfits & AI Stylist)
| Đường dẫn URL | File mã nguồn | Mô tả / Chức năng |
| :--- | :--- | :--- |
| `/ai-stylist` | [ai-stylist/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/ai-stylist/page.tsx) | Trợ lý phối đồ ảo AI |
| `/outfits` | [outfits/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/outfits/page.tsx) | Danh sách bộ phối đồ của người dùng |
| `/outfits/create` | [create/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/outfits/create/page.tsx) | Sàn tạo outfit mới |
| `/outfits/[id]` | [outfits/[id]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/outfits/[id]/page.tsx) | Xem chi tiết một outfit |

### Chợ thời trang & Cộng đồng (Marketplace & Community)
| Đường dẫn URL | File mã nguồn | Mô tả / Chức năng |
| :--- | :--- | :--- |
| `/marketplace` | [marketplace/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/marketplace/page.tsx) | Sàn mua bán sản phẩm |
| `/marketplace/my-listings` | [my-listings/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/marketplace/my-listings/page.tsx) | Các sản phẩm của tôi đang đăng bán |
| `/brands/[id]` | [brands/[id]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/brands/[id]/page.tsx) | Trang thông tin thương hiệu đối tác |
| `/products/[id]` | [products/[id]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/products/[id]/page.tsx) | Trang chi tiết sản phẩm thời trang |
| `/community` | [community/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/community/page.tsx) | Diễn đàn cộng đồng thời trang |
| `/posts/[postPublicId]` | [posts/[postPublicId]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/posts/[postPublicId]/page.tsx) | Bài viết chi tiết trên mạng xã hội |
| `/search` | [search/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/search/page.tsx) | Tìm kiếm sản phẩm/người dùng |

---

## 3. Nhóm Route cho Thương hiệu / Nhãn hàng (Brand)
Cổng quản lý và tiếp cận người dùng dành cho nhãn hàng thời trang.

| Đường dẫn URL | File mã nguồn | Mô tả / Chức năng |
| :--- | :--- | :--- |
| `/brand/dashboard` | [brand/dashboard/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/dashboard/page.tsx) | Bảng điều khiển thương hiệu |
| `/brand/profile` | [brand/profile/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/profile/page.tsx) | Quản lý hồ sơ thương hiệu |
| `/brand/products` | [brand/products/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/products/page.tsx) | Quản lý sản phẩm của hãng |
| `/brand/posts` | [brand/posts/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/posts/page.tsx) | Quản lý bài đăng truyền thông thương hiệu |
| `/brand/customer-care` | [customer-care/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/customer-care/page.tsx) | Cổng hỗ trợ & Chăm sóc khách hàng |
| `/brand/digital-sample-lab` | [digital-sample-lab/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/digital-sample-lab/page.tsx) | Quản lý mẫu thiết kế kỹ thuật số |
| `/brand/digital-sample-lab/report` | [report/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/digital-sample-lab/report/page.tsx) | Danh sách báo cáo phân tích mẫu thiết kế |
| `/brand/digital-sample-lab/report/[sampleId]`| [report/[sampleId]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/digital-sample-lab/report/[sampleId]/page.tsx) | Xem báo cáo phân tích chi tiết của thiết kế ảo |

---

## 4. Nhóm Route Quản trị viên (Admin)
Dành cho người quản trị vận hành toàn hệ thống.

| Đường dẫn URL | File mã nguồn | Mô tả / Chức năng |
| :--- | :--- | :--- |
| `/admin/dashboard` | [admin/dashboard/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/dashboard/page.tsx) | Dashboard tổng quan của Admin |
| `/admin/users` | [users/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/users/page.tsx) | Quản lý tài khoản người dùng và phân quyền |
| `/admin/category` | [category/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/category/page.tsx) | Quản lý danh mục sản phẩm |
| `/admin/wardrobe` | [admin/wardrobe/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/wardrobe/page.tsx) | Quản lý và kiểm duyệt tủ đồ hệ thống |
| `/admin/moderation` | [moderation/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/moderation/page.tsx) | Kiểm duyệt nội dung bài đăng cộng đồng |
| `/admin/trends` | [trends/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/trends/page.tsx) | Quản lý danh sách xu hướng thời trang |
| `/admin/trends/new` | [new/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/trends/new/page.tsx) | Tạo xu hướng thời trang mới |

---

## 5. Nhóm API Routes (BFF / Local API)
Các route trung gian xử lý session, cookie và token phía máy chủ (Next.js server-side routes).

| Đường dẫn API | File mã nguồn | Mô tả / Chức năng |
| :--- | :--- | :--- |
| `/api/auth/login` | [login/route.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/api/auth/login/route.ts) | Endpoint lưu session / thiết lập httpOnly cookie |
| `/api/auth/logout` | [logout/route.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/api/auth/logout/route.ts) | Endpoint xóa session và token |
| `/api/auth/refresh-token` | [refresh-token/route.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/api/auth/refresh-token/route.ts) | Làm mới access token từ refresh token |
| `/api/auth/status` | [status/route.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/api/auth/status/route.ts) | Kiểm tra trạng thái đăng nhập hiện tại |

---

## 6. Route Thử nghiệm (Playground)
| Đường dẫn URL | File mã nguồn | Mô tả / Chức năng |
| :--- | :--- | :--- |
| `/workpage` | [workpage/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/workpage/page.tsx) | Trang nháp để phát triển các tính năng thử nghiệm |
