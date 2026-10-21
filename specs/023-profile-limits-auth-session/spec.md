# Feature Specification: Hiển thị Hạn mức Profile & Quản lý Phiên Cookie Auth Chuẩn hoá

**Feature Branch**: `023-profile-limits-auth-session`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "đọc file D:\Project\smart-wardrobe\smart-wardrobe-fe\docs\frontend-profile-limits-and-session-guide"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Người dùng theo dõi trực quan hạn mức và số lượng thực tế của Tủ đồ và Outfit trên trang Profile (Priority: P1)

Khi người dùng truy cập trang cá nhân (`/profile`) tại thẻ thông tin gói dịch vụ hiện tại, người dùng có thể nắm bắt chính xác và minh bạch hai chỉ số quan trọng: số lượng trang phục/tủ đồ hiện có so với giới hạn tối đa cho phép của gói, và số lượng bộ phối đồ (outfit) đã tạo so với giới hạn tối đa. Cả hai thông số đều được biểu diễn rõ ràng dưới dạng `hiện tại / tối đa` kèm thanh đo tiến trình trực quan.

**Why this priority**: Đây là thông tin thiết yếu nhất giúp người dùng nhận thức được dung lượng còn lại của tài khoản, kích thích nhu cầu nâng cấp gói dịch vụ khi sắp chạm ngưỡng và loại bỏ sự hoang mang khi trước đây hệ thống luôn hiển thị mức tối đa vô hạn hoặc thông tin không trùng khớp.

**Independent Test**: Có thể kiểm thử độc lập bằng cách đăng nhập vào tài khoản có gói dịch vụ cụ thể (ví dụ gói Premium với giới hạn 500 món đồ và 50 outfit), mở trang `/profile` và xác nhận thẻ gói dịch vụ hiển thị chính xác số món đồ hiện tại (ví dụ: 128 / 500 món) và số outfit hiện tại (ví dụ: 12 / 50 bộ) cùng thanh tiến trình trực quan phản ánh đúng tỷ lệ phần trăm.

**Acceptance Scenarios**:

1. **Given** người dùng đã đăng nhập và đang sở hữu gói dịch vụ có giới hạn cụ thể, **When** người dùng truy cập trang `/profile`, **Then** hệ thống kết hợp thông tin hạn mức tối đa của gói và số liệu thống kê thực tế hiện có để hiển thị định dạng `{số lượng hiện tại} / {giới hạn tối đa} món` đối với tủ đồ và `{số lượng hiện tại} / {giới hạn tối đa} bộ` đối với outfit.
2. **Given** người dùng có số lượng món đồ hoặc outfit bằng 0, **When** xem thông tin tại thẻ gói dịch vụ, **Then** hệ thống hiển thị chính xác số `0 / {giới hạn tối đa}` chứ không bị ẩn hoặc rơi về giá trị mặc định sai lệch.
3. **Given** tỷ lệ sử dụng hiện tại của người dùng, **When** thanh tiến trình hiển thị, **Then** giá trị phần trăm được tính toán chính xác theo công thức `(hiện tại / tối đa) * 100%` (tối đa 100%) và hiển thị thanh màu trực quan.

---

### User Story 2 - Quản lý phiên đăng nhập và đăng xuất an toàn, sạch sẽ, không trùng lặp cookie (Priority: P1)

Người dùng thực hiện đăng nhập vào hệ thống bằng tài khoản thông thường hoặc đăng nhập thông qua Google. Hệ thống thiết lập phiên làm việc duy nhất, bảo mật cao và chịu sự quản lý tập trung từ máy chủ xác thực. Khi người dùng bấm đăng xuất, phiên làm việc được giải phóng hoàn toàn và tức thì; trình duyệt không còn lưu giữ các phiên bản thông tin phiên cũ hay thông tin rác, ngăn ngừa tình trạng đăng xuất không triệt để hoặc xung đột phiên.

**Why this priority**: Đảm bảo an ninh thông tin tài khoản ở mức cao nhất, chấm dứt hoàn toàn lỗi bất đồng bộ phiên làm việc (hiện tượng trùng lặp phiên trên nhiều cấp miền gây lỗi đăng nhập chập chờn, không thể đăng xuất sạch hoặc đọc nhầm thông tin phiên cũ).

**Independent Test**: Có thể kiểm thử độc lập bằng cách thực hiện đăng nhập trên ứng dụng web, kiểm tra thông tin lưu trữ phiên trên trình duyệt chỉ tồn tại duy nhất một phiên bản được phát hành bởi máy chủ xác thực. Sau đó nhấn Đăng xuất, xác nhận phiên đã bị thu hồi hoàn toàn và người dùng trở về trạng thái chưa đăng nhập trên tất cả các trang/tab.

**Acceptance Scenarios**:

1. **Given** người dùng chưa đăng nhập, **When** thực hiện đăng nhập thành công với thông tin hợp lệ hoặc qua Google, **Then** máy chủ xác thực thiết lập phiên đăng nhập duy nhất cho người dùng trên phạm vi tên miền ứng dụng, giao diện cập nhật trạng thái đã đăng nhập và không phát sinh bất kỳ bản sao phiên cục bộ nào gây xung đột.
2. **Given** người dùng đang trong phiên làm việc, **When** người dùng chọn "Đăng xuất", **Then** hệ thống gửi yêu cầu hủy phiên tới máy chủ xác thực, toàn bộ thông tin phiên được dọn dẹp sạch sẽ và người dùng được đưa về màn hình đăng nhập an toàn; khi tải lại trang, trạng thái đã đăng xuất được giữ nguyên.

---

### User Story 3 - Xoay vòng và duy trì phiên làm việc mượt mà khi Access Token hết hạn (Priority: P2)

Trong quá trình người dùng sử dụng ứng dụng web, khi thông tin xác thực ngắn hạn (Access Token) hết hạn, hệ thống tự động thực hiện cơ chế làm mới phiên làm việc ngầm mà không làm gián đoạn trải nghiệm của người dùng. Phiên làm việc mới được cập nhật đồng bộ và thay thế phiên cũ mà không sinh thêm phiên trùng lặp.

**Why this priority**: Đảm bảo trải nghiệm người dùng liên tục và mượt mà, người dùng không bị văng ra khỏi ứng dụng đột ngột khi đang thao tác phối đồ hoặc quản lý tủ đồ.

**Independent Test**: Kiểm thử độc lập bằng cách thiết lập thời gian sống của phiên ngắn hạn hết hạn, thực hiện một thao tác gửi yêu cầu dữ liệu, xác nhận yêu cầu tự động được thực hiện lại thành công sau khi phiên được làm mới ngầm, và danh sách thông tin phiên trên trình duyệt vẫn chỉ giữ đúng một bộ thông tin duy nhất.

**Acceptance Scenarios**:

1. **Given** phiên xác thực ngắn hạn của người dùng đã hết hiệu lực nhưng phiên dài hạn (Refresh Token) vẫn còn hạn, **When** người dùng thực hiện một thao tác trên ứng dụng, **Then** hệ thống tự động gia hạn phiên làm việc với máy chủ xác thực và tiếp tục hoàn thành thao tác của người dùng mà không yêu cầu đăng nhập lại.
2. **Given** quá trình làm mới phiên diễn ra, **When** máy chủ xác thực cấp thông tin phiên mới, **Then** phiên làm việc được xoay vòng trực tiếp, không tạo thêm bản sao phiên thừa trên trình duyệt.
3. **Given** phiên dài hạn cũng đã hết hạn hoặc bị thu hồi, **When** yêu cầu làm mới thất bại, **Then** hệ thống thông báo phiên làm việc đã kết thúc và chuyển hướng người dùng về trang đăng nhập một cách êm thuận.

---

### User Story 4 - Trải nghiệm trực quan với các gói không giới hạn (Unlimited) (Priority: P2)

Người dùng sở hữu các gói thuê bao đặc biệt hoặc các tài khoản không bị giới hạn số lượng món đồ tủ đồ hoặc số lượng outfit (giá trị giới hạn bằng 0 hoặc không thiết lập ngưỡng chặn). Thẻ thông tin gói dịch vụ trên trang Profile thể hiện biểu tượng vô cực (`∞`), không gây lỗi chia cho 0 và thanh tiến trình hiển thị phù hợp.

**Why this priority**: Đảm bảo tính thẩm mỹ, chính xác và chuyên nghiệp của giao diện đối với người dùng sử dụng gói cao cấp hoặc gói không giới hạn, tránh lỗi tính toán giao diện (NaN%, Infinity%).

**Independent Test**: Đăng nhập tài khoản có cấu hình gói không giới hạn (`maxWardrobeItems = 0` hoặc `maxOutfits = 0`), truy cập trang `/profile`, kiểm tra thẻ thông tin hiển thị định dạng `{số hiện tại} / ∞` và thanh tiến trình không bị tràn hay lỗi hiển thị.

**Acceptance Scenarios**:

1. **Given** tài khoản người dùng có gói cước không giới hạn số lượng đồ (`max = 0`), **When** mở trang `/profile`, **Then** chỉ số hạn mức hiển thị dạng `{activeItemsCount} / ∞ món`, không thực hiện phép chia cho 0.
2. **Given** tài khoản người dùng có gói cước không giới hạn số lượng outfit (`max = 0`), **When** mở trang `/profile`, **Then** chỉ số hạn mức hiển thị dạng `{outfitsCount} / ∞ bộ`.
3. **Given** mục có giới hạn vô cực, **When** hiển thị thanh đo tiến trình, **Then** hệ thống ẩn thanh tiến trình hoặc hiển thị ở mức an toàn 0% không gây rối mắt.

---

### User Story 5 - Tự động dọn dẹp các thông tin phiên cũ xung đột trên trình duyệt (Priority: P3)

Người dùng trước đây đã từng đăng nhập và vô tình bị lưu các thông tin phiên cũ dạng cục bộ (host-only) song song với thông tin phiên tên miền chính. Khi người dùng truy cập hoặc đăng nhập lại, hệ thống có cơ chế tự động dọn sạch các tàn dư phiên cũ xung đột này một lần để đưa trình duyệt về trạng thái chuẩn hóa.

**Why this priority**: Xử lý triệt để các trường hợp người dùng hiện hữu gặp lỗi chập chờn sau khi hệ thống chuyển đổi kiến trúc quản lý phiên, đảm bảo người dùng không cần phải xóa lịch sử/cookie thủ công.

**Independent Test**: Giả lập trình duyệt có sẵn thông tin phiên cũ cục bộ, thực hiện đăng nhập, xác nhận sau khi đăng nhập thành công thì các thông tin phiên cũ cục bộ bị loại bỏ hoàn toàn, chỉ còn duy nhất phiên chuẩn từ máy chủ xác thực.

**Acceptance Scenarios**:

1. **Given** trình duyệt của người dùng còn sót thông tin phiên cũ dạng cục bộ chưa có phạm vi miền, **When** hệ thống khởi tạo phiên mới, **Then** các mục thông tin phiên cũ cục bộ được thanh lý hoàn toàn, ngăn chặn việc đọc nhầm giá trị cũ.

---

### Edge Cases

- **Mạng gián đoạn hoặc máy chủ phản hồi chậm khi tải đồng thời hạn mức gói và số lượng thực tế**: Giao diện hiển thị trạng thái khung xương (skeleton loading) mượt mà cho đến khi đủ dữ liệu, không giật lag hay hiển thị số âm/NaN.
- **Dữ liệu số lượng thực tế vượt quá hạn mức tối đa của gói** (ví dụ: người dùng hạ cấp từ gói Premium về gói Thường nhưng tủ đồ vẫn còn nhiều món): Giao diện hiển thị thanh tiến trình ở mức tối đa 100% kèm cảnh báo màu sắc (cảnh báo vượt hạn mức), không vượt quá độ rộng của thẻ chứa.
- **Thao tác đăng xuất khi mất kết nối mạng**: Giao diện vẫn chủ động xóa trạng thái phiên cục bộ trong ứng dụng và chuyển người dùng về màn hình đăng nhập, đồng thời thông báo người dùng nên kiểm tra lại kết nối nếu cần.
- **Người dùng mở nhiều tab cùng lúc khi phiên hết hạn**: Khi một tab kích hoạt làm mới phiên thành công, các tab còn lại tiếp tục hoạt động trơn tru dựa trên phiên đã được làm mới chung, không gây xung đột xoay vòng token nhiều lần.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST hiển thị đồng thời hai thông số: số lượng tài nguyên đang sử dụng thực tế và giới hạn tối đa cho phép của gói thuê bao trên màn hình thông tin cá nhân/gói dịch vụ (`/profile`).
- **FR-002**: Hệ thống MUST biểu diễn dữ liệu hạn mức Tủ đồ theo cấu trúc `{activeItemsCount} / {maxWardrobeItems} món`.
- **FR-003**: Hệ thống MUST biểu diễn dữ liệu hạn mức Bộ trang phục (Outfit) theo cấu trúc `{outfitsCount} / {maxOutfits} bộ`.
- **FR-004**: Khi giới hạn tối đa của tài nguyên bằng `0` hoặc không có giá trị giới hạn, hệ thống MUST hiển thị ký hiệu vô cực (`∞`) đại diện cho gói không giới hạn và MUST NOT thực hiện phép chia cho 0.
- **FR-005**: Thanh tiến trình sử dụng tài nguyên MUST phản ánh tỷ lệ phần trăm `(hiện tại / tối đa) * 100%`, chặn trên ở mức 100%; trường hợp không giới hạn (`max = 0`), thanh tiến trình MUST được ẩn hoặc giữ ở mức 0%.
- **FR-006**: Số đếm sử dụng có giá trị bằng 0 MUST được hiển thị chính xác là chữ số `0`, không được xử lý như giá trị rỗng/falsy.
- **FR-007**: Hệ thống MUST đảm bảo các dữ liệu hạn ngạch gói dịch vụ sử dụng chung một khóa định danh lưu trữ đệm (cache key) thống nhất trên toàn ứng dụng để tránh lệch dữ liệu giữa các màn hình.
- **FR-008**: Toàn bộ chu trình thiết lập, gia hạn và thu hồi phiên xác thực người dùng (Auth Session) MUST do máy chủ xác thực quản lý duy nhất; tầng giao diện và trung gian ứng dụng web MUST NOT tự ý phát hành hay thiết lập đè các định danh phiên xác thực gây xung đột.
- **FR-009**: Khi người dùng đăng nhập thành công qua bất kỳ phương thức nào (mật khẩu thông thường hoặc liên kết Google), trình duyệt MUST chỉ duy trì duy nhất một bản thể phiên hợp lệ trên phạm vi tên miền chuẩn của hệ thống.
- **FR-010**: Khi người dùng thực hiện hành động Đăng xuất, hệ thống MUST thu hồi phiên trên máy chủ xác thực và dọn dẹp sạch toàn bộ phiên xác thực người dùng trên trình duyệt, đảm bảo các yêu cầu tiếp theo không còn mang thông tin xác thực cũ.
- **FR-011**: Hệ thống MUST hỗ trợ cơ chế tự động dọn dẹp một lần các thông tin định danh phiên cũ tồn dư ở cấp cục bộ nhằm tránh xung đột với phiên tên miền chính cho người dùng hiện hữu.
- **FR-012**: Các thông tin phiên không liên quan đến xác thực (ví dụ tùy chọn giao diện, cài đặt hiển thị tạm) MAY được quản lý riêng ở tầng giao diện với tiền tố phân biệt rõ ràng, không trùng tên với các định danh phiên xác thực của máy chủ.

### Key Entities *(include if feature involves data)*

- **SubscriptionQuota**: Đại diện cho các hạn mức tối đa theo gói dịch vụ của người dùng tại thời điểm hiện tại (bao gồm: `maxWardrobeItems` - số lượng đồ tối đa, `maxOutfits` - số outfit tối đa, `aiOutfitDailyQuota` - hạn ngạch AI gợi ý đồ hàng ngày, `aiChatDailyQuota` - hạn ngạch AI chat hàng ngày, kèm thông tin gói cước và thời hạn).
- **WardrobeStats**: Đại diện cho số lượng tài nguyên thực tế người dùng đang sở hữu trong tủ đồ (bao gồm: `activeItemsCount` - số lượng món đồ đang hoạt động, `outfitsCount` - số lượng bộ phối đồ đã tạo).
- **AuthSession**: Đại diện cho phiên xác thực người dùng trên trình duyệt, chứa thông tin định danh truy cập ngắn hạn, thông tin làm mới dài hạn và thông tin xác thực tạm thời, có phạm vi hiệu lực trên toàn miền ứng dụng và được kiểm soát vòng đời hoàn toàn bởi máy chủ xác thực.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% người dùng truy cập trang Profile xem được đồng thời thông tin số lượng đã sử dụng và giới hạn tối đa của tủ đồ và outfit theo định dạng `hiện tại / tối đa`.
- **SC-002**: 100% tài khoản có gói dịch vụ không giới hạn (`max = 0`) hiển thị ký hiệu vô cực (`∞`) và thanh tiến trình hiển thị chính xác không xảy ra hiện tượng chia cho 0 hay lỗi hiển thị NaN%.
- **SC-003**: 100% phiên đăng nhập mới chỉ tạo ra duy nhất một cặp thông tin phiên xác thực trên trình duyệt, loại bỏ hoàn toàn hiện tượng trùng lặp phiên trên 2 cấp tên miền (tồn tại 4 token).
- **SC-004**: Thời gian hoàn tất quá trình đăng xuất và đưa giao diện về trạng thái chưa đăng nhập đạt dưới 1 giây; khi làm mới trang hoặc mở tab mới, trạng thái đăng xuất được bảo toàn 100%.
- **SC-005**: 100% người dùng có phiên làm việc cũ được dọn dẹp sạch sẽ các thông tin xung đột khi khởi tạo phiên mới mà không cần can thiệp xóa dữ liệu trình duyệt thủ công.
- **SC-006**: Số lượng thắc mắc và khiếu nại của người dùng liên quan đến "không thể đăng xuất", "bị văng phiên bất thường" và "hạn mức tủ đồ luôn hiển thị vô cực" giảm 100%.

## Assumptions

- Máy chủ xác thực (Backend) đã sẵn sàng các thuộc tính `maxWardrobeItems` và `maxOutfits` trong dữ liệu hạn ngạch gói (`daily-quota`), cũng như API thống kê tủ đồ (`stats`).
- Máy chủ xác thực đã hỗ trợ đầy đủ cấu hình chia sẻ tài nguyên nguồn gốc (CORS) kèm ủy quyền phiên (`credentials: true`) cho tên miền ứng dụng web.
- Các ứng dụng di động (Mobile App) tiếp tục duy trì cơ chế truyền thông tin xác thực qua tiêu đề yêu cầu (Request Header/Body) độc lập và không bị ảnh hưởng bởi cơ chế quản lý phiên trên ứng dụng web.
- Các tính năng lưu trữ tùy chọn giao diện tương lai của ứng dụng web nếu sử dụng lưu trữ trình duyệt sẽ đặt tên độc lập, hoàn toàn không trùng với tên các định danh phiên xác thực (`accessToken`, `refreshToken`, `forgotPasswordToken`).
