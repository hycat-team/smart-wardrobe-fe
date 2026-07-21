# Architecture Documentation — Smart Wardrobe FE

Tài liệu mô tả đầy đủ kiến trúc, cấu trúc thư mục, luồng xử lý dữ liệu và các quy ước quan trọng của dự án **Smart Wardrobe** (Next.js 16 App Router).

---

## 1. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router) | Routing, SSR, Server Components |
| Language | TypeScript 5 | Type safety toàn dự án |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| UI Components | shadcn/ui + Radix UI | Base component primitives |
| Animation | GSAP + Framer Motion | Page/component animations |
| State — Server | TanStack Query v5 | Async data fetching & caching |
| State — Client | Zustand v5 | Global UI state (auth, sidebar) |
| HTTP Client | Axios | Client-side API calls qua BFF proxy |
| Server Fetch | Native `fetch` + `next/headers` | Server Component data fetching |
| Form | React Hook Form + Zod | Form handling & validation |
| Notifications | Sonner | Toast notifications |
| Fonts | Be Vietnam Pro (Google Fonts) | Typography |

---

## 2. Cau truc Thu muc (Directory Structure)

```text
smart-wardrobe-fe/
|-- public/                              # Static assets (images, icons)
|-- docs/                                # Project documentation
|   |-- ARCHITECTURE.md                  # This file -- project architecture guide
|   |-- ROUTE.md                         # Auto-generated API route docs from swagger
|   `-- generate_rout.js                 # Script to generate ROUTE.md from swagger.json
|
`-- src/
    |-- middleware.ts                    # Edge Middleware: JWT check + silent token refresh for every request
    |
    |-- app/                            # [Next.js App Router] Routing layer only, no business logic
    |   |-- layout.tsx                  # Root layout: Providers, Font (Be Vietnam Pro), Toaster
    |   |-- globals.css                 # Global CSS + CSS Variables (design tokens, dark/light theme)
    |   |-- error.tsx                   # Global error boundary
    |   |-- not-found.tsx               # 404 page
    |   |
    |   |-- (guest)/                    # Route group -- public pages, no auth required
    |   |   |-- layout.tsx              # Guest layout: no Sidebar, uses GuestHeader
    |   |   |-- page.tsx                # Landing page (/)
    |   |   |-- components/             # Landing page specific components
    |   |   `-- auth/
    |   |       |-- login/
    |   |       |   |-- page.tsx
    |   |       |   `-- components/LoginClient.tsx
    |   |       `-- register/
    |   |           |-- page.tsx
    |   |           `-- components/RegisterClient.tsx
    |   |
    |   |-- (user)/                     # Route group -- protected pages, auth required
    |   |   |-- layout.tsx              # User layout: Sidebar + MobileNav + GlobalAIChat + GlobalCartDrawer
    |   |   |-- components/             # Layout-level components (BrandRedirector, etc.)
    |   |   |
    |   |   |-- wardrobe/               # /wardrobe -- Personal wardrobe
    |   |   |   |-- page.tsx            # Server Component: metadata + Suspense
    |   |   |   |-- loading.tsx         # Suspense fallback (skeleton)
    |   |   |   |-- components/
    |   |   |   |   |-- WardrobeData.tsx      # Async Server: serverFetch + initialData
    |   |   |   |   |-- WardrobeClient.tsx    # Client: URL state filter/search/sort
    |   |   |   |   `-- WardrobeCard.tsx      # Wardrobe item card UI
    |   |   |   |-- item/[id]/          # /wardrobe/item/:id
    |   |   |   |   |-- page.tsx
    |   |   |   |   |-- loading.tsx
    |   |   |   |   |-- components/
    |   |   |   |   |   |-- WardrobeItemDetailClient.tsx
    |   |   |   |   |   `-- WardrobeItemEditClient.tsx
    |   |   |   |   |-- edit/page.tsx   # /wardrobe/item/:id/edit
    |   |   |   |   `-- sell/page.tsx   # /wardrobe/item/:id/sell
    |   |   |   |-- upload/             # /wardrobe/upload
    |   |   |   |   |-- page.tsx
    |   |   |   |   `-- components/UploadClient.tsx
    |   |   |   `-- explore/            # /wardrobe/explore -- System catalog
    |   |   |       |-- page.tsx
    |   |   |       `-- components/SystemCatalogClient.tsx
    |   |   |
    |   |   |-- outfits/                # /outfits -- Outfit collections
    |   |   |   |-- page.tsx
    |   |   |   |-- loading.tsx
    |   |   |   |-- components/         # OutfitsClient.tsx, OutfitCard.tsx
    |   |   |   |-- create/             # /outfits/create
    |   |   |   |   `-- components/CreateOutfitClient.tsx
    |   |   |   `-- [id]/               # /outfits/:id -- View and edit outfit
    |   |   |       |-- page.tsx        # generateMetadata + OutfitWrapper (Server)
    |   |   |       |-- loading.tsx
    |   |   |       `-- components/
    |   |   |           |-- OutfitData.tsx         # Async Server: serverFetch
    |   |   |           `-- OutfitDetailClient.tsx # Client: canvas drag-drop editor
    |   |   |
    |   |   |-- ai-stylist/             # /ai-stylist -- AI outfit suggestion
    |   |   |   |-- page.tsx
    |   |   |   `-- components/AIStylistClient.tsx
    |   |   |
    |   |   |-- community/              # /community -- Fashion social feed
    |   |   |   |-- page.tsx
    |   |   |   `-- components/
    |   |   |
    |   |   |-- marketplace/            # /marketplace -- Second-hand marketplace
    |   |   |   |-- page.tsx
    |   |   |   `-- my-listings/
    |   |   |
    |   |   |-- checkout/               # /checkout -- Order checkout
    |   |   |   |-- page.tsx
    |   |   |   `-- components/
    |   |   |
    |   |   |-- search/                 # /search -- Global search
    |   |   |   |-- page.tsx
    |   |   |   `-- components/
    |   |   |
    |   |   |-- profile/                # /profile -- User profile
    |   |   |   |-- page.tsx
    |   |   |   |-- loading.tsx
    |   |   |   |-- components/
    |   |   |   |-- update/             # /profile/update
    |   |   |   `-- purchases/          # /profile/purchases -- Order history
    |   |   |
    |   |   |-- pricing/                # /pricing -- Subscription plans
    |   |   |-- brands/                 # /brands
    |   |   |-- cart/                   # /cart
    |   |   |-- posts/                  # /posts
    |   |   |-- products/               # /products
    |   |   `-- returns/                # /returns -- Return requests
    |   |
    |   |-- admin/                      # /admin -- System administration
    |   |   |-- layout.tsx
    |   |   |-- dashboard/
    |   |   |-- users/
    |   |   |-- brands/
    |   |   |-- category/
    |   |   |-- wardrobe/               # Admin wardrobe management
    |   |   |-- moderation/
    |   |   `-- trends/
    |   |
    |   |-- brand/                      # /brand/:brandId -- Brand Portal
    |   |   |-- page.tsx                # Brand selector redirect
    |   |   `-- [brandId]/
    |   |       |-- layout.tsx          # Brand-specific sidebar layout
    |   |       |-- dashboard/
    |   |       |-- orders/
    |   |       |-- products/
    |   |       |-- members/
    |   |       |-- customers/
    |   |       |-- posts/
    |   |       |-- loyalty/
    |   |       |-- benefits/
    |   |       |-- digital-sample-lab/
    |   |       |-- profile/
    |   |       `-- chat/
    |   |
    |   |-- brand-portal/               # /brand-portal -- Brand registration flow
    |   |   |-- register/
    |   |   `-- select/
    |   |
    |   `-- api/                        # [BFF] Next.js API Routes -- proxy to backend
    |       `-- auth/
    |           |-- login/route.ts      # POST -- calls backend, sets HttpOnly cookie
    |           |-- logout/route.ts     # POST -- clears cookies
    |           |-- refresh-token/route.ts  # POST -- exchanges refresh for new access token
    |           `-- status/route.ts     # GET -- returns auth status for client
    |
    |-- features/                       # [Feature-Sliced Design] Business logic by domain
    |   |                               # Convention: api/ + queries/ + types/ + (components/) + (hooks/)
    |   |
    |   |-- auth/                       # Authentication
    |   |   |-- api/auth.api.ts         # login(), logout(), getProfile()
    |   |   |-- queries/auth.queries.ts # useLogin, useLogout, useGetProfile
    |   |   |-- types/index.ts
    |   |   `-- store.ts
    |   |
    |   |-- wardrobe/                   # Personal wardrobe management
    |   |   |-- api/wardrobe.api.ts     # getMyWardrobeItems(), getCategories(), upload...
    |   |   |-- queries/wardrobe.queries.ts  # useMyWardrobe, useCategories, useBulkDelete...
    |   |   |-- types/index.ts          # WardrobeItemRes, FashionItemRes, CategoryRes, WardrobeItemStatus
    |   |   `-- utils.ts                # getWardrobeItemName()
    |   |
    |   |-- outfits/                    # Outfit management
    |   |   |-- api/outfits.api.ts      # getOutfits(), createOutfit(), updateOutfit()...
    |   |   |-- queries/outfits.queries.ts  # useOutfits, useOutfitDetail, useUpdateOutfit...
    |   |   |-- types/index.ts          # OutfitRes, OutfitItemRes, SaveOutfitReq...
    |   |   |-- components/
    |   |   |   `-- OutfitCanvasBoard.tsx  # Reusable drag-drop canvas (create + edit)
    |   |   `-- hooks/
    |   |       `-- useOutfitCanvas.ts  # Canvas state: position, scale, zIndex, drag
    |   |
    |   |-- ai-stylist/                 # AI styling assistant
    |   |   |-- api/ai.api.ts
    |   |   |-- queries/ai.queries.ts
    |   |   |-- types/index.ts
    |   |   `-- components/             # AIChatMessage, AIQuickOptions, AIChatHistorySidebar
    |   |
    |   |-- community/                  # Social feed
    |   |   |-- api/
    |   |   |-- queries/
    |   |   |-- types/
    |   |   `-- components/             # PostCard, CommunityList, CreatePostModal
    |   |
    |   |-- ghost-closet/               # Virtual brand items (Ghost Closet feature)
    |   |   |-- types/
    |   |   |-- components/GhostItemBadge.tsx
    |   |   |-- hooks/
    |   |   `-- mock/
    |   |
    |   |-- brand-portal/               # Brand portal business logic
    |   |   |-- api/
    |   |   |-- queries/
    |   |   |-- types/
    |   |   `-- context/                # React Context for brand-scoped state
    |   |
    |   |-- brands/                     # Brand listing/discovery
    |   |-- subscription/               # Subscription plans and limits
    |   |-- billing/                    # Billing and invoices
    |   |-- wallet/                     # User wallet
    |   |-- profile/                    # User profile management
    |   |-- users/                      # User management (admin)
    |   `-- admin/                      # Admin-specific logic
    |
    |-- components/                     # [Global UI] Shared, domain-agnostic components
    |   |-- ui/                         # shadcn/ui primitives (29 files total)
    |   |   |-- button.tsx, input.tsx, dialog.tsx, select.tsx
    |   |   |-- table.tsx, pagination.tsx, skeleton.tsx
    |   |   |-- alert-dialog.tsx, dropdown-menu.tsx, sheet.tsx
    |   |   |-- tabs.tsx, accordion.tsx, avatar.tsx, badge.tsx
    |   |   |-- sonner.tsx              # Toast wrapper around Sonner
    |   |   `-- ...
    |   |-- layout/
    |   |   |-- sidebar.tsx             # Main sidebar (user layout) -- uses useSidebarStore
    |   |   |-- mobile-nav.tsx          # Mobile bottom navigation
    |   |   |-- topbar.tsx              # Top bar (currently hidden in layout)
    |   |   `-- guest-header.tsx        # Landing page header with nav
    |   |-- providers/
    |   |   |-- query-provider.tsx      # TanStack Query QueryClient + ReactQueryDevtools
    |   |   |-- theme-controller.tsx    # next-themes ThemeProvider wrapper
    |   |   `-- auth-provider.tsx       # On-mount: calls useGetProfile to hydrate Zustand store
    |   |-- chat/
    |   |   `-- GlobalAIChat.tsx        # Floating AI chat bubble (available in all user pages)
    |   |-- cart/
    |   |   `-- GlobalCartDrawer.tsx    # Slide-in cart drawer (global)
    |   |-- skeleton.tsx                # Generic skeleton wrapper component
    |   `-- WeatherWidget.tsx           # Weather data widget
    |
    |-- lib/                            # Core infrastructure utilities
    |   |-- axios.ts                    # Axios: baseURL=/api/v1, withCredentials, auto refresh on 401
    |   |-- server-fetch.ts             # SSR-only fetch: reads HttpOnly cookie, calls backend directly
    |   |-- cloudinary.ts               # uploadToCloudinary(), applyCloudinaryTrim(), getSignature()
    |   |-- api-error.ts                # handleApiError(): extracts message from AxiosError, shows toast
    |   |-- utils.ts                    # cn() = clsx() + twMerge()
    |   `-- axios.test.ts               # Jest unit tests for Axios interceptor logic
    |
    |-- store/                          # [Zustand] Global client state
    |   |-- useAuthStore.ts             # { user, setUser, clearUser } -- persisted to localStorage
    |   `-- useSidebarStore.ts          # { isCollapsed, toggle } -- sidebar expand/collapse state
    |
    |-- types/                          # Global TypeScript contracts
    |   `-- api.ts                      # APIResponse<T>, PaginationResult<T>, ErrorResponse
    |
    |-- hooks/                          # Global reusable React hooks
    |-- services/                       # External service integrations
    `-- common/                         # Shared constants, config values, helper functions

t
```

### 5.4 Session State

- **Token storage**: HttpOnly Cookie (không truy cập được từ JS → chống XSS).
- **User data**: Zustand `useAuthStore` (persist vào localStorage).
- **Auth check**: `AuthProvider` tự động gọi `useGetProfile` khi app load để hydrate Zustand store.

---

## 6. State Management

| State | Tool | Nơi dùng |
|---|---|---|
| Server data (API) | TanStack Query v5 | Mọi data fetch từ Backend |
| UI Global state | Zustand v5 | `useAuthStore` (user), `useSidebarStore` (sidebar) |
| Form state | React Hook Form | Các form đăng nhập, đăng ký, chỉnh sửa |
| URL state | `useSearchParams` + `useRouter` | Filter, search, phân trang trên trang wardrobe |
| Local component state | `useState` | UI toggles, modals, loading states cục bộ |

---

## 7. API Response Contract

Mọi API của Backend đều theo chuẩn:

```ts
// src/types/api.ts

interface APIResponse<T> {
  message?: string;
  data?: T;
}

interface PaginationResult<T> {
  items: T[];
  metadata: PaginationMetadata;
}

interface PaginationMetadata {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}
```

`serverFetch` và Axios service đều tự động unwrap `res.data.data` trước khi trả về cho hooks.

---

## 8. Route Groups & Layouts

| Route Group | Path | Layout | Mô tả |
|---|---|---|---|
| `(guest)` | `/`, `/auth/*` | Minimal layout (no sidebar) | Landing page, auth pages |
| `(user)` | `/wardrobe`, `/outfits`, `/ai-stylist`... | Sidebar + MobileNav + GlobalAIChat | Trang chính của user |
| `admin` | `/admin/*` | Admin-specific layout | Dashboard quản trị |
| `brand` | `/brand/*` | Brand portal layout | Quản lý brand orders, users |

---

## 9. URL State Pattern (Filter & Pagination)

Các trang có filter/search (Wardrobe, Outfits...) dùng URL search params làm single source of truth:

```ts
// Đọc state từ URL
const categoryParam = searchParams.get("categorySlug") || "";
const pageParam = parseInt(searchParams.get("page") || "1", 10);

// Cập nhật URL (không scroll lại đầu trang)
const updateParams = (newParams: Record<string, string | null>) => {
  const params = new URLSearchParams(searchParams.toString());
  // ...
  router.push(`${pathname}?${params.toString()}`, { scroll: false });
};
```

**Lợi ích**: Filter state được lưu trong URL, có thể bookmark và chia sẻ link. TanStack Query dùng URL params làm cache key để auto-refetch khi filter thay đổi.

---

## 10. Workflow — Thêm một Feature mới

Ví dụ thêm module `returns` (quản lý đơn hàng hoàn trả):

```bash
# 1. Khai báo Types
src/features/returns/types/index.ts

# 2. Tạo API Service
src/features/returns/api/returns.api.ts

# 3. Tạo TanStack Query Hooks
src/features/returns/queries/returns.queries.ts

# 4. (Optional) Tạo Feature-specific components
src/features/returns/components/ReturnCard.tsx

# 5. Tạo Route pages
src/app/(user)/returns/
    ├── page.tsx           # Server Component — metadata + Suspense
    ├── loading.tsx        # Skeleton fallback
    └── components/
        ├── ReturnsData.tsx    # Async Server Component — serverFetch
        └── ReturnsClient.tsx  # Client Component — "use client"
```

---

## 11. Cloudinary Integration

Upload ảnh lên Cloudinary được thực hiện client-side theo flow:

```
Client → GET /wardrobe-items/upload-signature (Backend)
       → Backend trả về { apiKey, signature, timestamp, folder }
       → Client upload file trực tiếp lên Cloudinary
       → Client nhận { secure_url, public_id }
       → Client gửi URL lên Backend để lưu vào database
```

Xem chi tiết tại `src/lib/cloudinary.ts`.

---

## 12. Testing

- **Unit tests**: Jest + ts-jest, chạy bằng `npm test`.
- **Test files**: Đặt cạnh file cần test với suffix `.test.ts` (ví dụ: `src/lib/axios.test.ts`).
- **Mocking**: `axios-mock-adapter` để mock Axios trong unit tests.
