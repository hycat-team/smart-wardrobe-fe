# BFF API Routes — Giải thích chi tiết

Tài liệu này giải thích cây thư mục `src/app/api/` (BFF Layer) và cách nó phối hợp với `middleware.ts` để xử lý bảo mật trong dự án Smart Wardrobe.

---

## 1. BFF là gì?

**BFF = Backend For Frontend** — một lớp server trung gian nằm giữa Browser và Backend thật.

Trong dự án này, BFF chính là **Next.js server** — nơi chứa `middleware.ts` và các `route.ts` trong `src/app/api/`.

```
┌──────────┐         ┌──────────────────┐         ┌──────────────┐
│  Browser │ ──────→ │  Next.js Server  │ ──────→ │   Backend    │
│ (Client) │ ←────── │     (BFF)        │ ←────── │ (Spring/.NET)│
└──────────┘         └──────────────────┘         └──────────────┘
                     Xử lý Cookie, Proxy,
                     Refresh Token tự động
```

**Tại sao cần BFF?**

| Không có BFF (Trực tiếp) | Có BFF (Dự án hiện tại) |
|---|---|
| Token lưu ở `localStorage` | Token lưu ở **HttpOnly Cookie** |
| JS đọc được token → **dễ bị XSS** | JS **không đọc được** token → **chống XSS** |
| Phải tự viết logic refresh token ở client | Middleware **tự động refresh** ở server |
| Server Component không có token | Server Component đọc cookie → **SSR có auth** |

---

## 2. Cây thư mục

```text
src/
├── middleware.ts                          ← (A) Bộ não chính: Proxy + Auto Refresh
└── app/
    └── api/
        └── auth/                         ← Chỉ chứa các route liên quan Authentication
            ├── login/
            │   └── route.ts              ← (B) Đăng nhập: nhận token → set cookie
            ├── logout/
            │   └── route.ts              ← (C) Đăng xuất: huỷ token → xoá cookie
            ├── refresh-token/
            │   └── route.ts              ← (D) Làm mới token → cập nhật cookie
            └── status/
                └── route.ts              ← (E) Kiểm tra trạng thái đăng nhập
```

> **Lưu ý:** Đây là API chạy trên **Next.js server**, không phải trang giao diện. Mỗi file `route.ts` tương ứng với một endpoint HTTP.

---

## 3. Vai trò từng thành phần

### (A) `middleware.ts` — Bộ não trung tâm

**URL match:** Tất cả request (`/api/v1/*` và mọi trang).

**Hai nhiệm vụ chính:**

#### Nhiệm vụ 1: Auto Refresh Token

Khi user đang dùng app, token hết hạn → middleware **tự động** refresh mà user không biết:

```
Request từ Browser
      ↓
middleware kiểm tra: accessToken còn hạn không?
      ↓
  ┌─ CÒN HẠN → Cho qua bình thường
  │
  └─ HẾT HẠN → Có refreshToken không?
                    ↓
               ┌─ CÓ → Gọi Backend /auth/refresh-token
               │        → Lấy token mới
               │        → Ghi đè cookie header
               │        → Cho request tiếp tục với token mới
               │
               └─ KHÔNG → Xoá cookie, trả 401 hoặc để page tự xử lý
```

#### Nhiệm vụ 2: API Proxy (Rewrite)

Khi Axios client gọi `/api/v1/me`, middleware **proxy** request sang Backend thật:

```
Axios: GET /api/v1/me
      ↓
middleware.ts:
  1. Đổi URL: /api/v1/me → http://backend:8080/api/v1/me
  2. Gắn header: Authorization: Bearer {accessToken từ cookie}
  3. NextResponse.rewrite(backendUrl)
      ↓
Backend nhận request đã có token → trả response
```

**Tại sao proxy?** Vì Axios client dùng `baseURL: '/api/v1'` (relative URL). Request gửi tới Next.js server trước, middleware chèn token rồi forward sang Backend. Client **không cần biết** token ở đâu.

---

### (B) `login/route.ts` — Đăng nhập

**Endpoint:** `POST /api/auth/login`

```
Browser gửi { email, password }
      ↓
route.ts nhận body
      ↓
fetch('http://backend:8080/api/v1/auth/login', body)
      ↓
Backend trả về { accessToken, refreshToken, ... }
      ↓
route.ts set HttpOnly Cookie:
  - accessToken (maxAge: 1 ngày)
  - refreshToken (maxAge: 7 ngày)
      ↓
Trả response cho Browser (KHÔNG chứa token trong body)
→ Browser tự lưu cookie, JS KHÔNG đọc được
```

**Code tham chiếu:** [`src/app/api/auth/login/route.ts`](../src/app/api/auth/login/route.ts)

---

### (C) `logout/route.ts` — Đăng xuất

**Endpoint:** `POST /api/auth/logout`

```
Browser gửi POST /api/auth/logout
      ↓
route.ts đọc accessToken từ cookie
      ↓
Gọi Backend /auth/logout (để huỷ token phía server nếu có)
      ↓
Xoá cookie: accessToken, refreshToken
      ↓
Trả { success: true }
```

**Code tham chiếu:** [`src/app/api/auth/logout/route.ts`](../src/app/api/auth/logout/route.ts)

---

### (D) `refresh-token/route.ts` — Làm mới token

**Endpoint:** `POST /api/auth/refresh-token`

> Route này được gọi bởi Axios interceptor khi phát hiện 401 ở client.

```
Axios interceptor phát hiện 401
      ↓
Gọi POST /api/auth/refresh-token
      ↓
route.ts đọc refreshToken từ cookie
      ↓
Gọi Backend /auth/refresh-token
      ↓
Backend trả token mới
      ↓
route.ts cập nhật HttpOnly Cookie với token mới
      ↓
Axios retry request gốc (tự động)
```

**Code tham chiếu:** [`src/app/api/auth/refresh-token/route.ts`](../src/app/api/auth/refresh-token/route.ts)

---

### (E) `status/route.ts` — Kiểm tra trạng thái

**Endpoint:** `GET /api/auth/status`

Route đơn giản nhất — chỉ kiểm tra xem cookie `accessToken` có tồn tại hay không:

```ts
export async function GET(request: NextRequest) {
  const hasToken = request.cookies.has('accessToken');
  return NextResponse.json({ hasToken });
}
```

**Khi nào dùng?** Client Component cần biết user đã đăng nhập chưa mà không cần gọi `/me` (tốn network). Ví dụ: hiện/ẩn nút Login/Logout.

**Code tham chiếu:** [`src/app/api/auth/status/route.ts`](../src/app/api/auth/status/route.ts)

---

## 4. Sơ đồ luồng tổng quan

### Luồng Đăng nhập

```
┌─────────┐    POST /api/auth/login     ┌──────────────┐    POST /auth/login     ┌─────────┐
│ Browser │ ──────────────────────────→ │ login/route  │ ──────────────────────→ │ Backend │
│         │    { email, password }       │   (BFF)      │    { email, password }  │         │
│         │                              │              │                         │         │
│         │ ←────────────────────────── │              │ ←────────────────────── │         │
│         │  Response + Set-Cookie:      │ Lưu token    │  { accessToken,         │         │
│         │  accessToken (HttpOnly)      │ vào cookie   │    refreshToken }       │         │
│         │  refreshToken (HttpOnly)     │              │                         │         │
└─────────┘                              └──────────────┘                         └─────────┘
```

### Luồng gọi API thông thường (sau khi đã đăng nhập)

```
┌─────────┐  GET /api/v1/me         ┌──────────────┐  GET /me                 ┌─────────┐
│ Browser │ ──────────────────────→ │ middleware   │ ──────────────────────→ │ Backend │
│ (Axios) │  Cookie tự động gửi     │              │  + Authorization:       │         │
│         │                          │ 1. Đọc token │    Bearer {token}       │         │
│         │                          │    từ cookie  │                         │         │
│         │                          │ 2. Kiểm tra   │                         │         │
│         │                          │    hết hạn?   │                         │         │
│         │                          │ 3. Gắn header │                         │         │
│         │                          │ 4. Rewrite URL│                         │         │
│         │ ←────────────────────── │              │ ←────────────────────── │         │
│         │  Response data           │              │  Response data          │         │
└─────────┘                          └──────────────┘                         └─────────┘
```

### Luồng Auto Refresh Token (token hết hạn giữa chừng)

```
┌─────────┐  GET /api/v1/me         ┌──────────────┐                          ┌─────────┐
│ Browser │ ──────────────────────→ │ middleware   │                          │ Backend │
│         │                          │              │                          │         │
│         │                          │ Token hết hạn!│                          │         │
│         │                          │       ↓       │                          │         │
│         │                          │ POST /auth/   │ ──────────────────────→ │         │
│         │                          │ refresh-token │  refreshToken            │         │
│         │                          │       ↓       │ ←────────────────────── │         │
│         │                          │ Nhận token mới│  newAccessToken          │         │
│         │                          │       ↓       │                          │         │
│         │                          │ Tiếp tục:     │                          │         │
│         │                          │ GET /me       │ ──────────────────────→ │         │
│         │                          │ + token mới   │                          │         │
│         │ ←────────────────────── │              │ ←────────────────────── │         │
│         │  Response + Set-Cookie   │              │  Response data          │         │
│         │  (token mới)             │              │                          │         │
└─────────┘                          └──────────────┘                         └─────────┘
```

---

## 5. So sánh `src/app/api/` vs `src/features/*/api/`

Đây là hai thứ **hoàn toàn khác nhau** dù cùng có tên `api`:

| | `src/app/api/auth/*` | `src/features/*/api/*` |
|---|---|---|
| **Kiểu** | Next.js Route Handler (server endpoint) | Hàm TypeScript (Axios wrapper) |
| **Chạy ở** | Server Next.js | Browser (client) |
| **Là API thật?** | ✅ Có — browser gọi được qua URL | ❌ Không — chỉ là hàm JS |
| **Mục đích** | Xử lý Cookie (đăng nhập/đăng xuất/refresh) | Gọi API nghiệp vụ (profile, wallet, wardrobe...) |
| **Ai gọi** | Axios interceptor, auth hooks | TanStack Query hooks trong Client Component |
| **Có logic nghiệp vụ?** | ❌ Không — chỉ proxy và quản lý cookie | ✅ Có — getProfile, updateProfile, getWallet... |

### Quy tắc đơn giản:

- **Cần đọc/ghi HttpOnly Cookie** → viết ở `src/app/api/`
- **Cần gọi API nghiệp vụ** → viết ở `src/features/*/api/`

---

## 6. Tóm tắt

```text
src/app/api/        = "Bảo vệ cổng" — Chỉ lo Authentication (Cookie)
src/features/*/api/ = "Nhân viên"    — Lo nghiệp vụ (gọi API từ client)
middleware.ts       = "Bộ não"       — Tự động proxy + refresh token
server-fetch.ts     = "Đường tắt"   — Server Component gọi Backend trực tiếp
```

| Thành phần | Khi nào chạy | Làm gì |
|---|---|---|
| `middleware.ts` | **Mọi request** | Kiểm tra token, auto refresh, proxy `/api/v1/*` |
| `app/api/auth/login` | User **đăng nhập** | Gọi Backend → lưu token vào HttpOnly Cookie |
| `app/api/auth/logout` | User **đăng xuất** | Gọi Backend → xoá Cookie |
| `app/api/auth/refresh-token` | Token **hết hạn** (client-side) | Gọi Backend → cập nhật Cookie |
| `app/api/auth/status` | Cần **check nhanh** auth | Trả `{ hasToken: true/false }` |
| `features/*/api/*` | Client Component **cần data** | Axios gọi qua proxy `/api/v1/*` |
| `server-fetch.ts` | Server Component **render trang** | fetch trực tiếp Backend + đọc cookie |
