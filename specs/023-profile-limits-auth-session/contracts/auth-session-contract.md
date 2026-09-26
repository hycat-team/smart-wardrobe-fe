# API Contract: Chuẩn hoá Phiên Xác thực & Quản lý Cookie Auth

**Feature**: `023-profile-limits-auth-session`  
**Base URL**: `/api/v1` (Proxied to `https://api.closy.hycat.online/api/v1`)  

---

## 1. Đăng nhập (`POST /api/v1/auth/login`)

- **Mục đích**: Xác thực người dùng, trả về thông tin người dùng và thiết lập cookie auth chuẩn.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "user@example.com",
    "password": "your-password"
  }
  ```

### Response Headers (Backend -> Client)
```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: accessToken=<JWT_ACCESS>; Domain=closy.hycat.online; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=900
Set-Cookie: refreshToken=<JWT_REFRESH>; Domain=closy.hycat.online; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=604800
```

### Response Body
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": "usr_123456",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

---

## 2. Làm mới Phiên (`POST /api/v1/auth/refresh-token`)

- **Mục đích**: Tự động xoay vòng cặp token khi `accessToken` hết hạn mà không làm gián đoạn trải nghiệm người dùng.
- **Request Headers**:
  - `Content-Type: application/json`
  - Cookie: Tự động gửi kèm `refreshToken` từ cookie jar của trình duyệt (`withCredentials: true`).

### Response Headers (Backend -> Client)
```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: accessToken=<NEW_JWT_ACCESS>; Domain=closy.hycat.online; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=900
Set-Cookie: refreshToken=<NEW_JWT_REFRESH>; Domain=closy.hycat.online; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=604800
```

### Response Body
```json
{
  "success": true,
  "message": "Làm mới phiên thành công"
}
```

---

## 3. Đăng xuất (`POST /api/v1/auth/logout`)

- **Mục đích**: Hủy bỏ phiên trên máy chủ và thu hồi cookie auth trên trình duyệt.
- **Request Headers**:
  - Cookie: Tự động gửi kèm `refreshToken` (`withCredentials: true`).

### Response Headers (Backend -> Client)
```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: accessToken=; Domain=closy.hycat.online; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0
Set-Cookie: refreshToken=; Domain=closy.hycat.online; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0
```

### Response Body
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

## 4. Nguyên tắc Tích hợp Phía Frontend

1. **Proxy Rewrite**:
   - Yêu cầu được gửi từ client tới cùng nguồn `/api/v1/auth/*`.
   - Next.js rewrite proxy chuyển tiếp nguyên trạng tới `https://api.closy.hycat.online/api/v1/auth/*`.
   - Header `Set-Cookie` của backend được chuyển tiếp nguyên trạng tới trình duyệt.
2. **Không Can thiệp Cookie**:
   - Không sử dụng `NextResponse.cookies.set()` hoặc `NextResponse.cookies.delete()` tại bất kỳ BFF route handler hay middleware nào đối với `accessToken` và `refreshToken`.
3. **Credentials**:
   - Mọi request xác thực hoặc yêu cầu API từ client bắt buộc phải bật thuộc tính `withCredentials: true` (đã được cấu hình mặc định trong Axios instance `@/lib/axios`).
