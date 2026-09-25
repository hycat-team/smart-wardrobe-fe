# Feature Specification: Đăng nhập bằng Google (Google Login Web)

**Feature Branch**: `002-google-login`

**Created**: 2026-09-25

**Status**: Draft

**Input**: User description: "Tích hợp đăng nhập Google cho Frontend Web dựa theo hướng dẫn docs/api/identity/google-login-frontend-guide.md"

## Clarifications

### Session 2026-09-25

- Q: Nút "Đăng nhập bằng Google" nên được hiển thị ở những màn hình nào trên ứng dụng web? → A: Hiển thị ở cả trang Đăng nhập (`/auth/login`) và trang Đăng ký (`/auth/register`).
- Q: Giao diện trang tiếp nhận callback (`/auth/callback`) nên được thiết kế như thế nào trong thời gian chờ xác thực phiên đăng nhập? → A: Hiển thị Auth Card ở giữa màn hình với Logo Closy, animation loading và thông báo "Đang hoàn tất đăng nhập...".
- Q: Có triển khai thêm Google One Tap (Google Identity Services) không? → A: Chỉ tập trung hoàn thiện luồng Web Redirect (§1) cho giai đoạn này; không nhúng thư viện script ngoài.
- Q: Khi phát sinh lỗi từ backend hoặc Google, giao diện nên hiển thị thông báo lỗi theo hình thức nào? → A: Điều hướng về `/auth/login` và hiển thị Toast tiếng Việt qua thư viện `sonner` theo bảng ánh xạ mã lỗi chuẩn.
- Q: Cơ chế bảo toàn và điều hướng về trang đích ban đầu (`returnUrl`)? → A: Lưu `returnUrl` vào `sessionStorage` trước khi redirect sang Google; trang callback đọc ra, điều hướng và xóa khỏi storage (fallback về `/brands` cho User hoặc `/admin/dashboard` cho Admin).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Người dùng đăng nhập thành công bằng tài khoản Google (Priority: P1)

Người dùng mở trang đăng nhập `/auth/login` (hoặc `/auth/register`), nhấn vào nút "Đăng nhập bằng Google". Trình duyệt chuyển hướng người dùng đến màn hình cấp quyền của Google. Sau khi xác thực tài khoản Google thành công, người dùng được chuyển hướng trở lại trang tiếp nhận kết quả của Closy (`/auth/callback`). Hệ thống tự động xác nhận phiên đăng nhập và điều hướng người dùng vào màn hình tương ứng (dashboard cho Admin hoặc trang chính cho Khách hàng).

**Why this priority**: Đây là luồng người dùng cốt lõi (Happy Path), giúp đơn giản hóa quá trình đăng ký và đăng nhập, giảm tối đa ma sát cho người dùng mới và hiện tại.

**Independent Test**: Có thể kiểm thử độc lập bằng cách nhấn nút "Đăng nhập bằng Google", đăng nhập với tài khoản Google hợp lệ, kiểm tra trang callback tiếp nhận phiên, và xác nhận đã điều hướng vào trang bên trong với thông tin tài khoản được cập nhật.

**Acceptance Scenarios**:

1. **Given** người dùng chưa đăng nhập ở trang `/auth/login`, **When** người dùng nhấn nút "Đăng nhập bằng Google", **Then** trình duyệt chuyển hướng đến endpoint `{API_BASE}/api/v1/auth/google?redirectUrl={FE_RETURN_URL}`.
2. **Given** người dùng hoàn tất đăng nhập tại Google và quay lại `/auth/callback`, **When** trang callback không nhận tham số `error`, **Then** hệ thống gọi API xác nhận phiên (`/api/v1/me` hoặc profile query), cập nhật trạng thái người dùng trong store/cache, hiển thị thông báo thành công và chuyển hướng đến trang đích (`/brands` hoặc `/admin/dashboard` tùy theo quyền).

---

### User Story 2 - Tiếp nhận và xử lý các kịch bản lỗi từ Google hoặc Backend (Priority: P2)

Trong quá trình xác thực với Google hoặc xử lý tại backend, nếu có lỗi phát sinh (người dùng hủy ủy quyền, email chưa xác thực, tài khoản bị khóa, xung đột liên kết tài khoản), trang callback tiếp nhận mã lỗi qua query string `?error=<code>`, diễn giải thành thông báo tiếng Việt rõ ràng, thân thiện và đưa người dùng trở lại màn hình đăng nhập an toàn.

**Why this priority**: Đảm bảo trải nghiệm người dùng liền mạch khi xảy ra lỗi, tránh tình trạng treo trang trắng hoặc lỗi kỹ thuật khó hiểu.

**Independent Test**: Có thể kiểm thử độc lập bằng cách truy cập `/auth/callback?error=access_denied` hoặc các mã lỗi khác trong hợp đồng backend, kiểm tra toast/thông báo hiển thị đúng nội dung và người dùng được điều hướng về `/auth/login`.

**Acceptance Scenarios**:

1. **Given** người dùng hủy thao tác tại màn hình Google và backend chuyển hướng về `/auth/callback?error=access_denied`, **When** trang tiếp nhận mã lỗi, **Then** hệ thống hiển thị thông báo "Bạn đã hủy đăng nhập bằng Google" và chuyển về `/auth/login`.
2. **Given** người dùng có tài khoản bị khóa và backend trả về `?error=account_disabled`, **When** trang callback phân tích lỗi, **Then** hiển thị thông báo tài khoản bị khóa và hướng dẫn liên hệ CSKH.
3. **Given** phát sinh các mã lỗi khác (`email_unverified`, `email_registered`, `account_linked`, `exchange_failed`, `server_error`), **When** phân tích URL query, **Then** giao diện hiển thị đúng thông điệp theo bảng mã lỗi chuẩn.

---

### User Story 3 - Duy trì ngữ cảnh trang đích sau khi đăng nhập Google (Priority: P3)

Người dùng đang xem một trang cần đăng nhập hoặc nhấn đăng nhập từ một liên kết cụ thể (ví dụ: giỏ hàng, thông tin trang phục). Sau khi hoàn tất đăng nhập bằng Google, người dùng được đưa trở lại đúng trang họ đang muốn truy cập thay vì luôn về trang mặc định.

**Why this priority**: Nâng cao trải nghiệm tiện ích, tránh làm gián đoạn hành trình mua sắm hay phối đồ của người dùng.

**Independent Test**: Có thể kiểm thử độc lập bằng cách bắt đầu luồng đăng nhập từ URL có `returnUrl=/wardrobe`, hoàn tất đăng nhập Google và xác nhận trang cuối cùng là `/wardrobe`.

**Acceptance Scenarios**:

1. **Given** người dùng có tham số `redirect` hoặc `from` trước khi đăng nhập, **When** chuyển hướng sang Google, **Then** thông tin đích đến được lưu tạm vào `sessionStorage` (key `auth_return_url`), và trang `/auth/callback` sau khi xác thực thành công sẽ đọc ra để điều hướng về đúng trang đó rồi xóa khỏi storage.

---

### Edge Cases

- **Mất kết nối mạng tại trang callback**: Nếu trình duyệt mất mạng ngay khi Google redirect về `/auth/callback`, trang callback hiển thị nút "Thử lại xác thực" mà không làm mất phiên.
- **Người dùng tải lại trang callback nhiều lần**: Trang callback chỉ kích hoạt gọi xác thực phiên một lần, tránh lặp lại request hoặc chuyển hướng vòng lặp.
- **Trình duyệt chặn cookie bên thứ ba hoặc chính sách SameSite**: Frontend và API cùng registrable domain (`hycat.online`) đảm bảo cookie HttpOnly `SameSite=Strict` hoạt động ổn định; hiển thị cảnh báo nếu trình duyệt tắt hoàn toàn cookie.
- **Tài khoản mới đăng nhập lần đầu bằng Google**: Hệ thống tự động tạo hồ sơ mặc định và chuyển tiếp liền mạch không yêu cầu điền mật khẩu.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Giao diện đăng nhập (`/auth/login`) và đăng ký (`/auth/register`) MUST hiển thị nút "Đăng nhập bằng Google" với nhãn và biểu tượng Google chuẩn nhận diện thương hiệu.
- **FR-002**: Khi người dùng nhấn nút Google Login, ứng dụng MUST tạo URL chuyển hướng đến `{API_BASE}/api/v1/auth/google` kèm query parameter `redirectUrl` được encode hợp lệ trỏ tới route callback của frontend (ví dụ: `https://<fe-domain>/auth/callback`).
- **FR-003**: Ứng dụng MUST có route `/auth/callback` chuyên trách tiếp nhận phản hồi từ backend sau khi Google redirect.
- **FR-004**: Route `/auth/callback` MUST kiểm tra sự tồn tại của query parameter `error`. Nếu có lỗi, MUST ánh xạ mã lỗi sang thông báo tiếng Việt theo bảng mã lỗi chuẩn, điều hướng người dùng về `/auth/login` và kích hoạt Toast (Sonner) thông báo lỗi.
- **FR-005**: Nếu không có `error`, route `/auth/callback` MUST kích hoạt xác nhận phiên đăng nhập thông qua API hiện hành với chế độ credentials HttpOnly (`fetch(..., { credentials: 'include' })` hoặc `profileApi.getProfile()`).
- **FR-006**: Sau khi xác nhận phiên thành công, ứng dụng MUST cập nhật TanStack React Query cache (`authStatus`, `profile`), cập nhật Zustand store (nếu có), hiển thị toast thông báo thành công và điều hướng tới trang nội bộ phù hợp.
- **FR-007**: Hệ thống MUST xử lý điều hướng phân quyền và ngữ cảnh: nếu có lưu `returnUrl` hợp lệ trong `sessionStorage`, ưu tiên điều hướng về trang đó; nếu không, người dùng có vai trò Admin chuyển về `/admin/dashboard`, người dùng thông thường chuyển về trang danh mục/khám phá (`/brands`).
- **FR-008**: Nút "Đăng nhập bằng Google" MUST được hiển thị ở cả trang Đăng nhập (`/auth/login`) và trang Đăng ký (`/auth/register`) với cùng luồng khởi tạo OAuth.
- **FR-009**: Trang `/auth/callback` MUST hiển thị Auth Card ở giữa màn hình với logo Closy, hiệu ứng loading động và thông báo "Đang hoàn tất đăng nhập..." trong khi xử lý xác thực phiên và điều hướng.
- **FR-010**: Hệ thống MUST tập trung hoàn toàn vào luồng Web Redirect qua backend (`GET /api/v1/auth/google?redirectUrl=...`); không nhúng thư viện JS ngoài (Google Identity Services) trong giai đoạn này.

### Key Entities *(include if feature involves data)*

- **AuthSession**: Đại diện cho phiên đăng nhập của người dùng trong hệ thống (lưu thông qua HttpOnly cookies `accessToken` và `refreshToken` do backend/BFF quản lý).
- **UserProfile**: Thông tin tài khoản người dùng lấy từ `/api/v1/me` (hoặc `/profile`), gồm `userId`, `email`, `fullName`, `roleSlug`, `status`.
- **GoogleAuthError**: Cấu trúc mã lỗi từ backend gồm các mã chuẩn: `access_denied`, `email_unverified`, `email_registered`, `account_linked`, `account_disabled`, `exchange_failed`, `server_error`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Người dùng hoàn tất quá trình đăng nhập bằng Google (từ lúc nhấn nút đến khi vào trang chủ) trong vòng dưới 5 giây trong điều kiện mạng tiêu chuẩn.
- **SC-002**: 100% các mã lỗi trả về trong query string `?error=<code>` được chuyển đổi thành thông điệp tiếng Việt có nghĩa, không hiển thị mã lỗi thô cho người dùng.
- **SC-003**: Không có hiện tượng rò rỉ token truy cập (Access Token / Refresh Token) ra URL query hoặc localStorage (tuân thủ nguyên tắc HttpOnly cookie).
- **SC-004**: Tỷ lệ đăng nhập Google thành công lần đầu đạt trên 95% đối với các tài khoản Google đã xác thực email.

## Assumptions

- Backend đã hoàn tất triển khai endpoint `GET /api/v1/auth/google?redirectUrl=...` và hỗ trợ đặt cookie phiên HttpOnly theo hợp đồng tại `specs/021-google-login/contracts/google-login-api.md`.
- Frontend chạy trên cùng domain hoặc registrable domain với Backend API theo cấu hình môi trường (hỗ trợ `SameSite=Strict` cookie).
- Sử dụng luồng Authorization Code Redirect là luồng bắt buộc và ưu tiên hàng đầu; luồng Google Identity Services (One Tap) có thể cân nhắc mở rộng ở giai đoạn sau.
