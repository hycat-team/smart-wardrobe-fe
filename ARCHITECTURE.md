# Kiến trúc Dự án (Architecture Documentation)

Tài liệu này mô tả cấu trúc thư mục và luồng xử lý dữ liệu (API, Authentication, State Management) của dự án **Smart Wardrobe FE** (Next.js).

## 1. Cấu trúc Thư mục Tổng quan

Dự án áp dụng mô hình **Feature-Based Architecture**, nhóm code theo từng tính năng/nghiệp vụ để dễ dàng mở rộng và bảo trì.

```text
src/
├── app/                  # Next.js App Router (Pages, Layouts, Routing)
│   ├── (admin)/          # Group routes cho Admin
│   ├── (user)/           # Group routes cho User
│   └── layout.tsx        # Root layout (Chứa các Provider global)
├── components/           # (1) GLOBAL COMPONENTS: Component dùng chung toàn bộ dự án
│   ├── layout/           # Header, Sidebar, Footer, Navigation...
│   ├── providers/        # QueryProvider, ThemeProvider...
│   └── ui/               # Base UI components (shadcn: Button, Input, Modal...)
├── features/             # Nơi chứa logic nghiệp vụ cốt lõi, chia theo domain
│   ├── auth/             
│   │   ├── components/   # (2) FEATURE COMPONENTS: Component riêng của module Auth (vd: LoginForm)
│   │   ├── api/
│   │   └── ...
│   └── wardrobe/         
│       └── components/   # (2) FEATURE COMPONENTS: Component riêng của tủ đồ (vd: WardrobeCard)
├── lib/                  # Các thư viện và cấu hình core
│   ├── axios.ts          
│   └── utils.ts          
└── store/                # Nơi chứa các Global State (Zustand)
```

## 2. Luồng gọi API (3-Layer API Architecture)

Luồng kết nối với Backend được chia thành 3 lớp rõ ràng (Bọc theo nguyên lý mô hình Gộp các file nhỏ):

### Lớp 1: Core / Interceptor (`src/lib/axios.ts`)
- Quản lý `baseURL` và `timeout`.
- **Request Interceptor**: Tự động trích xuất `accessToken` từ Cookies và gắn vào Header `Authorization`.
- **Response Interceptor**: Xử lý tự động Refresh Token. Nếu API trả về `401 Unauthorized`:
  1. Tạm dừng các request đang gọi.
  2. Lấy `refreshToken` từ Cookie để gọi API cấp lại token.
  3. Cập nhật token mới vào Cookie.
  4. Tiếp tục thực thi các request bị tạm dừng.
  5. Nếu `refreshToken` cũng lỗi -> Xoá token, văng Toast và đẩy về trang đăng nhập.

### Lớp 2: Lớp Service (`src/features/*/api/*.api.ts`)
- Nơi khai báo các hàm gọi API thuần tuý thông qua Axios.
- Ví dụ: `authApi.login`, `authApi.getProfile`.

### Lớp 3: Lớp Hooks / TanStack Query (`src/features/*/queries/*.queries.ts`)
- Bọc các hàm Service vào `useQuery` và `useMutation`.
- Nơi xử lý các side-effect toàn cục khi API thành công/thất bại:
  - Bật Toast thông báo (dùng `sonner`).
  - Cập nhật Global State (Zustand).
  - Invalidate Cache để tự động fetch lại dữ liệu mới.

---

## 3. Luồng Xác thực (Authentication Flow)

Dự án kết hợp giữa **Cookies**, **Zustand** và **TanStack Query** để xử lý bảo mật:

1. **Đăng nhập (`useLogin` hook)**: 
   - Gọi API lấy token và user info.
   - Lưu `accessToken` (1 ngày) và `refreshToken` (7 ngày) vào **Cookies** qua thư viện `js-cookie`. Lợi ích: giúp Next.js Middleware và Server Components có thể đọc được token để kiểm soát quyền truy cập.
   - Lưu `User Data` vào Global Store (**Zustand**).
   
2. **Khôi phục trạng thái (Làm mới trang)**:
   - Có thể dùng hook `useAuthProfile` để tự động lấy dữ liệu người dùng khi load trang.
   - Zustand được setup `persist`, tự động đồng bộ state User qua LocalStorage.

3. **Đăng xuất (`useLogout` hook)**:
   - Gọi API huỷ token (nếu Backend có hỗ trợ).
   - Xoá Cookies và xoá dữ liệu trong Zustand Store.

## 4. Cách thêm một Tính năng mới (Workflow)

Để tạo mới một module (Ví dụ: `products`), hãy tuân thủ cấu trúc sau:

1. Tạo thư mục `src/features/products`
2. Khai báo Types: `src/features/products/types/index.ts`
3. Định nghĩa các hàm gọi API (Gộp): `src/features/products/api/products.api.ts`
4. Tạo Custom Hooks (Gộp): `src/features/products/queries/products.queries.ts`
5. Tạo Components riêng: `src/features/products/components/ProductCard.tsx`
6. Cuối cùng, import các Hook và Component này vào trong `src/app/products/page.tsx` để sử dụng.

---

## 5. Chiến lược chia Component (Component Strategy)

Để tránh tình trạng thư mục `components` rác và lộn xộn, dự án áp dụng chiến lược phân tầng Component theo 3 cấp độ:

### Cấp độ 1: Global Components (`src/components`)
Đây là những component **hoàn toàn "ngu" (Dumb components)** hoặc được dùng ở mọi nơi (Global). Chúng không chứa logic gọi API chuyên biệt nào.
- `components/ui`: Nơi chứa các UI thuần (Button, Input, Table, Modal) - chủ yếu được sinh ra từ `shadcn/ui`.
- `components/layout`: Nơi chứa Header, Footer, Sidebar.
- `components/providers`: Chứa các bọc cấu hình (QueryProvider, ThemeProvider).

### Cấp độ 2: Feature Components (`src/features/*/components`)
Đây là những component **chứa nghiệp vụ (Smart components)** và chỉ thuộc về một tính năng (feature) cụ thể.
- Ví dụ: `LoginForm`, `RegisterForm` -> Để trong `src/features/auth/components`.
- Ví dụ: `WardrobeItemCard`, `CreateWardrobeModal` -> Để trong `src/features/wardrobe/components`.
- **Lý do**: Khi bạn cần sửa chức năng Tủ đồ, bạn chỉ cần mở folder `features/wardrobe` là thấy toàn bộ API, Types, Hooks và cả UI của nó, không phải đi tìm rải rác.

### Cấp độ 3: Page-Specific Components (`src/app/**/components`)
Nếu một component cực kỳ đặc thù, **chỉ dùng đúng ở 1 trang duy nhất** (ví dụ: một cái Chart đặc biệt cho màn hình Dashboard), bạn không cần ném nó vào Global hay Feature. Hãy tạo một thư mục `components` nằm ngay cạnh file `page.tsx` đó.
```text
src/app/(admin)/dashboard/
├── page.tsx
└── components/
    ├── DashboardRevenueChart.tsx
    └── DashboardStatsArea.tsx
```

**Nguyên tắc "Kéo từ trên xuống":** Page (`app/`) sẽ import từ Feature (`features/`). Feature sẽ import từ Global (`components/`). *Tuyệt đối không làm ngược lại (Global không được import Feature).*

